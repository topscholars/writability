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

    universities: function () {                     // This populates all universities
        return this.store.find('university');
    }.property(),

    universityHasBeenSelected: function () {
        this.set('defaultValueOption', null);
    },

    select: function (ev) {
        var newUniversity = this.get('newUniversity');
        if (newUniversity) {
            this.send('selectedUniversity', this.get('newUniversity'), this);
        }
    }.observes("newUniversity"),

    attachEssays: function() {
        var student = this.get('student');
        var universitiesPromise = student.get('universities');
        var urlForStudent = '/api/students/' + student.id + '/add-universities';

        return essaysAttachPromise = new Promise(function(resolve) {
            universitiesPromise.then(function(universities) {
                Ember.$.ajax({
                    url: urlForStudent,
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        student_id: student.id,
                        universities: universities.getEach('id')
                    })
                }).then(function() { resolve() });
            });
        });
    },

    actions: {
        next: function() {
            var controller = this;
            var student = this.get('student');

            this.attachEssays().then(function() {
                student.set('state', 'active');
                return student.save();
            }).then(function() {
                controller.transitionToRoute('essays');
            });
        }
    }
});

App.UniversitiesView = App.ListView.extend({
    title: 'Universities',
    listItem: App.UniversityItemView,
    newItem: App.UniversityNewItemView
});
