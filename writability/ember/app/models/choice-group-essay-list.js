import Ember from 'ember';

export default Ember.Object.extend({
	choiceGroup: null,
	content: [],

	selectedEssays: function() {
		console.log('selectedEssays calculated');

		return this.get('content').filterBy('onboarding_is_selected', true);
	}.property('content.@each.onboarding_is_selected'),

	requiredSelected: function() {
		if (this.get('selectedEssays.length') >= this.get('choiceGroup.num_required_essays')) {
			return true;
		} else {
			return false;
		}
	}.property('selectedEssays.length', 'choiceGroup.num_required_essays')
});
