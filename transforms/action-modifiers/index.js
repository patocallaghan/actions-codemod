const { getOptions } = require('codemod-cli');
const ActionsMap = require('../../util/actions-map');
const processFilePath = require('../../util/process-file-path');

function isDomHandler(name) {
  return [
    'oninput',
    'onclick',
    'onblur',
    'onfocus',
    'onkeypress',
    'onkeydown',
    '@enter',
    '@key-down',
    '@key-up',
    '@key-press',
    'enter',
    'key-down',
    'key-up',
    'key-press',
  ].includes(name);
}

function isMutAction(node) {
  return node.params[0].type === 'SubExpression' && node.params[0].path.original === 'mut';
}

function isPassedAction(node) {
  return node.params[0].type === 'PathExpression';
}

module.exports = function ({ source, path: filePath }, { parse, visit }) {
  const ast = parse(source);
  const options = getOptions();
  const modifiedFilePath = processFilePath(filePath);
  const shouldModify = options.shouldModify !== 'false';

  return visit(ast, (env) => {
    let { builders: b } = env.syntax;

    return {
      MustacheStatement(node, path) {
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
      },
      SubExpression(node, path) {
        if (
          node.path.original === 'action' &&
          path.parent.node.type === 'HashPair' &&
          !isPassedAction(node)
        ) {
          if (!isDomHandler(path.parent.node.key) && !isMutAction(node)) {
            let actionName = node.params[0].original;
            if (shouldModify && ActionsMap.hasAction('actions', modifiedFilePath, actionName)) {
              if (node.params.length === 1) {
                path.parent.node.value = b.path(`this.${actionName}`);
              } else {
                path.parent.node.value = b.sexpr(b.path('fn'), [
                  b.path(`this.${actionName}`),
                  ...node.params.splice(1),
                ]);
              }
            } else {
              ActionsMap.addItem('hbs', modifiedFilePath, actionName);
            }
          }
        }
      },
    };
  });
};

module.exports.type = 'hbs';
