const ActionsMap = require('./actions-map');
const FORMATTING = require('./formatting');
const processFilePath = require('./process-file-path');
const addImportSpecifier = require('./add-import-specifier');

module.exports = function actionHash(file, j, shouldModify) {
  let shouldAddImport = false;
  let modifiedFilePath = processFilePath(file.path);
  let code = j(file.source)
    .find(j.ObjectProperty, {
      key: {
        type: 'Identifier',
        name: 'actions',
      },
    })
    .forEach((path) => {
      path.node.value.properties = path.node.value.properties.filter((func) => {
        if (!shouldModify) {
          ActionsMap.addItem('js', modifiedFilePath, func.key.name);
          return true;
        }
        if (ActionsMap.hasAction('actions', modifiedFilePath, func.key.name)) {
          shouldAddImport = true;
          const actionFunc = j(`${func.key.name}: action()`).__paths[0].value.program.body[0];
          let newFunc = j.functionExpression(null, func.params, func.body);
          newFunc.async = func.async;
          actionFunc.body.expression.arguments.push(newFunc);
          j(path).insertBefore(actionFunc);

          return false;
        }
        return true;
      });
    })
    .toSource(FORMATTING);

  if (shouldModify) {
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

    if (shouldAddImport) {
      code = addImportSpecifier(j, code, 'action', '@ember/object');
      return j(code).toSource(FORMATTING);
    }
  }
  return j(code).toSource(FORMATTING);
};
