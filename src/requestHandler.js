const fs = require('fs');
const path = require('path');

var messages = [];

function handleRequest(client, message, sendDataToEachClient) {
    message = message.toString();
	if (message.startsWith("message")) {
        messages.push(message.split(" ").slice(1).join(" "));
        sendDataToEachClient(message);
    }
}

module.exports = handleRequest;
