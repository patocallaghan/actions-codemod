const actionModifiers = require('../../util/action-modifiers');
const { getOptions } = require('codemod-cli');

module.exports = function ({ source, path: filePath }, { parse, visit }) {
  const ast = parse(source);
  const { shouldModify } = getOptions();

  return visit(ast, (env) => {
    let { builders: b } = env.syntax;

    return {
      MustacheStatement(node, path) {
        actionModifiers(node, path, b, filePath, shouldModify !== 'false');
      },
    };
  });
};

module.exports.type = 'hbs';
