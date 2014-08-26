import Ember from 'ember';
import EssaySortable from 'writability/mixins/essay-sortable';
import DisplayableEssays from 'writability/mixins/displayable-essays';

export default Ember.ArrayController.extend(EssaySortable, DisplayableEssays, {
    // Ember won't accept an array for sorting by state..
    selectedEssay: null,

    actions: {
        selectEssay: function (model) {
            if (this.selectedEssay !== model) {
                this.set('selectedEssay', model);

                if (model.get('isThemeEssay')) {
                    this.transitionToRoute('theme-essay', model);
                } else if (model.get('essayType') === 'application') {
                    this.transitionToRoute('application-essay', model);
                }
            }
        }
    }
});
