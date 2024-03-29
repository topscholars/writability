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

    // required for CurrentUserHelper to set properties
    content: {}
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
    if (str) {
        if (str.length > 50) {
            return str.substring(0,50) + '...';
        }
    }
    return str;
});

Ember.Handlebars.helper('formatDate', function(date) {
    if (date) {
        return moment(date).format("MMM Do, 'YY");//format('LL');
    }
    return date;
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
//

/**
    A replacement for #each that provides an index value (and other helpful
    values) for each iteration. Unless using `foo in bar` format, the item
    at each iteration will be accessible via the `item` variable.

    From: http://mozmonkey.com/2014/03/ember-getting-the-index-in-each-loops/
 
    Simple Example
    --------------
    ```
    {{#eachIndexed bar in foo}}
      {{index}} - {{bar}}
    {{/#eachIndexed}}
    ```

    Helpful iteration values
    ------------------------
    * index: The current iteration index (zero indexed)
    * index_1: The current iteration index (one indexed)
    * first: True if this is the first item in the list
    * last: True if this is the last item in the list
    * even: True if it's an even iteration (0, 2, 4, 6)
    * odd: True if it's an odd iteration (1, 3, 5)
*/
Ember.Handlebars.registerHelper('eachIndexed', function eachHelper(path, options) {
    var keywordName = 'item',
        fn;

    // Process arguments (either #earchIndexed bar, or #earchIndexed foo in bar)
    if (arguments.length === 4) {
          Ember.assert('If you pass more than one argument to the eachIndexed helper, it must be in the form #eachIndexed foo in bar', arguments[1] === 'in');
          Ember.assert(arguments[0] +' is a reserved word in #eachIndexed', $.inArray(arguments[0], ['index', 'index+1', 'even', 'odd']));
          keywordName = arguments[0];

          options = arguments[3];
          path = arguments[2];
          options.hash.keyword = keywordName;
          if (path === '') { path = 'this'; }
    }

    if (arguments.length === 1) {
        options = path;
        path = 'this';
    }

    // Wrap the callback function in our own that sets the index value
    fn = options.fn;
    function eachFn(){
          var keywords = arguments[1].data.keywords,
              view = arguments[1].data.view,
              index = view.contentIndex,
              list = view._parentView.get('content') || [],
              len = list.length;

          // Set indexes
          keywords['index'] = index;
          keywords['index_1'] = index + 1;
          keywords['first'] = (index === 0);
          keywords['last'] = (index + 1 === len);
          keywords['even'] = (index % 2 === 0);
          keywords['odd'] = !keywords['even'];
          arguments[1].data.keywords = keywords;

          return fn.apply(this, arguments);
    }
    options.fn = eachFn;

    // Render
    options.hash.dataSourceBinding = path;
    if (options.data.insideGroup && !options.hash.groupedRows && !options.hash.itemViewClass) {
          new Ember.Handlebars.GroupedEach(this, path, options).render();
    } else {
          return Ember.Handlebars.helpers.collection.call(this, 'Ember.Handlebars.EachView', options);
    }
});

App.Collapsable = Ember.Mixin.create({
	collapseActive: false,

	actions: {
		toggleCollapse: function() {
			this.set('collapseActive', !this.get('collapseActive'));
			console.log(this.get('collapseActive'))
		}
	}
});

App.FormSelect2Component = Ember.TextField.extend({
	type: 'hidden',
	select2Options: {},
	prompt: 'Please select...',

	didInsertElement: function () {
		this.$().attr('placeholder', this.get('prompt'));
		Ember.run.scheduleOnce('afterRender', this, 'processChildElements');
	},

	processChildElements: function () {
		this.$().select2(this.get('select2Options'));
	},

	willDestroyElement: function () {
		this.$().select2("destroy");
	}
});

App.AnnotationContainerComponent = Ember.Component.extend({
	existingAnnotationGroups: function() {
		var groups = Ember.ArrayProxy.create({content:[]});

		this.get('annotations').forEach(function (domAnnotation) {
			var top = domAnnotation.get('offset.top'),
				group = groups.findBy('top', top);

			if (group) {
				group.annotations.pushObject(domAnnotation.get('annotation'))
			} else {
				groups.pushObject({
					top: top,
					annotations: [domAnnotation.get('annotation')]
				});
			}
		});

		return groups;
	}.property('annotations.@each'),
	actions: {
		hasSavedAnnotation: function(annotation) {
			this.sendAction('hasSavedAnnotation', annotation);
		}
	}
});

App.AnnotationCreateboxComponent = Ember.Component.extend(App.Collapsable, {
	tagId: Ember.computed.alias('annotation.annotation.tagId'),

	tag: Ember.computed.alias('annotation.annotation.tag'),

	comment: Ember.computed.alias('annotation.annotation.comment'),

	offsetHasChanged: function() {
		this.setElementOffset();
	}.observes('annotation.offset'),

	didInsertElement: function() {
		this.setElementOffset();
	},

	setElementOffset: function() {
		this.$().offset({top: this.get('annotation.offset.top')});
	},

	actions: {
		saveAnnotation: function() {
			var component = this;
			this.get('annotation.annotation').save().then(function(annotation) {
				component.sendAction('hasSavedAnnotation', annotation);
			});
		}
	}
});

App.AnnotationDetailComponent = Ember.Component.extend(App.Collapsable, {

	classNames: ['annotation-detail'],

	didInsertElement: function() {
		this.$().offset({top: this.get('top')});
	},

	actions: {
		resolveAnnotation: function () {
			var annotation = this.get('annotation'),
				component = this;

			annotation.set('state', 'resolved');
			annotation.save().then(function() {
				component.sendAction('closeAnnotation');
			});
		},
		approveAnnotation: function () {
			var annotation = this.get('annotation'),
				component = this;

			annotation.set('state', 'approved');
			annotation.save().then(function() {
				component.sendAction('closeAnnotation');
			});
		},
		closeAnnotation: function () {
			this.sendAction('closeAnnotation');
		}
	}

});

App.AnnotationGroupcontainerComponent = Ember.Component.extend({

	classNames: ['annotation-group'],

	didInsertElement: function() {
		this.$().offset({top: this.get('group.top')});
	},

	actions: {
		selectAnnotation: function (annotation) {
			this.set('selectedAnnotation', annotation);
		},
		closeAnnotation: function () {
			this.set('selectedAnnotation', null);
		}
	}
});

App.AutosuggestTagComponent = App.FormSelect2Component.extend({
	formatSelection: function (tag) {
		console.log('formatSelection');
		var tag_type = tag.get('tag_type').toLowerCase();

		var
			nameEl = $('<span>').addClass('tag-result-name tag-'+tag_type).html(tag.get('name'))
			$result = $('<div>');

		$result.append(nameEl);
		return $result;
	},

	formatResult: function (tag) { //Fired on clicking into the tag input field

		console.log('formatResult');
		var tag_type = tag.get('tag_type').toLowerCase();

		var categoryEl = $('<span>').addClass('tag-result-category').html(tag.get('category')),
			nameEl = $('<span>').addClass('tag-result-name tag-'+tag_type).html(tag.get('name'))
			$result = $('<div>');

		$result.append(categoryEl);
		$result.append(nameEl);
		return $result;
	},

	prompt: 'Tag it.',

	didInsertElement: function () {
		this.setupSelect2Options();
		this.$().width('100%');
		this._super();
	},

	setupSelect2Options: function() { //Fired on hitting comment button. Loops for every tag
		console.log('setupSelect2Options');
		this.select2Options = {
			data: {
				results: this.get('data').toArray(),
				text: function(tag) {
					return tag.get('category');
				}
			},
			formatResult: this.formatResult,
			formatSelection: this.formatSelection
		}
	}
});

App.GeneralCollapseComponent = Ember.Component.extend({
	classNames: ['collapse'],
	classNameBindings: ['isActive'],

	didInsertElement: function () {
		if (!this.get('isActive')) {
			this.$().hide();
		}
	},

	toggleCollapse: function() {
		if (!this.get('isActive')) {
			this.$().slideUp();
		} else {
			this.$().slideDown();
		}
	}.observes('isActive')
})

App.IsInArrayCheckboxComponent = Ember.Component.extend({
	target: null,
	list: [],
	isInArray: function() {
		var target = this.get('target'),
			list = this.get('list');

		return (list.indexOf(target) != -1) || (list.indexOf(target.toString()) != -1);
	}.property('list.@each', 'target')
});

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

App.computed = {};

App.computed.aliasArrayObject = function (dependentKey, index) {
	return Ember.computed(dependentKey, function(key, value) {
	  if (arguments.length > 1) {
	  	var tempArray = this.get(dependentKey);
	  	tempArray[index] = value;
	    this.set(dependentKey, tempArray);
	    return value;
	  } else {
	    return this.get(dependentKey)[index];
	  }
	});
}

App.Annotation = DS.Model.extend({
	original: DS.attr(),
	comment: DS.attr(),
	state: DS.attr(),
	tag: DS.belongsTo('tag'),

	review: DS.belongsTo('review', {async: true}),

	isPositive: function() { // Required because handlebar template can't use an attr's value..
		var model = this;
		var tag_type = model.get('tag.tag_type'); 
		var result = (tag_type == "POSITIVE" ? true : false);
    return result;
  }.property('tag.tag_type'),

	isResolved: function() {
		var state = this.get('state'); 
		var result = (state == "resolved" ? true : false);
    return result;
  }.property('state'),

  isApproved: function() {
		var state = this.get('state'); 
		var result = (state == "approved" ? true : false);
    return result;
  }.property('state'),

	changeTagObserver: function() {
		var model = this;

		this.store.find('tag', this.get('tagId'))
			.then(function(tag) {
				model.set('tag', tag);
			});
	}.observes('tagId'),

	didCreate: function() {
	    var model = this;

	    this.get('review').then(function (review) {
	    	review.get('annotations').pushObject(model);
	    })
	}
});

App.DomAnnotation = Ember.Object.extend({
	offset: null,
	annotation: null
});

/* globals App, DS */
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
    essay: DS.belongsTo('themeEssay'), // TODO: need this for essay.theme
    review: DS.belongsTo('review', {async: true})
});

