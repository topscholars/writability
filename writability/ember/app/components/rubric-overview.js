import Ember from 'ember';

export default Ember.Component.extend({
	selectedRubricCategory: null,

	rubricCategories: [],

	actions: {
		selectCategory: function (category) {
			this.set('selectedRubricCategory', category);
		}
	}
});
