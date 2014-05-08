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

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('user', 0);
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
