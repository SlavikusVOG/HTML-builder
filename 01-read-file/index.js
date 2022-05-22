import fs from "node:fs";
import readline from "node:readline";
import path from 'node:path';

const file = path.format({
	dir: './01-read-file',
	base: 'text.txt'
})

const fileStream = fs.createReadStream(file);
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity
});

for await (const line of rl) {
	console.log(line);
}
