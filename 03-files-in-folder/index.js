import readdir from "fs/promises";
import path from "path";

const dirPath = path.dirname('./secret-folder');

try {
  const files = await readdir(dirPath);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}