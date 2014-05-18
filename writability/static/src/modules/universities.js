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

    select: function (ev) {
        var newUniversity = this.get('newUniversity');
        if (newUniversity) {
            this.send('selectedUniversity', this.get('newUniversity'));
            this.set('defaultValueOption', null);
        }
    }.observes("newUniversity"),

    convertEssays: function (student) {  //pass in?   scope = this
        console.log('convertEssays() called');
        var that = this;
        var app_essay_templates;    // ManyArray, universities.all.app_essay_templates

        // This checks for existing AppEssays and prevents dupes based on the linked AppEssTemplate ID
        // Other parts of the application could still create dupes.
        var existing_app_essay_tmp_ids = [];
        student.get('application_essays')
            .then( function (app_essays) {
                app_essays.forEach( function (app_essay) {
                    existing_app_essay_tmp_ids.push(app_essay.essay_template.id);
                });
            });


        this.getAllTemplatesForStudent(student)
            .then( function (app_essay_templates) {
                var all_themes = [];
                console.log(' done! templates: '); 
                console.log(app_essay_templates);
                console.log( 'app_essay_templates.toString: ' + app_essay_templates.toString() );
                app_essay_templates.forEach(function (item, index) {            // For each AppEssay Template

                    if (existing_app_essay_tmp_ids.indexOf(item.id) == -1) {    // If related Essay doesn't exist
                        var item_id = item.get('id');  
                        var themes_id_obj_dict = [];

                        // Create App Essay  
                        // Setting app_essay during theme_essay creation handles both sides of the relationship
                        var app_essay_id = that.createAppEssay(student, item);

                        // Create Theme Essays for each app essay template
                        item.get('themes').then(function (themes) {             // Each app_ess_tmp hasMany themes
                            var themes_length =  themes.get('length');

                            themes.forEach( function (theme) {  
                                var theme_id = theme.get('id');   
                                //all_themes.addObject(theme);                  // Ember, adds if does not exist.                    //
                                if ( all_themes.indexOf(theme_id) == -1 ) {     // If themeEssay not yet created    
                                    all_themes.push(theme_id);

                                    var theme_essay = that.store.createRecord('theme_essay', {
                                        theme: theme,
                                        application_essays: app_essay_id,    // should be app_essay, not app_essay_template
                                        student: student
                                    });
                                    theme_essay.save();                      // Create theme_essay
                                }
                            });
                        });
                    } else {
                        console.log('Skipping creation of duplicate App Essay.');
                    }
                });
            });
    },
    createAppEssay: function (student, item) {
        var app_essay = this.store.createRecord('application_essay', {
                            student: student,
                            essay_template: item    // Requires object, not ID.  backref creates other other model's relation.
                        });
        app_essay.save();
        return app_essay.get('id');                 // Return ID
    },
    // Move to model
    // app_essay_templates are always unique. May 14, 2014
    getAllTemplatesForStudent: function (student) {
        var deferred = jQuery.Deferred();
        var essays_list = [];
        var last_univ = false;
        student.get('universities').then(function (univs) {    
            var univs_count = univs.get('length');
            console.log('univs count: ' + univs_count );
            
            // Outside all loops
            univs.forEach(function (item, index, enumerable) {            // For each Univ  
                last_univ = (index == univs_count - 1) ? true : false ;   // end of univ loop?
                item.get('application_essay_templates')                   // Get app templates
                    .then( function (app_essay_templates) {               // for each template
                        app_ess_tmps_length = app_essay_templates.get('length');
                        app_essay_templates.forEach(function (item, index) {
                            var last_essay = (index == app_ess_tmps_length - 1) ? true : false ;
                            essays_list.push(item);                     // Add essays
                            if (last_univ && last_essay) {              // Return after all univs/essays are looped
                                deferred.resolve(essays_list);
                            }
                        });
                    })
                    .catch( function (error) { 
                        console.log('Error in univs.forEach loop.'); 
                        console.log(error);
                        deferred.reject(error);
                    });
            });
        });
        return deferred.promise();
    },

    actions: {
        next: function() {
            var that = this;

            this.store.find('student', 0)
                .then(function (student) {
                    student.save()
                        .then(  function () { 
                            that.convertEssays(student);
                            //that.transitionToRoute("essays") 
                        })
                        .catch( function (error) { 
                            console.log(error);
                            alert("Sorry! We've encountered an error."); 
                        });
                });
        }
    }
});

App.UniversitiesView = App.ListView.extend({
    title: 'Universities',
    listItem: App.UniversityItemView,
    newItem: App.UniversityNewItemView
});
