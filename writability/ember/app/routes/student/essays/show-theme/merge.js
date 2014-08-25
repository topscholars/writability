import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
	model: function() {
		return this.modelFor('student').get('theme_essays');
	},

    setupController: function(controller, model) {
        controller.set('parentEssay', this.modelFor('student.essays.show-theme'));
        controller.set('essays', model);
    },
    renderTemplate: function() {
        this.render({into: 'application', outlet: 'modal-module'});
        this.send('openModal');
    }
});
