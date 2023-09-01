$(document).ready(function () {
	const express = require("express");
	const app = express();
	const PORT = 8001;

	app.listen(PORT, () => {
		console.log(`Server started at ${PORT}`);
	});

	const folder = './';
	const fs = require('fs');

	const { exec, spawn } = require('child_process')
	/*
	let ls = spawn("ls", ["-la"], {shell: true});
	try {
		ls.stdout.on('data', function (data) {
		//terminal_stdout.innerHTML += data.toString();
		console.log(`${data.toString()} --- `);
	});
		ls.stderr.on('data', function (data) {
		//terminal_stdout.innerHTML += data.toString();
		console.log(`${data.toString()} --- `);
	});
		ls.on('exit', function (code) {
		//console.log('child process exited with code ' + code.toString());
		console.log(code.toString());
	});
	} catch(e) {
		console.log(e + " code");
	}
	*/
	var terminal_stdin = document.querySelector(".terminal_stdin");
	var terminal_stdout = document.querySelector(".terminal_stdout");

	terminal_stdin.addEventListener("keypress", e => {
		if (e.keyCode == 13 && terminal_stdin.value.length != 0) {
			e.preventDefault();
			let input = terminal_stdin.value.split(" ");
			let ls = spawn("%SystemRoot%\\System32\\wsl.exe", input, {shell: true, detached: false});
			terminal_stdout.innerHTML += `${terminal_stdin.value}<br>`;
			
			exec(terminal_stdin.value, (error, stdout, stderr) => {
				if (error) {
					terminal_stdout.innerHTML += `error : ${error}`;
					return;
				}
				//console.log(`stdout: ${stdout}`);
				terminal_stdout.innerHTML += `${stdout}`;
				terminal_stdout.innerHTML += `${stderr}`;
			});
			
			ls.stdout.on('data', function (data) {
				terminal_stdout.innerHTML += data.toString().replace("\n", "AAAAAAAAAAAAA").replace("\t", "");
				terminal_stdout.innerHTML += "hello";
			});
			ls.stderr.on('data', function (data) {
				terminal_stdout.innerHTML += data.toString();
			});
			ls.on('exit', function (code) {
				console.log('child process exited with code ' + code.toString());
			});
			terminal_stdin.value = "";
		}
	});
	
	app.get("/", async (req, res) => {
		let files = fs.readdirSync(folder).map(v => {
			let isDir = fs.lstatSync(`${folder}${v}`).isDirectory();
			if (isDir) {
				v = {
					isDirectory : isDir,
					directory: `${v}`,
					path: `${folder}${v}`,
					files : fs.readdirSync(`${folder}${v}/`)
				};
			} else {
				v = {
					isDirectory : isDir,
					path: `${folder}${v}`,
					file: v
				}
			}
			return v;
		})
		res.json({"files": files.sort((a, b) => a.isDirectory > b.isDirectory)});
	});
	app.get("/filesystem", async (req, res) => {
		res.send("hello world");
	});

	var term = new window.Terminal({
		cursorBlink: true
	});
	term.open(document.getElementById('terminal'));
	const ws = new WebSocket("ws://localhost:6060");
	ws.send(command + '\n');
	socket.onmessage = (event) => {
		term.write(event.data);
	}
	var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

	var ptyProcess = pty.spawn(shell, [], {
		name: 'xterm-color',
		env: process.env,
	});

	ws.on('message', command => {
		ptyProcess.write(command);
	});
	ptyProcess.on('data', function (data) {
		ws.send(data);
		console.log(data);
	});
});