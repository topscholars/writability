import Ember from 'ember';

export default Ember.Component.extend({
	category: null,
	selectedRubricCategory: null,
	barWidth: function() {
		return "width: " + this.get('category.score') + "%;";
	}.property('category.score')
});
