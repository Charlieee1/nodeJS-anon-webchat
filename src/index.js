// Set up logger
const logger = require("./logger");
logger("Started!");

const { handleRequest, loadMessages } = require("./requestHandler");

// Print IP address
const os = require("os");
const networkInterfaces = os.networkInterfaces();
let ipAddress = "";
for (let interface in networkInterfaces) {
    for (let address of networkInterfaces[interface]) {
        if (address.family === "IPv4" && !address.internal) {
            ipAddress = address.address;
            break;
        }
    }
}
logger(`IP address of server: ${ipAddress}`);

// Web page
const path = require("path");
const express = require("express");

const webserver = express();
webserver.use(express.static(path.join(__dirname, "public")));
webserver.use("/", (_, res) => res.redirect("/"));
webserver.listen(3000, () => console.log("Listening on 3000"));

// Web socket
const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 443 });

function sendDataToEachClient(data) {
	console.log(`Distributing message: ${data}`);
	logger(`Distributing message: ${data}`);
	sockserver.clients.forEach(client => {
		client.send(`${data}`);
	});
}

sockserver.on("connection", async ws => {
	console.log("New client connected!");
	ws.send("Connection established!");
	ws.on("close", () => console.log("Client has disconnected!"));
	// This is confusing to read - it is two words "on error"
	ws.onerror = () => {
		console.log("websocket error");
	}
	
	ws.on("message", data => {
		handleRequest(ws, data, sendDataToEachClient);
	});
});

loadMessages();