/* globals App, DS */
App.Essay = DS.Model.extend({
    // properties
    audience: DS.attr('string'),
    context: DS.attr('string'),
    due_date: DS.attr('date'),
    essay_prompt: DS.attr('string'),
    num_of_drafts: DS.attr('number'),
    topic: DS.attr('string'),
    max_words: DS.attr('number'),
    draft_due_date: DS.attr('date', {readOnly: true}),
    next_action: DS.attr('string', {readOnly: true}),

    // relationships
    student: DS.belongsTo('student'),
    drafts: DS.hasMany('draft', {async: true}),
    essay_template: DS.belongsTo('essayTemplate', {async: true}),
});

App.ThemeEssaySerializer = App.ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.application_essays = [];
        hash.selected_essays = [];
        hash.unselected_essays = [];
        $.each(hash.application_essay_states, function(id, value) {
            hash.application_essays.push(id);
            if (value == 'selected') {
                hash.selected_essays.push(id);
            } else if (value == 'not_selected') {
                hash.unselected_essays.push(id);
            }
        });
        hash.children_essays = hash.merged_theme_essays;

        hash.parent = hash.parent_id == 0 ? null : hash.parent_id;

        return this._super(type, hash, prop);
    },
    serializeAttribute: function(record, json, key, attributes) {
        json.parent_id = record.get('parent');
        if (record.get('parent_id') === 0) {
            record.set('parent_id', null);
        }
        this._super(record, json, key, attributes);
    }
});

App.ThemeEssay = App.Essay.extend({
    next_states: DS.attr('array', {readOnly: true}),
    proposed_topics: DS.attr('array'),
    state: DS.attr('string'),

    // relationships
    theme: DS.belongsTo('theme', {async: true}),
    application_essays: DS.hasMany('applicationEssay', {async: true}),
    selected_essays: DS.attr('array'),
    unselected_essays: DS.attr('array'),

    essay_template: DS.belongsTo('themeEssayTemplate', {async: true}),
    merged_theme_essays: DS.hasMany('themeEssay', {
        inverse: 'parent'
    }),

    parent: DS.belongsTo('themeEssay', {
        inverse: 'merged_theme_essays'
    }),

    proposed_topic_0: App.computed.aliasArrayObject('proposed_topics', 0),
    proposed_topic_1: App.computed.aliasArrayObject('proposed_topics', 1),
    is_in_progress: Ember.computed.equal('state', 'in_progress'),
    is_new_essay: Ember.computed.equal('state', 'new'),
    topicsReadyForApproval: Ember.computed.equal('state', 'added_topics'),
});

App.ApplicationEssay = App.Essay.extend({
    // properties

    // relationships
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    essay_template: DS.belongsTo('applicationEssayTemplate', {async: true})
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

/* globals App, DS */
App.Review = DS.Model.extend({
    // properties
    text: DS.attr('string'),
    is_draft_approved: DS.attr('boolean'),
    due_date: DS.attr('string'),
    review_type: DS.attr('string'),

    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),
    annotations: DS.hasMany('annotation', {async: true}),

    all_annotations_resolved: function() {
        var annotations = this._data.annotations;
        var annos = this.get('annotations');
        console.log("annotations[0].get('state'): " + annotations[0].get('state') );

        for (i=0; i < annotations.length; i++) {
            var anno_state = annotations[i].get('state');
            console.log(anno_state);
            if (anno_state == "new" ) {
                return false;
            }
        }
        return true;
        // NONE OF THE BELOW WORK. Why ?? Leave this here until we get some answers.

        // annotations[0] = an annotations ember object
        //for (anno in annotations) {
            //console.log('anno.get("state": ' + anno.get('state'));
            //console.log('anno.state": ' + anno.state);
            //console.log('anno.isResolved": ' + anno.isResolved);
            //console.log('anno.isResolved()": ' + anno.isResolved() );
        //    debugger
            //console.log(anno._data.state);
        //    if ( anno._data.state == "new") {
        //        return false;                 
        //    }
        //}

        //this.get('annotations')                   // Same problem without the .then() for async
        //  .then(function(annotations) { 
        //    for (anno in annotations) {
        //        if ( anno.get('state') == "new") {  // annos is an Ember obj of ~130 elements instead of 4
        //            return false;                   // so can't use != "resolved" .. goddamnit ember
        //        }
        //    }
        //});
        //return true;
    }.property('annotations.@each.state'),

    // relationships
    draft: DS.belongsTo('draft'),
    teacher: DS.belongsTo('teacher')
});

/* globals App, DS */
App.Role = DS.Model.extend({
    // properties
    name: DS.attr('string')
});

App.Tag = DS.Model.extend({
	category: DS.attr(),
	name: DS.attr(),
	description: DS.attr(),
  tag_type: DS.attr(),


  isPositive: function() {
    var model = this;
    var tag_type = model.get('tag_type'); 
    var result = (tag_type == "POSITIVE" ? true : false);
    return result;
  }.property('tag_type'),
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
    roles: DS.hasMany('role', {async: true, readOnly: true}),
    state: DS.attr('string'),

    // computed properties
    name: function () {
        return this.get('first_name') + ' ' + this.get('last_name');
    }.property('first_name', 'last_name'),

    isTeacher: function () {
        return this.get('roles').isAny('name', 'teacher');
    }.property('roles'),

    isStudent: function () {
        return this.get('roles').isAny('name', 'student');
    }.property('roles')
});

App.TeacherSerializer = App.ApplicationSerializer.extend({
    normalize: function(type, hash, prop) {
        hash.reviews = hash.reviews.filter(function(value) {
            return value !== null;
        });

        return this._super(type, hash, prop);
    }
});

App.Teacher = App.User.extend({
    // properties
    // relationships
    students: DS.hasMany('student', {async: true}),
    reviews: DS.hasMany('review', {async: true}),
    teacher_essays: DS.hasMany('themeEssay', {async: true}),
    invitations: DS.hasMany('invitation', {async: true}),
});

App.Student = App.User.extend({
    // properties
    //essays: function() {
    //    return this.get('themeEssays');     // Later we'll use this method to return all essays.
    //}.property('themeEssay.@each'),

    // relationships
    teacher: DS.belongsTo('teacher'),
    //essays: DS.hasMany('themeEssay', {async: true}),
    theme_essays: DS.hasMany('themeEssay', {async: true}),
    application_essays: DS.hasMany('applicationEssay', {async: true}),
    universities: DS.hasMany('university', {async: true}), // Use async true or ember expects data to already be there
    roles: DS.attr(null, {readOnly: true})
});

/* globals App, Ember */
App.ApplicationEssayTemplatesItemView = App.FakeListItem.extend({
    templateName: "modules/_application_essay_templates-list-item"
});


App.ApplicationEssayTemplatesController = Ember.ArrayController.extend({

});

App.ApplicationEssayTemplatesView = App.ListView.extend({
    classNames: ['application-essay-templates'],
    title: 'Application Essays',
    listItem: App.ApplicationEssayTemplatesItemView,
    newItem: null
});

/* globals Ember, App */

App.autosaveTimout = 5000;

App.DraftController = Ember.ObjectController.extend({

    isStudent: false,

    annotations: Ember.computed.alias('review.annotations'),

    formatted_text_buffer: '',

    domAnnotations: function() {
        var controller = this;

        if (this.get('annotations')) {
            return this.get('annotations').map(function(annotation) {
                return controller.createDomAnnotation(annotation);
            });
        }

        else {
            return [];
        }
    }.property('annotations.@each'),

    createDomAnnotation: function(annotation) {
        var annotationOffset = {top: 159, left: 0};

        return App.DomAnnotation.create({
            offset: annotationOffset,
            annotation: annotation
        });
    },

    saveDraft: function() {
        var draft = this.get('model');
        if (draft.get('isDirty')) {
            draft.save().then(this.onSuccess, this.onFailure);
        }
    },

    formattedTextObserver: function () {
        Ember.run.debounce(this, this.saveDraft, App.autosaveTimout, true);
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
    }
});


App.StudentDraftController = App.DraftController.extend({

    needs: ['essay', 'themeEssay'],

    reviewMode: false,

    currentReview: null,

    isStudent: true,

    getCurrentReview: function () {
        var essay = this.get('essay');
        var essayController = this.get('controllers.themeEssay').set('model', essay);
        essayController.currentReviewWithState('completed')
            .then(function (review) {
                this.set('currentReview', review);
            }.bind(this));
    }.observes('essay'),

    onNewDraftOpened: function () {
        var draft = this.get('model');
        if (draft.get('state') === 'new') {
            draft.set('state', 'in_progress');
            draft.save();
        }
    }.observes('model'),

    refreshAndTransitionEssay: function (draft) {
        var controller = this,
            essay = draft.get('essay');

        essay.reload().then(function () {
            controller.transitionToRoute('essay', essay);
        });
    },

    actions: {
        /**
         * Respond to next by submitting draft.
         * This requires that all annotations on that draft's review be resolved before submit
         */
        next: function () {
            var annotations_resolved = this.get('model.review.all_annotations_resolved');
            if (annotations_resolved) {
                if (confirm('Are you sure you want to submit this draft?')) {
                    var draft = this.get('model');
                    draft.set('state', 'submitted');

                    // Save draft
                    draft.save().then(
                        this.refreshAndTransitionEssay.bind(this)
                    );
                }
            } else {
                alert ('You must resolve all annotations before you can submit this draft.');
            }
        },

        back: function () {
            // make sure the draft is saved.
            var draft = this.get('model');
            draft.save().then(function (draft) {
                var essay_id = draft._data.essay.id;
                // Transition to essays page
                this.transitionToRoute('essay', essay_id);
            }.bind(this));
        }
    }
});


App.TeacherDraftController = App.DraftController.extend({

    annotationSelector: null,
    newAnnotation: null,
    // Page displays blank anno's when this is used.
    //annotations: Ember.computed.alias('review.annotations'),

    tags: function() {
        return this.store.find('tag');
    }.property(),

    formattedTextObserver: function () {
        if (this.get('formatted_text').indexOf('id="annotation-in-progress"') > -1) {
            this.send('createNewAnnotation');
        } else {
            this._super();
        }
    }.observes('formatted_text'),

    reviewMode: true,

    saveReview: function () {
        this.get('review').then(function (review) {
            review.save();
        });
    },

    _onReviewChange: function () {
        if (this.get('review.isDirty')) {
            Ember.run.debounce(this, this.saveReview, App.autosaveTimout, true);
        }
    }.observes('review.text'),

    actions: {

        next: function () {
            var draft = this.get('model');
            draft.get('review')
                .then(function (review) {
                    review.set('state', 'completed');
                    // Save draft
                    return review.save();
                })
                .then(function (savedReview) {
                    var essay_id = draft._data.essay.id;
                    // Transition to essays page
                    // TODO: convert this to essays once it's complete
                    this.transitionToRoute('students');
                }.bind(this));
        },

        back: function () {
            // make sure the review is saved.
            var draft = this.get('model');
            draft.get('review')
                .then(function (review) {
                    return review.save();
                })
                .then(function (savedReview) {
                    var essay_id = draft._data.essay.id;
                    // Transition to essays page
                    // TODO: convert this to essays once it's complete
                    this.transitionToRoute('students');
                }.bind(this));
        },

        createNewAnnotation: function () {
            var existingNewAnnotation = this.get('newAnnotation');

            if (existingNewAnnotation) {
                existingNewAnnotation.get('annotation').destroyRecord();
                existingNewAnnotation.destroy();
            }

            this.get('review').then(function (review) {
                var newAnnotationSpan = $('#annotation-in-progress');

                var annotationText = newAnnotationSpan.html(),
                    annotationOffset = newAnnotationSpan.offset(),
                    newAnnotation = this.store.createRecord('annotation', {
                        original: annotationText,
                        review: review
                    });

                var newDomAnnotation = App.DomAnnotation.create({
                    offset: annotationOffset,
                    annotation: newAnnotation
                });

                this.set('newAnnotation', newDomAnnotation);
                this.set('annotationSelector', newAnnotationSpan);
            }.bind(this));
        },

        hasSavedAnnotation: function(annotation) {
            var tag_type = annotation.get('tag.tag_type'); // 'POSITIVE' or 'NEGATIVE'

            // Update comment's span to include the annotation's DB ID
            var anno_id = 'annotation-' + annotation.id;

            var stuff = $('<div>').html(this.get('formatted_text'));
            var workingAnnotation = stuff.find('#annotation-in-progress');
            workingAnnotation.attr('id', anno_id).addClass(tag_type);
            var newFormattedText = stuff.html();

            this.set('formatted_text', newFormattedText);
            this.set('formatted_text_buffer', newFormattedText);
            Ember.run.debounce(this, this.saveDraft, App.autosaveTimout, true);

            this.set('newAnnotation', null);
        }
    }
});


App.DraftView = App.EditorView.extend({
    templateName: 'modules/draft',

    toggleSelector: '.panel-toggle',

    actions: {
        /*
         * Clicking the Details / Review button toggles the current displayed
         * item.
         */
        togglePanel: function (panelKey) {
            var summaryPanel = this.get('summaryPanel');
            var activePanel = summaryPanel.get('activePanel');

            if (panelKey === activePanel) {
                Ember.$('.' + panelKey + this.toggleSelector).removeClass('active');
                summaryPanel.hide();
            } else {
                if (activePanel) {
                    Ember.$('.' + activePanel + this.toggleSelector).removeClass('active');
                    summaryPanel.hide();
                }
                Ember.$('.' + panelKey + this.toggleSelector).addClass('active');
                summaryPanel.show(panelKey);
            }
        }
    }
});

App.SummaryPanel = Ember.ContainerView.extend({
    classNames: ['summary-panel'],

    activePanel: null,

    init: function () {
        this.set('details', Ember.View.create({
            templateName: "modules/_draft-details-panel"
        }));
        this.set('review', Ember.View.create({
            templateName: "modules/_draft-review-panel"
        }));
        this.set('childViews', []);
        this._super();
    },

    show: function (panelKey) {
        this.activePanel = panelKey;
        this.pushObject(this.get(panelKey));
        this.$().parent().css('visibility', 'visible');
    },

    hide: function () {
        this.activePanel = null;
        this.$().parent().css('visibility', 'hidden');
        this.popObject();
    }
});

/* globals App, Ember */
App.EssayOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/_essay-details-overview"
});

