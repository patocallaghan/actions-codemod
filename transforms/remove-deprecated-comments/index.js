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
          let indexOfComment = node.body.findIndex(
            (node) =>
              node.type === 'MustacheCommentStatement' &&
              node.value.includes('template-lint-disable no-action'),
          );
          if (hasOtherRule) {
            node.body = node.body.map((node, index) => {
              if (index === indexOfComment || index === indexOfComment + 1) {
                return b.text('{{!-- DELETE COMMENT --}}');
              } else {
                return node;
              }
            });
          } else {
            node.body = node.body.map((node, index) => {
              return index > 7 ? node : b.text('{{!-- DELETE COMMENT --}}');
            });
          }
        },
      };
    });
  }
  return source;
};

module.exports.type = 'hbs';
