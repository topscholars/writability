import Ember from 'ember';

export default Ember.ArrayController.extend({
	noProgramEssays: function() {
		return this.get('content').filter(function(essay) {
			if (essay.get('special_program')) {
				return false;
			} else {
				return true;
			}
		});
	}.property('content.length'),

	programEssays: function() {
		return this.get('content').filter(function(essay) {
			if (essay.get('special_program')) {
				return true;
			} else {
				return false;
			}
		});
	}.property('content.length'),

	choiceEssays: function() {
		return this.get('noProgramEssays').filter(function(essay) {
			if (essay.get('choice_group')) {
				return true;
			} else {
				return false;
			}
		});
	}.property('noProgramEssays.length'),

	requiredEssays: function() {
		return this.get('noChoiceEssays').filterBy('requirement_type', 'Required');
	}.property('noChoiceEssays.length'),

	optionalEssays: function() {
		return this.get('noChoiceEssays').filterBy('requirement_type', 'Optional');
	}.property('noChoiceEssays.length'),

	noChoiceEssays: function() {
		return this.get('noProgramEssays').filter(function(essay) {
			if (essay.get('choice_group')) {
				return false;
			} else {
				return true;
			}
		});
	}.property('noProgramEssays.length'),
	// changeContent: function() {
	// 	if (this.get('applicationEssays') && this.get('universityName')) {
	// 		this.set('universityApplicationEssays', this.get('applicationEssays').filterBy('university_name', this.get('universityName')));
	// 		console.log(this.get('universityApplicationEssays'));
	// 	}
	// }.observes('applicationEssays.length', 'universityName'),

	actions: {
		toggleApplicationEssay: function (applicationEssay) {
			if (applicationEssay.get('requirement_type') !== 'Required') {
				var controller = this;
				applicationEssay.toggleProperty('onboarding_is_selected');

				applicationEssay.save().then(function() {
					controller.send('alert', 'Application Essay Selected');
				});
			} else {
				this.send('alert', 'This essay is required', 'warning');
			}
		}
	}
});
