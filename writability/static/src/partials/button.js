/* globals App, Ember */
App.Button = Ember.View.extend({
    tagName: 'button',
    templateName: 'partials/button',
    text: 'Submit'
});

App.NavButton = App.Button.extend({
    classNames: ['nav-button'],
    attributeBindings: ['disabled'],
});

App.LeftNavButton = App.NavButton.extend({
    classNames: ['left-nav-button'],
    text: function () {
        var buttonText = this.get('controller.backText') || 'Back';
        return '< ' + buttonText;
    }.property(),
    disabled: Ember.computed.alias('controller.backDisabled'),
    click: function (evt) {
        this.get('controller').send('back');
    }
    // IDEA: Accept URL for what back & next should be.
    // Note: classNameBindings: ['isEnabled:enabled:disabled'],  if/then/else
});

App.RightNavButton = App.NavButton.extend({
    classNames: ['right-nav-button'],
    text: function () {
        var buttonText = this.get('controller.nextText') || 'Next';
        return buttonText + ' >';
    }.property(),
    disabled: Ember.computed.alias('controller.nextDisabled'),
    click: function (evt) {
        this.get('controller').send('next');
    }

});
