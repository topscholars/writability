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

	noChoiceEssays: function() {
		return this.get('content').filter(function(essay) {
			if (essay.get('choice_group')) {
				return false;
			} else {
				return true;
			}
		});
	}.property('content.length'),

	requiredEssays: function() {
		return this.get('noChoiceEssays').filterBy('requirement_type', 'Required');
	}.property('noChoiceEssays.length'),

	optionalEssays: function() {
		return this.get('noChoiceEssays').filterBy('requirement_type', 'Optional');
	}.property('noChoiceEssays.length'),

	currentEssayState: null,
	showCheck: null,

	showEssays: function() {
		if (this.get('showCheck') !== null) {
			return this.get('showCheck');
		}

		var show = false;

		this.get('content').forEach(function(essay) {
			if (essay.get('onboarding_is_selected')) {
				show = true;
			}
		});

		if (show) {
			this.set('currentEssayState', true);
			this.set('showCheck', true);
		}

		return show;
	}.property('content.length', 'content.@each.onboarding_is_selected', 'showCheck')
});
