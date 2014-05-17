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
    model: function () {
        return this.store.find('student', 0)
            .then(function (student) {
                return student.get('universities');
        });
    },

    renderTemplate: function () {
        this.render('core/layouts/main');
        this.render('NavHeader', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
        /* this.render(
            'applicationEssayTemplates',
            {into: 'core/layouts/main', outlet: 'details-module'}); */ //details=right-side-outlet
    },

    actions: {
        selectedUniversity: function (university) {
            var that = this;
            this.store.find('student', 0).then(function (student) {
                var universities = student.get('universities');
                universities.pushObject(university);
                //that.render('applicationEssayTemplates', {outlet: 'details-module'});/details=right-side-outlet
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
        this.render(
            'applicationEssayTemplates',
            {outlet: 'right-side-outlet'});
    }
});

// Actions are events. 2 types of events. Within-module (select element in list + update list)  
                            // and 
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
                // needs into explicity because core/layouts/main was rendered within function
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
