
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
