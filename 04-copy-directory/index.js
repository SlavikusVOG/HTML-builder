import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "node:path";

const copyDir = async (currDir) => {
	await mkdir(path.join(currDir, 'files-copy'), {recursive: true});
	const files = await readdir(path.join(currDir, 'files'), {withFileTypes: true});
	files.forEach(async(file) => {
		const fileContent = await readFile(
			path.join(currDir, 'files', file.name)
		);
		await writeFile(
			path.join(path.join(currDir, 'files-copy'), file.name),
			fileContent
		);
	});
}

const currentDirectory = path.join(".", '04-copy-directory');

copyDir(currentDirectory);
