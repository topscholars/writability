/* globals App, Ember */
App.ApplicationEssayTemplatesItemView = App.ThinListItem.extend({
    templateName: "modules/_application_essay_templates-list-item",
});


App.ApplicationEssayTemplatesController = Ember.ArrayController.extend({

    content: function () {
        var universities = this.get('model').get('universities');
        var templates = [];
        universities.forEach(function (item, index) {
            templates.update(item.get('application_essay_templates'));
        });

    }.property('universities')
});

App.ApplicationEssayTemplatesView = App.ListView.extend({
    title: 'Application Essays',
    listItem: App.ApplicationEssayTemplatesItemView,
    newItem: null
});