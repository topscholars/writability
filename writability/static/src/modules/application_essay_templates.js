/* globals App, Ember */
App.ApplicationEssayTemplatesItemView = App.FakeListItem.extend({
    templateName: "modules/_application_essay_templates-list-item"
});


App.ApplicationEssayTemplatesController = Ember.ArrayController.extend({

});

App.ApplicationEssayTemplatesView = App.ListView.extend({
    title: 'Application Essays',
    listItem: App.ApplicationEssayTemplatesItemView,
    newItem: null

});
