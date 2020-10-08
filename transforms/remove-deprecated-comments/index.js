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
        if (node.path.original === 'action') {
          hasAction = true;
        }
      },
      SubExpression(node) {
        if (node.path.original === 'action') {
          hasAction = true;
        }
      },
    };
  });

  if (!hasAction && hasNoActionRule) {
    return visit(ast, (env) => {
      return {
        Program(node) {
          let indexOfComment = node.body.findIndex(
            (node) =>
              node.type === 'MustacheCommentStatement' &&
              node.value.includes('template-lint-disable no-action'),
          );
          if (hasOtherRule) {
            node.body.splice(indexOfComment, 2);
          } else {
            node.body.splice(0, 8);
          }
        },
      };
    });
  } else {
    return source;
  }
};

module.exports.type = 'hbs';
