import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentTeacher');
    },

    renderTemplate: function () {
        this.render('layouts/main');
        this.render('Header', {outlet: 'header'});
        // needs into explicity because layouts/main was rendered
        // within function
        this.render('students/index', {into: 'layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        inviteStudent: function (studentEmail) {
            var teacher = this.get('currentTeacher');
            var invitation = this.store.createRecord('invitation', {
                email: studentEmail,
                teacher: this.get('currentTeacher')
            });

            teacher.get('invitations').pushObject(invitation);

            invitation.save();
        }
    }
});
