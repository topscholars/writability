import NavButton from './nav-button';
import Ember from 'ember';

export default NavButton.extend({
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
