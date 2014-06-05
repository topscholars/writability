/* globals App, Ember */
App.DetailsView = Ember.View.extend({
    templateName: 'core/modules/details',

    //elementId: "details-module",
    tagName: "section",
    classNames: ["module", "details-module"],
    tabsViewClass: ""
});

App.DetailsListView = Ember.View.extend({
    tagName: 'ul',
    templateName: 'partials/_details-list'
});
