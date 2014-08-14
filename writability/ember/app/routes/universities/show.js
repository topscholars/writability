import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
	model: function (params) {
		var universityName = params.university_name;

		return universityName;
	},

	setupController: function(controller, model) {
		controller.set('applicationEssays', this.get('currentStudent.application_essays'));
		controller.set('universityName', model);
	    this._super(controller, null);
	},

    renderTemplate: function () {
        this.render({into: 'layouts/main', outlet: 'right-side-outlet'});
    }
});
