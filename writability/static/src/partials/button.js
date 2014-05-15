/* globals App, Ember */
App.Button = Ember.View.extend({
    tagName: 'button',
    templateName: 'partials/button',
    text: 'Submit'
});

App.NavButton = App.Button.extend({
    classNames: ['nav-button'],
    text: 'Next'
});
