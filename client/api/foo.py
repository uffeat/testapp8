import json
import os
from http.server import BaseHTTPRequestHandler
from anvil.server import call, connect


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        key = os.getenv("anvil_uplink_client")
        connect(key)

        data = call("foo")
        ##data = json.dumps(data)

        data = 'test'

        self.send_response(200)
        ##self.send_header("Content-Type", "application/json")
        self.send_header("Content-Type", "text/plain")
        self.end_headers()

        self.wfile.write(data.encode("utf-8"))
        return
        
