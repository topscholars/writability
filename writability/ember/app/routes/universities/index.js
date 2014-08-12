import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
    setupController: function(controller, model) {
        this.controllerFor('universities').set('addingUniversities', false);
        this._super(controller, model); //Required boilerplate
    },

    renderTemplate: function () {
        this.render({into: 'layouts/main', outlet: 'right-side-outlet'});
    }
});
