/* globals App, Ember, $, DS */

window.App = Ember.Application.create({
    rootElement: '#application-root',

    // Basic logging, e.g. "Transitioned into 'post'"
    LOG_TRANSITIONS: true,

    // Extremely detailed logging, highlighting every internal
    // step made while transitioning into a route, including
    // `beforeModel`, `model`, and `afterModel` hooks, and
    // information about redirects and aborted transitions
    LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationController = Ember.ObjectController.extend({

    globalizeUser: function () {
        var user = this.get('model');
        Ember.set('App.CurrentUser');
    }.observes('model'),

    currentUser: function() {
        return this.get('model');
    }

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

Ember.Handlebars.helper('dotdotfifty', function(str) {
  if (str)
    if (str.length > 50)
      return str.substring(0,50) + '...';
  return str;
});
Ember.Handlebars.helper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);
 
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});
//Handlebars.registerHelper('dotdotfifty', function(str) {
//  if (str.length > 50)
//    return str.substring(0,50) + '...';
//  return str;
//});

App.DetailsView = Ember.View.extend({
    templateName: 'core/modules/details',
    
    //elementId: "details-module", 
    tagName: "section",
    classNames: ["module", "details-module"]

});

App.EditorView = Ember.View.extend({
    templateName: 'core/modules/editor'
});

/* globals App, Ember */
App.HeaderView = Ember.View.extend({
    tagName: 'header',
    elementId: 'header',
    templateName: 'core/modules/header',
    title: 'Writability'
});

App.NavHeaderView = App.HeaderView.extend({
    templateName: 'core/modules/nav_header',
    classNames: ['nav-header']
});

App.ListView = Ember.View.extend({
    templateName: 'core/modules/list',
    title: null,
    //sections: [],
    listItem: "",
    //elementId: "list-module",  // No id, could have multiple on page.
    tagName: "section",
    classNames: ["module", "list-module"]
});

App.FakeListItem = Ember.View.extend({
    classNames: ["fake-list-item"]
});

App.ListItem = Ember.View.extend({
    tagName: "li",
    classNames: ["list-item"]
});

App.ThinListItem = App.ListItem.extend({
    classNames: ["thin-list-item"]
});

App.ThinNewItem = App.ThinListItem.extend({
    classNames: ['new-item']
});

App.ThickListItem = App.ListItem.extend({
    classNames: ["thick-list-item"]
});

App.Draft = DS.Model.extend({
    // properties
    plain_text: DS.attr('string'),
    formatted_text: DS.attr('string'),
    due_date: DS.attr('string'),
    word_count: DS.attr('number'),
    is_final_draft: DS.attr('boolean'),
    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),

    // relationships
    essay: DS.belongsTo('essay'),
    review: DS.belongsTo('review')
});

/* globals App, DS */
App.Essay = DS.Model.extend({
    // properties
    audience: DS.attr('string'),
    context: DS.attr('string'),
    due_date: DS.attr('string'),
    essay_prompt: DS.attr('string'),
    num_of_drafts: DS.attr('number'),
    topic: DS.attr('string'),
    max_words: DS.attr('number'),

    // relationships
    drafts: DS.hasMany('draft'),
    essay: DS.belongsTo('essay')   // *IFFY  // changed to essay_template
});

App.ThemeEssay = App.Essay.extend({
    next_states: DS.attr('array', {readOnly: true}),
    proposed_topics: DS.attr('array'),
    state: DS.attr('string')
});

App.ApplicationEssay = App.Essay.extend({
});

/* globals App, DS */
App.EssayTemplate = DS.Model.extend({
    // properties
    essay_prompt: DS.attr('string'),
});

App.ThemeEssayTemplate = App.EssayTemplate.extend({
    audience: DS.attr('string'),
    context: DS.attr('string'),
    theme: DS.belongsTo('theme', {async: true})
});

App.ApplicationEssayTemplate = App.EssayTemplate.extend({
    max_words: DS.attr('string'),
    university: DS.belongsTo('university', {async: true}),
    themes: DS.hasMany('theme', {async: true}),
    due_date: DS.attr('string')
});
/* globals App, DS */
App.Invitation = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    is_registered: DS.attr('boolean'),
    teacher: DS.belongsTo('teacher')
});

App.Review = DS.Model.extend({
    // properties
    text: DS.attr('string'),
    is_draft_approved: DS.attr('boolean'),
    due_date: DS.attr('string'),
    review_type: DS.attr('string'),

    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),

    // relationships
    draft: DS.belongsTo('draft'),
    teacher: DS.belongsTo('teacher')
});
/* globals App, DS */
App.Role = DS.Model.extend({
    // properties
    name: DS.attr('string')
});

