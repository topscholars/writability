App.rootElement = '#application-root';
App.setupForTesting();
App.injectTestHelpers();

App.Store = DS.Store.extend({
  adapter: DS.FixtureAdapter.extend(),
});

//   Uncaught Error: Cannot re-register: `store:main`, as it has already been looked up.
//beforeEach(function() {
//  Ember.run(function() {
//    App.reset();
//  });
//});