App.StudentEssaysController = Ember.ArrayController.extend({
    needs: ['student'],
    student: Ember.computed.alias('controllers.student.model'),
    actionRequiredEssays: Ember.computed.filter('model', function(essay) {
        return essay.state != 'completed';
    }),
    actions: {
        select: function() {
            console.log('select essay');
        }
    }
});

App.StudentEssaysHeaderView = Ember.View.extend({
    templateName: 'modules/student/essay'
});

App.StudentEssaysView = App.ListView.extend({
    templateName: 'modules/student/essay-layout',
    //sections: ['To do', 'Not to do'],
    listItem: App.EssayItemView
});