/* globals App, DS */
App.Theme = DS.Model.extend({
    // properties
    name: DS.attr('string'),
    category: DS.attr('string'),
    theme_essay_template: DS.belongsTo('theme_essay_template', {async: true})
    // camelCase
});
/* globals App, DS */
App.University = DS.Model.extend({
    // properties
    name: DS.attr('string'),
    // logo_url: DS.attr('string'),
    application_essay_templates: DS.hasMany('application_essay_template', {async: true})
});

/* globals App, DS */
App.User = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    roles: DS.hasMany('role', {async: true})
});

App.Teacher = App.User.extend({
    // properties
    // relationships
    students: DS.hasMany('student'),
    reviews: DS.hasMany('review')
});

App.Student = App.User.extend({
    // properties
    // relationships
    teacher: DS.belongsTo('teacher'),
    essays: DS.hasMany('themeEssay', {async: true}),  // iffy

    universities: DS.hasMany('university', {async: true}) // Use async true or ember expects data to already be there
});

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
        },
        /*
         * Clicking the Details / Review button toggles the current displayed item.
         */
        editorToggle: function () {
            alert("Hello");
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

/* globals App, Ember */
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

App.EssayItemView = App.ThickListItem.extend({
    templateName: "modules/_essays-list-item",
    click: function (ev) {
        this.get('controller').send('select');
    },
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
    listItem: App.EssayItemView
});

App.StudentView = App.DetailsView.extend({
    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
        //{key: 'archive', title: 'Archive'},
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

App.StudentOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/_student-details-overview"
});

App.StudentApplicationsTab = Ember.View.extend({
    name: "Applications",
    templateName: "modules/_student-details-overview"
});

App.StudentTabs = Ember.ContainerView.extend({
    childViews: ['overview'],
    overview: App.StudentOverviewTab.create(),
    application: App.StudentApplicationsTab.create()
});

/* globals App, Ember */
App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ArrayController.extend({
    invitedStudentEmail: null,

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

/* globals App, Ember */
App.UniversityItemView = App.ThinListItem.extend({
    templateName: "modules/_universities-list-item",
});


App.UniversityNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_universities-new-item",
});


App.UniversitiesController = Ember.ArrayController.extend({

    // set select for new item
    defaultValueOption: "3",

    universities: function () {
        return this.store.find('university');
    }.property(),

    select: function (ev) {
        var newUniversity = this.get('newUniversity');
        if (newUniversity) {
            this.send('selectedUniversity', this.get('newUniversity'));
            this.set('defaultValueOption', null);
        }
    }.observes("newUniversity"),

    convertEssays: function (student) {  //pass in?   scope = this
        console.log('convertEssays() called');
        that = this;
        var app_essay_templates;    // ManyArray, universities.all.app_essay_templates
                    // all themes from stud.univ.themes, no dupes,
            
        //var student_theme_essays = student.get('theme_ess')..
        // university.application_essay_templates
        // student.themeEssays   (student subclasses User) //was student.essays

        var app_essay_templates = that.getAllTemplatesForStudent(student);
        console.log(app_essay_templates.toString());

        app_essay_templates.forEach(function (item, index) {  
            var item_id = item.get('id');  
            var themes_id_obj_dict = [];
            // Create Theme Essays for each
            item.get('themes').then(function (themes) {         // Each app_ess_tmp hasMany themes
                // 
                themes.forEach( function (theme) {     
                    //all_themes.addObject(theme);              // Ember, adds if does not exist.                    //
                    if ( all_themes.indexOf(theme) == -1 ) {    // If themeEssay not yet created    
                        var theme_id = theme.get('id');
                        //all_themes.push(theme_id);
                        themes_id_obj_dict.push({
                            key:   item_id,
                            value: theme
                        });

                        var theme_essay = that.store.createRecord('essay', {
                            essay_template: theme_id,
                            application_essays: item_id,
                            student: student
                        });
                        theme_essay.save();
                        //App.ThemeEssay.Create({
                        //})
                        //Create theme_essay from this theme_template with state new.

                        // ThemeEssay states: ["new", "added_topics", "in_progress", "completed"]
                    }
                });
            });
            // Create App Essay
            var app_essay = that.store.createRecord('application_essay', {
                essay_template: item_id
                // theme_essays: id OR obj  // added via backref above ?
            });
            app_essay.save();
        });

        // grab theme from dict array 
        ///////======== Create application record 
        //////////-====== check everything went well

        // Why create both ThemeEssayTemplates and ThemeEssay??
        // ----- A themeEssay can include multiple TETs, or multiple TEs

        // create theme essays
        // go back to themes 
        // 1to1 beween themes and theme_essays

        
        // 2. convert app_essay_templates into app_essays and save
        ///////   app_essay_templates are on the univ, app_essays are on student
        // 3. convert app_es_tmp into theme_es_tmp
        /////// theme
        // 4. convert theme_es_tmp into theme_essays   save
        /////// each theme_essay also needs associated app_essays  . 
    },
    getAllTemplatesForStudent: function (student) {
        var essays_list = [];
        student.get('universities')
            .then(function (univs) {                 
                univs.forEach(function (item, index, enumerable) {          // For each Univ
                    console.log(univs.get('length'));
                    item.get('application_essay_templates')                 // Get app templates
                        .then( function (app_essay_templates) {             // for each template
                            console.log(app_essay_templates.get('length'));   // Returning 0..
                            app_essay_templates.forEach(function (item, index) {
                                // app_essay_templates are always unique. May 14, 2014
                                essays_list.push(item);                     // Add template/prompt
                            });
                        })
                        .catch( function (error) { 
                            console.log('Error in univs.forEach loop.'); });
                });
            });
        return essays_list;  // Should return array of whatver objects ManyArray holds
    },

    actions: {
        next: function() {
            that = this;

            this.store.find('student', 0)
                .then(function (student) {
                    //Log univ.count //student.get('universities').then(function (univs) { console.log( univs.get('length') ); });
                    student.save()
                        .then(  function () { 
                            that.convertEssays(student);
                            //that.transitionToRoute("essays") 
                        })
                        .catch( function (error) { 
                            console.log(error);
                            alert("Sorry! We've encountered an error."); });
                });
        }

        // Transition to /essays   [DONE]
        // 1. save universities    [DONE]
        // 2. convert app_essay_templates into app_essays and save
        // 3. convert ap_es_tmp into theme_es_tmp    
        // 4. convert them_es_tmp into theme_essays   save
    }
});

App.UniversitiesView = App.ListView.extend({
    title: 'Universities',
    listItem: App.UniversityItemView,
    newItem: App.UniversityNewItemView
});

/* globals App, Ember */
App.Button = Ember.View.extend({
    tagName: 'button',
    templateName: 'partials/button',
    text: 'Submit'
});

App.LeftNavButton = App.Button.extend({
    classNames: ['nav-button', 'left-nav-button'],
    text: '< Back',
    attributeBindings: ['disabled'],
    disabled: Ember.computed.alias("controller.backDisabled"),

    // IDEA: Accept URL for what back & next should be.
    // Note: classNameBindings: ['isEnabled:enabled:disabled'],  if/then/else
});

App.RightNavButton = App.Button.extend({
    classNames: ['nav-button', 'right-nav-button'],
    text: 'Next >',
    attributeBindings: ['disabled'],
    disabled: Ember.computed.alias("controller.nextDisabled"),
    click: function(evt) {
      this.get('controller').send('next');
    }

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

/* globals App, Ember */
App.Router.reopen({
    // use the history API
    location: 'history'
});

App.Router.map(function () {
    this.resource('essays', function () {
        this.resource('essay', {path: '/:id'});
    });

    this.resource('students', function () {
        this.resource('student', {path: '/:id'});
    });

    // no drafts list resource
    this.resource('draft', {path: '/drafts/:id'});

    this.resource('universities', function () {
        this.route('/');
    });
    // no university item resource
});

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('user', 0);
    }
});

