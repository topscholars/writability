App.StudentEssaysController = Ember.ArrayController.extend({
    needs: ['student'],
    itemController: 'student.essay.item',
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

App.StudentEssayItemController = Ember.ObjectController.extend({
    needs: ['studentEssays'],

    isSelected: (function () {
        var selectedEssay = this.get('controllers.studentEssays.selectedEssay');
        return selectedEssay === this.get('model');
    }).property('controllers.studentEssays.selectedEssay'),

    actions: {
        select: function (transition) {
            var model = this.get('model');
            this.send('selectEssay', model);
        }
    },
});

App.StudentEssaysHeaderView = Ember.View.extend({
    templateName: 'modules/student/essay'
});

App.StudentEssayItemView = App.ThickListItem.extend({
    isSelectedHasChanged: function() {
        if (this.get('controller.selectedEssay.id') == this.get('context.id')) {
            this.$().addClass('is-selected');
        }
    }.observes('controller.selectedEssay'),

    templateName: "modules/_essays-list-item",
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
