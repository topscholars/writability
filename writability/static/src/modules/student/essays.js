App.StudentEssaysController = Ember.ArrayController.extend({
    needs: ['student'],
    sortProperties: ['due_date', 'next_action'],

    sortFunction: function (a, b) {
        if (a !== null) {
            console.log(a);
        }
        if (a === null) {
            if (b === null) {
                return 0;
            } else {
                return 1;
            }
        } else if (b === null) {
            return -1;
        }

        if (App.isDateSort(a, b)) {
            return App.sortDate(a, b);
        } else {
            return App.sortNextAction(a, b);
        }
    },

    showMergedEssays: false,
    selectedEssay: null,

    student: Ember.computed.alias('controllers.student.model'),
    mergedEssays: function () {
        return this.get('arrangedContent').filter(function(essay) {
            return (essay.get('parent'));
        })
    }.property('@each.parent'),
    unmergedEssays: function () {
        return this.get('arrangedContent').filter(function(essay) {
            return (!essay.get('parent'));
        })
    }.property('@each.parent'),
    actionRequiredEssays: Ember.computed.filter('unmergedEssays', function(essay) {
        return (essay.get('state') != 'completed');
    }),
    actions: {
        selectEssay: function(model, noTransition) {
            this.set('selectedEssay', model);
            if (!noTransition) {
                this.transitionToRoute('student.essays.show', model);
            }
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
