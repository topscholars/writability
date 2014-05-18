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
                    // all themes from stud.univ.themes, no dupes,
            
        //var student_theme_essays = student.get('theme_ess')..
        // university.application_essay_templates
        // student.themeEssays   (student subclasses User) //was student.essays

        var app_essay_templates = that.getAllTemplatesForStudent(student);
        console.log(app_essay_templates.toString());

        app_essay_templates.forEach(function (item, index) {  
            var item_id = item.get('id');  
            var themes_id_obj_dict = [];
            // Create Theme Essays for each
            item.get('themes').then(function (themes) {         // Each app_ess_tmp hasMany themes
                // 
                themes.forEach( function (theme) {     
                    //all_themes.addObject(theme);              // Ember, adds if does not exist.                    //
                    if ( all_themes.indexOf(theme) == -1 ) {    // If themeEssay not yet created    
                        var theme_id = theme.get('id');
                        //all_themes.push(theme_id);
                        themes_id_obj_dict.push({
                            key:   item_id,
                            value: theme
                        });

                        var theme_essay = that.store.createRecord('essay', {
                            essay_template: theme_id,
                            application_essays: item_id,
                            student: student
                        });
                        theme_essay.save();
                        //App.ThemeEssay.Create({
                        //})
                        //Create theme_essay from this theme_template with state new.

                        // ThemeEssay states: ["new", "added_topics", "in_progress", "completed"]
                    }
                });
            });
            // Create App Essay
            var app_essay = that.store.createRecord('application_essay', {
                essay_template: item_id
                // theme_essays: id OR obj  // added via backref above ?
            });
            app_essay.save();
        });

        // grab theme from dict array 
        ///////======== Create application record 
        //////////-====== check everything went well

        // Why create both ThemeEssayTemplates and ThemeEssay??
        // ----- A themeEssay can include multiple TETs, or multiple TEs

        // create theme essays
        // go back to themes 
        // 1to1 beween themes and theme_essays

        
        // 2. convert app_essay_templates into app_essays and save
        ///////   app_essay_templates are on the univ, app_essays are on student
        // 3. convert app_es_tmp into theme_es_tmp
        /////// theme
        // 4. convert theme_es_tmp into theme_essays   save
        /////// each theme_essay also needs associated app_essays  . 
    },
    getAllTemplatesForStudent: function (student) {
        var essays_list = [];
        student.get('universities')
            .then(function (univs) {                 
                univs.forEach(function (item, index, enumerable) {          // For each Univ
                    console.log(univs.get('length'));
                    item.get('application_essay_templates')                 // Get app templates
                        .then( function (app_essay_templates) {             // for each template
                            console.log(app_essay_templates.get('length'));   // Returning 0..
                            app_essay_templates.forEach(function (item, index) {
                                // app_essay_templates are always unique. May 14, 2014
                                essays_list.push(item);                     // Add template/prompt
                            });
                        })
                        .catch( function (error) { 
                            console.log('Error in univs.forEach loop.'); });
                });
            });
        return essays_list;  // Should return array of whatver objects ManyArray holds
    },

    actions: {
        next: function() {
            that = this;

            this.store.find('student', 0)
                .then(function (student) {
                    //Log univ.count //student.get('universities').then(function (univs) { console.log( univs.get('length') ); });
                    student.save()
                        .then(  function () { 
                            that.convertEssays(student);
                            //that.transitionToRoute("essays") 
                        })
                        .catch( function (error) { 
                            console.log(error);
                            alert("Sorry! We've encountered an error."); });
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
