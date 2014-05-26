describe('user login', function() {
   beforeEach(function() {
    //route = App.IndexRoute.create();
    //For view tests
    root = $('body').append('<div id="view-tests" />');
    rootElement = window.App.rootElement;
    window.App.rootElement = $("#view-tests");
  });
  afterEach(function() {
      Ember.run(function() {
          window.App.rootElement = rootElement;
          $("#view-tests").html('');
      });
  });

  it('ensures user can log in', function() {

    browser().navigateTo('/');
    // expect current scope to contain username
  });
  it('ensures path has changed', function() {
    // expect path to equal '/dashboard'
  });

});