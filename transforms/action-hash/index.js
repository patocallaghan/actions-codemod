const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const actionHash = require('../../util/action-hash');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const { shouldModify } = getOptions();
  return actionHash(file, j, shouldModify !== 'false');
};

module.exports.type = 'js';
