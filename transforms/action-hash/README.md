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
* [noop](#noop)
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
import { action } from '@ember/object';
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
  }),
});

```
---
<a id="noop">**noop**</a>

**Input** (<small>[noop.input.js](transforms/action-hash/__testfixtures__/noop.input.js)</small>):
```js

/* === ⚠️ THIS FILE CURRENTLY USES DEPRECATED PATTERNS ⚠️ === */
/* === 🔗 For more information visit https://go.inter.com/ember-best-practices 🔗 */
/* === 🚀 Please consider refactoring & removing some of the comments below when working on this file 🚀 */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-computed-macros */
/* eslint-disable ember/use-brace-expansion */
/* eslint-disable @intercom/intercom/use-es5-getters */
import Component from '@ember/component';
import EmberObject, { action, computed } from '@ember/object';
import { match } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  isEventAttribute: match('item.value', /^user_event_summaries\./),
  shouldRenderTooltip: computed('item.descriptionForTooltip', 'truncated', function() {
    return this.get('item.descriptionForTooltip') || this.get('truncated');
  }),

  handleClick: action(function() {
    this.onDropdownItemSelected(this.get('item.value'));
  }),
  onDropdownItemSelected: action(function() {
    if (this.isEventAttribute) {
      this.addEventCountPredicate();
    } else {
      this.selectItem(this.item, this.get('item.value'));
    }
  }),
  addEventCountPredicate: action(function() {
    let attribute = EmberObject.create({
      identifier: `${this.get('item.value')}.count`,
      type: `user_event_integer`,
    });
    let clonedItemWithValue = Object.assign({}, this.item, { value: attribute });
    let item = EmberObject.create(clonedItemWithValue);
    this.selectItem(item);
  }),
  checkForTruncation: action(function(element) {
    if (element) {
      this.set('truncated', element.offsetWidth < element.scrollWidth);
    } else {
      this.set('truncated', false);
    }
  }),
});

```

**Output** (<small>[noop.output.js](transforms/action-hash/__testfixtures__/noop.output.js)</small>):
```js
/* === ⚠️ THIS FILE CURRENTLY USES DEPRECATED PATTERNS ⚠️ === */
/* === 🔗 For more information visit https://go.inter.com/ember-best-practices 🔗 */
/* === 🚀 Please consider refactoring & removing some of the comments below when working on this file 🚀 */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-computed-macros */
/* eslint-disable ember/use-brace-expansion */
/* eslint-disable @intercom/intercom/use-es5-getters */
import Component from '@ember/component';
import EmberObject, { action, computed } from '@ember/object';
import { match } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  isEventAttribute: match('item.value', /^user_event_summaries\./),
  shouldRenderTooltip: computed('item.descriptionForTooltip', 'truncated', function() {
    return this.get('item.descriptionForTooltip') || this.get('truncated');
  }),

  handleClick: action(function() {
    this.onDropdownItemSelected(this.get('item.value'));
  }),
  onDropdownItemSelected: action(function() {
    if (this.isEventAttribute) {
      this.addEventCountPredicate();
    } else {
      this.selectItem(this.item, this.get('item.value'));
    }
  }),
  addEventCountPredicate: action(function() {
    let attribute = EmberObject.create({
      identifier: `${this.get('item.value')}.count`,
      type: `user_event_integer`,
    });
    let clonedItemWithValue = Object.assign({}, this.item, { value: attribute });
    let item = EmberObject.create(clonedItemWithValue);
    this.selectItem(item);
  }),
  checkForTruncation: action(function(element) {
    if (element) {
      this.set('truncated', element.offsetWidth < element.scrollWidth);
    } else {
      this.set('truncated', false);
    }
  }),
});

```
<!--FIXTURES_CONTENT_END-->
