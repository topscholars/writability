import Ember from 'ember';

export default Ember.ContainerView.extend({
    classNames: ['summary-panel'],

    activePanel: null,

    init: function () {
        this.set('details', Ember.View.create({
            templateName: "modules/_draft-details-panel"
        }));
        this.set('review', Ember.View.create({
            templateName: "modules/_draft-review-panel"
        }));
        this.set('settings', Ember.View.create({
            templateName: "modules/draft/_settings-panel"
        }));
        this.set('childViews', []);
        this._super();
    },

    show: function (panelKey) {
        this.activePanel = panelKey;
        this.pushObject(this.get(panelKey));
        this.$().parent().css('visibility', 'visible');
    },

    hide: function () {
        this.activePanel = null;
        this.$().parent().css('visibility', 'hidden');
        this.popObject();
    }
});
