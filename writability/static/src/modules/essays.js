App.EssayItemView = App.ThickListItem.extend({
    templateName: "modules/_essays-list-item",
    didInsertElement: function() {
        this.isSelectedHasChanged();
    },
    isSelectedHasChanged: function() {
        if (this.get('controller.selectedEssay.id') == this.get('context.id')) {
            this.$().addClass('is-selected');
        } else {
            this.$().removeClass('is-selected');
        }
    }.observes('controller.selectedEssay'),
    click: function (ev) {
        console.log(this.get('context'));
        this.get('controller').send('selectEssay', this.get('context'));
    }
});

App.EssaysController = Ember.ArrayController.extend({
    // Ember won't accept an array for sorting by state..
    sortProperties: ['next_action'],
    sortAscending: false,
    selectedEssay: null,

    unmergedEssays: Ember.computed.filter('model', function(essay) {
        return (essay.get('parent_id') == 0);
    }),
    actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') != 'completed');
    }),

    actions: {
        selectEssay: function (model) {
            if (this.selectedEssay !== model) {
                this.set('selectedEssay', model);
                this.transitionToRoute("essay", model.id);
            }
        }
    }
});

App.EssaysView = App.ListView.extend({
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: App.EssayItemView
});
