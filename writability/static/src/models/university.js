/* globals App, DS */
App.University = DS.Model.extend({
    // properties
    name: DS.attr('string'),
    // logo_url: DS.attr('string'),
    application_essay_templates: DS.hasMany('application_essay_template', {async: true})
});
