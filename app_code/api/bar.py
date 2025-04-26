import requests
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        response = requests.get("https://api.example.com/data")
        data = response.text



        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()

        self.wfile.write(data.encode("utf-8"))
        ##self.wfile.write(b"From Vercel bar")
