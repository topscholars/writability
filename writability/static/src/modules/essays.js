/* globals App, Ember */
App.EssaysController = Ember.ArrayController.extend({
    itemController: 'essay.item',

    selectedEssay: null,

    actions: {
        selectEssay: function (model) {
            if (this.selectedEssay !== model) {
                this.transitionToRoute("essay", model.id);
                this.set('selectedEssay', model);
            }
        }
    }
});

App.EssaysView = App.ListView.extend({
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: "modules/_essays-list-item"
});

App.EssayItemController = Ember.ObjectController.extend({
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
