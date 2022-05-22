import process from 'node:process';
import fsPromises from 'node:fs/promises';
import * as readline from 'node:readline';
import EventEmitter from 'node:events';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const file = path.format({
	root: '/02-write-file',
	base: 'text.txt'
});
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const message = 'Please, type some text:'
let filehandle;

await rl.write('Greetings!\n');
await rl.write('Press Ctrl + C or type exit to exit.\n');
console.log(message);
const state = {flag: true};
rl.on('line', async(input) => {
	try {
		if (input === message) {
			rl.emit('resume');
			return;
		} else {
			if (input.trim() === 'exit') {
				rl.emit('SIGINT');
				return;
			}
			filehandle = await fsPromises.open('./02-write-file/text.txt', 'a');
			const file = filehandle.createWriteStream(Number.MAX_SAFE_INTEGER);
			file.write(input);
			console.log(message);
		}
	} catch(error) {
		console.error(error);
	} finally {
		filehandle?.close();
	}
});
rl.on('SIGINT', () => {
	console.log('Goodbye!\n');
	rl.close();
});
