import Ember from 'ember';
import EssaySortable from 'writability/mixins/essay-sortable';

export default Ember.ArrayController.extend(EssaySortable, {
    // Ember won't accept an array for sorting by state..
    selectedEssay: null,

    unmergedEssays: Ember.computed.filter('arrangedContent', function(essay) {
        console.log('computed');
        return (!essay.get('parent'));
    }).property('arrangedContent', 'arrangedContent.length'),

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
