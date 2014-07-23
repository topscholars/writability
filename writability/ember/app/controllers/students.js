import Ember from 'ember';

export default Ember.ObjectController.extend({
    invitedStudentEmail: null,

    pendingInvitations: Ember.computed.filterBy('invitations', 'is_registered', false),

    resetInvitedStudent: function() {
        this.set('invitedStudentEmail', '');
    },

    actions: {
        inviteStudentCont: function () {
            this.send('inviteStudent', this.get('invitedStudentEmail'));

            this.resetInvitedStudent();
        }
    }
});