App.EssayApplicationsTab = App.DetailsListView.extend({
    name: "Applications",
    summaryText: "Click on an application question to exclusively associate it with this essay. Each question must be associated with a single essay.",
    listItemController: "modules/student/essays/show/_app-item"
});

App.ProposedTopicOne = Ember.View.extend({
    tagName: 'textarea',
    classNames: ['value', 'student-text'],
});

App.EssayTabs = Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', App.EssayOverviewTab.create());
        this.set('application', App.EssayApplicationsTab.create());
        this.set('childViews', ['overview']);
        this._super();
    },

    showTab: function (tabKey) {
        this.popObject();
        this.pushObject(this.get(tabKey));
    }
});

App.EssayController = Ember.ObjectController.extend({
    needs: ['essays'],

    proposedTopicsRules: {
        'proposed_topic_0': 'required',
        'proposed_topic_1': 'required'
    },

    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    currentReviewWithState: function (state) {
        return this.get('drafts')
            .then(function (drafts) {
                var reviewPromises = [];
                drafts.forEach(function (item, index) {
                    var reviewPromise = item.get('review');
                    if (reviewPromise) {
                        reviewPromises.push(reviewPromise);
                    }
                });
                return Ember.RSVP.all(reviewPromises);
            })
            .then(function (reviews) {
                var reviewsWithGoodState = reviews.filterBy('state', state);
                var numOfGoodReviews = reviewsWithGoodState.length;
                if (numOfGoodReviews > 0) {
                    return reviewsWithGoodState[numOfGoodReviews - 1];
                } else {
                    return null;
                }
            });
    },

    draftByMostCurrent: function (version) {
        var drafts = this.get('drafts');
        if (!drafts) {
            return null;
        }

        if (version >= drafts.length) {
            return null;
        }

        return drafts[drafts.length - 1 - version];
    },

    /**
     * Helper method to cause observer to fire only once.
     */
    //_proposed_topics_merged: function () {
    //    return this.get('proposed_topic_0') + this.get('proposed_topic_1');
    //}.property('proposed_topic_0', 'proposed_topic_1'),

    //proposedTopicsChanged: function () {
    //    var newProposedTopics = [
    //        this.get('proposed_topic_0'),
    //        this.get('proposed_topic_1')
    //    ];
    //    this.get('model').set('proposed_topics', newProposedTopics);
    //}.observes('_proposed_topics_merged'),

    // proposedTopicOneChanged: function () {
    //     console.log('proposedTopicOneChanged()');
    //     var pt2 = this.get('model').get('proposed_topics')[1];
    //     var newProposedTopics = [  this.get('proposed_topic_0'),
    //                                pt2                            ]
    //     this.get('model').set('proposed_topics', newProposedTopics);
    // //}.observes('proposed_topics'),
    // }.observes('proposed_topic_0'),

    // proposedTopicTwoChanged: function () {
    //     console.log('proposedTopicTwoChanged()');
    //     var pt1 = this.get('model').get('proposed_topics')[0];
    //     var newProposedTopics = [  pt1,
    //                                this.get('proposed_topic_1')  ]
    //     this.get('model').set('proposed_topics', newProposedTopics);
    // }.observes('proposed_topic_1'),

    getMostRecentDraft: function () {
        return this.get('model.drafts').then(function (drafts) {
            return drafts.get('lastObject');
        });
    },

    submitTopic: function(model) {
        model.set('state', 'added_topics');
        model.save().then(
            function() {
                console.log('saved');
            },
            function() {
                console.log('error');
            });
    },

    actions: {
        openDraft: function () {
            var that = this;
            this.getMostRecentDraft().then(function (draft) {
                draft.set('state', 'in_progress');
                draft.save().then(function() {
                    that.transitionToRoute('draft', draft);
                });
            });
        },
        submitProposedTopics: function(model) {
            var input = {
                proposed_topic_0: model.get('proposed_topic_0'),
                proposed_topic_1: model.get('proposed_topic_1')
            };
            var validator = new Validator(input, this.proposedTopicsRules);
            if (validator.fails()) {
                alert('You must supply two proposed topics');
            } else {
                if (confirm('Are you sure you want to submit these topics?')) {
                    this.submitTopic(model);
                }
            }
        }
    }
});

