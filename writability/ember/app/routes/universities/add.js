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
            var controller = this.controllerFor('universities.add');
            var student = controller.get('student');

            controller.attachEssays().then(function() {
                student.set('state', 'active');
                return student.save();
            }).then(function() {
                controller.transitionToRoute('essays');
            });
        },
        removeUniversity: function(universitiy) {
            var controller = this.controllerFor('universities.add');
            var student = controller.get('student');

            student.get('universities').removeObject(universitiy);
            student.save();
        }
    }
});
