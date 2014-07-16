import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return Ember.RSVP.Promise.all([
            this.get('currentTeacher').get('students'),
            this.get('currentTeacher').get('invitations')
        ]).then(function(values) {
            return {students: values[0], invitations: values[1]};
        });
    },

    setupController: function (controller, model) {
        controller.set('students', model.students);
        controller.set('invitations', model.invitations);
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        // needs into explicity because core/layouts/main was rendered
        // within function
        this.render('modules/students', {into: 'core/layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        inviteStudent: function (studentEmail) {
            var invitation = this.store.createRecord('invitation', {
                email: studentEmail,
                teacher: this.get('currentTeacher')
            });
            this.get('currentTeacher').get('invitations').then(function(invitations) {
                invitations.pushObject(invitation);
                invitations.save();
            });
        }
    }
});
