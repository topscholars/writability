/* globals App, DS */
App.Theme = DS.Model.extend({
    // properties
    name: DS.attr('string'),
    category: DS.attr('string')
});