import Ember from 'ember';
import ChoiceGroupEssayList from 'writability/models/choice-group-essay-list';

export default Ember.ArrayController.extend({
	choiceGroupings: function() {
		var essays = this.get('content'),
			groups = [],
			controller = this;

		essays.forEach(function(essay) {
			var choiceGroupId = essay.get('choice_group_id');

			if (groups[choiceGroupId]) {
				groups[choiceGroupId].content.push(essay);
			} else {
				groups[choiceGroupId] = ChoiceGroupEssayList.create({
					choiceGroup: controller.store.find('choice-group', choiceGroupId),
					content: [essay]
				});
			}
		});

		return groups.compact();
	}.property('model.length')
});
