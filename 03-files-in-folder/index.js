import { readdir, stat } from "fs/promises";
import path from "path";

const getFilesInfo = async (filesPath) => {
  const content = await readdir(filesPath, {withFileTypes: true});
  const filesInfo = await Promise.all(content.map(async (obj) => {
    if(obj.isDirectory()) {
      // TODO: use recursion if you want to see files in subfolders too.
      // return getFilesInfo(path.join(filesPath, obj.name));
    } else {
      const fileStat = await stat(path.join(filesPath, obj.name));
      return {
        name: obj.name.indexOf('.') !== 0 ? obj.name.slice(0, obj.name.lastIndexOf('.')) : obj.name,
        ext: path.extname(path.join(filesPath, obj.name)).slice(1),
        size: `${fileStat.size} B`
      };
    }
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
  const filesInfo = files.reduce((info, file) => {
	  if (file) {
		  info.push(`${file.name} - ${file.ext} - ${file.size}`)
	  }
	  return info;
  }, []);
  filesInfo.forEach((info) => {
    console.log(info);
  })
} catch (err) {
  console.error(err);
}
