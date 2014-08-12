import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('themeEssay', params.id);
    },

    renderTemplate: function () {
        this.controllerFor('essays').send('selectEssay', this.currentModel);
        this.render({outlet: 'right-side-outlet'});
    },

    _assert_authorized: function (id) {
        var route = this;
        this.get('currentStudent').get('theme_essays').then(function (theme_essays) {
            if (!theme_essays.isAny('id', id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    }
});
