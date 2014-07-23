import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['rubric-overview'],

	selectedRubricCategory: null,

	rubricCategories: [],

	actions: {
		selectCategory: function (category) {
			this.set('selectedRubricCategory', category);
		}
	}
});
