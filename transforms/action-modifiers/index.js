function isDomHandler(name) {
  return ['oninput', 'onclick', 'onblur', 'onfocus', 'onkeypress', 'onkeydown'].includes(name);
}

function isMutAction(node) {
  return node.params[0].type === 'SubExpression' && node.params[0].path.original === 'mut';
}

function isPassedAction(node) {
  return node.params[0].type === 'PathExpression';
}

module.exports = function ({ source /* path */ }, { parse, visit }) {
  const ast = parse(source);

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
            if (node.params.length === 1) {
              path.parent.node.value = b.mustache(`this.${node.params[0].original}`);
            } else {
              path.parent.node.value = b.mustache(b.path('fn'), [
                b.path(`this.${node.params[0].original}`),
                ...node.params.splice(1),
              ]);
            }
          }
        }
      },
    };
  });
};

module.exports.type = 'hbs';
