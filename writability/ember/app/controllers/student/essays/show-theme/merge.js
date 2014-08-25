import Ember from 'ember';

export default Ember.Controller.extend({
	mergeEssays: function() {
		var parentEssay = this.get('parentEssay');

		return this.get('essays').filter(function(essay) {
			return essay.get('is_displayed') && essay.id !== parentEssay.id;
		});
	}.property('parentEssay', 'essays'),

	reloadMergedEssays: function() {
		var childrenEssay = this.get('parentEssay.merged_theme_essays');
		childrenEssay.forEach(function(essay) {
			essay.reload();
		});
	},

	transitionBack: function() {
		this.transitionToRoute('student.essays.show-theme');
		this.send('closeModal');
	},

	actions: {
		closeModal: function() {
			this.get('parentEssay').reload().then(function() {
				this.transitionToRoute('student.essays.show-theme');
			}.bind(this));

			return true;
		},
		toggleMergeSelected: function(essay) {
			var mergedEssays = this.get('parentEssay.merged_theme_essays');
			var indexOf = mergedEssays.indexOf(essay);

			if (indexOf === -1) {
				mergedEssays.pushObject(essay);
			} else {
				mergedEssays.removeObject(essay);
			}
		},
		mergeEssays: function() {
			var parentEssay = this.get('parentEssay'),
				controller = this;

			parentEssay.save().then(function() {
				controller.reloadMergedEssays();
				controller.transitionBack();
			});
		}
	}
});
