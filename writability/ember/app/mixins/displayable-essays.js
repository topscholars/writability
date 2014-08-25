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
	}).property('displayedEssays', 'displayedEssays.length'),

	unmergedEssays: Ember.computed.filter('displayedEssays', function(essay) {
	    return (!essay.get('parent'));
	}).property('displayedEssays', 'displayedEssays.length'),

	studentActionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
	    return (essay.get('nextActionAwaits') === 'student');
	}).property('unmergedEssays', 'unmergedEssays.length'),

	teacherActionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
	    return (essay.get('nextActionAwaits') === 'teacher');
	}).property('unmergedEssays', 'unmergedEssays.length'),

	actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') !== 'completed');
    }),

    actions: {
        toggleHiddenEssays: function() {
            this.set('showHiddenEssays', !this.get('showHiddenEssays'));
        }
    }
});
