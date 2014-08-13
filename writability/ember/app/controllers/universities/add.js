import Ember from 'ember';

export default Ember.ArrayController.extend({
	attachEssays: function() {
	    var controller = this;
	    var student = this.get('student');
	    var universitiesPromise = student.get('universities');
	    var urlForStudent = '/api/students/' + student.id + '/add-universities';

	    return new Ember.RSVP.Promise(function(resolve) {
	        universitiesPromise.then(function(universities) {
	            Ember.$.ajax({
	                url: urlForStudent,
	                method: 'POST',
	                contentType: "application/json; charset=utf-8",
	                dataType: "json",
	                data: JSON.stringify({
	                    student_id: student.id,
	                    universities: universities.getEach('id')
	                })
	            }).then(function() { resolve(); });
	        });
	    });
	}
});
