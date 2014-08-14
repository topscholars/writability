import Ember from 'ember';

export default Ember.ArrayController.extend({
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
