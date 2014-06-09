App.StudentEssaysController = Ember.ArrayController.extend({
    needs: ['student'],
    itemController: 'student.essay.item',
    student: Ember.computed.alias('controllers.student.model'),
    actionRequiredEssays: Ember.computed.filter('model', function(essay) {
        return essay.state != 'completed';
    }),
    actions: {
        // select: function() {
        //     console.log('select essay');
        // }
    }
});

App.StudentEssayItemController = Ember.ObjectController.extend({
    isSelected: (function () {
        var selectedEssay = this.get('controllers.studentEssays.selectedEssay');
        return selectedEssay === this.get('model');
    }).property('controllers.studentEssays.selectedEssay'),

    needs: ['studentEssays'],

    actions: {
        select: function () {
            var model = this.get('model');
            this.get('controllers.studentEssays').send('selectEssay', model);
        }
    },
});

App.StudentEssaysHeaderView = Ember.View.extend({
    templateName: 'modules/student/essay'
});

App.StudentEssayItemView = App.ThickListItem.extend({
    templateName: "modules/_essays-list-item",
    click: function (ev) {
        this.get('controller').send('select');
    },
});

App.StudentEssaysListView = Ember.View.extend({
    templateName: 'modules/student/list',
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
