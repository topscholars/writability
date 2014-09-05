import Ember from 'ember';

export default Ember.Component.extend({
  rubric: null,

  selectedRubricCategory: null,

  selectedRubricCategoryDidChange: function() {
    var component = this;
    var criteria = this.get('rubric').load_impact_criteria(this.get('selectedRubricCategory'));

    criteria.then(function(c) {
      component.set('criteria', c);
    });

  }.observes('selectedRubricCategory'),
  actions: {
    selectCategory: function (category) {
      this.set('selectedRubricCategory', category);
    }
  }
});

