const ipAddress = window.location.hostname;
console.log(ipAddress);
const ws = new WebSocket('ws://'+ipAddress+':443/');
ws.addEventListener("open", async () => {
    console.log("Websocket connected");
});

ws.onmessage = event => {
    let data = event.data.toString();
    console.log(data);
    if (data.startsWith("message")) {
        receiveMessage(data);
    }
};

function waitForMessage() {
    return new Promise(resolve => {
        ws.onmessage = event => {
            resolve(event.data);
        };
    });
}

function sendMessageToServer(message, event=null) {
    ws.send(message);
    event.preventDefault();
}

function sendMessage(event) {
    let message = messageInputField.value;
    messageInputField.value = "";
    sendMessageToServer("message " + message, event);
}

var messageInputForm = document.getElementById("message-input-container");
messageInputForm.addEventListener("submit", sendMessage);

var messageInputField = document.getElementById("message-input");

var messageInputButton = document.getElementById("send-button");
messageInputButton.onclick = sendMessage;

var messageList = document.getElementById("message-container");

function receiveMessage(message) {
    let newMessage = document.createElement("p");
    newMessage.appendChild(document.createTextNode(message.slice(8)));
    messageList.appendChild(newMessage);
}
