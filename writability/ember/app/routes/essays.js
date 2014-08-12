import AuthenticatedRoute from './authenticated';
import DS from 'ember-data';
import Ember from 'ember';

export default AuthenticatedRoute.extend({
    beforeModel: function() {
        if (this.get('currentUser').get('isStudent') && this.get('currentStudent').get('state') !== 'active') {
            this.transitionTo('universities.add');
        }
    },
    model: function () {
        var route = this;
        if (this.get('currentUser').get('isStudent')) {
            return this.get('currentStudent.all_essays');
        } else {
            console.log('in teacher side of essaysroute');
            return this.get('currentTeacher').get('students').get('essays');
        }
    },

    renderTemplate: function () {
        this.render('layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
    }
});
