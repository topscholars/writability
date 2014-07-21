import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.send('openLoading');
    },
    deactivate: function() {
        this.send('closeLoading');
    }
});
