window.App = Ember.Application.create({
    rootElement: '#application-root',

    // Basic logging, e.g. "Transitioned into 'post'"
    LOG_TRANSITIONS: true,

    // Extremely detailed logging, highlighting every internal
    // step made while transitioning into a route, including
    // `beforeModel`, `model`, and `afterModel` hooks, and
    // information about redirects and aborted transitions
    // LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationView = Ember.View.extend({
    templateName: 'core/application',

    didInsertElement: function () {
        $('#splash-page').remove();
    }
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
    // Turn Model camel cased class names to dashed urls.
    pathForType: function (type) {
        var dasherized = Ember.String.dasherize(type);
        return Ember.String.pluralize(dasherized);
    },

    namespace: 'api'
});

App.ApplicationSerializer = DS.RESTSerializer.extend({
    // Turn root object snake cased into camel case for Ember.
    typeForRoot: function (root) {
        var camelized = Ember.String.camelize(root);
        return Ember.String.singularize(camelized);
    },
    // Turn camel case into snake case for JSON body.
    serializeIntoHash: function (data, type, record, options) {
        var root = Ember.String.decamelize(type.typeKey);
        data[root] = this.serialize(record, options);
    },
    // Add a readOnly attribute that blocks that attribute from updating
    // to the server.
    serializeAttribute: function(record, json, key, attribute) {
        // TODO: Don't fail silently!
        if (!attribute.options.readOnly) {
            return this._super(record, json, key, attribute);
        }
    }
});

App.ArrayTransform = DS.Transform.extend({

    serialize: function (jsonData) {
        if (jsonData instanceof Array) {
            return jsonData;
        } else {
            // TODO: Throw error.
            return false;
        }
    },

    deserialize: function (externalData) {
        if (externalData instanceof Array) {
            return externalData;
        } else {
            // TODO: Throw error.
            return false;
        }
    }
});

App.DetailsView = Ember.View.extend({
    templateName: 'core/modules/details'
});

App.EditorView = Ember.View.extend({
    templateName: 'core/modules/editor'
});

