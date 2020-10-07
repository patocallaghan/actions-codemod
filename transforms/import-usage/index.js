const { getParser } = require('codemod-cli').jscodeshift;
const ActionsMap = require('../../util/actions-map');
const FORMATTING = require('../../util/formatting');
const addComment = require('../../util/add-comment');

module.exports = function transformer(file, api) {
  const j = getParser(api);

  return j(file.source)
    .find(j.ImportDeclaration, (node) => {
      let jsCache = ActionsMap.getCache('js');
      return Object.keys(jsCache).find((key) => {
        if (!jsCache[key].length) {
          return false;
        }
        let source = node.source.value;
        let componentName = source.substring(source.lastIndexOf('/') + 1);
        return key.substring(key.lastIndexOf('/') + 1) === componentName;
      });
    })
    .forEach((path) => {
      addComment(
        j,
        path,
        ` CODE MIGRATION HINT: \`${path.node.source.value}\` has had its actions changed so this may affect this subclassing`,
      );
    })
    .toSource(FORMATTING);
};

module.exports.type = 'js';
