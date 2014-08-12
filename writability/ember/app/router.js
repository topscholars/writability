import Ember from 'ember';

var Router = Ember.Router.extend({
	location: WritabilityENV.locationType
});

Router.map(function () {
    this.resource('essays', function () {
        this.resource('theme-essay', {path: 'theme/:id'});
        this.resource('application-essay', {path: 'application/:id'});
    });

    this.resource('students', function () {
        this.resource('student', {path: '/:id'}, function() {
            this.resource("student.essays", { path: "/essays" }, function() {
                this.resource("student.essays.show-theme", { path: "theme/:theme_essay_id" }, function() {
                    this.route('merge', { path: "/merge" });
                });
                this.resource("student.essays.show-application", { path: "application/:application_essay_id" });
            });
        });
    });

    // no drafts list resource
    this.resource('draft', {path: '/drafts/:id'});

    this.resource('universities', function () {
    });
    // no university item resource

    this.resource('error', function () {
        this.route('unauthorized');
    });

});

export default Router;
