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
