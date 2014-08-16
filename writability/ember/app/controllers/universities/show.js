import Ember from 'ember';

export default Ember.ArrayController.extend({
	noProgramEssays: function() {
		return this.get('model').filter(function(essay) {
			if (essay.get('special_program')) {
				return false;
			} else {
				return true;
			}
		});
	}.property('model.length'),

	programEssays: function() {
		return this.get('model').filter(function(essay) {
			if (essay.get('special_program')) {
				return true;
			} else {
				return false;
			}
		});
	}.property('model.length'),

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
			var controller = this;
			applicationEssay.toggleProperty('onboarding_is_selected');

			applicationEssay.save().then(function() {
				controller.send('alert', 'Application Essay Selected');
			});
		}
	}
});
