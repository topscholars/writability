import Ember from 'ember';
import NavButton from './nav-button';

export default NavButton.extend({
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