App.EssayView = App.DetailsView.extend({

    tabsViewClass: App.EssayTabs,

    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
    ],

    didInsertElement: function () {
        Ember.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        selectTab: function (tabKey) {
            //TODO: make this cleaner
            Ember.$('.tab-header').each(function (index, el) {
                var elID = Ember.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    Ember.$(el).addClass("is-selected");
                } else {
                    Ember.$(el).removeClass("is-selected");
                }
            });
            this.get('tabsView').showTab(tabKey);
        }
    }
});


App.ThemeEssayController = App.EssayController.extend({});

App.ModulesEssayAppItemController = Ember.ObjectController.extend({
    essayController: 'controllers.essay',
    needs: ['essay'],
    selected: function() {
        var selectedEssay = this.get('controllers.essay.selected_essays');

        return selectedEssay.indexOf(this.get('model.id')) != -1;
    }.property('controllers.essay.selected_essays', 'model'),

    actions: {
        select: function() {
            this.send('selectApplicationEssay', this.get('model'));
        }
    }
});

App.EssayItemView = App.ThickListItem.extend({
    templateName: "modules/_essays-list-item",

    didInsertElement: function() {
        this.isSelectedHasChanged();
    },
    isSelectedHasChanged: function() {
        if (this.get('controller.selectedEssay.id') == this.get('context.id')) {
            this.$().addClass('is-selected');
        } else {
            this.$().removeClass('is-selected');
        }
    }.observes('controller.selectedEssay'),

    click: function (ev) {
        this.get('controller').send('selectEssay', this.get('context'));
    }
});

App.EssaysController = Ember.ArrayController.extend({
    // Ember won't accept an array for sorting by state..
    sortProperties: ['next_action'],
    sortAscending: false,
    selectedEssay: null,

    unmergedEssays: Ember.computed.filter('model', function(essay) {
        return (!essay.get('parent'));
    }),
    actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') != 'completed');
    }),

    actions: {
        selectEssay: function (model) {
            if (this.selectedEssay !== model) {
                this.set('selectedEssay', model);
                this.transitionToRoute("essay", model.id);
            }
        }
    }
});

App.EssaysListView = Ember.View.extend({
    templateName: 'modules/essays/list',
    // templateName: 'modules/student/essays/list',
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: App.EssayItemView
});

App.EssaysView = App.ListView.extend({
    templateName: 'modules/essays/layout'
});

/* globals App, Ember */

App.StudentOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/_student-details-overview"
});

App.StudentTabs = Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', App.StudentOverviewTab.create());
        this.set('childViews', ['overview']);
        this._super();
    },

    showTab: function (tabKey) {
        this.popObject();
        this.pushObject(this.get(tabKey));
    }
});

App.StudentView = App.DetailsView.extend({
    selectedTab: 'overview',
    tabsViewClass: App.StudentTabs,

    tabs: [
        {key: 'overview', title: 'Overview'},
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

App.StudentEssaysController = Ember.ArrayController.extend({
    needs: ['student'],
    sortProperties: ['next_action'],
    sortAscending: false,

    showMergedEssays: false,
    selectedEssay: null,

    student: Ember.computed.alias('controllers.student.model'),
    mergedEssays: function () {
        return this.get('model').filter(function(essay) {
            return (essay.get('parent'));
        })
    }.property('@each.parent'),
    unmergedEssays: function () {
        return this.get('model').filter(function(essay) {
            return (!essay.get('parent'));
        })
    }.property('@each.parent'),
    actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') != 'completed');
    }),
    actions: {
        selectEssay: function(model, noTransition) {
            this.set('selectedEssay', model);
            if (!noTransition) {
                this.transitionToRoute('student.essays.show', model);
            }
        },
        toggleMergedEssays: function() {
            this.set('showMergedEssays', !this.get('showMergedEssays'));
        }
    }
});

App.StudentEssaysHeaderView = Ember.View.extend({
    templateName: 'modules/student/essay'
});

App.StudentEssayItemView = App.ThickListItem.extend({
    templateName: "modules/_essays-list-item",

    didInsertElement: function() {
        this.isSelectedHasChanged();
    },
    isSelectedHasChanged: function() {
        if (this.get('controller.selectedEssay.id') == this.get('context.id')) {
            this.$().addClass('is-selected');
        } else {
            this.$().removeClass('is-selected');
        }
    }.observes('controller.selectedEssay'),

    click: function (ev) {
        this.get('controller').send('selectEssay', this.get('context'));
    }
});

App.StudentEssaysListView = Ember.View.extend({
    templateName: 'modules/student/essays/list',
    title: null,
    //sections: [],
    listItem: "",
    //elementId: "list-module",  // No id, could have multiple on page.
    tagName: "section",
    listItem: App.StudentEssayItemView
});

App.StudentEssaysView = App.ListView.extend({
    templateName: 'modules/student/essay-layout',
    //sections: ['To do', 'Not to do'],
});

App.StudentEssaysShowController = Ember.ObjectController.extend({
    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    recentDraft: Ember.computed.alias('model.drafts.lastObject'),
    draft_ready_for_review: Ember.computed.equal('recentDraft.state', 'submitted'),

    approveAndSelectTopic: function(model, approvedTopicField) {
        model.set('state', 'in_progress');
        model.set('topic', model.get(approvedTopicField));
        model.save();
    },
    actions: {
        approveProposedTopic: function(model, approvedTopicField) {
            if (confirm('Are you sure you want to approve these topics?')) {
                this.approveAndSelectTopic(model, approvedTopicField);
            }
        },
        update: function(model) {
            if (confirm('Are you sure you want to save these topics?')) {
                model.save();
            }
        },
        mergeEssay: function(model) {
            this.transitionToRoute('student.essays.show.merge');
        },
        splitEssay: function(model) {
            var oldParent = model.get('parent');
            model.set('parent', null);

            model.save().then(function() {
                oldParent.reload();
            });
        },
        reviewDraft: function() {
            var draft = this.get('recentDraft');
            this.transitionToRoute('draft', draft);
        },
        selectApplicationEssay: function(applicationEssay) {
            var newSelectedEssays = this.get('model.selected_essays').concat([applicationEssay.id]);
            this.set('model.selected_essays', newSelectedEssays);

            var selectApplicationEssayUrl = '/api/theme-essays/' + this.get('model.id') + '/select-application-essay/' + applicationEssay.id;
            var data = {};
            data[applicationEssay.id] = 'selected';

            var selectApplicationEssayPromise = new Ember.RSVP.Promise(function(resolve) {
                Ember.$.ajax({
                    url: selectApplicationEssayUrl,
                    method: 'PUT',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(data)
                }).then(function(data) { console.log(data); resolve(); });
            });
        }
    }
});

App.StudentEssaysShowOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/student/essays/show/_overview"
});

App.StudentEssaysShowApplicationsTab = App.DetailsListView.extend({
    templateName: 'modules/student/essays/show/_details-list',
    name: "Applications",
    summaryText: "Click on an application question to exclusively associate it with this essay. Each question must be associated with a single essay.",
    listItemController: "modules/student/essays/show/_app-item"
});

App.StudentEssaysShowTabs = Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', App.StudentEssaysShowOverviewTab.create());
        this.set('application', App.StudentEssaysShowApplicationsTab.create());
        this.set('childViews', ['overview']);
        this._super();
    },

    showTab: function (tabKey) {
        this.popObject();
        this.pushObject(this.get(tabKey));
    }
});

App.StudentEssaysShowView = App.DetailsView.extend({

    tabsViewClass: App.StudentEssaysShowTabs,

    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
    ],

    didInsertElement: function () {
        Ember.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        selectTab: function (tabKey) {
            //TODO: make this cleaner
            Ember.$('.tab-header').each(function (index, el) {
                var elID = Ember.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    Ember.$(el).addClass("is-selected");
                } else {
                    Ember.$(el).removeClass("is-selected");
                }
            });
            this.get('tabsView').showTab(tabKey);
        }
    }
});

App.ModulesStudentEssaysShowAppItemController = Ember.ObjectController.extend({
    essayController: 'controllers.studentEssaysShow',
    needs: ['studentEssaysShow'],
    selected: function() {
        var selectedEssays = this.get('controllers.studentEssaysShow.selected_essays');

        if (selectedEssays) {
            return selectedEssays.indexOf(this.get('model.id')) != -1;
        }
    }.property('controllers.studentEssaysShow.selected_essays', 'model'),

    actions: {
        select: function() {
            this.send('selectApplicationEssay', this.get('model'));
        }
    }
});

App.StudentEssaysShowMergeView = Ember.View.extend({
	templateName: 'modules/student/essays/show/merge'
});

