App.ModulesEssayAppItemController = Ember.ObjectController.extend({
    essayController: 'controllers.essay',
    needs: ['essay'],
    selected: function() {
        var selectedEssay = this.get('controllers.essay.selected_essays');

        return selectedEssay.indexOf(this.get('model.id')) != -1;
    }.property('controllers.essay.selected_essays', 'model'),

    actions: {
        select: function() {
            this.send('selectApplicationEssay', this.get('model'));
        }
    }
});
