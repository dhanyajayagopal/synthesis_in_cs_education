#!/usr/bin/env python3

from http.server import *
import os
import sys
import subprocess
import json

ENDPOINTS = [
    "log",
    "eval-insert",
    "eval-search",
    "synthesize-insert",
    "synthesize-search",
    "check-insert",
    "check-search",
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
        content_len_header = self.headers.get("Content-Length")
        content_len = 0
        if content_len_header is not None:
            content_len = int(content_len_header)
        return self.rfile.read(content_len)

    # Handlers

    # OPTIONS is needed for CORS preflight
    def do_OPTIONS(self):
        self.respond_ok()

    # POST is the main REST API
    def do_POST(self):
        command = self.path[1:]
        user_input = self.get_body()
        if command not in ENDPOINTS:
            self.respond_not_found()
        try:
            output_bytes = subprocess.check_output(
                ["./server-endpoints/" + command],
                input=user_input,
                timeout=TIMEOUT
            )
            output = output_bytes.decode("utf-8")
            self.respond_ok(json.dumps({
                "code": 0,
                "result": output
            }))
        except subprocess.TimeoutExpired:
            self.respond_ok(json.dumps({
                "code": 1
            }))
        except subprocess.CalledProcessError as cpe:
            self.respond_server_error()
        except Exception as e:
            print("Something unknown happened:", e)
            self.respond_server_error()

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, Handler)
    httpd.serve_forever()

if __name__ == "__main__":
    if "id" not in os.environ:
        sys.stderr.write(
            "[ERROR] You must set a participant id by running:\n\n    make serve id=NUMBER\n\n"
        )
        sys.exit(1)

    run()
