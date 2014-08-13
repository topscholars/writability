import AuthenticatedRoute from './authenticated';

export default AuthenticatedRoute.extend({
    model: function (params) {
        return this.get('currentTeacher.students').then(function(students) {
            return students.findBy('id', params.id);
        });
    },

    renderTemplate: function() {
        this.render({outlet: 'right-side-outlet'});
    },
});
