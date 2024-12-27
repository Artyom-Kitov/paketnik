from http.server import HTTPServer, BaseHTTPRequestHandler


import os
from time import sleep
import unittest
import threading
import hashlib
import shutil
import subprocess
import signal
import tempfile
import requests

from io import BytesIO

TEST_DATA_DIR = "test_data"
TEST_FILE_1_CORRECT = "correct_1.pcap"
TEST_FILE_2_CORRECT = "correct_2.pcap"
TEST_FILE_1_INCORRECT = "incorrect_1.pcap"
SCRIPT_TO_RUN = "./upload-agent/main.py"
STANDARD_TIMEOUT = 1.5


def get_file_hash(filename):
    with open(filename, "rb") as file:
        all_file = file.read()
        return hashlib.md5(all_file).digest()


def get_script_path() -> str:
    return os.path.abspath(SCRIPT_TO_RUN)


def get_test_file_path(filename: str) -> str:
    return os.path.abspath("./" + TEST_DATA_DIR + "/" + filename)


class MockHTTPRequestHandler(BaseHTTPRequestHandler):
    received_data = set()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"OK")

    # определяем метод `do_POST`
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        filename = self.headers["X-File-Name"]
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        response = BytesIO()
        response.write(filename.encode("utf-8"))
        response.write(b":")
        response.write(str(len(body)).encode("utf-8"))
        self.wfile.write(response.getvalue())

        MockHTTPRequestHandler.received_data.add(hashlib.md5(body).digest())

    def get_received_data():
        return MockHTTPRequestHandler.received_data

    def reset_received_data():
        MockHTTPRequestHandler.received_data = set()


class TestUploadAgent(unittest.TestCase):
    PATH_TEST_FILE_1_CORRECT = get_test_file_path(TEST_FILE_1_CORRECT)
    PATH_TEST_FILE_2_CORRECT = get_test_file_path(TEST_FILE_2_CORRECT)
    PATH_TEST_FILE_1_INCORRECT = get_test_file_path(TEST_FILE_1_INCORRECT)

    def setUp(self):
        self.httpd = HTTPServer(("", 0), MockHTTPRequestHandler)
        self.server_address = self.httpd.server_address
        self.temp_dir = tempfile.TemporaryDirectory()
        self.thread = threading.Thread(target=self.start_server)
        self.thread.start()

        self.wait_for_server_to_start()

        return super().setUp()

    def wait_for_server_to_start(self):
        MAX_ATTEMPTS = 10
        while True:
            try:
                response = requests.get(
                    "http://"
                    + self.server_address[0]
                    + ":"
                    + str(self.server_address[1])
                )
                if response is not None and response.status_code == 200:
                    return
            finally:
                sleep(0.1)

            MAX_ATTEMPTS -= 1
            if MAX_ATTEMPTS == 0:
                raise Exception("Failed to start server")

    def run_script_in_test_dir(self, upload_last: bool = True) -> subprocess.Popen:
        args = [
            "python",
            get_script_path(),
            "./",
            self.server_address[0],
            str(self.server_address[1]),
        ]
        if upload_last:
            args.append("--upload-last")

        return subprocess.Popen(args, stderr=subprocess.PIPE, cwd=self.temp_dir.name)

    def start_server(self):
        self.httpd.serve_forever()

    def get_testdir_file_path(self, filename: str) -> str:
        return self.temp_dir.name + "/" + filename

    def copy_file_to_testdir(self, filename: str):
        shutil.copyfile(
            get_test_file_path(filename),
            self.get_testdir_file_path(filename),
        )


    def test_upload(self):
        self.copy_file_to_testdir(TEST_FILE_1_CORRECT)

        p = self.run_script_in_test_dir(upload_last=True)

        sleep(STANDARD_TIMEOUT)

        self.assertTrue(
            get_file_hash(self.PATH_TEST_FILE_1_CORRECT)
            in MockHTTPRequestHandler.get_received_data()
        )

        MockHTTPRequestHandler.reset_received_data()

        self.copy_file_to_testdir(TEST_FILE_2_CORRECT)

        sleep(STANDARD_TIMEOUT)

        self.assertFalse(
            get_file_hash(self.PATH_TEST_FILE_1_CORRECT)
            in MockHTTPRequestHandler.get_received_data()
        )

        self.assertTrue(
            get_file_hash(self.PATH_TEST_FILE_2_CORRECT)
            in MockHTTPRequestHandler.get_received_data()
        )

        p.send_signal(signal.SIGINT)
        self.assertTrue(p.wait() == 0)

    def test_dont_upload_uploaded(self):

        self.copy_file_to_testdir(TEST_FILE_1_CORRECT)

        p = self.run_script_in_test_dir(upload_last=True)

        sleep(STANDARD_TIMEOUT)

        p.send_signal(signal.SIGINT)
        self.assertTrue(p.wait() == 0)

        self.assertTrue(
            get_file_hash(self.PATH_TEST_FILE_1_CORRECT)
            in MockHTTPRequestHandler.get_received_data()
        )

        MockHTTPRequestHandler.reset_received_data()

        p = self.run_script_in_test_dir(upload_last=True)

        sleep(STANDARD_TIMEOUT)
        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 0)

        p.send_signal(signal.SIGINT)
        self.assertTrue(p.wait() == 0)
        if p.stdout is not None:
            p.stdout.close()

    def test_dont_upload_incorrect_file(self):

        self.copy_file_to_testdir(TEST_FILE_1_INCORRECT)

        p = self.run_script_in_test_dir(upload_last=True)

        sleep(STANDARD_TIMEOUT)
        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 0)

        p.send_signal(signal.SIGINT)
        self.assertTrue(p.wait() == 0)

    def test_dont_upload_newest_without_flag(self):
        self.copy_file_to_testdir(TEST_FILE_1_CORRECT)

        sleep(0.1)

        self.copy_file_to_testdir(TEST_FILE_2_CORRECT)

        p = self.run_script_in_test_dir(upload_last=False)

        sleep(STANDARD_TIMEOUT)

        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 1)
        self.assertTrue(
            get_file_hash(self.PATH_TEST_FILE_1_CORRECT)
            in MockHTTPRequestHandler.get_received_data()
        )

        p.send_signal(signal.SIGINT)
        self.assertTrue(p.wait() == 0)

    def test_dont_upload_newest_without_flag_while_dir_monitoring(self):
        self.copy_file_to_testdir(TEST_FILE_1_CORRECT)

        p = self.run_script_in_test_dir(upload_last=False)

        sleep(STANDARD_TIMEOUT)

        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 0)

        self.copy_file_to_testdir(TEST_FILE_2_CORRECT)

        sleep(STANDARD_TIMEOUT)

        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 1)
        self.assertTrue(
            get_file_hash(self.PATH_TEST_FILE_1_CORRECT)
            in MockHTTPRequestHandler.get_received_data()
        )

        p.send_signal(signal.SIGINT)
        self.assertTrue(p.wait() == 0)

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join()
        self.temp_dir.cleanup()
        MockHTTPRequestHandler.reset_received_data()


if __name__ == "__main__":
    unittest.main()
