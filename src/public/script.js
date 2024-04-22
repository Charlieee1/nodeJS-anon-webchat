var messageInputForm = document.getElementById("message-input-container");
messageInputForm.addEventListener("submit", sendMessage);
var messageInputField = document.getElementById("message-input");
var messageInputButton = document.getElementById("send-button");
messageInputButton.onclick = sendMessage;
var messageList = document.getElementById("message-container");
var messagesLoaded = false;
var userName = "";

const ipAddress = window.location.hostname;
console.log(ipAddress);
const ws = new WebSocket('ws://' + ipAddress + ':443/');
ws.addEventListener("open", async () => {
    console.log("Websocket connected");
    await waitForMessage(); // Connection Established!
    await login();
    ws.send("request_loaded_messages");
});

function waitForMessage(start = "") {
    return new Promise(resolve => {
        let temp = ws.onmessage;
        ws.onmessage = event => {
            if (event.data.startsWith(start)) {
                resolve(event.data);
                ws.onmessage = temp;
            }
        };
    });
}

function sendMessageToServer(message, event = null) {
    ws.send(message);
    event.preventDefault();
}

ws.onmessage = event => {
    let data = event.data;
    data = data.toString();
    console.log(data);
    if (data.startsWith("message")) {
        receiveMessage(data);
    } else if (data.startsWith("loaded_messages")) {
        loadMessages(data.slice(16).split("\n"));
    }
};

function sendMessage(event) {
    let message = messageInputField.value;
    if (message == "") {
        return event.preventDefault();
    }
    messageInputField.value = "";
    sendMessageToServer(`message ${userName} ${message}`, event);
}

function loadMessages(messages) {
    console.log(messages);
    messages.forEach((message) => {
        receiveMessage("message " + message, true);
    });
    messagesLoaded = true;
}

function receiveMessage(message, override = false) {
    if (!messagesLoaded && !override) { return; }
    message = message.slice(8);
    let newMessage = document.createElement("p");
    let newUser = document.createElement("b");
    let newUserText = document.createTextNode(message.split(" ")[0]);
    let newMessageText = document.createTextNode(message.slice(newUserText.textContent.length));
    newUser.appendChild(newUserText);
    newMessage.append(newUser);
    newMessage.appendChild(newMessageText);
    messageList.appendChild(newMessage);
    newMessage.scrollIntoView();
}

async function login() {
    let user = prompt("Login - user: ");
    let pass = prompt("Login - password: ");
    ws.send(`login ${user} ${pass}`);
    let result = await waitForMessage("login");
    console.log(result);
    if (result == "login true") {
        userName = user;
    } else {
        alert("Invalid login, please refresh to try again");
        ws.close();
    }
}
