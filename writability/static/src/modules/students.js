/* globals App, Ember */

App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ObjectController.extend({
    invitedStudentEmail: null,

    actions: {
        inviteStudentCont: function () {
            this.send('inviteStudent', this.get('invitedStudentEmail'));
        }
    }
});

App.StudentsListView = App.ListView.extend({
    title: 'Students',
    listItem: App.StudentItemView,
    newItem: App.StudentNewItemView,
});
