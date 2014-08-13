import Ember from 'ember';

export default Ember.ArrayController.extend({

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

    actions: {
        removeUniversity: function(universitiy) {
            var student = this.get('student');

            student.get('universities').removeObject(universitiy);
            student.save();
        }
    }
});
