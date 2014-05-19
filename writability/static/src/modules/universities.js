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
        var deferred = $.Deferred();
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
        //console.log(existing_app_essay_tmp_ids);

        this.getAllTemplatesForStudent(student)
            .done( function (app_essay_templates) {
                var all_themes = [];
                console.log('all_themes at start: ' + all_themes);
                app_essay_templates.forEach(function (app_essay_template, index) {            // For each AppEssay Template
                    if (existing_app_essay_tmp_ids.indexOf(app_essay_template.id) == -1) {    // If related Essay doesn't exist
                        var item_id = app_essay_template.get('id');

                        // Create App Essay. Setting app_essay during theme_essay creation handles both sides of the relationship
                        if ( existing_app_essay_tmp_ids.indexOf(item_id) == -1 ) {
                            var app_essay_id = that.createAppEssay(student, app_essay_template);
                            existing_app_essay_tmp_ids.push(item_id);
                        }

                        // Create Theme Essays for each app essay template
                        app_essay_template.get('themes').then(function (themes) {       // Each app_ess_tmp hasMany themes
                            var themes_length =  themes.get('length');

                            themes.forEach( function (theme, index) {                   // This theme variable doesn't contain
                                var theme_id = theme.get('id');
                                if ( all_themes.indexOf(theme_id) == -1 ) {             // If themeEssay not yet created
                                    //console.log('theme: ' + theme + 'theme_id: ' + theme_id);  // Collect data before entering these functions
                                    //console.log(all_themes);
                                    //console.log('index_of id: ' + all_themes.indexOf(theme_id));
                                    all_themes.push(theme_id);

                                    theme.get('theme_essay_template')                   // TODO: API call here is horrific
                                        .then(function (theme_essay_template) {         // ERROR: This sometimes gives a NULL error. (theme_id=6)
                                            //console.log('theme essay_template: ' + theme_essay_template);
                                            var theme_essay = that.store.createRecord('theme_essay', {
                                                theme: theme,
                                                application_essays: app_essay_id,    // should be app_essay, not app_essay_template
                                                essay_template: theme_essay_template,// get theme essay template
                                                student: student,
                                                state: "new",                        // AssertionError without
                                                proposed_topics: ["",""]                  // Without this attr, it tries False gives a Bool isn't iterable error
                                            });
                                            theme_essay.save();                      // Create theme_essay

                                            if (index == themes_length - 1) {             // Resolve when complete!
                                                deferred.resolve();
                                            }
                                        })
                                        .catch( function(error) {
                                            console.log(theme_id + ' <- If this is "6" then this is an ember quirk where a .get fails');
                                        });
                                }
                            });
                        });
                    } else {
                        console.log('Skipping creation of duplicate App Essay.');
                    }
                });
            });
        return deferred.promise();

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

            this.store.find('student', 0).then(function (student) {
                student.get('roles').then(function (oldRoles) {
                    student.save().then(function () {
                        //student.get('roles').then(function (newRoles) {
                        //console.log(oldRoles.content.length);
                        //alert();
                        //    console.log(newRoles.content.length);
                        //    alert();
                                that.convertEssays(student)  // Create App & Theme essays from Univs' prompts
                                    .done( function () {
                                        student.set('state', 'active');             // Set student state to active
                                        student.get('roles').then(function (newRoles) {
                                            console.log(newRoles.content.length);
                                            student.save().then(function () {
                                                console.log(newRoles.content.length);
                                                //debugger;
                                                that.transitionToRoute("essays");           // Redirect to Essays page
                                            });
                                        });

                                    })
                                    .fail( function (error) {
                                        console.log(error);
                                    });
                             //   });
                        //});


                    })
                    .catch( function (error) {
                        console.log(error);
                        alert("Sorry! We've encountered an error.");
                    });
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
