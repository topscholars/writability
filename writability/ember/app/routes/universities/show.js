import Ember from 'ember';
import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
	getApplicationEssays: function(promises) {
		return promises[1].filterBy('university_name', promises[0]);
	},

	beforeModel: function() {
		if (this.get('currentStudent.universities.length') < 1) {
			this.transitionTo('universities.add');
		}
	},

	model: function (params) {
		var universityName = params.university_name,
			applicationEssays = this.get('currentStudent.application_essays');

		return Ember.RSVP.all([universityName, applicationEssays]);
	},

	afterModel: function(promises, transition) {
		if (this.getApplicationEssays(promises).length < 1) {
			debugger;
			transition.send('alert', 'Please finish adding universities', 'danger');
			this.transitionTo('universities.add');
		}
	},

	setupController: function(controller, promises) {
		var applicationEssays = promises[1],
			universityName = promises[0];

		controller.set('applicationEssays', applicationEssays);
		controller.set('universityName', universityName);
		controller.set('universityApplicationEssays', this.getApplicationEssays(promises));
	    this._super(controller, null);
	},

    renderTemplate: function () {
        this.render({into: 'layouts/main', outlet: 'right-side-outlet'});
    }
});