App.StudentEssaysShowMergeController = Ember.Controller.extend({
	mergeEssays: function() {
		var parentEssay = this.get('parentEssay');

		return this.get('essays').filter(function(essay) {
			return essay.id != parentEssay.id;
		});
	}.property('parentEssay', 'essays'),

	reloadMergedEssays: function() {
		var childrenEssay = this.get('parentEssay.merged_theme_essays');
		childrenEssay.forEach(function(essay) {
			essay.reload();
		});
	},

	transitionBack: function() {
		this.transitionToRoute('student.essays.show');
		this.send('closeModal');
	},

	actions: {
		closeModal: function() {
			this.get('parentEssay').reload().then(function() {
				this.transitionToRoute('student.essays.show');
			});

			return true;
		},
		toggleMergeSelected: function(essay) {
			var mergedEssays = this.get('parentEssay.merged_theme_essays');
			var indexOf = mergedEssays.indexOf(essay);

			if (indexOf === -1) {
				mergedEssays.pushObject(essay);
			} else {
				mergedEssays.removeObject(essay);
			}
		},
		mergeEssays: function() {
			var parentEssay = this.get('parentEssay'),
				controller = this;
			this.get('parentEssay').save().then(function() {
				controller.reloadMergedEssays();
				controller.transitionBack();
			});
		}
	}
})

/* globals App, Ember */

App.StudentItemView = App.ThinListItem.extend({
    templateName: "modules/_students-list-item",
});

App.InvitationItemView = App.ThinListItem.extend({
    templateName: "modules/_invitation-list-item",
});

App.StudentNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_students-new-item"
});

App.StudentsController = Ember.ObjectController.extend({
    students: null,
    invitations: null,
    invitedStudentEmail: null,

    pendingInvitations: function() {
        return this.get('invitations').filterBy('is_registered', false);
    }.property('invitations.@each'),

    actions: {
        inviteStudentCont: function () {
            this.send('inviteStudent', this.get('invitedStudentEmail'));
        }
    }
});

App.StudentsListView = App.ListView.extend({
    title: 'Students',
    listItem: App.StudentItemView,
    classNames: ["module", "list-module", 'auto-height']
});

App.InvitationsListView = App.ListView.extend({
    title: 'Invitations',
    listItem: App.InvitationItemView,
    newItem: App.StudentNewItemView,
    classNames: ["module", "list-module", 'auto-height'],
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

    universities: function () {                     // This populates all universities
        return this.store.find('university');
    }.property(),

    universityHasBeenSelected: function () {
        this.set('defaultValueOption', null);
    },

    select: function (ev) {
        var newUniversity = this.get('newUniversity');
        if (newUniversity) {
            this.send('selectedUniversity', this.get('newUniversity'), this);
        }
    }.observes("newUniversity"),

    attachEssays: function() {
        var student = this.get('student');
        var universitiesPromise = student.get('universities');
        var urlForStudent = '/api/students/' + student.id + '/add-universities';

        return essaysAttachPromise = new Promise(function(resolve) {
            universitiesPromise.then(function(universities) {
                Ember.$.ajax({
                    url: urlForStudent,
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        student_id: student.id,
                        universities: universities.getEach('id')
                    })
                }).then(function() { resolve() });
            });
        });
    },

    actions: {
        next: function() {
            var controller = this;
            var student = this.get('student');

            this.attachEssays().then(function() {
                student.set('state', 'active');
                return student.save();
            }).then(function() {
                controller.transitionToRoute('essays');
            });
        }
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

App.NavButton = App.Button.extend({
    classNames: ['nav-button'],
    attributeBindings: ['disabled'],
});

App.LeftNavButton = App.NavButton.extend({
    classNames: ['left-nav-button'],
    text: function () {
        var buttonText = this.get('controller.backText') || 'Back';
        return '< ' + buttonText;
    }.property(),
    disabled: Ember.computed.alias('controller.backDisabled'),
    click: function (evt) {
        this.get('controller').send('back');
    }
    // IDEA: Accept URL for what back & next should be.
    // Note: classNameBindings: ['isEnabled:enabled:disabled'],  if/then/else
});

App.RightNavButton = App.NavButton.extend({
    classNames: ['right-nav-button'],
    text: function () {
        var buttonText = this.get('controller.nextText') || 'Next';
        return buttonText + ' >';
    }.property(),
    disabled: Ember.computed.alias('controller.nextDisabled'),
    click: function (evt) {
        this.get('controller').send('next');
    }

});


App.TagBox = Ember.View.extend({
    templateName: 'partials/tags',
    didInsertElement: initializeTagBox
});

$.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
        this._super();
        this.widget().menu( "option", "items",
                            "> :not(.ui-autocomplete-category)" );
    },
    _renderItem: function( ul, item ) {
        var type = item.tag_type.toLowerCase();
        return $( "<li>" )
            .append( $( "<a class=\"tag-" + type + "\">" ).text(item.label))
            .appendTo( ul );
    },
    _renderMenu: function( ul, items ) {
        var that = this;
        var currentCategory = "";
        $.each( items, function( index, item ) {
            if ( item.category != currentCategory ) {
                ul.append( "<li class='ui-autocomplete-category'>"
                           + item.category + " :</li>" );
                currentCategory = item.category;
            }
            var li = that._renderItemData( ul, item );
            if ( item.category ) {
                li.attr( "aria-label", item.category + " : " + item.label );
            }
        });
    }
});

function initializeTagBox() {
    var data = [
        { label: "anders", category: "Random", tag_type: "POSITIVE"},
        { label: "andreas", category: "Random", tag_type: "NEGATIVE"},
        { label: "antal", category: "Random", tag_type: "POSITIVE" },
        { label: "annhhx10", category: "Products", tag_type: "NEGATIVE" },
        { label: "annk K12", category: "Products", tag_type: "NEUTRAL" },
        { label: "annttop C13", category: "Products", tag_type: "NEGATIVE" },
        { label: "anders andersson", category: "People", tag_type: "POSITIVE" },
        { label: "andreas andersson", category: "People", tag_type: "NEGATIVE" },
        { label: "andreas johnson", category: "People", tag_type: "POSITIVE" }
    ];

    var filter = function(request, response) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( $.grep( data, function(value) {
            return matcher.test( value.category + ' ' + value.label );
        } ) );
    }

    var catcomplete = $( "#tag-search" ).catcomplete({
        delay: 0,
        appendTo: '#tag-menu',
        source: filter,
        select: function(event, ui) {
            alert( ui.item.label );
        },
        position: { my: 'left top', at: 'left top', of: '#tag-menu' }
    });
}

/* globals App, Ember, CKEDITOR */
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
    isReadOnly: false,  // This is obsolete if we use reviewMode
    reviewMode: false,
    _suspendValueChange: false,
    _minimumChangeMilliseconds: 1000,
    valueBuffer: null,

    didInsertElement: function () {
        this._setupInlineEditor();
        console.log(this.get('valueBuffer'));
    },

    _setupInlineEditor: function () {
        var context = {
            controller: this
        };

        var id = this.get('elementId');

        var config = this._getEditorConfig();   // This function returns config options
                                                // It thus isn't using config file...
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline(id, config);

        CKEDITOR.once('instanceReady', function (e) {
            var editor = CKEDITOR.instances[e.editor.name];
            console.log(editor.filter.allowedContent);
            this.set ('editor', editor);

            editor.setReadOnly(this.get('isReadOnly'));

            editor.on('change', this._onChange, this);
            editor.on('focus', this._onFocus, this);

            // Prevents all typing, deleting, pasting in editor. (blocks keypresses)
            // TODO this should include a serverside block for non-plugin insertions as well.
            if ( this.get('reviewMode') ) {
                $('#'+id).next().attr('onkeydown', 'return false;'); //This grabs the textarea, then nexts onto inline editor

                //$('#'+id).next().bind('keypress', function(e) {
                //  //if (e.which == '13') { //enter pressed
                //     return false;
                //});
            }
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

    _getEditorConfig: function () {     // This replace CKEditor config files
        config = {
            removePlugins: 'magicline,scayt',
            extraPlugins: 'sharedspace,comment',
            startupFocus: true,
            enterMode: CKEDITOR.ENTER_BR,
            toolbar: [
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['NumberedList', 'BulletedList']
                //['Comment']
            ],
            // {styles e.g. text-align}(class)(!requiredclass) [attr e.g. href]
            allowedContent: 'em strong u ol li ul; span[name,*](*){*}', // 'span[!data-commentID,name](*){*}', //Requires data-commentID, any class/style allowed
            sharedSpaces: {
                top: "editor-toolbar",
            },
            title: false, // hide hover title
        };

        // Remove toolbar option for Review Mode
        reviewMode = this.get('reviewMode');
        if (reviewMode) {
            config.toolbar = [ ['Comment'], [] ];
            config.keystrokes = [ [ 13 /*Enter*/, 'doNothing'] ];    //This uses blank plugin.
            //config.blockedKeystrokes = [13, CKEDITOR.SHIFT + 13];  // Doesn't work
        }

        return config;
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
        // make sure the editor doesn't have any bound events before it's
        // destroyed.
        var editor = this.get('editor');
        editor.removeAllListeners();
        editor.destroy(false);
    },

    valueBufferPush: function() {
        var editor = this.get('editor'),
            newFormattedText = this.get('valueBuffer');

        editor.setData(newFormattedText);
    }.observes('valueBuffer')
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
        this.resource('student', {path: '/:id'}, function() {
            this.resource("student.essays", { path: "/essays" }, function() {
                this.resource("student.essays.show", { path: "/:theme_essay_id" }, function() {
                    this.route('merge', { path: "/merge" });
                });
            });
        });
    });

    // no drafts list resource
    this.resource('draft', {path: '/drafts/:id'});

    this.resource('universities', function () {
    });
    // no university item resource

    this.resource('error', function () {
        this.route('unauthorized');
    });

    this.route('select2-test');

});

