/* globals App, Ember */

App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.InvitationItemView = App.ThinListItem.extend({
    templateName: "modules/_invitation-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ObjectController.extend({
    invitedStudentEmail: null,
    students: null,
    invitations: null,

    actions: {
        inviteStudentCont: function () {
            this.send('inviteStudent', this.get('invitedStudentEmail'));
        }
    }
});

App.StudentsListView = App.ListView.extend({
    title: 'Students',
    listItem: App.StudentItemView,
});

App.InvitationsListView = App.ListView.extend({
    title: 'Invitations',
    listItem: App.InvitationItemView,
    newItem: App.StudentNewItemView,
});
