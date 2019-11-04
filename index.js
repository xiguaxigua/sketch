const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');

function readFileList(path, filesList) {
  const files = fs.readdirSync(path);
  files.forEach(function(itm) {
    const stat = fs.statSync(path + itm);
    if (stat.isDirectory() && !['node_modules', '.git'].includes(itm)) {
      readFileList(path + itm + '/', filesList);
    } else {
      const res = {
        path,
        file: path + itm,
      };
      if (/.(jpg|png)$/gm.test(itm)) filesList.push(res);
    }
  });
}

(async () => {
  console.log('开始压缩');
  const fileList = [];
  readFileList('./', fileList);
  for (item of fileList) {
    await imagemin([item.file], {
      destination: item.path,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  }
  console.log('压缩完毕');
  exit(1);
})();
