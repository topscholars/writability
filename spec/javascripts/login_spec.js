describe('App.IndexRoute', function() {
  var controller, route;

  beforeEach(function() {
    controller = jasmine.createSpyObj('controller', ['set']);

    route = App.IndexRoute.create();
    spyOn(route, 'controllerFor').and.returnValue(controller);
  
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

  it ("calls controllerFor with application", function() {
    //Ember.run(function() {
    //  route.activate();
    //});
    route.activate();
    //expect(route.controllerFor).toHaveBeenCalledWith('application');
  });

  it ("opens landing page", function() {
    visit("/");

    //browser().navigateTo('#/');
    //expect(browser().location().path()).toBe("/login");
    //page.should have_content("login");

    //   done();
  });


  it ("arbitrary template will render given output", function(){



        var view = Ember.View.create({
            template: Ember.Handlebars.compile('bar')
        });
        Ember.run(function() {
            view.appendTo("#view-tests");
        });
        expect(view.$().text()).toEqual("bar");

        // move to after each
        Ember.run(function() {
            window.App.rootElement = rootElement;
            $("#view-tests").html('');
        });
    });



  xit("sets loginLayout on applicationController on activate", function() {
    route.activate(); 
    expect(controller.set).toHaveBeenCalledWith('ApplicationController', true);
  });

  xit("unsets loginLayout on applicationController on deactivate", function() {
    route.deactivate();
    expect(controller.set).toHaveBeenCalledWith('loginLayout', false);
  });
});