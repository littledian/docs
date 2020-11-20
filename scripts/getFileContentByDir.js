const fs = require('fs');
const path = require('path');

function getFileContentByDir(root) {
  let array = [];
  const stat = fs.statSync(root);
  if (!stat.isDirectory()) return array;
  const files = fs.readdirSync(root);
  files.forEach((file) => {
    const subPath = path.join(root, file);
    const stat = fs.statSync(subPath);
    if (stat.isDirectory()) {
      array = array.concat(getFileContentByDir(subPath));
      return;
    }
    if (stat.isFile()) {
      if (/\.mdx?$/.test(subPath)) {
        array.push({
          path: subPath,
          value: fs.readFileSync(subPath, 'utf8')
        });
      }
    }
  });

  return array;
}

module.exports = getFileContentByDir;
