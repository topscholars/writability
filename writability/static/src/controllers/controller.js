App.EssaysController = Ember.ArrayController.extend({
    itemController: 'essay',

    selectedEssay: null,

    actions: {
        selectEssay: function (essay) {
            this.set('selectedEssay', essay);
        }
    }
});


App.EssayController = Ember.ObjectController.extend({
    isSelected: (function () {
        var selectedEssay = this.get('controllers.essays.selectedEssay');
        return selectedEssay === this.get('model');
    }).property('controllers.essays.selectedEssay'),

    needs: ['essays'],

    actions: {
        select: function () {
            var model = this.get('model');
            this.get('controllers.essays').send('selectEssay', model);
        }
    },
});
