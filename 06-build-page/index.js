import { cp, mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from 'path';

const currentDir = path.join('.', '06-build-page');
const projectDirName = 'project-dist';
const re = /{{\w+}}/gm;

try {
	await mkdir(path.join(currentDir, projectDirName));
	await mkdir(path.join(currentDir, projectDirName, 'assets'));
} catch(err) {/* folders created */}
await cp(path.join(currentDir, 'assets'), path.join(currentDir, projectDirName, 'assets'));

const templateContent = await readFile(path.join(currentDir, 'template.html'));
const sections = templateContent.match(re);
sections.map(section => section.substr(2, -2)).forEach(async (sectionName) => {
	const sectionContent = await readFile(path.join(currentDir, 'components', `${sectionName}.html`), {encoding: 'utf-8'});
	templateContent.replace(`{{${sectionName}}}`, sectionContent);
});
await writeFile(path.join(currentDir, projectDirName, 'index.html'));

const cssFiles = readdir(path.join(currentDir, 'styles'), {withFileTypes: true});
const cssFilesDir = path.join(currentDir, 'styles');
const bundleContent = await Promise.all(cssFiles.map(async (file) => {
	if(path.extname(path.join(cssFilesDir, file.name)) === '.css') {
		const fileContent = await readFile(path.join(sourceDir, file.name), {encoding: 'utf-8'});
		return fileContent;
	} else {
		return '';
	}
}));
await writeFile(path.join(currentDir, projectDirName, 'style.css'), bundleContent.join('\n'));
