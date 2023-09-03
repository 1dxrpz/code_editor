const express = require("express");
const app = express();
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 6060 });
const PORT = 8001;

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});

var os = require('os');
var pty = require('node-pty');

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
	name: 'xterm-color',
	cols: 80,
	rows: 30,
	cwd: process.env.HOME,
	env: process.env
});

var ConnectedSocket = undefined;

wsServer.on('connection', socket => {
	ConnectedSocket = socket;
	socket.on('message', message => {
		ptyProcess.write(`${message}\r`);
	});
});

ptyProcess.onData((data) => {
	if (ConnectedSocket != undefined)
		ConnectedSocket.send(data.toString());
});

const folder = './';
const fs = require('fs');

app.get("/", async (req, res) => {
	let files = fs.readdirSync(folder).map(v => {
		let isDir = fs.lstatSync(`${folder}${v}`).isDirectory();
		if (isDir) {
			v = {
				isDirectory: isDir,
				directory: `${v}`,
				path: `${folder}${v}`,
				files: fs.readdirSync(`${folder}${v}/`)
			};
		} else {
			v = {
				isDirectory: isDir,
				path: `${folder}${v}`,
				file: v
			}
		}
		return v;
	})
	res.json({ "files": files.sort((a, b) => a.isDirectory > b.isDirectory) });
});
app.get("/filesystem", async (req, res) => {
	res.send("hello world");
});