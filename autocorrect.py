import http.server
import socketserver
import json
import http.client
import urllib.parse

PORT = 8000
LANGUAGETOOL_API_HOST = "api.languagetool.org"
LANGUAGETOOL_API_PATH = "/v2/check"

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/check":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            input_text = data.get("text", "")

            print("Received input:", input_text)

            params = urllib.parse.urlencode({
                'text': input_text,
                'language': 'en-US',
                'enabledOnly': 'false',
            })

            conn = http.client.HTTPSConnection(LANGUAGETOOL_API_HOST)
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": str(len(params))
            }

            conn.request("POST", LANGUAGETOOL_API_PATH, body=params, headers=headers)
            response = conn.getresponse()

            if response.status == 200:
                response_data = response.read()
                result = json.loads(response_data)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "text": input_text,
                    "matches": result.get("matches", [])
                }).encode())
            else:
                self.send_error(502, "Bad gateway: LanguageTool API error")
            conn.close()
        else:
            self.send_error(404, "Endpoint not found")

    def translate_path(self, path):
        if path == "/":
            return "index.html"
        elif path in ("/style.css", "/script.js"):
            return path[1:]
        return http.server.SimpleHTTPRequestHandler.translate_path(self, path)

if __name__ == "__main__":
    url = f"http://localhost:{PORT}"
    print(f"\n🔗 AutoCorrect Server running at: {url}\n")

    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n❌ Server closed.")
            httpd.server_close()