App.ListView = Ember.View.extend({
    templateName: 'core/modules/list',
    title: null,
    //sections: [],
    listItem: ""
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

App.ThemeEssay = App.Essay.extend({
    next_states: DS.attr('array', {readOnly: true}),
    proposed_topics: DS.attr('array'),
    state: DS.attr('string')
});

App.DraftController = Ember.ObjectController.extend({

    formattedTextObserver: function () {
        var draft = this.get('model');
        if (draft.get('isDirty')) {
            draft.save().then(this.onSuccess, this.onFailure);
        }
    }.observes('formatted_text'),

    onSuccess: function () {
        console.log("Saved draft to server.");
    },

    onFailure: function () {
        console.log("Failure to sync draft to server.");
    },

    actions: {
        /**
         * When the user started writing make sure the server is in sync.
         */
        startedWriting: function (cb) {
            var draft = this.get('model');
            draft.reload().then(cb, this.onFailure);
        }
    },
});

App.DraftView = App.EditorView.extend({
    templateName: 'modules/draft',
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
    templateName: "modules/_essay-details-overview"
});

App.EssayApplicationsTab = Ember.View.extend({
    name: "Applications",
    templateName: "modules/_essay-details-overview"
});

App.EssayArchiveTab = Ember.View.extend({
    name: "Archive",
    templateName: "modules/_essay-details-overview"
});

App.EssayTabs = Ember.ContainerView.extend({
    childViews: ['overview'],
    overview: App.EssayOverviewTab.create(),
    application: App.EssayApplicationsTab.create(),
    archive: App.EssayArchiveTab.create()
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

App.EssaysView = App.ListView.extend({
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: "modules/_essays-list-item"
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

App.TextEditor = Ember.TextArea.extend({

    actions: {
        sync: function () {
            console.log('wel then');
        }

    },
    classNames: ['draft-text'],
    attributeBindings: ['contenteditable'],
    contenteditable: 'true',
    editor: null,
    _suspendValueChange: false,
    _minimumChangeMilliseconds: 1000,

    didInsertElement: function () {
        this._setupInlineEditor();
    },

    _setupInlineEditor: function () {
        var id = this.get('elementId');
        var config = this._getEditorConfig();

        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline(id, config);

        CKEDITOR.on('instanceReady', function (e) {
            var editor = CKEDITOR.instances[e.editor.name];
            this.set ('editor', editor);

            editor.on('change', this._onChange, this);
            editor.on('focus', this._onFocus, this);
        }, this);
    },

    _onChange: function () {
        // use timer to make sure that change event handling is throttled
        // var timer;
        var component = this;

        //if (timer) { return; }

        // TODO: Return timer and non-instant updates. But stop caret reset
        // bug/
        //timer = setTimeout(function () {
        //    timer = 0;
            component.suspendValueChange(function() {
                component.set('value', component.get('editor').getData());
            });
        //}, view._minimumChangeMilliseconds);
    },

    /**
     * Handle focus by alerting a 'startedWriting' event and updating the text
     * editor's content if old.
     */
    _onFocus: function () {
        var component = this;
        this.sendAction('action', function () {
            var content = component.get('value');
            var editor = component.get('editor');
            if (content !== editor.getData()) {
                editor.setData(content);
            }
        });
    },

    _getEditorConfig: function () {
        return {
            removePlugins: 'magicline,scayt',
            extraPlugins: 'sharedspace',
            startupFocus: true,
            toolbar: [
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['NumberedList', 'BulletedList']
            ],
            sharedSpaces: {
                top: "editor-toolbar",
            },
            title: false, // hide hover title
        };
    },

    suspendValueChange: function(cb) {
        this._suspendValueChange = true;
        cb();
        this._suspendValueChange = false;
    },

    valueChanged: function() {
        // FIXME: don't respond to changes on value. this was creating a bug
        // where pushes to the server caused setData and a caret reset. setData
        // is asynchronous. That was probably the problem. It's only needed if
        // multiple people are editing the document at the same time.
        if (this._suspendValueChange) { return; }

        // var content = this.get("value");
        // var editor = this.get("editor");
        // editor.setData(content);
    }.observes("value"),

    willDestroyElement: function() {
        //var context = this.get('context');
        //var editor = context.get('editor');
        this.get('editor').destroy(false);
        this.get('editor').remove();
    }
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
        return this.store.find('themeEssay');
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('core/modules/header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'list-module'});
    }
});

App.EssayRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('themeEssay', params.id);
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
        this.render('core/layouts/editor');
        this.render('core/modules/header', {outlet: 'header'});
        this.render({into: 'core/layouts/editor', outlet: 'editor-module'});
    }
});

Ember.TEMPLATES["core/application"] = Ember.Handlebars.compile("<header id=\"header\">{{outlet header}}</header>\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\">\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n");

Ember.TEMPLATES["core/modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"select\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n<div class=\"tab-content\">\n    {{view App.EssayTabs}}\n</div>\n");

Ember.TEMPLATES["core/modules/editor"] = Ember.Handlebars.compile("\n");

Ember.TEMPLATES["core/modules/header"] = Ember.Handlebars.compile("<div class=\"header-title\">Writability</div>\n");

Ember.TEMPLATES["core/modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\">\n{{#each}}\n    <li {{action \"select\"}} {{bind-attr class=\":list-item isSelected\"}}>\n        {{partial view.listItem}}\n    </li>\n{{/each}}\n</ol>\n");

Ember.TEMPLATES["modules/_essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_essays-list-item"] = Ember.Handlebars.compile("<div class=\"list-style-group\">{{id}} +7</div>\n<div class=\"main-group\">\n    <div class=\"main-line\">Theme</div>\n    <div class=\"sub-line\">Category</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">Start Topic</div>\n    <div class=\"draft-due\">Draft Due: May 3, 2014</div>\n    <div class=\"essay-due\">Essay Due: {{due_date}}</div>\n</div>\n");

Ember.TEMPLATES["modules/draft"] = Ember.Handlebars.compile("<div class=\"editor-column summary-column\">\n    <div class=\"editor-toggles\">\n        <button class=\"editor-toggle\">Details</button>\n        <button class=\"editor-toggle\">Review</button>\n    </div>\n    <div class=\"essay-prompt strong\">{{essay.essay_prompt}}</div>\n</div>\n\n<div class=\"editor-column text-column\">\n    <div class=\"toolbar-container\">\n        <div id=\"editor-toolbar\" class=\"editor-toolbar\"></div>\n    </div>\n    {{view App.TextEditor action=\"startedWriting\" valueBinding=\"formatted_text\"}}\n</div>\n\n<div class=\"editor-column annotations-column\">\n</div>\n");