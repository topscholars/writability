import AuthenticatedRoute from 'writability/routes/authenticated';

export default AuthenticatedRoute.extend({
	model: function (params) {
		var universityName = params.university_name;

		return this.get('currentStudent.application_essays').filter('university_name', universityName);
	}
});
