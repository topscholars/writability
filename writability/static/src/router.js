define([
    // libs
    "ember",
    // app
], function (Ember) {

    var registerRoutes = function (App) {
        App.Router.map(function () {
            alert('router student');
            // TODO XXX: this.resource('student', {path: '/student/'});
        });
    };

    return {
        registerRoutes: registerRoutes
    };
});

