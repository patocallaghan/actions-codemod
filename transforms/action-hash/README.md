# action-hash

## Usage

```
npx actions-codemod action-hash path/of/files/ or/some**/*glob.js

# or

yarn global add actions-codemod
actions-codemod action-hash path/of/files/ or/some**/*glob.js
```

## Local Usage

```
node ./bin/cli.js action-hash path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/action-hash/__testfixtures__/basic.input.js)</small>):
```js
import Component from '@ember/component';

export default Component.extend({
  test: {
    wat: 'wtf',
  },
  bap: action(function () {
    console.log('wat');
  }),
  actions: {
    foo(predicate) {
      this.set('newlyAddedPredicate', null);
    },
    bar(predicate, updatedPredicate) {
      predicate.setProperties(updatedPredicate);
    },
    baz(predicate, updatedPredicate) {
      predicate.setProperties(updatedPredicate);
    },
  },
});

```

**Output** (<small>[basic.output.js](transforms/action-hash/__testfixtures__/basic.output.js)</small>):
```js
import Component from '@ember/component';

export default Component.extend({
  test: {
    wat: 'wtf',
  },

  bap: action(function () {
    console.log('wat');
  }),

  foo: action(function(predicate) {
    this.set('newlyAddedPredicate', null);
  }),

  bar: action(function(predicate, updatedPredicate) {
    predicate.setProperties(updatedPredicate);
  }),

  baz: action(function(predicate, updatedPredicate) {
    predicate.setProperties(updatedPredicate);
  })
});

```
<!--FIXTURES_CONTENT_END-->
