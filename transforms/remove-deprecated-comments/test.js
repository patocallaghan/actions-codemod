'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'remove-deprecated-comments',
});