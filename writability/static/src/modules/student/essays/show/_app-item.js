App.ModulesStudentEssaysShowAppItemController = Ember.ObjectController.extend({
    essayController: 'controllers.studentEssaysShow',
    needs: ['studentEssaysShow'],
    selected: function() {
        var selectedEssays = this.get('controllers.studentEssaysShow.selected_essays');

        if (selectedEssays) {
            return selectedEssays.indexOf(this.get('model.id')) != -1;
        }
    }.property('controllers.studentEssaysShow.selected_essays', 'model'),

    actions: {
        select: function() {
            this.send('selectApplicationEssay', this.get('model'));
        }
    }
});
