/* globals App, Ember */
App.EssayItemController = Ember.ObjectController.extend({
    isSelected: (function () {
        var selectedEssay = this.get('controllers.essays.selectedEssay');
        return selectedEssay === this.get('model');
    }).property('controllers.essays.selectedEssay'),

    needs: ['essays'],

    themeNameBinding: 'theme.name',
    themeCategoryBinding: 'theme.category',

    actions: {
        select: function () {
            var model = this.get('model');
            this.get('controllers.essays').send('selectEssay', model);
        }
    },
});

App.EssayItemView = App.ThickListItem.extend({
    templateName: "modules/_essays-list-item",
    click: function (ev) {
        this.get('controller').send('select');
    },
});

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
    listItem: App.EssayItemView
});
