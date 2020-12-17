from http.server import *
import subprocess

VALID_COMMANDS = [
    "synthesize-is-bst",
    "synthesize-insert",
    "synthesize-search",
    "eval"
]

PORT = 9090

TIMEOUT = None

class Handler(BaseHTTPRequestHandler):

    # Helpers

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Accept, Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def respond_ok_bytes(self, data_bytes=None):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
        if data_bytes:
            self.wfile.write(data_bytes)

    def respond_ok(self, data=None):
        self.respond_ok_bytes(bytes(data, "utf8") if data else None)

    def respond_not_found(self):
        self.send_response(404)
        self.send_cors_headers()
        self.end_headers()

    def respond_server_error(self):
        self.send_response(500)
        self.send_cors_headers()
        self.end_headers()

    def respond_malformed(self):
        self.send_response(400)
        self.send_cors_headers()
        self.end_headers()

    def get_body(self):
        content_len = int(self.headers.get('Content-Length'))
        return self.rfile.read(content_len)

    # Handlers

    # OPTIONS is needed for CORS preflight
    def do_OPTIONS(self):
        self.respond_ok()

    # POST is the main REST API
    def do_POST(self):
        command = self.path[1:]
        user_input = self.get_body()
        if command not in VALID_COMMANDS:
            self.respond_not_found()
        try:
            output = subprocess.check_output(
                ["./" + command],
                input=user_input,
                timeout=TIMEOUT
            )
            self.respond_ok_bytes('{ "code": 0, "response": "' + output + '"}')
        except subprocess.CalledProcessError as cpe:
            self.respond_server_error()
        except subprocess.TimeoutExpired:
            self.respond_ok('{ "code": 1 }')

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, Handler)
    httpd.serve_forever()

if __name__ == "__main__":
    run()
