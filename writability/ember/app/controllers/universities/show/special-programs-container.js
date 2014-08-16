import Ember from 'ember';
import SpecialProgramEssayList from 'writability/models/special-program-essay-list';

export default Ember.ArrayController.extend({
	needs: ['application'],

	programGroupings: function() {
		var essays = this.get('content'),
			groups = [],
			controller = this;

		essays.forEach(function(essay) {
			var specialProgramId = essay.get('special_program_id');

			if (groups[specialProgramId]) {
				groups[specialProgramId].content.push(essay);
			} else {
				groups[specialProgramId] = SpecialProgramEssayList.create({
					specialProgram: controller.store.find('special_program', specialProgramId),
					content: [essay]
				});
			}
		});

		return groups.compact();
	}.property('model.length'),

	selectSpecialProgram: function(specialProgramEssayList) {
		var student = this.get('controllers.application.currentStudent'),
			checked = specialProgramEssayList.get('showCheck'),
			url = '/api/students/' + student.id + '/special-programs/' + specialProgramEssayList.get('specialProgram.id'),
			controller = this;

		Ember.$.ajax({
			url: url,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify({
				checked: checked
			})
		}).then(function(data) {
			this.store.pushPayload(data);
		}.bind(controller));
	},

	newCheckedProgram: function() {
		var controller = this;
		this.get('programGroupings').forEach(function(specialProgramEssayList) {
			if (specialProgramEssayList.get('showCheck') !== specialProgramEssayList.get('currentEssayState')) {
				controller.selectSpecialProgram(specialProgramEssayList);
			}
		});
	}.observes('programGroupings.@each.showCheck')
});
