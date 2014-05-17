/* globals App, DS */
App.EssayTemplate = DS.Model.extend({
    // properties
    due_date: DS.attr('string'),
    essay_prompt: DS.attr('string'),
});

App.ThemeEssayTemplate = App.EssayTemplate.extend({
    audience: DS.attr('string'),
    context: DS.attr('string'),
    theme: DS.belongsTo('theme', {async: true})
});

App.ApplicationEssayTemplate = App.EssayTemplate.extend({
    max_words: DS.attr('string'),
    university: DS.belongsTo('university', {async: true}),
    themes: DS.hasMany('theme', {async: true})
});