window.App = Ember.Application.create({
    rootElement: '#application-root',
});

App.ApplicationView = Ember.View.extend({
    didInsertElement: function () {
        $('#splash-page').remove();
    }
});

// App.ApplicationAdapter = DS.FixtureAdapter.extend();
DS.RESTAdapter.reopen({
    namespace: 'api'
});
