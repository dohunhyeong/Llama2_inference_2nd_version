const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${sender}: ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

sendButton.addEventListener("click", async () => {
    const prompt = userInput.value;
    if (!prompt) return;

    appendMessage("You", prompt);
    userInput.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        if (data.error) {
            appendMessage("Bot", data.error);
        } else {
            appendMessage("Bot", data.response);
        }
    } catch (error) {
        appendMessage("Bot", "An error occurred: " + error.message);
    }
});
