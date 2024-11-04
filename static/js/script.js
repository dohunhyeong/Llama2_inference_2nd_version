const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

function appendMessage(sender, message, isHTML = false) {
    const messageElement = document.createElement("div");
    
    // 메시지가 HTML인지 아닌지에 따라 적절한 방식으로 메시지 삽입
    if (isHTML) {
        messageElement.innerHTML = `${sender}: ${message}`;
    } else {
        messageElement.textContent = `${sender}: ${message}`;
    }
    
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
            // 봇의 응답에 HTML이 포함될 수 있으므로 isHTML을 true로 설정
            appendMessage("Bot", data.response, true);
        }
    } catch (error) {
        appendMessage("Bot", "An error occurred: " + error.message);
    }
});
