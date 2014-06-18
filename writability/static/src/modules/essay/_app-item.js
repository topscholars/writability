App.ModulesEssayAppItemController = Ember.ObjectController.extend({
    needs: ['essay'],
    selected: function() {
        var selectedEssay = this.get('controllers.essay.selected_application_essay');

        return selectedEssay == this.get('model.id');
    }.property('controllers.essay.selected_application_essay', 'model'),

    actions: {
        select: function() {
            this.send('selectApplicationEssay', this.get('model'));
        }
    }
});
