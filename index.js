const express = require("express");
const app = express();
const PORT = 8000;
//const axios = require("axios").create({baseUrl: "https://jsonplaceholder.typicode.com/"});

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});

const folder = './';
const fs = require('fs');

const { exec, spawn } = require('child_process')

var ls = spawn('npm', ['i', 'fs']);

ls.stdout.on('data', function (data) {
	console.log('stdout: ' + data.toString());
});
ls.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

ls.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

/*
exec('npm i fs', (err, output) => {
    // once the command has completed, the callback function is called
    if (err) {
        // log and return if we encounter an error
        console.error("could not execute command: ", err)
        return
    }
    // log the output received from the command
    console.log("Output: \n", output)
})
*/

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