App.Select2TestRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('tag');
    },
    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('NavHeader', {outlet: 'header'});
        this.render('test/select', {into: 'core/layouts/main', outlet: 'left-side-outlet'});
    }
});

App.LoadingRoute = Ember.Route.extend({
    renderTemplate: function() {
        this.send('openLoading');
    },
    deactivate: function() {
        this.send('closeLoading');
    }
});

/**
 * AuthenticatedRoute has access to a current user object.
 * FROM: http://quickleft.com/blog/a-currentuser-helper-for-ember-routes
 */
App.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function() {
        if (!this.get('currentUser')) {
            return Ember.RSVP.Promise.all([
                this.store.find('user', 0),
                this.store.find('teacher', 0),
                this.store.find('student', 0)
            ]).then(function (values) {
                var user = values[0];
                var teacher = values[1];
                var student = values[2];

                return user.get('roles').then(function (roles) {
                    if (!user.get('isTeacher')) {
                        teacher = null;
                    }

                    if (!user.get('isStudent')) {
                        student = null;
                    }

                    this.controllerFor('application').set(
                        'currentUser',
                        user);
                    this.controllerFor('application').set(
                        'currentTeacher',
                        teacher);
                    this.controllerFor('application').set(
                        'currentStudent',
                        student);
                }.bind(this));
            }.bind(this));
        }
    },

    currentUser: function() {
        return this.controllerFor('application').get('currentUser');
    }.property(),

    currentStudent: function() {
        return this.controllerFor('application').get('currentStudent');
    }.property(),

    currentTeacher: function() {
        return this.controllerFor('application').get('currentTeacher');
    }.property()
});


App.ErrorUnauthorizedRoute = Ember.Route.extend({
    renderTemplate: function () {
        // TODO: Build 404 Error Template
        console.log('render error template');
    }
});


App.ApplicationRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentUser');
    },

    actions: {
        closeModal: function() {
            this.controllerFor('application').set('modalActive', false);
        },
        openModal: function() {
            this.controllerFor('application').set('modalActive', true);
        },
        openLoading: function() {
            this.controllerFor('application').set('loadingActive', true);
        },
        closeLoading: function() {
            this.controllerFor('application').set('loadingActive', false);
        },
    }
});


App.IndexRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentUser');
    },

    redirect: function (model, transition) {
        if (model.get('isStudent')) {
            this.transitionTo('essays');
        } else {
            this.transitionTo('students');
        }
    }
});

// Similar to this for students
App.UniversitiesRoute = App.AuthenticatedRoute.extend({

    model: function () {
        return this.get('currentStudent').get('universities');
    },

    setupController: function(controller, model) {
        controller.set('student', this.get('currentStudent'));
        controller.set('backDisabled', true);
        this._super(controller, model); //Required boilerplate
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('NavHeader', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        selectedUniversity: function (university, controller) {
            var student = this.get('currentStudent');
            var universitiesPromise = student.get('universities');

            universitiesPromise.then(function(universities) {
                universities.pushObject(university);
                student.save().then(function () {
                    controller.universityHasBeenSelected();
                });
            });
        }
    }
});

App.UniversitiesIndexRoute = App.AuthenticatedRoute.extend({
    controllerName: 'applicationEssayTemplates',

    model: function () {
        return this.get('currentStudent').get('universities');
    },

    renderTemplate: function () {
        this.render(
            'applicationEssayTemplates',
            {outlet: 'right-side-outlet'});
    }
});

App.StudentsRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return Ember.RSVP.Promise.all([
            this.get('currentTeacher').get('students'),
            this.get('currentTeacher').get('invitations')
        ]).then(function(values) {
            return {students: values[0], invitations: values[1]};
        });
    },

    setupController: function (controller, model) {
        controller.set('students', model.students);
        controller.set('invitations', model.invitations);
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        // needs into explicity because core/layouts/main was rendered
        // within function
        this.render('modules/students', {into: 'core/layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        inviteStudent: function (studentEmail) {
            var invitation = this.store.createRecord('invitation', {
                email: studentEmail,
                teacher: this.get('currentTeacher')
            });
            this.get('currentTeacher').get('invitations').then(function(invitations) {
                invitations.pushObject(invitation);
                invitations.save();
            });
        }
    }
});

App.StudentRoute = App.AuthenticatedRoute.extend({
    model: function (params) {
        return this.get('currentTeacher.students').then(function(students) {
            return students.findBy('id', params.id);
        });
    },

    renderTemplate: function() {
        this.render({outlet: 'right-side-outlet'});
    },
});

App.EssaysRoute = App.AuthenticatedRoute.extend({
    beforeModel: function() {
        if (this.get('currentUser').get('isStudent') && this.get('currentStudent').get('state') !== 'active') {
                this.transitionTo('universities');

        }
    },
    model: function () {
        if (this.get('currentUser').get('isStudent')) {
            return this.get('currentStudent').get('theme_essays');
        } else {
            console.log('in teacher side of essaysroute');
            return this.get('currentTeacher').get('students').get('theme_essays');
        }
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    }
});

/*  Here we use StudentEssay(s) to match student.essay(s) route */
App.StudentEssaysRoute = App.AuthenticatedRoute.extend({
    model: function () {
        var student = this.modelFor('student');

        return student.get('theme_essays');
    },

    renderTemplate: function () {
        // this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
        this.render('core/select-prompt', {into: 'core/layouts/main', outlet: 'right-side-outlet'});
    }
});

App.StudentEssaysShowRoute = App.AuthenticatedRoute.extend({
    renderTemplate: function () {
        this.controllerFor('student.essays').send('selectEssay', this.currentModel, true);
        this.render({outlet: 'right-side-outlet'});
    }
});

App.StudentEssaysShowMergeRoute = App.AuthenticatedRoute.extend({
    setupController: function(controller, model) {
        controller.set('parentEssay', this.modelFor('student.essays.show'));
        controller.set('essays', this.modelFor('student.essays'));
    },
    renderTemplate: function() {
        this.render({into: 'application', outlet: 'modal-module'});
        this.send('openModal');
    }
});

