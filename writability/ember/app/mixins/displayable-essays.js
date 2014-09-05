import Ember from 'ember';

export default Ember.Mixin.create({
    showHiddenEssays: false,

	displayedEssays: Ember.computed.filter('arrangedContent', function(essay) {
	    return (essay.get('is_displayed'));
	}).property('arrangedContent', 'arrangedContent.length'),

	notDisplayedEssays: Ember.computed.filter('arrangedContent', function(essay) {
	    return (!essay.get('is_displayed'));
	}).property('arrangedContent', 'arrangedContent.length'),

	mergedEssays: Ember.computed.filter('displayedEssays', function(essay) {
	    return (essay.get('parent'));
	}).property('displayedEssays', 'displayedEssays.length', 'displayedEssays.@each.parent'),

	unmergedEssays: Ember.computed.filter('displayedEssays', function(essay) {
	    return (!essay.get('parent'));
	}).property('displayedEssays', 'displayedEssays.length', 'displayedEssays.@each.parent'),

	studentActionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
	    return (essay.get('nextActionAwaits') === 'student');
	}).property('unmergedEssays', 'unmergedEssays.length', 'unmergedEssays.@each.nextActionAwaits', 'unmergedEssays.@each.next_action', 'unmergedEssays.@each.state'),

	teacherActionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
	    return (essay.get('nextActionAwaits') === 'teacher');
	}).property('unmergedEssays', 'unmergedEssays.length', 'unmergedEssays.@each.nextActionAwaits', 'unmergedEssays.@each.next_action', 'unmergedEssays.@each.state'),

	actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') !== 'completed');
    }),

    actions: {
        toggleHiddenEssays: function() {
            this.toggleProperty('showHiddenEssays');
        }
    }
});
