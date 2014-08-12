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
        this.render('universities/add/essay-templates', {into: 'layouts/main', outlet: 'right-side-outlet'});
        this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
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