App.EssayRoute = App.AuthenticatedRoute.extend({
    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('themeEssay', params.id);
    },

    renderTemplate: function () {
        this.controllerFor('essays').send('selectEssay', this.currentModel);
        this.render({outlet: 'right-side-outlet'});
    },

    _assert_authorized: function (id) {
        var route = this;
        this.get('currentStudent').get('theme_essays').then(function (theme_essays) {
            if (!theme_essays.isAny('id', id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    }
});

App.DraftRoute = App.AuthenticatedRoute.extend({
    activate: function () {
        this._super();
        if (this.get('currentUser').get('isStudent')) {
            this.controllerName = 'studentDraft';
        } else {
            this.controllerName = 'teacherDraft';
        }
    },

    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('draft', params.id);
    },

    setupController: function(controller, model) {
        controller.set('model', model); //Required boilerplate
        // controller.set('backDisabled', true);
        // controller.set('nextDisabled', true); // Use same for next button in other views
        if (this.get('currentUser.isStudent')) {
            controller.set('nextText', 'Send to Teacher');
        } else {
            controller.set('nextText', 'Submit Review');
        }
    },

    renderTemplate: function () {
        this.render('core/layouts/editor');
        this.render('NavHeader', {outlet: 'header'});
        this.render({
            controller: this.controllerName,
            into: 'core/layouts/editor',
            outlet: 'editor-module'
        });
    },

    _assert_authorized: function (id) {
        if (this.get('currentUser').get('isStudent')) {
            this._assert_students_draft(id);
        } else {
            this._assert_teachers_review(id);
        }
    },

    _assert_students_draft: function (id) {
        var route = this;
        Ember.RSVP.Promise.all([
            route.get('currentStudent').get('theme_essays'),
            route.store.find('draft', id)
        ]).then(function (values) {
            var theme_essays = values[0];
            var draft = values[1];
            var essay_id = draft._data.essay.id;

            if (!theme_essays.isAny('id', essay_id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    },

    _assert_teachers_review: function (id) {
        var route = this;
        Ember.RSVP.Promise.all([
            route.get('currentTeacher.reviews'),
            route.store.find('draft', id)
        ]).then(function (values) {
            var reviews = values[0];
            var draft = values[1];
            var review_id = draft.get('review.id');

            if (review_id && !reviews.isAny('id', review_id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    }
});

Ember.TEMPLATES["components/annotation-container"] = Ember.Handlebars.compile("{{#each annotationGroup in existingAnnotationGroups}}\n\t{{annotation-groupcontainer group=annotationGroup isStudent=isStudent}}\n{{/each}}\n\n{{#if newAnnotation}}\n\t{{annotation-createbox annotation=newAnnotation tags=tags hasSavedAnnotation=\"hasSavedAnnotation\"}}\n{{/if}}\n");

Ember.TEMPLATES["components/annotation-createbox"] = Ember.Handlebars.compile("{{#if tag}}\n<div class=\"annotation-create\">\n\t<span {{bind-attr class=\":annotation-create-tag-selected tag.isPositive:tag-positive:tag-negative\"}}>{{tag.name}} <i class=\"icon-info-circled\" {{action \"toggleCollapse\"}}></i></span>\n\n\t{{#general-collapse isActive=collapseActive}}\n\t\t{{annotation.tag.description}}\n\t{{/general-collapse}}\n\n\t{{textarea value=comment class=\"annotation-create-comment\"}}\n\n\t<button class=\"annotation-create-button\" {{action \"saveAnnotation\"}}>Tag It</button>\n</div>\n{{else}}\n\t{{autosuggest-tag data=tags value=tagId}}\n{{/if}}\n");

Ember.TEMPLATES["components/annotation-detail"] = Ember.Handlebars.compile("<span class=\"annotaion-close\" {{action 'closeAnnotation'}}><i class=\"icon-cancel-circled\"></i></span>\n\n<span {{bind-attr class=\":annotation-details-tag-selected annotation.isPositive:tag-positive:tag-negative\"}}>{{annotation.tag.name}} <i class=\"icon-info-circled\" {{action \"toggleCollapse\"}}></i></span>\n\n{{#general-collapse isActive=collapseActive}}\n\t{{annotation.tag.description}}\n{{/general-collapse}}\n\n<p class=\"annotation-details-comment\">{{annotation.comment}}</p>\n\n<p class=\"annotation-details-comment\">Original: \"{{annotation.original}}\"</p>\n\n{{#if isStudent}}\n  {{#unless annotation.isResolved}}\n\t  <button class=\"annotation-details-button\" {{action \"resolveAnnotation\"}}>Resolve</button>\n  {{else}}\n    <p class=\"bold\">[Resolved]</p>\n  {{/unless}}\n{{else}}\n  {{#unless annotation.isApproved}}\n    <button class=\"annotation-details-button\" {{action \"approveAnnotation\"}}>Approve</button>\n  {{else}}\n    <p class=\"bold\">[Approved]</p>\n  {{/unless}}\n{{/if}}\n");

Ember.TEMPLATES["components/annotation-groupcontainer"] = Ember.Handlebars.compile("{{#each annotation in group.annotations}}\n\t<div {{bind-attr class=\":annotation-title annotation.isPositive:tag-positive:tag-negative annotation.isResolved:tag-resolved\"}} {{action 'selectAnnotation' annotation}}>{{annotation.tag.name}}</div>\n{{/each}}\n{{#if selectedAnnotation}}\n\t{{annotation-detail annotation=selectedAnnotation top=group.top isStudent=isStudent closeAnnotation=\"closeAnnotation\"}}\n{{/if}}\n");

Ember.TEMPLATES["components/general-collapse"] = Ember.Handlebars.compile("{{yield}}\n");

Ember.TEMPLATES["components/is-in-array-checkbox"] = Ember.Handlebars.compile("<div class=\"checkbox\">\n\t{{#if isInArray}}\n\t\t<i class=\"icon-check\"></i>\n\t{{else}}\n\t\t<i class=\"icon-check inactive\"></i>\n\t{{/if}}\n</div>\n");

Ember.TEMPLATES["core/application"] = Ember.Handlebars.compile("{{outlet header}}\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\" {{bind-attr class=\"modalActive:active\"}}>\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n<div id=\"loading-container\" {{bind-attr class=\"loadingActive:active\"}}>\n\t<section id=\"loading-spinner\"></section>\n</div>\n");

Ember.TEMPLATES["core/layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"left-side\" class=\"outlet\">\n        {{outlet left-side-outlet}}\n    </section>\n    <section id=\"right-side\" class=\"outlet\">\n        {{outlet right-side-outlet}}\n    </section>\n</div>\n\n\n<!--\n<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n\n-->");

Ember.TEMPLATES["core/modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"selectTab\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n\n<div class=\"tab-content\">\n    {{view view.tabsViewClass viewName=\"tabsView\"}}\n</div>\n");

Ember.TEMPLATES["core/modules/editor"] = Ember.Handlebars.compile("\n");

Ember.TEMPLATES["core/modules/header"] = Ember.Handlebars.compile("<div class=\"temp_logout\">  \n  <a href=\"/logout\">Logout</a>\n</div>\n<div class=\"header-title\">{{view.title}}</div>\n");

Ember.TEMPLATES["core/modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["core/modules/nav_header"] = Ember.Handlebars.compile("<div class=\"nav-section left-nav\">{{view App.LeftNavButton}}</div>\n<div class=\"temp_logout\">  \n  <a href=\"/logout\">Logout</a>\n</div>\n<div class=\"header-title\">{{view.title}}</div>\n<div class=\"nav-section right-nav\">{{view App.RightNavButton}}</div>\n");

Ember.TEMPLATES["core/select-prompt"] = Ember.Handlebars.compile("<h3>Please Select An Item From the Left</h3>\n");

Ember.TEMPLATES["modules/_application_essay_templates-list-item"] = Ember.Handlebars.compile("\n{{#each t in application_essay_templates }}\n    <li class=\"list-item\">\n        <strong>{{../name}}</strong>: {{dotdotfifty t.essay_prompt}}\n    </li>\n{{/each}}\n");

Ember.TEMPLATES["modules/_draft-details-panel"] = Ember.Handlebars.compile("<div class=\"panel-title\">Details</div>\n\n{{#with essay}}\n<div class=\"details-field\">\n    <span class=\"key\">Audience:</span>\n    <span class=\"value app-text\">{{audience}}</span>\n</div>\n<div class=\"details-field\">\n    <span class=\"key\">Context:</span >\n    <span class=\"value app-text\">{{context}}</span>\n</div>\n<div class=\"details-field\">\n    <span class=\"key\">Topic:</span>\n    <span class=\"value app-text\">{{topic}}</span>\n</div>\n<div class=\"details-field\">\n    <span class=\"key\">Theme:</span>\n    <span class=\"value app-text\">{{theme.name}} ({{theme.category}})</span>\n</div>\n{{/with}}\n");

Ember.TEMPLATES["modules/_draft-review-panel"] = Ember.Handlebars.compile("<div class=\"panel-title\">Review</div>\n\n{{#if reviewMode}}\n    {{textarea class=\"review-editor\" value=review.text}}\n{{else}}\n    <p>{{currentReview.text}}</p>\n{{/if}}\n");

Ember.TEMPLATES["modules/_essay-app-tab-list-item"] = Ember.Handlebars.compile("<li class=\"tab-list-item\">\n    <div class=\"tab-li-field app-text\">{{essay_template.university.name}}:</div>\n    <div class=\"tab-li-field\">{{essay_prompt}}</div>\n    {{#if theme_essays}}\n        <div class=\"tab-li-field\">Also with:\n        {{#each theme_essay in theme_essays}}\n            {{theme_essay.essay_template.theme.name}}\n            ({{theme_essay.essay_template.theme.category}}),\n        {{/each}}\n        </div>\n    {{/if}}\n</li>\n");

Ember.TEMPLATES["modules/_essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Prompt:</div>\n    <div class=\"value app-text\">{{essay_prompt}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div>\n    <div class=\"value app-text\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Context:</div>\n    <div class=\"value app-text\">{{context}}</div>\n</div>\n\n{{#if is_in_progress}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic:</div>\n        <div class=\"value student-text\">{{topic}}</div>\n    </div>\n\n    {{#if review}}\n        <button {{action openDraft}}>Read Draft</button>\n    {{else}}\n        <button {{action openDraft}}>Write Draft</button>\n    {{/if}}\n{{else}}\n    {{#if is_new_essay}}\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 1:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\"}}\n        </div>\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 2:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\"}}\n        </div>\n\n        <button {{action 'submitProposedTopics' model}}>Submit Proposed Topics</button>\n    {{else}}\n        <div class=\"key\">Topics Under Review</div>\n\n        <hr>\n\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 1:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\" disabled=true}}\n            {{! view App.ProposedTopicOne valueBinding=\"proposed_topic_0\"}}\n        </div>\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 2:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\" disabled=true}}\n        </div>\n    {{/if}}\n{{/if}}\n");

Ember.TEMPLATES["modules/_essays-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">{{id}} +7</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{theme.name}}</div>\n    <div class=\"sub-line\">{{theme.category}}</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">{{next_action}}</div>\n    <div class=\"draft-due\">\n        Draft Due: &nbsp;\n                  {{#if draft_due_date}}\n                    {{formatDate draft_due_date}}\n                  {{else}}N/A{{/if}}\n    </div>\n    <div class=\"essay-due\">\n      Essay Due:  {{#if due_date}} {{formatDate due_date}}\n                  {{else}}         N/A             {{/if}}\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_invitation-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{email}}\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_student-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Email:</div>\n    <div class=\"value app-text\">{{email}}</div>\n</div>\n\n{{#link-to 'student.essays.index'}}<button>See Essays</button>{{/link-to}}\n");

Ember.TEMPLATES["modules/_students-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{#link-to \"student\" this}}\n            {{name}}\n        {{/link-to}}\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_students-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{!-- it is necessary to use \"controller.\" because this is inside a \"with\" block in the template,\n              which changes the context. The default context is controller, but now it is set to the\n              parameter of the \"with\" statement  --}}\n        {{input type=\"text\" placeholder=\"Student's Email\" value=controller.invitedStudentEmail}}\n        <span {{action \"inviteStudentCont\"}} class=\"inviteStudent\">+</span>\n        <!-- onclick=\"alert('Hit the invitation endpoint!'); return false;\"  -->\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_universities-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{name}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_universities-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{view Ember.Select\n        content=universities\n        selectionBinding=\"newUniversity\"\n        optionValuePath=\"content.id\"\n        valueBinding=\"defaultValueOption\"\n        optionLabelPath=\"content.name\"\n        prompt=\"Select a school\"}}\n    </div>\n</div>\n\n");

Ember.TEMPLATES["modules/draft"] = Ember.Handlebars.compile("<div class=\"editor-column summary-column\">\n    <section class=\"summary-header\">\n        <div class=\"panel-toggle-container\">\n            <button {{action togglePanel \"details\" target=view}} class=\"details panel-toggle\">\n                Details\n            </button>\n            <button {{action togglePanel \"review\" target=view}} class=\"review panel-toggle\">\n                Review\n            </button>\n        </div>\n        <div class=\"essay-prompt strong\">{{essay.essay_prompt}}</div>\n    </section>\n    <section class=\"summary-panel-container\">\n        {{view App.SummaryPanel viewName=\"summaryPanel\"}}\n    </section>\n</div>\n\n<div class=\"editor-column text-column\">\n    <div class=\"toolbar-container\">\n        <div id=\"editor-toolbar\" class=\"editor-toolbar\"></div>\n    </div>\n\n    {{#if reviewMode}}\n        {{view App.TextEditor\n            action=\"startedWriting\"\n            valueBinding=\"formatted_text\"\n            isReadOnly=false\n            reviewMode=true\n            valueBuffer=formatted_text_buffer\n        }}\n    {{else}}\n        {{view App.TextEditor\n            action=\"startedWriting\"\n            valueBinding=\"formatted_text\"\n            valueBuffer=formatted_text_buffer\n        }}\n    {{/if}}\n</div>\n\n<div class=\"editor-column annotations-column\">\n    {{annotation-container\n        newAnnotation=newAnnotation\n        annotations=domAnnotations\n        tags=tags\n        hasSavedAnnotation=\"hasSavedAnnotation\"\n        isStudent=isStudent}}\n</div>\n");

Ember.TEMPLATES["modules/essay/_app-item"] = Ember.Handlebars.compile("<li {{bind-attr class=\":tab-list-item selected unselected\"}}>\n    <div class=\"tab-li-field app-text\">{{essay_template.university.name}}:</div>\n    <div class=\"tab-li-field\">{{essay_prompt}}</div>\n    {{#if theme_essays}}\n        <div class=\"tab-li-field\">Also with:\n        {{#each theme_essay in theme_essays}}\n            {{theme_essay.essay_template.theme.name}}\n            ({{theme_essay.essay_template.theme.category}}),\n        {{/each}}\n        </div>\n    {{/if}}\n</li>\n");

Ember.TEMPLATES["modules/essays/layout"] = Ember.Handlebars.compile("<div class=\"module-title\">\n\t<h2>Essays</h2>\n\t<span class=\"student-info\">{{student.name}}</span>\n</div>\n\n{{view App.EssaysListView}}\n");

Ember.TEMPLATES["modules/essays/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n  {{#if actionRequiredEssays}}\n    <li class=\"legend\">Take Action</li>\n    {{#each actionRequiredEssays}}\n      {{view view.listItem classNameBindings=\"isSelected\" }}\n    {{/each}}\n  {{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/student/essay-layout"] = Ember.Handlebars.compile("<div class=\"module-title\">\n\t<h2>Essays</h2>\n\t<span class=\"student-info\">{{student.name}}</span>\n\t{{#if showMergedEssays}}\n\t\t<button {{action 'toggleMergedEssays'}}>Hide Merged Essays</button>\n\t{{else}}\n\t\t<button {{action 'toggleMergedEssays'}}>Show Merged Essays</button>\n\t{{/if}}\n</div>\n\n{{view App.StudentEssaysListView}}\n");

Ember.TEMPLATES["modules/student/essays/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n{{#if showMergedEssays}}\n  <li class=\"legend\">Merged</li>\n  {{#each mergedEssays}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n  {{/each}}\n{{else}}\n    {{#if actionRequiredEssays}}\n      <li class=\"legend\">Take Action</li>\n      {{#each actionRequiredEssays}}\n        {{view view.listItem classNameBindings=\"isSelected\" }}\n      {{/each}}\n    {{/if}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/student/essays/show/_app-item"] = Ember.Handlebars.compile("<li {{bind-attr class=\":tab-list-item selected unselected\"}} {{action 'select'}}>\n    <div class=\"tab-li-field app-text\">{{essay_template.university.name}}:</div>\n    <div class=\"tab-li-field\">{{essay_prompt}}</div>\n    {{#if theme_essays}}\n        <div class=\"tab-li-field\">Also with:\n        {{#each theme_essay in theme_essays}}\n            {{theme_essay.essay_template.theme.name}}\n            ({{theme_essay.essay_template.theme.category}}),\n        {{/each}}\n        </div>\n    {{/if}}\n</li>\n");

Ember.TEMPLATES["modules/student/essays/show/_details-list"] = Ember.Handlebars.compile("<p>{{view.summaryText}}</p>\n\n{{#each application_essay in application_essays}}\n    {{render 'modules/student/essays/show/_app-item' application_essay}}\n{{/each}}\n");

Ember.TEMPLATES["modules/student/essays/show/_overview"] = Ember.Handlebars.compile("{{#if parent}}\n<div class=\"details-field\">\n    <div class=\"key\">Merged into Essay:</div>\n    <div class=\"value app-text\">{{parent.theme.name}}</div>\n</div>\n{{/if}}\n\n<div class=\"details-field\">\n    <div class=\"key\">Prompt:</div>\n    <div class=\"value app-text\">{{essay_prompt}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div>\n    <div class=\"value app-text\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Context:</div>\n    <div class=\"value app-text\">{{context}}</div>\n</div>\n\n{{#if merged_theme_essays}}\n<div class=\"details-field\">\n    <div class=\"key\">Merged into Essay:</div>\n    <ul>\n        {{#each mergedEssay in merged_theme_essays}}\n            <li>{{mergedEssay.theme.name}}</li>\n        {{/each}}\n    </ul>\n    <div class=\"value app-text\">{{parent.theme.name}}</div>\n</div>\n{{/if}}\n\n{{#if is_in_progress}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic:</div>\n        <div class=\"value student-text\">{{topic}}</div>\n    </div>\n{{else}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic 1:</div>\n        {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\"}}\n    </div>\n\n    {{#if topicsReadyForApproval}}\n        <button {{action 'approveProposedTopic' model 'proposed_topic_0'}}>Approve Topic 1</button>\n    {{/if}}\n\n    <div class=\"details-field\">\n        <div class=\"key\">Topic 2:</div>\n        {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\"}}\n    </div>\n\n    {{#if topicsReadyForApproval}}\n        <button {{action 'approveProposedTopic' model 'proposed_topic_1'}}>Approve Topic 2</button>\n    {{else}}\n        <button {{action 'update' model}}>Save Topics</button>\n    {{/if}}\n{{/if}}\n\n{{#if draft_ready_for_review}}\n    <button {{action 'reviewDraft' recentDraft}}>Review Draft</button>\n{{/if}}\n\n{{#if parent}}\n<button {{action 'splitEssay' model}}>Unmerge Essay</button>\n{{else}}\n<button {{action 'mergeEssay' model}}>Merge Essay</button>\n{{/if}}\n");

Ember.TEMPLATES["modules/student/essays/show/merge"] = Ember.Handlebars.compile("<div class=\"modal-content\">\n  <button class=\"close-button\" {{action 'closeModal'}}>X</button>\n  <div class=\"modal-title\">Merge Essays</div>\n  <div class=\"instructions\">\n  \t<p>Select the essays to merge into {{parentEssay.theme.name}}.</p>\n  \t<p>You'll only write to the Prompt and Topics for {{parentEssay.theme.name}}.</p>\n  </div>\n  <ul class=\"modal-list\">\n  \t{{#each essay in mergeEssays}}\n  \t\t<li {{action 'toggleMergeSelected' essay}}>\n        {{is-in-array-checkbox list=parentEssay.merged_theme_essays target=essay}}\n  \t\t\t<div class=\"main-group\">\n          <div class=\"main-line\">{{essay.theme.name}}</div>\n          <div class=\"sub-line\">{{essay.theme.category}}</div>\n        </div>\n  \t\t</li>\n  \t{{/each}}\n  </ul>\n  <div class=\"modal-actions\">\n    <button class=\"double-column\" {{action 'mergeEssays' parentEssay}}>Merge &gt;</button>\n  </div>\n</div>\n");

Ember.TEMPLATES["modules/student/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/students"] = Ember.Handlebars.compile("{{#with students}}\n    {{view App.StudentsListView}}\n{{/with}}\n\n{{#with pendingInvitations}}\n    {{view App.InvitationsListView}}\n{{/with}}\n");

Ember.TEMPLATES["partials/_details-list"] = Ember.Handlebars.compile("<p>{{view.summaryText}}</p>\n\n{{#each application_essay in application_essays}}\n    {{render 'modules/essay/_app-item' application_essay}}\n{{/each}}\n");

Ember.TEMPLATES["partials/button"] = Ember.Handlebars.compile("{{view.text}}");

Ember.TEMPLATES["partials/tags"] = Ember.Handlebars.compile("<div id=\"tag-box\">\n<input id=\"tag-search\">\n<div id=\"tag-menu\"></div>\n</div>\n");

Ember.TEMPLATES["test/select"] = Ember.Handlebars.compile("{{autosuggest-tag data=this}}\n");