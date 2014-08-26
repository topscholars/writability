import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        return this.get('currentStudent').get('universities');
    },

    setupController: function(controller, model) {
        controller.set('student', this.get('currentStudent'));
        controller.set('backDisabled', true);

        this.controllerFor('universities').set('addingUniversities', true);
        this._super(controller, model); //Required boilerplate
    },

    renderTemplate: function () {
        this.render('universities/add/essay-templates', {into: 'layouts/main', outlet: 'right-side-outlet'});
    },

    actions: {
        selectedUniversity: function (university, controller) {
            var student = this.get('currentStudent');
            var universitiesPromise = student.get('universities');

            universitiesPromise.then(function(universities) {
                universities.pushObject(university);
                student.save().then(function () {
                    controller.universityHasBeenSelected();
                });
            });
        },
        next: function() {
            var route = this;
            var controller = this.controllerFor('universities.add');
            var student = this.get('currentStudent');

            controller.attachEssays().then(function() {
                route.transitionTo('universities');

                student.reload().then(function() {
                    route.store.find('application-essay');
                });
            });
        },
        removeUniversity: function(universitiy) {
            var controller = this.controllerFor('universities.add');
            var student = controller.get('student');

            student.get('universities').then(function(universities) {
                universities.removeObject(universitiy);
                student.save();
            });
        }
    }
});
