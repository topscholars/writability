import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    renderTemplate: function () {
        this.controllerFor('student.essays').send('selectEssay', this.currentModel, true);
        this.render({outlet: 'right-side-outlet'});
    }
});
