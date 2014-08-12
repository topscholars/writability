import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('application-essay', params.id);
    },

    renderTemplate: function () {
        this.controllerFor('essays').send('selectEssay', this.currentModel);
        this.render({outlet: 'right-side-outlet'});
    },

    _assert_authorized: function (id) {
        var route = this;
        this.get('currentStudent').get('application_essays').then(function (application_essays) {
            if (!application_essays.isAny('id', id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    }
});
