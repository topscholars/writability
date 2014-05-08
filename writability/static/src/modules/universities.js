/* globals App, Ember */
App.UniversityItemView = App.ThinListItem.extend({
    templateName: "modules/_universities-list-item",
});


App.UniversityNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_universities-new-item"
});


App.UniversitiesController = Ember.ArrayController.extend({

    universities: function () {
        return this.store.find('university');
    }.property(),

    select: function () {
        this.send('selectedUniversity', this.get('newUniversity'));
    }.observes("newUniversity")
});

App.UniversitiesView = App.ListView.extend({
    title: 'Universities',
    listItem: App.UniversityItemView,
    newItem: App.UniversityNewItemView
});
