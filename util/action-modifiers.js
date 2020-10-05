const ActionsMap = require('./actions-map');
const processFilePath = require('./process-file-path');

function isDomHandler(name) {
  return ['oninput', 'onclick', 'onblur', 'onfocus', 'onkeypress', 'onkeydown'].includes(name);
}

function isMutAction(node) {
  return node.params[0].type === 'SubExpression' && node.params[0].path.original === 'mut';
}

function isPassedAction(node) {
  return node.params[0].type === 'PathExpression';
}

module.exports = function actionModifiers(node, path, b, filePath, shouldModify) {
  let modifiedFilePath = processFilePath(filePath);
  if (
    node.path.original === 'action' &&
    path.parent.node.type === 'AttrNode' &&
    !isPassedAction(node)
  ) {
    if (!isDomHandler(path.parent.node.name) && !isMutAction(node)) {
      let actionName = node.params[0].original;
      if (shouldModify && ActionsMap.hasAction('actions', modifiedFilePath, actionName)) {
        if (node.params.length === 1) {
          path.parent.node.value = b.mustache(`this.${actionName}`);
        } else {
          path.parent.node.value = b.mustache(b.path('fn'), [
            b.path(`this.${actionName}`),
            ...node.params.splice(1),
          ]);
        }
      } else {
        ActionsMap.addItem('hbs', modifiedFilePath, actionName);
      }
    }
  }
};
