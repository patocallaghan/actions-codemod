module.exports = function ({ source /*, path*/ }, { parse, visit }) {
  const ast = parse(source);

  return visit(ast, (env) => {
    let { builders: b } = env.syntax;

    return {
      MustacheStatement(node) {
        if (node.path.original === 'action') {
          if (node.hash.pairs.length) {
            return;
          }
          if (
            node.params.length &&
            node.params[0].type === 'SubExpression' &&
            node.params[0].path.original === 'mut'
          ) {
            let property = node.params[0].params[0];
            return b.mustache('set', [property, ...node.params.slice(1)]);
          }
        }
      },
      SubExpression(node) {
        if (node.path.original === 'action') {
          if (node.hash.pairs.length) {
            return;
          }
          if (
            node.params.length &&
            node.params[0].type === 'SubExpression' &&
            node.params[0].path.original === 'mut'
          ) {
            let property = node.params[0].params[0];
            return b.sexpr('set', [property, ...node.params.slice(1)]);
          }
        }
      },
    };
  });
};

module.exports.type = 'hbs';
