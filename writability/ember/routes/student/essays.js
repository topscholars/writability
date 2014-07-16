import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function () {
        var student = this.modelFor('student');

        return student.get('theme_essays');
    },

    renderTemplate: function () {
        // this.render('layouts/main');
        this.render('Header', {outlet: 'header'});
        this.render({into: 'layouts/main', outlet: 'left-side-outlet'});
        this.render('core/select-prompt', {into: 'layouts/main', outlet: 'right-side-outlet'});
    }
});
