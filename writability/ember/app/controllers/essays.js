import Ember from 'ember';
import EssaySortable from 'writability/mixins/essay-sortable';

export default Ember.ArrayController.extend(EssaySortable, {
    // Ember won't accept an array for sorting by state..
    selectedEssay: null,

    displayedEssays: Ember.computed.filter('arrangedContent', function(essay) {
        return (essay.get('is_displayed'));
    }).property('arrangedContent', 'arrangedContent.length'),

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
        selectEssay: function (model) {
            if (this.selectedEssay !== model) {
                this.set('selectedEssay', model);
                this.transitionToRoute('essay', model.id);
            }
        }
    }
});
