import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    setupController: function(controller, model) {
        controller.set('parentEssay', this.modelFor('student.essays.show'));
        controller.set('essays', this.modelFor('student.essays'));
    },
    renderTemplate: function() {
        this.render({into: 'application', outlet: 'modal-module'});
        this.send('openModal');
    }
});
