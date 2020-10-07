'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'mut-to-set',
});