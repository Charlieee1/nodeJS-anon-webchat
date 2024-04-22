const fs = require("fs");
const userFile = "./storage/users.json"

// Creating users file if it doesn't exist
if (!fs.existsSync(userFile)) {
	fs.writeFileSync(userFile, "");
}

var users = null;
fs.readFile(userFile, (err, data) => {
    users = JSON.parse(data);
});

function updateFile() {
    console.log(JSON.stringify(users));
    fs.writeFile(userFile, JSON.stringify(users, undefined, 4) + "\n", (err) => {});
}

function checkLogin(user, passwd) {
    if (!users[user]) {
        users[user] = passwd;
        updateFile();
        return true;
    }
    if (users[user] == passwd) {
        return true;
    } else {
        return users[user];
    }
}

module.exports = { checkLogin };
