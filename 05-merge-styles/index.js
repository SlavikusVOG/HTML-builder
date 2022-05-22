import { readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

const re = /\s/gm;
const bundleDir = path.join('.', '05-merge-styles', 'project-dist');
const bundleFile = 'bundle.css';
const sourceDir = path.join('.', '05-merge-styles', 'styles');
try {
	await rm(path.join(bundleDir, bundleFile), {});
} catch(err) {/* file removed */}
const cssFiles = await readdir(sourceDir, {withFileTypes: true});
const bundleContent = await Promise.all(cssFiles.map(async (file) => {
	if(path.extname(path.join(sourceDir, file.name)) === '.css') {
		const fileContent = await readFile(path.join(sourceDir, file.name), {encoding: 'utf-8'});
		return fileContent;
	} else {
		return '';
	}
}));
await writeFile(path.join(bundleDir, bundleFile), bundleContent.join('\n'));
