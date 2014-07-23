import Ember from 'ember';

export default Ember.Component.extend({
	category: null,
	selectedRubricCategory: null,
	barWidth: function() {
		return "width: " + this.get('category.score') + "%;";
	}.property('category.score'),

	actions: {
		decrement: function () {
			if (this.get('category.score') >= 10) {
				this.decrementProperty('category.score', 10);
			}
		},
		increment: function () {
			if (this.get('category.score') <= 90) {
				this.incrementProperty('category.score', 10);
			}
		}
	}
});
