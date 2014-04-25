App.Router.reopen({
    // use the history API
    location: 'history'
});

App.Router.map(function () {
    this.resource('essays', {path: '/essays'});
});

App.EssaysRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('essay');
    }
});
