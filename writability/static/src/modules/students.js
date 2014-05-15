/* globals App, Ember */
App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ArrayController.extend({
    invitedStudentEmail: null,

    students: function () {
        return this.store.find('student');
    }.property(),
    
    actions: { 
        inviteStudentCont: function () {
            // This should create invitation model
            // Should also push the new invitation object to the /students list
            // this.send('invitedStudent', this.get('newStudent'));
        }.observes("newStudent")
    }
});

App.StudentsView = App.ListView.extend({
    title: 'Students',
    listItem: App.StudentItemView,
    newItem: App.StudentNewItemView
});
