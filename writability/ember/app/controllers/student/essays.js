import Ember from 'ember';
import EssaySortable from 'writability/mixins/essay-sortable';
import DisplayableEssays from 'writability/mixins/displayable-essays';

export default Ember.ArrayController.extend(EssaySortable, DisplayableEssays, {
    needs: ['student'],

    selectedEssay: null,

    student: Ember.computed.alias('controllers.student.model'),

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
        }
    }
});
