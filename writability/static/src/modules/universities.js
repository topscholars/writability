/* globals App, Ember */
App.UniversitiesController = Ember.ArrayController.extend({
});

App.UniversitiesView = App.ListView.extend({
    title: 'Universities',
    listItem: 'modules/_universities-list-item'
});
