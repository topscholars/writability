App.StudentEssaysShowMergeView = Ember.View.extend({
	templateName: 'modules/student/essays/show/merge'
});

App.StudentEssaysShowMergeController = Ember.Controller.extend({
	mergeEssays: function() {
		var parentEssay = this.get('parentEssay');

		return this.get('essays').filter(function(essay) {
			return essay.id != parentEssay.id;
		});
	}.property('parentEssay', 'essays'),

	reloadMergedEssays: function() {
		var childrenEssay = this.get('parentEssay.merged_theme_essays');
		childrenEssay.forEach(function(essay) {
			essay.reload();
		});
	},

	transitionBack: function() {
		this.transitionToRoute('student.essays.show');
		this.send('closeModal');
	},

	actions: {
		closeModal: function() {
			this.transitionToRoute('student.essays.show');

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
			this.get('parentEssay').save().then(function() {
				controller.reloadMergedEssays();
				controller.transitionBack();
			});
		}
	}
})
