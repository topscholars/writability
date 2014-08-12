import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentStudent').get('universities');
    },

    setupController: function(controller, model) {
        controller.set('student', this.get('currentStudent'));
        controller.set('backDisabled', true);
        this._super(controller, model); //Required boilerplate
    },

    renderTemplate: function () {
        this.render('layouts/main');
        this.render('nav-header', {outlet: 'header'});
        this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
    }
});
