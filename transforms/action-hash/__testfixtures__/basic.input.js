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
