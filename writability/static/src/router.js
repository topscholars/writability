App.Router.reopen({
    // use the history API
    location: 'history'
});

App.Router.map(function () {
    this.resource('essays', {path: '/essays'});
    this.resource('essay', {path: '/essays/:id'});
    //this.resource('drafts', {path: '/drafts'});
    this.resource('draft', {path: '/drafts/:id'});
});

App.EssaysRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('essay');
    },

    renderTemplate: function () {
        this.render('modules/header', {outlet: 'header'});
        this.render({outlet: 'list-module'});
    }
});

App.EssayRoute = Ember.Route.extend({
    model: function (params) {
        var id = params.id;
        return Ember.RSVP.hash({
            listModel: this.store.find('essay'),
            itemModel: this.store.find('essay', id)
        });
    },

    setupController: function (controller, model) {
        controller.set('model', model.itemModel);
        this.controllerFor('essays').set('model', model.listModel);
    },

    renderTemplate: function () {
        this.render('modules/header', {
            outlet: 'header'
        });
        this.render('essays', {
            outlet: 'list-module'
        });
        this.render({
            outlet: 'details-module',
        });

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
        this.render('modules/header', {outlet: 'header'});
        this.render({outlet: 'editor-module'});
    }
});
