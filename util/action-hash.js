const ActionsMap = require('./actions-map');
const FORMATTING = require('./formatting');
const addComment = require('./add-comment');
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

    code = j(code)
      .find(j.MemberExpression, (path) => {
        if (
          path.object.type === 'ThisExpression' &&
          path.property &&
          path.property.name &&
          ActionsMap.hasAction('actions', modifiedFilePath, path.property.name)
        ) {
          return true;
        }

        if (
          path.object.type === 'ThisExpression' &&
          path.callee &&
          path.callee.property &&
          path.callee.property.name &&
          (path.callee.property.name === 'send' || path.callee.property.name === 'sendAction') &&
          path.arguments &&
          path.arguments.length &&
          path.arguments[0].type === 'StringLiteral' &&
          ActionsMap.hasAction('actions', modifiedFilePath, path.arguments[0].value)
        ) {
          return true;
        }
      })
      .forEach((path) => {
        addComment(
          j,
          path,
          ` CODE MIGRATION HINT: \`this.${path.node.property.name}\` is now being clobbered by a migrated action`,
        );
      })
      .toSource(FORMATTING);

    code = j(code)
      .find(j.CallExpression, (path) => {
        if (
          path.callee &&
          path.callee.object &&
          path.callee.object.type === 'ThisExpression' &&
          path.callee.property &&
          path.callee.property.name &&
          (path.callee.property.name === 'send' || path.callee.property.name === 'sendAction') &&
          path.arguments[0].type.includes('Literal') &&
          ActionsMap.hasAction('actions', modifiedFilePath, path.arguments[0].value)
        ) {
          return true;
        }
      })
      .forEach((path) => {
        addComment(
          j,
          path,
          ` CODE MIGRATION HINT: \`this.${path.node.arguments[0].value}\` is now being clobbered by a migrated action`,
        );
      })
      .toSource();

    if (shouldAddImport) {
      code = addImportSpecifier(j, code, 'action', '@ember/object');
      return j(code).toSource(FORMATTING);
    }
  }
  return j(code).toSource(FORMATTING);
};
