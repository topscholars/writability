/* globals App, DS */
App.Theme = DS.Model.extend({
    // properties
    name: DS.attr('string'),
    category: DS.attr('string'),
    theme_essay_template: DS.belongsTo('theme_essay_template', {async: true})
    // camelCase
});