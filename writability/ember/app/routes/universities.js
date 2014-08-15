import Ember from 'ember';
import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentStudent').get('universities');
    },

    setupController: function(controller, model) {
        controller.set('student', this.get('currentStudent'));
        controller.set('backDisabled', true);
        this._super(controller, model); //Required boilerplate
    },

    renderTemplate: function () {
        this.render('layouts/main');
        this.render('nav-header', {outlet: 'header'});
        this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
    },

    actions: {
        next: function() {
            var useThreading = this.controllerFor('universities').get('use_threading'),
                studentId = this.get('currentStudent.id'),
                urlForStudent = "/api/students/" + studentId + "/set-essay-display";

            debugger;

            return new Ember.RSVP.Promise(function(resolve) {
                Ember.$.ajax({
                    url: urlForStudent,
                    method: 'PUT',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        use_threading: useThreading,
                        student: studentId
                    })
                }).then(function() { resolve(); });
            });
        }
    }
});
