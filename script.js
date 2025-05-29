document.getElementById("checkButton").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value;
  const outputDiv = document.getElementById("outputText");
  const suggestionTitle = document.getElementById("suggestionTitle");

  fetch("/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: inputText })
  })
    .then(response => response.json())
    .then(data => {
      outputDiv.innerHTML = "";
      const matches = data.matches;

      if (matches.length === 0) {
        outputDiv.textContent = "No issues found.";
        outputDiv.style.display = "block";
        suggestionTitle.style.display = "block";
        return;
      }

      outputDiv.innerHTML = "<p><strong>Click on a suggestion to apply:</strong></p>";

      matches.forEach((match) => {
        const issueText = data.text.substr(match.offset, match.length);

        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");

        const title = document.createElement("p");
        title.innerHTML = `🔍 <strong>${issueText}</strong> (Position ${match.offset})`;

        const suggestionList = document.createElement("div");
        suggestionList.classList.add("suggestions");

        match.replacements.forEach(replacement => {
          const button = document.createElement("button");
          button.textContent = replacement.value;
          button.addEventListener("click", () => {
            applySuggestion(match.offset, match.length, replacement.value);
          });
          suggestionList.appendChild(button);
        });

        matchDiv.appendChild(title);
        matchDiv.appendChild(suggestionList);
        outputDiv.appendChild(matchDiv);
      });

      outputDiv.style.display = "block";
      suggestionTitle.style.display = "block";
    })
    .catch(error => {
      outputDiv.textContent = "Error: " + error.message;
      outputDiv.style.display = "block";
      suggestionTitle.style.display = "block";
    });
});

function applySuggestion(offset, length, replacement) {
  const textarea = document.getElementById("inputText");
  const originalText = textarea.value;

  const newText =
    originalText.slice(0, offset) +
    replacement +
    originalText.slice(offset + length);

  textarea.value = newText;
}

document.getElementById("outputText").style.display = "none";
document.getElementById("suggestionTitle").style.display = "none";

