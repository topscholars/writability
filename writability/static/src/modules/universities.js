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

    convertEssays: function (student) {  //pass in?   scope = this
        console.log('convertEssays() called');
        that = this;
        var app_essay_templates;    // ManyArray, universities.all.app_essay_templates
               
        /* Comment for merge
        this.getAllTemplatesForStudent(student)
            .then( function (app_essay_templates) {
                var all_themes = [];
                console.log(' done! templates: '); 
                console.log(app_essay_templates);
                console.log( 'app_essay_templates.toString: ' + app_essay_templates.toString() );
                app_essay_templates.forEach(function (item, index) {  
                    var item_id = item.get('id');  
                    var themes_id_obj_dict = [];


                    // Create App Essay  
                    // Here assumes that setting app_essay during theme_essay creation 
                    // handles both sides of the relationship
                    var app_essay = that.store.createRecord('application_essay', {
                        essay: item_id  // id OR obj  // added via backref above ? //essay_template
                    });
                    app_essay.save();
                    app_essay_id = app_essay.get('id');
                    // Create Theme Essays for each
                    item.get('themes').then(function (themes) {         // Each app_ess_tmp hasMany themes
                        var themes_length =  themes.get('length');

                        themes.forEach( function (theme) {  
                            var theme_id = theme.get('id');   
                            //all_themes.addObject(theme);              // Ember, adds if does not exist.                    //
                            if ( all_themes.indexOf(theme_id) == -1 ) {    // If themeEssay not yet created    
                                all_themes.push(theme_id);
                                themes_id_obj_dict.push({
                                    key:   item_id,
                                    value: theme
                                });
                                var theme_essay = that.store.createRecord('essay', {
                                    essay_template: theme_id,
                                    application_essays: app_essay_id,  // should be app_essay, not app_essay_template
                                    student: student
                                });
                                theme_essay.save();
                                //Create theme_essay from this theme_template with state new.
                            }
                        });
                    });
                });
            });
        */
    },
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
                        deferred.reject(error);
                    });
            });
        });
        return deferred.promise();
    },

    actions: {
        next: function() {
            that = this;

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
