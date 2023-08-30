const express = require("express");
const app = express();
const PORT = 8000;
//const axios = require("axios").create({baseUrl: "https://jsonplaceholder.typicode.com/"});

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});

const folder = './';
const fs = require('fs');

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