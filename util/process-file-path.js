module.exports = function processFilePath(filePath) {
  return filePath
    .replace(process.cwd(), '')
    .replace('.hbs', '')
    .replace('.js', '')
    .replace('controllers/', '')
    .replace('templates/', '')
    .replace(/^\//, '');
};
