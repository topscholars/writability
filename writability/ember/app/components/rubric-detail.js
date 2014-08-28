import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['rubric-detail'],
  actions: {
    updateCriteria: function() {
      var component = this;
      this.get('criterion').load_impact_criteria().then(function(criteria) {
        this.set('rubricCriteria', criteria);
      });
    }
  }
});
