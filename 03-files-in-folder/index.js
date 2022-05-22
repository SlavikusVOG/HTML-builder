import { readdir, stat } from "fs/promises";
import path from "path";

const getFilesInfo = async (filesPath) => {
  const content = await readdir(filesPath, {withFileTypes: true});
  const filesInfo = await Promise.all(content.map(async (obj) => {
    if(obj.isDirectory()) {
      return getFilesInfo(path.join(filesPath, obj.name));
    }
    const fileStat = await stat(path.join(filesPath, obj.name));
    return {
      name: obj.name.indexOf('.') !== 0 ? obj.name.slice(0, obj.name.lastIndexOf('.')) : obj.name,
      ext: path.extname(path.join(filesPath, obj.name)).slice(1),
      size: `${fileStat.size} B`
    };
  }));
  const result = [];
  filesInfo.forEach((info) => {
    if(Array.isArray(info)) {
      result.push(...info)
    } else {
      result.push(info);
    }
  });
  return result;
}

const dirPath = path.join('.', '03-files-in-folder', '/secret-folder');

try {
  const files = await getFilesInfo(dirPath);
  const filesInfo = files.map((file) => {
    return `${file.name} - ${file.ext} - ${file.size}`;
  });
  filesInfo.forEach((info) => {
    console.log(info);
  })
} catch (err) {
  console.error(err);
}