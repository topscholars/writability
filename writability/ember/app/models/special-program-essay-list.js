import Ember from 'ember';

export default Ember.Object.extend({
	specialProgram: null,
	content: [],

	choiceEssays: function() {
		return this.get('content').filter(function(essay) {
			if (essay.get('choice_group')) {
				return true;
			} else {
				return false;
			}
		});
	}.property('content.length'),

	requiredEssays: function() {
		return this.get('content').filter(function(essay) {
			if (essay.get('choice_group')) {
				return false;
			} else {
				return true;
			}
		});
	}.property('content.length'),

	manualIsActive: null,

	showEssays: function() {
		if (this.get('manualIsActive') !== null) {
			return this.get('manualIsActive');
		}

		var show = false;

		this.get('content').forEach(function(essay) {
			if (essay.get('onboarding_is_selected')) {
				show = true;
			}
		});

		if (show) {
			this.set('manualIsActive', true);
		}

		return show;
	}.property('content.length', 'content.@each.onboarding_is_selected', 'manualIsActive')
});
