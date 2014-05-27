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
        controller.set('model', model); //Required boilerplate
        controller.set('backDisabled', true);
        // controller.set('nextDisabled', true); // Use same for next button in other views
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('NavHeader', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        selectedUniversity: function (university) {
            var universities = this.get('currentStudent').get('universities');
            universities.pushObject(university);
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
       // TODO: concatenate invites and students
        return this.get('currentTeacher').get('students');
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        // needs into explicity because core/layouts/main was rendered
        // within function
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        // TODO This should create an invitation model and add to list
        inviteStudent: function (student) {
            console.log('invite');
            var students = this.get('currentTeacher').get('students');
            students.pushObject(student);
            // Set status to server
            students.save();  // Ember magic   s.model has a save with
            // student.invitation.create
        }
    }
});

App.EssaysRoute = App.AuthenticatedRoute.extend({
    model: function () {
        if (this.get('currentStudent').get('state') !== 'active') {
            this.transitionTo('universities');
        }

        return this.get('currentStudent').get('theme_essays');
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
    }
});

App.EssayRoute = App.AuthenticatedRoute.extend({

    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('themeEssay', params.id);
    },

    renderTemplate: function () {

        console.log('this.currentModel id: ' + this.currentModel.id );
        //this.modelFor(this.EssayRoute)
        var id = this.currentModel.id;
        //var id = this.controller.get('model').id;
        this.controllerFor('essays').findBy('id', id).send('select');
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
    model: function (params) {
        this._assert_authorized(params.id);
        return this.store.find('draft', params.id);
    },

    setupController: function(controller, model) {
        controller.set('model', model); //Required boilerplate
        // controller.set('backDisabled', true);
        // controller.set('nextDisabled', true); // Use same for next button in other views
        controller.set('nextText', 'Send to Teacher');
    },

    renderTemplate: function () {
        this.render('core/layouts/editor');
        this.render('NavHeader', {outlet: 'header'});
        this.render({into: 'core/layouts/editor', outlet: 'editor-module'});
    },

    _assert_authorized: function (id) {
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
    }
});
