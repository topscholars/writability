import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        if (!this.get('currentUser')) {
            return Ember.RSVP.Promise.all([
                this.store.find('user', 0),
                this.store.find('teacher', 0),
                this.store.find('student', 0)
            ]).then(function (values) {
                var user = values[0];
                var teacher = values[1];
                var student = values[2];

                return user.get('roles').then(function (roles) {
                    if (!user.get('isTeacher')) {
                        teacher = null;
                    }

                    if (!user.get('isStudent')) {
                        student = null;
                    }

                    this.controllerFor('application').set(
                        'currentUser',
                        user);
                    this.controllerFor('application').set(
                        'currentTeacher',
                        teacher);
                    this.controllerFor('application').set(
                        'currentStudent',
                        student);
                }.bind(this));
            }.bind(this));
        }
    },

    currentUser: function() {
        return this.controllerFor('application').get('currentUser');
    }.property(),

    currentStudent: function() {
        return this.controllerFor('application').get('currentStudent');
    }.property(),

    currentTeacher: function() {
        return this.controllerFor('application').get('currentTeacher');
    }.property(),

    setupController: function(controller, model) {
        controller.set('currentUser', this.get('currentUser'));
        this._super(controller, model);
    }
});
