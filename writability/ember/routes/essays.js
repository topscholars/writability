import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    beforeModel: function() {
        if (this.get('currentUser').get('isStudent') && this.get('currentStudent').get('state') !== 'active') {
                this.transitionTo('universities');

        }
    },
    model: function () {
        if (this.get('currentUser').get('isStudent')) {
            return this.get('currentStudent').get('theme_essays');
        } else {
            console.log('in teacher side of essaysroute');
            return this.get('currentTeacher').get('students').get('theme_essays');
        }
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    }
});
