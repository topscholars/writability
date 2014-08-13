import Ember from 'ember';
import EssaySortable from 'writability/mixins/essay-sortable';

export default Ember.ArrayController.extend(EssaySortable, {
    needs: ['student'],

    showMergedEssays: false,
    selectedEssay: null,

    student: Ember.computed.alias('controllers.student.model'),

    displayedEssays: Ember.computed.filter('arrangedContent', function(essay) {
        return (essay.get('is_displayed'));
    }).property('arrangedContent', 'arrangedContent.length'),

    mergedEssays: function () {
        return this.get('displayedEssays').filter(function(essay) {
            return (essay.get('parent'));
        });
    }.property('displayedEssays.@each.parent'),

    unmergedEssays: function () {
        return this.get('displayedEssays').filter(function(essay) {
            return (!essay.get('parent'));
        });
    }.property('displayedEssays.@each.parent'),

    studentActionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('nextActionAwaits') === 'student');
    }),

    teacherActionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('nextActionAwaits') === 'teacher');
    }),

    actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') !== 'completed');
    }),

    actions: {
        selectEssay: function(model, noTransition) {
            this.set('selectedEssay', model);
            if (!noTransition) {
                if (model.get('isThemeEssay')) {
                    this.transitionToRoute('student.essays.show-theme', model);
                } else if (model.get('essayType') === 'application') {
                    this.transitionToRoute('student.essays.show-application', model);
                }
            }
        },
        toggleMergedEssays: function() {
            this.set('showMergedEssays', !this.get('showMergedEssays'));
        }
    }
});
