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

	actions: {
		closeModal: function() {
			this.transitionToRoute('student.essays.show');

			return true;
		},
		toggleMergeSelected: function(essay) {
			var mergedEssays = this.get('parentEssay.merged_theme_essays');
			// Strange but needed to fire listener events for now...
			this.set('parentEssay.merged_theme_essays', mergedEssays.concat([essay.id]));
		}
	}
})
