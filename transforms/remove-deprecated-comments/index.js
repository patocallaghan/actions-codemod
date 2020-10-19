module.exports = function ({ source /*, path*/ }, { parse, visit }) {
  const ast = parse(source);

  let hasAction = false;
  let hasNoActionRule = false;
  let hasOtherRule = false;

  visit(ast, (env) => {
    return {
      MustacheCommentStatement(node) {
        if (node.value.includes('template-lint-disable no-action')) {
          hasNoActionRule = true;
        } else if (node.value.includes('template-lint-disable')) {
          hasOtherRule = true;
        }
      },
    };
  });

  visit(ast, (env) => {
    return {
      MustacheStatement(node) {
        if (node.path && node.path.original === 'action') {
          hasAction = true;
        }
      },
      SubExpression(node) {
        if (node.path && node.path.original === 'action') {
          hasAction = true;
        }
      },
      PathExpression(node) {
        if (node.original === 'action') {
          hasAction = true;
        }
      },
    };
  });

  if (!hasAction && hasNoActionRule) {
    source = visit(ast, (env) => {
      let { builders: b } = env.syntax;
      return {
        Program(node) {
          node.body = [
            b.MustacheCommentStatement(`{{!-- CODE MIGRATION COMMENT - REMOVE LINT--}}`),
            b.text('\n'),
          ].concat(node.body);
        },
      };
    });
  }
  return source;
};

module.exports.type = 'hbs';
