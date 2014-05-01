/* App.DraftController = Ember.ObjectController.extend({
    // Is this function necessary?
    essay: function () {
        return this.get('model').get('essay');
    }.property('model.essay')
}); */


App.DraftView = App.EditorView.extend({
    templateName: 'modules/draft'
});
