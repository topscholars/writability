import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['rubric-slider'],
	classNameBindings: ['selected'],

	category: null,
	selectedRubricCategory: null,

	barWidth: function() {
		return "width: " + this.get('category.score') + "%;";
	}.property('category.score'),

	selected: function () {
		return this.get('category.id') === this.get('selectedRubricCategory.id');
	}.property('category', 'selectedRubricCategory'),

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
		},
		select: function () {
			this.sendAction('select', this.get('category'));
		}
	}
});
