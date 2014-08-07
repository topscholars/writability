import Ember from 'ember';
import { autosaveTimout } from 'writability/config';

export default Ember.Component.extend({
	classNames: ['rubric-slider'],
	classNameBindings: ['selected'],

	association: null,
	selectedRubricCategory: null,

	saveCategory: function() {
		if (this.get('association.isDirty') == true) {
			this.get('association').save();
		}
	},

	associationGradeHasChanged: function() {
		Ember.run.debounce(this, this.saveCategory, autosaveTimout);
	}.observes('association.grade'),

	barWidth: function() {
		return "width: " + this.get('association.grade') + "%;";
	}.property('association.grade'),

	selected: function () {
		return this.get('association.rubric_category.id') === this.get('selectedRubricCategory.id');
	}.property('association', 'selectedRubricCategory'),

	actions: {
		decrement: function () {
			if (this.get('association.grade') >= 10 && this.get('reviewMode')) {
				this.decrementProperty('association.grade', 10);
			}
		},
		increment: function () {
			if (this.get('association.grade') <= 90 && this.get('reviewMode')) {
				this.incrementProperty('association.grade', 10);
			}
		},
		select: function () {
			this.sendAction('select', this.get('association.rubric_category'));
		}
	}
});
