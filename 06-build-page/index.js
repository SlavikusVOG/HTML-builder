import { copyFile, cp, mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from 'path';

const currentDir = path.join('.', '06-build-page');
const projectDirName = 'project-dist';
const componentsDirName = 'components';
const assetsDirName = 'assets';
const re = /{{\w+}}/gm;

async function copyDir(currDir, destDir, copyDirName){
	try {
		await mkdir(path.join(destDir, copyDirName), {recursive: true});
	} catch(err) {/* folders created*/}
	const files = await readdir(path.join(currDir, copyDirName), {withFileTypes: true});
	files.forEach(async(file) => {
		if (file.isDirectory()) {
			copyDir(
				path.join(currDir, copyDirName),
				path.join(destDir, copyDirName),
				file.name
			);
		}
		else {
			// const fileContent = await readFile(
			// 	path.join(currDir, copyDirName, file.name)
			// );
			// await writeFile(
			// 	path.join(path.join(destDir, copyDirName), file.name),
			// 	fileContent
			// );
			try{
				await copyFile(
					path.join(currDir, copyDirName, file.name),
					path.join(destDir, copyDirName, file.name)
				);
			} catch (err) {
				console.error(err.message);
			}
		}
	});
}

try {
	await mkdir(path.join(currentDir, projectDirName));
	await mkdir(path.join(currentDir, projectDirName, assetsDirName));
} catch(err) {/* folders created */}
await copyDir(currentDir, path.join(currentDir, projectDirName), assetsDirName);

const templateContent = await readFile(path.join(currentDir, 'template.html'), {encoding: 'utf-8'});
const sections = templateContent.match(re);
const sectionNames = sections.map(section => section.slice(2, -2));
const contents = await Promise.all(
	sectionNames.map(async (sectionName) => {
		return readFile(path.join(currentDir, componentsDirName, `${sectionName}.html`), {encoding: 'utf-8'});
	})
);
const htmlContent = sections.reduce((content, section, index) => {
	return content.replace(section, contents[index]);
}, templateContent);
await writeFile(path.join(currentDir, projectDirName, 'index.html'), htmlContent);

const cssFiles = await readdir(path.join(currentDir, 'styles'), {withFileTypes: true});
const cssFilesDir = path.join(currentDir, 'styles');
const bundleContent = await Promise.all(cssFiles.map(async (file) => {
	if(path.extname(path.join(cssFilesDir, file.name)) === '.css') {
		const fileContent = await readFile(path.join(cssFilesDir, file.name), {encoding: 'utf-8'});
		return fileContent;
	} else {
		return '';
	}
}));
await writeFile(path.join(currentDir, projectDirName, 'style.css'), bundleContent.join('\n'));
