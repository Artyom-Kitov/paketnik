from http.server import HTTPServer, BaseHTTPRequestHandler

from io import BytesIO
from base64 import b64decode


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    # определяем метод `do_GET` 
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'Hello, world!')

    # определяем метод `do_POST` 
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        filename = self.headers['X-File-Name']
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        response = BytesIO()
        response.write(filename.encode('utf-8'))
        response.write(b':')
        response.write(str(len(body)).encode('utf-8'))
        self.wfile.write(response.getvalue())


httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()