App.IndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('user', 0);
    },

    redirect: function (model, transition) {
        var route = this;
        model.get('roles').then(function (roles) {
            // use first role to determine home page
            var roleName = roles.objectAt(0).get('name');

            if (roleName === 'student') {
                // students see their essays
                route.transitionTo('essays');
            } else if (roleName === 'teacher') {
                // teachers see their students
                route.transitionTo('students');
            }
        });
    }
});

// Similar to this for students
App.UniversitiesRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        controller.set('model', model); //Required boilerplate
        controller.set('backDisabled', true);
        // controller.set('nextDisabled', true); // Use same for next button in other views
    },

    model: function () {
        return this.store.find('student', 0)
            .then(function (student) {
                return student.get('universities');
        });
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('NavHeader', {outlet: 'header'}); // pass in backDisabled
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        selectedUniversity: function (university) {
            console.log('selectedUniversity() action');
            var that = this;
            this.store.find('student', 0).then(function (student) {
                var universities = student.get('universities');
                universities.pushObject(university);
             });
        }
    }
});

App.UniversitiesIndexRoute = Ember.Route.extend({
    controllerName: 'applicationEssayTemplates',

    model: function () {
        return this.store.find('student', 0)
            .then(function (student) {
                return student.get('universities');
        });
    },

    renderTemplate: function () {
        console.log('univIndexRoute UniversitiesIndexRoute');
        this.render(
            'applicationEssayTemplates',
            {outlet: 'right-side-outlet'});
    }
});

