/* globals App, Ember */
App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ArrayController.extend({
    students: function () {
        return this.store.find('student');
    }.property(),
    select: function () {
        this.send('selectedStudent', this.get('newStudent'));
    }.observes("newStudent")
});

App.StudentsView = App.ListView.extend({
    title: 'Students',
    listItem: App.StudentItemView,
    newItem: App.StudentNewItemView
});
