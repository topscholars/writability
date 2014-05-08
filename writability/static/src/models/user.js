/* globals App, DS */
App.User = DS.Model.extend({
    // properties
    email: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
});
