📝 AutoCorrect Tool
A lightweight web-based tool that used the [LanguageTool API](https://languagetool.org/http-api/) to check and suggest grammar, spelling and style corrections in English. Built with Python and Javascript.

📡 How it Works
The server.py file sets up a local server.
-When you click "Check & Correct", the frontend sends a POST request to /check.
-The server forwards the text to LanguageTool’s API.
-The API returns grammar/spelling suggestions, which are displayed interactively.
-Clicking on a suggestion applies the change to the text.

📦 Requirements
- Python 3.x
- Internet connection (to reach LanguageTool's API)
