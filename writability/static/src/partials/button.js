/* globals App, Ember */
App.Button = Ember.View.extend({
    tagName: 'button',
    templateName: 'partials/button',
    text: 'Submit'
});

App.LeftNavButton = App.Button.extend({
    classNames: ['nav-button', 'left-nav-button'],
    text: '< Back',
    attributeBindings: ['disabled'],
    disabled: Ember.computed.alias("controller.backDisabled"),

    // IDEA: Accept URL for what back & next should be.
    // Note: classNameBindings: ['isEnabled:enabled:disabled'],  if/then/else
});

App.RightNavButton = App.Button.extend({
    classNames: ['nav-button', 'right-nav-button'],
    text: 'Next >',
    attributeBindings: ['disabled'],
    disabled: Ember.computed.alias("controller.nextDisabled"),
    click: function(evt) {
      this.get('controller').send('next');
    }

});