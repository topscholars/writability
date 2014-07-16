import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentUser');
    },

    redirect: function (model, transition) {
        if (model.get('isStudent')) {
            this.transitionTo('essays');
        } else {
            this.transitionTo('students');
        }
    }
});
