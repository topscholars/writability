export default Ember.ObjectController.extend({
    students: null,
    invitations: null,
    invitedStudentEmail: null,

    pendingInvitations: function() {
        return this.get('invitations').filterBy('is_registered', false);
    }.property('invitations.@each'),

    actions: {
        inviteStudentCont: function () {
            this.send('inviteStudent', this.get('invitedStudentEmail'));
        }
    }
});
