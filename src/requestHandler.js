const fs = require('fs');
const path = require('path');
const logger = require("./logger");
const { checkLogin } = require("./userManager");

const messagesFile = path.join("./storage", "messages.txt");

var messages = [];

function loadMessages() {
    fs.readFile(messagesFile, (err, data) => {
        data = data.toString();
        messages = data.split("\n").slice(0, -1);
        console.log("Finished loading messages");
        logger("Finished loading messages");
    });
}

function handleRequest(client, message, sendDataToEachClient) {
    message = message.toString();
	if (message.startsWith("message")) {
        message = message.split(" ").slice(1).join(" ");
        messages.push(message);
        sendDataToEachClient("message " + message);
        fs.appendFileSync(messagesFile, message + "\n");
    } else if (message == "request_loaded_messages") {
        client.send("loaded_messages " + messages.join("\n"));
        logger("client requested previous messages");
    } else if (message.startsWith("login")) {
        message = message.split(" ");
        client.send("login " + checkLogin(message[1], message[2]));
        logger(`client attempted to login with user ${message[1]} and password ${message[2]}`);
    } else {
        logger(`client sent invalid message: ${message}`);
    }
}

module.exports = { handleRequest, loadMessages };
