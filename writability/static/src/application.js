window.App = Ember.Application.create();

// App.ApplicationAdapter = DS.FixtureAdapter.extend();
DS.RESTAdapter.reopen({
    namespace: 'api'
});
