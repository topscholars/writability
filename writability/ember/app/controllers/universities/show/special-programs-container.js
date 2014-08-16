import Ember from 'ember';
import ChoiceGroupEssayList from 'writability/models/special-program-essay-list';

export default Ember.ArrayController.extend({
	programGroupings: function() {
		var essays = this.get('content'),
			groups = [],
			controller = this;

		essays.forEach(function(essay) {
			var specialProgramId = essay.get('special_program_id');

			if (groups[specialProgramId]) {
				groups[specialProgramId].content.push(essay);
			} else {
				groups[specialProgramId] = ChoiceGroupEssayList.create({
					specialProgram: controller.store.find('special_program', specialProgramId),
					content: [essay]
				});
			}
		});

		return groups.compact();
	}.property('model.length')
});
