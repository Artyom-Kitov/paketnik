from http.server import HTTPServer, BaseHTTPRequestHandler


import os
from time import sleep
import unittest
import threading
import hashlib
import shutil
import subprocess
import signal

from io import BytesIO
from base64 import b64decode

TEST_DATA_DIR = "test_data"

TEST_FILE_1_CORRECT = "correct_1.pcap"

TEST_FILE_2_CORRECT = "correct_2.pcap"

TEST_FILE_1_INCORRECT = "incorrect_1.pcap"

TEST_DIR = "test_dir"

SCRIPT_TO_RUN = "./upload-agent/main.py"

STANDART_TIMEOUT = 1.5


def get_file_hash(filename):
    with open(filename, "rb") as file:
        all_file = file.read()
        return hashlib.md5(all_file).digest()


def get_filepath_in_test_data_dir(filename: str) -> str:
    return os.path.abspath("./" + TEST_DATA_DIR + "/" + filename)


def get_filepath_in_directory_for_testing(filename: str) -> str:
    return os.path.abspath("./" + TEST_DIR + "/" + filename)


def get_scipt_name() -> str:
    return os.path.abspath(SCRIPT_TO_RUN)


def run_script_in_test_dir(upload_last: bool = True):
    args = [
        "python",
        get_scipt_name(),
        "./",
        "localhost",
        "8080",
    ]
    if upload_last:
        args.append("--upload-last")

    return subprocess.Popen(args, cwd=TEST_DIR)


class MockHTTPRequestHandler(BaseHTTPRequestHandler):
    recieved_data = set()

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

        MockHTTPRequestHandler.recieved_data.add(hashlib.md5(body).digest())

    def get_received_data():
        return MockHTTPRequestHandler.recieved_data.copy()

    def reset_received_data():
        MockHTTPRequestHandler.recieved_data = set()


server_address = ("", 8080)
httpd = HTTPServer(server_address, MockHTTPRequestHandler)


def start_server():
    httpd.serve_forever()


class TestUploadAgent(unittest.TestCase):

    def setUp(self):
        os.mkdir(TEST_DIR)
        self.thread = threading.Thread(target=start_server)
        self.thread.start()
        return super().setUp()

    def test_upload(self):
        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_1_CORRECT),
        )

        p = run_script_in_test_dir(upload_last=True)

        sleep(STANDART_TIMEOUT)

        self.assertTrue(
            get_file_hash(get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT))
            in MockHTTPRequestHandler.get_received_data()
        )

        MockHTTPRequestHandler.reset_received_data()

        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_2_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_2_CORRECT),
        )

        sleep(STANDART_TIMEOUT)

        self.assertFalse(
            get_file_hash(get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT))
            in MockHTTPRequestHandler.get_received_data()
        )

        self.assertTrue(
            get_file_hash(get_filepath_in_test_data_dir(TEST_FILE_2_CORRECT))
            in MockHTTPRequestHandler.get_received_data()
        )

        p.send_signal(signal.SIGINT)
        p.wait()

    def test_dont_upload_uploaded(self):
        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_1_CORRECT),
        )

        p = run_script_in_test_dir(upload_last=True)

        sleep(STANDART_TIMEOUT)
        p.send_signal(signal.SIGINT)
        p.wait()

        self.assertTrue(
            get_file_hash(get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT))
            in MockHTTPRequestHandler.get_received_data()
        )

        MockHTTPRequestHandler.reset_received_data()

        p = run_script_in_test_dir(upload_last=True)

        sleep(STANDART_TIMEOUT)
        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 0)

        p.send_signal(signal.SIGINT)
        p.wait()

    def test_dont_upload_incorrect_file(self):

        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_1_INCORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_1_INCORRECT),
        )

        p = run_script_in_test_dir(upload_last=True)

        sleep(STANDART_TIMEOUT)
        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 0)

        p.send_signal(signal.SIGINT)
        p.wait()

    def test_dont_upload_newest_without_flag(self):
        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_1_CORRECT),
        )

        sleep(0.1)

        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_2_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_2_CORRECT),
        )

        p = run_script_in_test_dir(upload_last=False)

        sleep(STANDART_TIMEOUT)

        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 1)
        self.assertTrue(
            get_file_hash(get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT))
            in MockHTTPRequestHandler.get_received_data()
        )

        p.send_signal(signal.SIGINT)
        p.wait()

    def test_dont_upload_newest_without_flag_while_dir_monitoring(self):
        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_1_CORRECT),
        )

        p = run_script_in_test_dir(upload_last=False)

        sleep(STANDART_TIMEOUT)

        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 0)

        shutil.copyfile(
            get_filepath_in_test_data_dir(TEST_FILE_2_CORRECT),
            get_filepath_in_directory_for_testing(TEST_FILE_2_CORRECT),
        )

        sleep(STANDART_TIMEOUT)

        self.assertEqual(len(MockHTTPRequestHandler.get_received_data()), 1)
        self.assertTrue(
            get_file_hash(get_filepath_in_test_data_dir(TEST_FILE_1_CORRECT))
            in MockHTTPRequestHandler.get_received_data()
        )

        p.send_signal(signal.SIGINT)
        p.wait()

    def tearDown(self):
        httpd.shutdown()
        self.thread.join()
        shutil.rmtree(TEST_DIR)
        MockHTTPRequestHandler.reset_received_data()


if __name__ == "__main__":
    unittest.main()
