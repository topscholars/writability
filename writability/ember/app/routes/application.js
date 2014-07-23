import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentUser');
    },

    actions: {
        closeModal: function() {
            this.controllerFor('application').set('modalActive', false);
        },
        openModal: function() {
            this.controllerFor('application').set('modalActive', true);
        },
        openLoading: function() {
            this.controllerFor('application').set('loadingActive', true);
        },
        closeLoading: function() {
            this.controllerFor('application').set('loadingActive', false);
        },
    }
});
