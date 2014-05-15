/* globals App, Ember */
App.HeaderView = Ember.View.extend({
    tagName: 'header',
    elementId: 'header',
    templateName: 'core/modules/header',
    title: 'Writability'
});

App.NavHeaderView = App.HeaderView.extend({

});
