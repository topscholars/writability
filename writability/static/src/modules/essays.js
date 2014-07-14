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
        this.get('controller').send('selectEssay', this.get('context'));
    }
});

App.EssaysController = Ember.ArrayController.extend(App.EssaySortable, {
    // Ember won't accept an array for sorting by state..
    sortProperties: ['next_action'],
    sortAscending: false,
    selectedEssay: null,

    unmergedEssays: Ember.computed.filter('model', function(essay) {
        return (!essay.get('parent'));
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

App.EssaysListView = Ember.View.extend({
    templateName: 'modules/essays/list',
    // templateName: 'modules/student/essays/list',
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: App.EssayItemView
});

App.EssaysView = App.ListView.extend({
    templateName: 'modules/essays/layout'
});
