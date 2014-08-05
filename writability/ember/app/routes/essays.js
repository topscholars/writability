import AuthenticatedRoute from './authenticated';
import DS from 'ember-data';
import Ember from 'ember';

export default AuthenticatedRoute.extend({
    beforeModel: function() {
        if (this.get('currentUser').get('isStudent') && this.get('currentStudent').get('state') !== 'active') {
                this.transitionTo('universities');

        }
    },
    model: function () {
        var route = this;
        if (this.get('currentUser').get('isStudent')) {
            var promise = new Ember.RSVP.Promise(function(resolve) {
                Ember.RSVP.all([
                    route.get('currentStudent').get('theme_essays'),
                    route.get('currentStudent').get('application_essays')
                ]).then(function(data) {
                    resolve(data[0].content.concat(data[1].content));
                });
            });
            return DS.PromiseArray.create({promise: promise});
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
