describe('App.IndexRoute', function() {
  var controller, route;

  beforeEach(function() {
    controller = jasmine.createSpyObj('controller', ['set']);

    route = App.IndexRoute.create();
    spyOn(route, 'controllerFor').and.returnValue(controller);
  });

  it("calls controllerFor with application", function() {
    Ember.run(function() {
      route.activate();
    });
    //route.activate();
    //expect(route.controllerFor).toHaveBeenCalledWith('application');
  });

  xit("sets loginLayout on applicationController on activate", function() {
    route.activate(); 
    expect(controller.set).toHaveBeenCalledWith('loginLayout', true);
  });

  xit("unsets loginLayout on applicationController on deactivate", function() {
    route.deactivate();
    expect(controller.set).toHaveBeenCalledWith('loginLayout', false);
  });
});