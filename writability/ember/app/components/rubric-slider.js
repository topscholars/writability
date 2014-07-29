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

	categoryGradeHasChanged: function() {
		Ember.run.debounce(this, this.saveCategory, autosaveTimout);
	}.observes('category.grade'),

	barWidth: function() {
		return "width: " + this.get('category.grade') + "%;";
	}.property('category.grade'),

	selected: function () {
		return this.get('category.id') === this.get('selectedRubricCategory.id');
	}.property('category', 'selectedRubricCategory'),

	actions: {
		decrement: function () {
			if (this.get('category.grade') >= 10 && this.get('reviewMode')) {
				this.decrementProperty('category.grade', 10);
			}
		},
		increment: function () {
			if (this.get('category.grade') <= 90 && this.get('reviewMode')) {
				this.incrementProperty('category.grade', 10);
			}
		},
		select: function () {
			this.sendAction('select', this.get('category'));
		}
	}
});
