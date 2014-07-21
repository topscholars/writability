define("writability/app",
  ["ember/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: 'writability', // TODO: loaded via config
      Resolver: Resolver,
      rootElement: '#application-root',

      // Basic logging, e.g. "Transitioned into 'post'"
      LOG_TRANSITIONS: true,

      // Extremely detailed logging, highlighting every internal
      // step made while transitioning into a route, including
      // `beforeModel`, `model`, and `afterModel` hooks, and
      // information about redirects and aborted transitions
      LOG_TRANSITIONS_INTERNAL: true
    });

    __exports__["default"] = App;
  });
define("writability/templates/application", function () { return Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<h2 id='title'>Welcome to Ember.js</h2>\n\n");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
}); });
define("writability/router",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Router = Ember.Router.extend({
        location: 'history'
    });

    Router.map(function () {
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

    });

    __exports__["default"] = Router;
  });
define("writability/templates/layouts/main", function () { return Ember.TEMPLATES["layouts/main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"left-side\" class=\"outlet\">\n        ");
  data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "left-side-outlet", options) : helperMissing.call(depth0, "outlet", "left-side-outlet", options))));
  data.buffer.push("\n    </section>\n    <section id=\"right-side\" class=\"outlet\">\n        ");
  data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "right-side-outlet", options) : helperMissing.call(depth0, "outlet", "right-side-outlet", options))));
  data.buffer.push("\n    </section>\n</div>\n");
  return buffer;
  
}); });
define("writability/adapters/application",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.RESTAdapter.extend({
        // Turn Model camel cased class names to dashed urls.
        pathForType: function (type) {
            var dasherized = Ember.String.dasherize(type);
            return Ember.String.pluralize(dasherized);
        },

        namespace: 'api'
    });
  });
define("writability/computed/alias-array-object",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = function (dependentKey, index) {
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
    };
  });
define("writability/controllers/application",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend({

        // required for CurrentUserHelper to set properties
        content: {}
    });
  });
define("writability/controllers/students",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend({
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
  });
define("writability/models/annotation",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
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
  });
define("writability/models/application-essay-template",
  ["./essay-template","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var EssayTemplate = __dependency1__["default"];

    __exports__["default"] = EssayTemplate.extend({
        max_words: DS.attr('string'),
        university: DS.belongsTo('university', {async: true}),
        themes: DS.hasMany('theme', {async: true}),
        due_date: DS.attr('string')
    });
  });
define("writability/models/application-essay",
  ["./essay","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Essay = __dependency1__["default"];__exports__["default"] = Essay.extend({
        // properties

        // relationships
        theme_essays: DS.hasMany('themeEssay', {async: true}),
        essay_template: DS.belongsTo('applicationEssayTemplate', {async: true})
    });
  });
define("writability/models/dom-annotation",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Object.extend({
    	offset: null,
    	annotation: null
    });
  });
define("writability/models/draft",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
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
        review: DS.belongsTo('review', {async: true}),

        reviewState: Ember.computed.alias('review.state')
    });
  });
define("writability/models/essay-template",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        // properties
        essay_prompt: DS.attr('string'),
    });
  });
define("writability/models/essay",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        dueDateAdvanceDays: 3,

        // properties
        audience: DS.attr('string'),
        context: DS.attr('string'),
        due_date: DS.attr(),
        essay_prompt: DS.attr('string'),
        num_of_drafts: DS.attr('number'),
        topic: DS.attr('string'),
        max_words: DS.attr('number'),
        draft_due_date: DS.attr(null, {readOnly: true}),
        next_action: DS.attr('string', {readOnly: true}),

        // relationships
        student: DS.belongsTo('student'),
        drafts: DS.hasMany('draft', {async: true}),
        essay_template: DS.belongsTo('essayTemplate', {async: true}),

        autoUpdateDueDate: function() {
            var currentDueDate = moment(this.get('due_date'));

            // Check if currentDueDate is in the past
            if (currentDueDate.isBefore(moment())) {
                var newDueDate = currentDueDate.add('d', this.get('dueDateAdvanceDays'));
                this.set('due_date', newDueDate.format('YYYY-MM-DD'));
            }
        },

        recentDraft: Ember.computed.alias('drafts.lastObject').property('drafts', 'drafts.length'),

        numberOfStartedDrafts: Ember.computed.alias('drafts.length'),

        teacherRecentReview: Ember.computed.alias('recentDraft.review'),

        draftsWithCompletedDrafts: Ember.computed.filterBy('drafts', 'reviewState', 'completed'),

        studentRecentReview: function () {
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
                    var reviewsWithGoodState = reviews.filterBy('state', 'completed');
                    var numOfGoodReviews = reviewsWithGoodState.length;
                    if (numOfGoodReviews > 0) {
                        return reviewsWithGoodState[numOfGoodReviews - 1];
                    } else {
                        return null;
                    }
                });
        }.property('drafts', 'teacherRecentReview', 'draftsWithCompletedDrafts'),

        nextActionAwaits: function () {
            var nextAction = this.get('next_action');

            if ( nextAction.match(/Review|Approve/)) {
                return 'teacher';
            } else {
                return 'student';
            }
        }.property('next_action', 'state')
    });
  });
define("writability/models/invitation",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        // properties
        email: DS.attr('string'),
        is_registered: DS.attr('boolean'),
        teacher: DS.belongsTo('teacher')
    });
  });
