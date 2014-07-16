import AuthenticatedRoute from './authenticated';

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
        this.render('core/layouts/main');
        this.render('NavHeader', {outlet: 'header'});
        this.render({into: 'core/layouts/main', outlet: 'left-side-outlet'});
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
        }
    }
});
