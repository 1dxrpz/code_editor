$(document).ready(function () {
	const express = require("express");
	const app = express();
	const PORT = 8001;
	const os = require('os');
	const pty = require('node-pty');
	var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
	const folder = './';
	const fs = require('fs');

	var term = new Terminal({
		cursorBlink: "block"
	});

	var curr_line = '';
	var entries = [];
	var currPos = 0;
	var pos = 0;
	var prefix = "";
	var prefixPos = 0;

	app.listen(PORT, () => {
		console.log(`Server started at ${PORT}`);
	});

	var ptyProcess = pty.spawn(shell, [], {
		name: 'xterm-color',
		cols: 80,
		rows: 30,
		cwd: process.env.HOME,
		env: process.env
	});

	let init = 0;
	var SendDataToTerminal = (data) => {
		if (init < 2) {
			init++;
			prefix = data.toString();
			prefix = prefix.split("\n")[1];
		} else {
		}
		term.write(data.toString());

		setTimeout(() => {
			prefixPos = term.buffer.cursorX - 1;
			if (init == 2)
			{
				term.clear();
				init++;
			}
		}, 10);
	}

	var ExecuteCommand = (message) => {
		ptyProcess.write(`${message}\r`);
	}

	ptyProcess.onData((data) => {
		SendDataToTerminal(data.toString());
	});

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

	term.open(document.getElementById('terminal'));

	term.on('key', function (key, ev) {
		const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey &&
		!(ev.keyCode === 37 && term.buffer.cursorX < prefixPos + 2);

			if (ev.keyCode === 13) { // Enter key
				if (curr_line.replace(/^\s+|\s+$/g, '').length != 0) {
					entries.push(curr_line);
					currPos = entries.length - 1;
				}
				term.write('\n\r\u001b[37m');
				socket.send(`${curr_line}`);
				curr_line = '';
			} else if (ev.keyCode === 8) { // Backspace
				if (term.buffer.cursorX > prefixPos + 1) {
					curr_line = curr_line.slice(0, term.buffer.cursorX - prefixPos - 2) + curr_line.slice(term.buffer.cursorX - prefixPos - 1);
					pos = curr_line.length - term.buffer.cursorX + prefixPos + 2;
					term.write('\033['.concat((0).toString()).concat('D'));
					term.write(" \033[D");
				}
			} else if (ev.keyCode === 38) { // Up arrow
				if (entries.length > 0) {
					if (currPos > 0) {
						currPos -= 1;
					}
					curr_line = entries[currPos];
					term.write('\33[2K\r\u001b[32m' + prefix + ' \u001b[37m' + curr_line);
				}
			} else if (ev.keyCode === 40) { // Down arrow
				currPos += 1;
				if (currPos === entries.length || entries.length === 0) {
					currPos -= 1;
					curr_line = '';
					term.write('\33[2K\r\u001b[32m' + prefix + ' \u001b[37m');
				} else {
					curr_line = entries[currPos];
					term.write('\33[2K\r\u001b[32m' + prefix + ' \u001b[37m' + curr_line);

				}
			} else if (printable && !(ev.keyCode === 39 && term.buffer.cursorX > curr_line.length + prefixPos)) {
				if (ev.keyCode != 37 && ev.keyCode != 39) {
					var input = ev.key;
					if (ev.keyCode == 9) { // Tab
						input = "    ";
					}
					pos = curr_line.length - term.buffer.cursorX + prefixPos - 1;
					curr_line = [curr_line.slice(0, term.buffer.cursorX - prefixPos - 1), input, curr_line.slice(term.buffer.cursorX - prefixPos - 1)].join('');
					term.write('\u001b[32m' + '\u001b[37m' + key);
					term.write('\033['.concat(pos.toString()).concat('D')); //term.write('\033[<N>D');
				} else {
					term.write(key);
				}
			}
		});

	term.on('paste', function (data) {
		curr_line += data;
		term.write(curr_line);
	});

	
	ExecuteCommand("\r");
});