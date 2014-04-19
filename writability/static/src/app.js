define([
    // libs
    "ember",
    // app
    "router"
], function (Ember, Router) {
    var App = Ember.Application.create();
    Router.registerRoutes(App);
});
