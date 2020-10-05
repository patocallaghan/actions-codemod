const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const addImportSpecifier = require('../../util/add-import-specifier');
const FORMATTING = require('../../util/formatting');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  let code = j(file.source)
    .find(j.ObjectProperty, {
      key: {
        type: 'Identifier',
        name: 'actions',
      },
    })
    .forEach((path) => {
      path.node.value.properties = path.node.value.properties.filter((func) => {
        const actionFunc = j(`${func.key.name}: action()`).__paths[0].value.program.body[0];
        actionFunc.body.expression.arguments.push(
          j.functionExpression(null, func.params, func.body),
        );
        j(path).insertBefore(actionFunc);

        return false;
      });
    })
    .toSource(FORMATTING);

  code = j(code)
    .find(j.ObjectProperty, {
      key: {
        type: 'Identifier',
        name: 'actions',
      },
    })
    .forEach((path) => {
      if (!path.node.value.properties.length) {
        j(path).remove();
      }
    })
    .toSource(FORMATTING);

  code = addImportSpecifier(j, code, 'action', '@ember/object');
  return j(code).toSource(FORMATTING);
};

module.exports.type = 'js';