define("writability/models/review",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        // properties
        text: DS.attr('string'),
        is_draft_approved: DS.attr('boolean'),
        due_date: DS.attr('string'),
        review_type: DS.attr('string'),

        next_states: DS.attr('array', {readOnly: true}),
        state: DS.attr('string'),
        annotations: DS.hasMany('annotation', {async: true}),

        all_annotations_resolved: function() {
            return ! this.get('annotations').isAny('state', 'new');
        }.property('annotations.@each.state'),

        // relationships
        draft: DS.belongsTo('draft'),
        teacher: DS.belongsTo('teacher')
    });
  });
define("writability/models/role",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        // properties
        name: DS.attr('string')
    });
  });
define("writability/models/student",
  ["./user","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var User = __dependency1__["default"];

    __exports__["default"] = User.extend({
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
  });
define("writability/models/tag",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
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
  });
define("writability/models/teacher",
  ["./user","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var User = __dependency1__["default"];

    __exports__["default"] = User.extend({
        // properties
        // relationships
        students: DS.hasMany('student', {async: true}),
        reviews: DS.hasMany('review', {async: true}),
        teacher_essays: DS.hasMany('themeEssay', {async: true}),
        invitations: DS.hasMany('invitation', {async: true}),
    });
  });
define("writability/models/theme-essay-template",
  ["./essay-template","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var EssayTemplate = __dependency1__["default"];

    __exports__["default"] = EssayTemplate.extend({
        audience: DS.attr('string'),
        context: DS.attr('string'),
        theme: DS.belongsTo('theme', {async: true})
    });
  });
define("writability/models/theme-essay",
  ["./essay","../computed/alias-array-object","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Essay = __dependency1__["default"];var aliasArrayObject = __dependency2__["default"];

    __exports__["default"] = Essay.extend({
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

        proposed_topic_0: aliasArrayObject('proposed_topics', 0),
        proposed_topic_1: aliasArrayObject('proposed_topics', 1),
        is_in_progress: Ember.computed.equal('state', 'in_progress'),
        is_new_essay: Ember.computed.equal('state', 'new'),
        topicsReadyForApproval: Ember.computed.equal('state', 'added_topics'),
    });
  });
define("writability/models/theme",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        // properties
        name: DS.attr('string'),
        category: DS.attr('string'),
        theme_essay_template: DS.belongsTo('theme_essay_template', {async: true})
        // camelCase
    });
  });
define("writability/models/university",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
        // properties
        name: DS.attr('string'),
        // logo_url: DS.attr('string'),
        application_essay_templates: DS.hasMany('application_essay_template', {async: true})
    });
  });
define("writability/models/user",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.Model.extend({
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
  });
define("writability/routes/application",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
  });
define("writability/routes/authenticated",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
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
  });
define("writability/routes/draft",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
  });
define("writability/routes/error-unauthorized",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
        renderTemplate: function () {
            // TODO: Build 404 Error Template
            console.log('render error template');
        }
    });
  });
define("writability/routes/essay",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
  });
define("writability/routes/essays",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
            this.render('layouts/main');
            this.render('Header', {outlet: 'header'});
            this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
        }
    });
  });
define("writability/routes/index",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
  });
define("writability/routes/loading",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
        renderTemplate: function() {
            this.send('openLoading');
        },
        deactivate: function() {
            this.send('closeLoading');
        }
    });
  });
define("writability/routes/student",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
        model: function (params) {
            return this.get('currentTeacher.students').then(function(students) {
                return students.findBy('id', params.id);
            });
        },

        renderTemplate: function() {
            this.render({outlet: 'right-side-outlet'});
        },
    });
  });
define("writability/routes/students",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
            this.render('layouts/main');
            this.render('Header', {outlet: 'header'});
            // needs into explicity because layouts/main was rendered
            // within function
            this.render('modules/students', {into: 'layouts/main', outlet: 'left-side-outlet'});
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
  });
define("writability/routes/universities",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({

        model: function () {
            return this.get('currentStudent').get('universities');
        },

        setupController: function(controller, model) {
            controller.set('student', this.get('currentStudent'));
            controller.set('backDisabled', true);
            this._super(controller, model); //Required boilerplate
        },

        renderTemplate: function () {
            this.render('layouts/main');
            this.render('NavHeader', {outlet: 'header'});
            this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
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
  });
define("writability/serializers/application",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.RESTSerializer.extend({
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
  });
define("writability/serializers/teacher",
  ["./application","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ApplicationSerializer = __dependency1__["default"];

    __exports__["default"] = ApplicationSerializer.extend({
        normalize: function(type, hash, prop) {
            hash.reviews = hash.reviews.filter(function(value) {
                return value !== null;
            });

            return this._super(type, hash, prop);
        }
    });
  });
define("writability/routes/student/essays",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
        model: function () {
            var student = this.modelFor('student');

            return student.get('theme_essays');
        },

        renderTemplate: function () {
            // this.render('layouts/main');
            this.render('Header', {outlet: 'header'});
            this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
            this.render('core/select-prompt', {into: 'layouts/main', outlet: 'right-side-outlet'});
        }
    });
  });
define("writability/routes/universities/index",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
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
  });
define("writability/routes/student/essays/show",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
        renderTemplate: function () {
            this.controllerFor('student.essays').send('selectEssay', this.currentModel, true);
            this.render({outlet: 'right-side-outlet'});
        }
    });
  });
define("writability/routes/student/essays/show/merge",
  ["./authenticated","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var AuthenticatedRoute = __dependency1__["default"];

    __exports__["default"] = AuthenticatedRoute.extend({
        setupController: function(controller, model) {
            controller.set('parentEssay', this.modelFor('student.essays.show'));
            controller.set('essays', this.modelFor('student.essays'));
        },
        renderTemplate: function() {
            this.render({into: 'application', outlet: 'modal-module'});
            this.send('openModal');
        }
    });
  });