App.StudentEssaysController = Ember.ArrayController.extend({
    needs: ['student'],
    sortProperties: ['next_action'],
    sortAscending: false,

    showMergedEssays: false,
    selectedEssay: null,

    student: Ember.computed.alias('controllers.student.model'),
    mergedEssays: Ember.computed.filter('model', function(essay) {
        return (essay.get('parent_id') != 0);
    }),
    unmergedEssays: Ember.computed.filter('model', function(essay) {
        return (essay.get('parent_id') == 0);
    }),
    actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') != 'completed');
    }),
    actions: {
        selectEssay: function(model) {
            this.set('selectedEssay', model);
            this.transitionToRoute('student.essays.show', model);
        },
        toggleMergedEssays: function() {
            this.set('showMergedEssays', !this.get('showMergedEssays'));
        }
    }
});

App.StudentEssaysHeaderView = Ember.View.extend({
    templateName: 'modules/student/essay'
});

App.StudentEssayItemView = App.ThickListItem.extend({
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

App.StudentEssaysListView = Ember.View.extend({
    templateName: 'modules/student/essays/list',
    title: null,
    //sections: [],
    listItem: "",
    //elementId: "list-module",  // No id, could have multiple on page.
    tagName: "section",
    listItem: App.StudentEssayItemView
});

App.StudentEssaysView = App.ListView.extend({
    templateName: 'modules/student/essay-layout',
    //sections: ['To do', 'Not to do'],
});
