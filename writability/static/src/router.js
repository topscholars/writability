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
        }
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
                is_registered: false,
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
        this.controllerFor('student.essays').send('selectEssay', this.currentModel);
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
            route.get('currentTeacher').get('reviews'),
            route.store.find('draft', id)
        ]).then(function (values) {
            var reviews = values[0];
            var draft = values[1];
            var review_id = draft._data.review.id;

            if (!reviews.isAny('id', review_id)) {
                route.transitionTo('error.unauthorized');
            }
        });
    }
});
