const { getParser } = require('codemod-cli').jscodeshift;
const ActionsMap = require('../../util/actions-map');
const FORMATTING = require('../../util/formatting');
const addComment = require('../../util/add-comment');

module.exports = function transformer(file, api) {
  const j = getParser(api);

  let modifiedKey = '';
  return j(file.source)
    .find(j.ImportDeclaration, (node) => {
      modifiedKey = '';
      let actionsCache = ActionsMap.getCache('actions');
      return Object.keys(actionsCache).find((key) => {
        if (!actionsCache[key].length) {
          return false;
        }
        let source = node.source.value;
        let componentName = source.substring(source.lastIndexOf('/') + 1);
        let hasComponentName = key.substring(key.lastIndexOf('/') + 1) === componentName;
        if (hasComponentName) {
          modifiedKey = key;
        }
        return hasComponentName;
      });
    })
    .forEach((path) => {
      addComment(
        j,
        path,
        ` CODE MIGRATION HINT: \`${modifiedKey}\` has had its actions changed so this may affect this subclassing`,
      );
    })
    .toSource(FORMATTING);
};

module.exports.type = 'js';