App.StudentsRoute = Ember.Route.extend({
    model: function () { //
        return this.store.find('teacher', 0).then(function (teacher) { // 0 is for current 

            console.log(teacher.get('students'));
            //concatenate invites and students

            return teacher.get('students');
        });
    },
    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'}); 
            // needs 'into' explicity because core/layouts/main was rendered in same function
    },
    actions: {
        // TODO This should create an invitation model and add to list
        inviteStudent: function (student) {
            this.store.find('teacher', 0).then(function (teacher) { 
                var students = teacher.get('students');
                students.pushObject(student); 
                // Set status to server
                students.save();  // Ember magic   s.model has a save with 
                // student.invitation.create
            });
        }
    }
});

App.EssaysRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('themeEssay');
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    }
});

App.EssayRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('themeEssay', params.id);
    },

    renderTemplate: function () {
        this.render({outlet: 'right-side-outlet'});

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
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/editor', outlet: 'editor-module'});
    }
});

Ember.TEMPLATES["core/application"] = Ember.Handlebars.compile("{{outlet header}}\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\">\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"left-side\" class=\"outlet\">\n        {{outlet left-side-outlet}}\n    </section>\n    <section id=\"right-side\" class=\"outlet\">\n        {{outlet right-side-outlet}}\n    </section>\n</div>\n\n\n<!--\n<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n\n-->");

Ember.TEMPLATES["core/modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"select\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n<div class=\"tab-content\">\n    {{view App.EssayTabs}}\n</div>\n");

Ember.TEMPLATES["core/modules/editor"] = Ember.Handlebars.compile("\n");

Ember.TEMPLATES["core/modules/header"] = Ember.Handlebars.compile("<div class=\"header-title\">{{view.title}}</div>\n");

Ember.TEMPLATES["core/modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\" class=\"scrollable\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["core/modules/nav_header"] = Ember.Handlebars.compile("<div class=\"nav-section left-nav\">{{view App.LeftNavButton text=\"< Back\"}}</div>\n<div class=\"header-title\">{{view.title}}</div>\n<div class=\"nav-section right-nav\">{{view App.RightNavButton text=\"Next >\"}}</div>\n");

Ember.TEMPLATES["modules/_application_essay_templates-list-item"] = Ember.Handlebars.compile("\n{{#each t in application_essay_templates }}\n    <strong>{{../name}}</strong>: {{dotdotfifty t.essay_prompt}}\n    <br />\n{{/each}}");

Ember.TEMPLATES["modules/_draft-details-panel"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">foo:</div> <div class=\"value\">bar</div>\n</div>\n");

Ember.TEMPLATES["modules/_essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_essays-list-item"] = Ember.Handlebars.compile("<div class=\"list-style-group\">{{id}} +7</div>\n<div class=\"main-group\">\n    <div class=\"main-line\">Theme</div>\n    <div class=\"sub-line\">Category</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">Start Topic</div>\n    <div class=\"draft-due\">Draft Due: May 3, 2014</div>\n    <div class=\"essay-due\">Essay Due: {{due_date}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_students-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{name}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_students-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{view Ember.TextField placeholder=\"Student's Email\" valueBinding=\"invitedStudentEmail\"}}\n\n        <span {{action \"inviteStudentCont\"}} class=\"inviteStudent\">+</span>\n\n        <!-- onclick=\"alert('Hit the invitation endpoint!'); return false;\"  -->\n    </div>\n</div>");

Ember.TEMPLATES["modules/_universities-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{name}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_universities-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{view Ember.Select\n        content=universities\n        selectionBinding=\"newUniversity\"\n        optionValuePath=\"content.id\"\n        valueBinding=\"defaultValueOption\"\n        optionLabelPath=\"content.name\"\n        prompt=\"Select a school\"}}\n    </div>\n</div>\n\n");

Ember.TEMPLATES["modules/draft"] = Ember.Handlebars.compile("<div class=\"editor-column summary-column\">\n    <div class=\"editor-toggles\">\n        <button {{action editorToggle}} class=\"editor-toggle\">Details</button>\n        <button {{action editorToggle}} class=\"editor-toggle\">Review</button>\n    </div>\n    <div class=\"essay-prompt strong\">{{essay.essay_prompt}}</div>\n</div>\n\n<div class=\"editor-column text-column\">\n    <div class=\"toolbar-container\">\n        <div id=\"editor-toolbar\" class=\"editor-toolbar\"></div>\n    </div>\n    {{view App.TextEditor action=\"startedWriting\" valueBinding=\"formatted_text\"}}\n</div>\n\n<div class=\"editor-column annotations-column\">\n</div>\n");

Ember.TEMPLATES["partials/button"] = Ember.Handlebars.compile("{{view.text}}");