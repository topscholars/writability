/* globals App, Ember */

App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ArrayController.extend({
    invitedStudentEmail: null,

    actions: {
        inviteStudentCont: function () {
            this.send('inviteStudent', this.get('invitedStudentEmail'));
        }
    }
});

App.StudentsView = App.SectionListView.extend({
    title: 'Students',
    listItem: App.StudentItemView,
    newItem: App.StudentNewItemView,
    sections: [
        {
            title: 'Students',
            items: this.get('controller.model').get('students')
        },
        {
            title: 'Invites',
            items: this.get('controller.model').get('invites')
        }
    ]
});
