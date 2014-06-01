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

  it ("arbitrary template will render given output", function(){
      var view = Ember.View.create({
          template: Ember.Handlebars.compile('bar')
      });
      Ember.run(function() {
          view.appendTo("#view-tests");
      });
      expect(view.$().text()).toEqual("bar");
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

// Below is an example of a more full spec
/*
describe('EditTaskView', function () {
  describe('#update', function () {
    ... // existing successful update spec
 
    describe('given an invalid task', function () {
      beforeEach(function () {
        this.task = new Task({ id: 1 });
        this.editTaskView = new EditTaskView({ model: this.task });
        this.editTaskView.render();
 
        $('form', this.editTaskView.el)
          .find('input[name=description]')
            .val('')
            .end()
          .submit();
      });
 
      it('displays any validation errors', function () {
        var body = {
          description: ["can't be blank"]
        };
        var response = {
          status: 422,
          responseText: JSON.stringify(body)
        };
        var request = mostRecentAjaxRequest();
        request.response(response);
        expect($('#errors', this.editTaskView.el)).toHaveText("Description can't be blank");
      });
    });
  });
});
*/
