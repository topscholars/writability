window.App = Ember.Application.create({
    rootElement: '#application-root',
});

App.ApplicationView = Ember.View.extend({
    didInsertElement: function () {
        $('#splash-page').remove();
    }
});

// App.ApplicationAdapter = DS.FixtureAdapter.extend();
DS.RESTAdapter.reopen({
    namespace: 'api'
});

App.EssaysController = Ember.ArrayController.extend({
    itemController: 'essay.item',

    selectedEssay: null,

    actions: {
        selectEssay: function (model) {
            if (this.selectedEssay !== model) {
                this.transitionToRoute("essay", model.id);
                this.set('selectedEssay', model);
            }
        }
    }
});


App.EssayItemController = Ember.ObjectController.extend({
    isSelected: (function () {
        var selectedEssay = this.get('controllers.essays.selectedEssay');
        return selectedEssay === this.get('model');
    }).property('controllers.essays.selectedEssay'),

    needs: ['essays'],

    actions: {
        select: function () {
            var model = this.get('model');
            this.get('controllers.essays').send('selectEssay', model);
        }
    },
});

App.EssayController = Ember.ObjectController.extend({

});

App.Draft = DS.Model.extend({
    // properties
    plain_text: DS.attr('string'),
    formatted_text: DS.attr('string'),
    due_date: DS.attr('string'),
    word_count: DS.attr('number'),
    is_final_draft: DS.attr('boolean'),

    // relationships
    essay: DS.belongsTo('essay')
});

App.Essay = DS.Model.extend({
    // properties
    audience: DS.attr('string'),
    context: DS.attr('string'),
    due_date: DS.attr('string'),
    essay_prompt: DS.attr('string'),
    num_of_drafts: DS.attr('number'),
    topic: DS.attr('string'),
    word_count: DS.attr('number'),

    // relationships
    drafts: DS.hasMany('draft')
});

App.Router.reopen({
    // use the history API
    location: 'history'
});

App.Router.map(function () {
    this.resource('essays', function () {
        this.resource('essay', {path: '/:id'});
    });

    // no drafts list resource
    this.resource('draft', {path: '/drafts/:id'});
});

App.EssaysRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('essay');
    },

    renderTemplate: function () {
        this.render('layouts/main');
        this.render('modules/header', {outlet: 'header'});
        this.render({into: 'layouts/main', outlet: 'list-module'});
    }
});

App.EssayRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('essay', params.id);
    },

    renderTemplate: function () {
        this.render({outlet: 'details-module'});

        var id = this.controller.get('model').id;
        this.controllerFor('essays').findBy('id', id).send('select');
    }
});

App.DraftRoute = Ember.Route.extend({
    model: function (params) {
        var id = params.id;
        return this.store.find('draft', id);
    },

    renderTemplate: function () {
        this.render('layouts/editor');
        this.render('modules/header', {outlet: 'header'});
        this.render({into: 'layouts/editor', outlet: 'editor-module'});
    }
});

Ember.TEMPLATES["application"] = Ember.Handlebars.compile("<header id=\"header\">{{outlet header}}</header>\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\">\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n");

Ember.TEMPLATES["modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"select\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n<div class=\"tab-content\">\n    {{view App.EssayTabs}}\n</div>\n");

Ember.TEMPLATES["modules/editor"] = Ember.Handlebars.compile("some stuff here\n");

Ember.TEMPLATES["modules/header"] = Ember.Handlebars.compile("<div class=\"header-title\">Writability</div>\n");

Ember.TEMPLATES["modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\">\n{{#each}}\n    <li {{action \"select\"}} {{bind-attr class=\":list-item isSelected\"}}>\n        {{partial view.listItem}}\n    </li>\n{{/each}}\n</ol>\n");

Ember.TEMPLATES["partials/essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n");

Ember.TEMPLATES["partials/essay-list-item"] = Ember.Handlebars.compile("<div class=\"list-style-group\">{{id}} +7</div>\n<div class=\"main-group\">\n    <div class=\"main-line\">Theme</div>\n    <div class=\"sub-line\">Category</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">Start Topic</div>\n    <div class=\"draft-due\">Draft Due: May 3, 2014</div>\n    <div class=\"essay-due\">Essay Due: {{due_date}}</div>\n</div>\n");
App.ListView = Ember.View.extend({
    templateName: 'modules/list',
    title: null,
    //sections: [],
    listItem: ""
});

App.EssaysView = App.ListView.extend({
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: "partials/essay-list-item"
});

App.DetailsView = Ember.View.extend({
    templateName: 'modules/details'
});

App.EssayView = App.DetailsView.extend({
    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
        {key: 'archive', title: 'Archive'},
    ],

    didInsertElement: function () {
        Ember.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        select: function (tabKey) {
            //TODO: make this cleaner
            Ember.$('.tab-header').each(function (index, el) {
                var elID = Ember.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    Ember.$(el).addClass("is-selected");
                } else {
                    Ember.$(el).removeClass("is-selected");
                }
            });
        }
    }
});

App.EssayOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "partials/essay-details-overview"
});

App.EssayApplicationsTab = Ember.View.extend({
    name: "Applications",
    templateName: "partials/essay-details-overview"
});

App.EssayArchiveTab = Ember.View.extend({
    name: "Archive",
    templateName: "partials/essay-details-overview"
});

App.EssayTabs = Ember.ContainerView.extend({
    childViews: ['overview'],
    overview: App.EssayOverviewTab.create(),
    application: App.EssayApplicationsTab.create(),
    archive: App.EssayArchiveTab.create()
});

App.EditorView = Ember.View.extend({
    templateName: 'modules/editor'
});

App.DraftView = App.EditorView.extend();
