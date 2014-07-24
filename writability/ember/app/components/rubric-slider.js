import Ember from 'ember';
import { autosaveTimout } from 'writability/config';

export default Ember.Component.extend({
	classNames: ['rubric-slider'],
	classNameBindings: ['selected'],

	category: null,
	selectedRubricCategory: null,

	saveCategory: function() {
		this.get('category').save();
	},

	categoryScoreHasChanged: function() {
		Ember.run.debounce(this, this.saveCategory, autosaveTimout);
	}.observes('category.score'),

	barWidth: function() {
		return "width: " + this.get('category.score') + "%;";
	}.property('category.score'),

	selected: function () {
		return this.get('category.id') === this.get('selectedRubricCategory.id');
	}.property('category', 'selectedRubricCategory'),

	actions: {
		decrement: function () {
			if (this.get('category.score') >= 10 && this.get('reviewMode')) {
				this.decrementProperty('category.score', 10);
			}
		},
		increment: function () {
			if (this.get('category.score') <= 90 && this.get('reviewMode')) {
				this.incrementProperty('category.score', 10);
			}
		},
		select: function () {
			this.sendAction('select', this.get('category'));
		}
	}
});
