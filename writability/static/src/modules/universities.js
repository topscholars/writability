/* globals App, Ember */
App.UniversityItemView = App.ThinListItem.extend({
    templateName: "modules/_universities-list-item",
});


App.UniversityNewItemView = App.ThinNewItem.extend({
    templateName: "modules/_universities-new-item",
});


App.UniversitiesController = Ember.ArrayController.extend({

    // set select for new item
    defaultValueOption: "3",

    universities: function () {
        return this.store.find('university');
    }.property(),

    select: function (ev) {
        var newUniversity = this.get('newUniversity');
        if (newUniversity) {
            this.send('selectedUniversity', this.get('newUniversity'));
            this.set('defaultValueOption', null);
        }
    }.observes("newUniversity"),

    actions: {
        next: function() {
            that = this;

            this.store.find('student', 0)
                .then(function (student) {
                    //Log univ.count //student.get('universities').then(function (univs) { console.log( univs.get('length') ); });
                    student.save()
                        .then(  function () { that.transitionToRoute("essays") })
                        .catch( function () { alert("Sorry! We've encountered an error."); });
                });
        }

        // Transition to /essays   [DONE]
        // 1. save universities    [DONE]
        // 2. convert app_essay_templates into app_essays and save
        // 3. convert ap_es_tmp into theme_es_tmp    
        // 4. convert them_es_tmp into theme_essays   save
    }
});

App.UniversitiesView = App.ListView.extend({
    title: 'Universities',
    listItem: App.UniversityItemView,
    newItem: App.UniversityNewItemView
});
