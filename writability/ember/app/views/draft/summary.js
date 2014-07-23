import Ember from 'ember';
import DraftDetails from './summary/details';
import DraftReview from './summary/review';
import DraftSettings from './summary/settings';

export default Ember.ContainerView.extend({
    classNames: ['summary-panel'],

    activePanel: null,

    init: function () {
        this.set('details', DraftDetails.create());
        this.set('review', DraftReview.create());
        this.set('settings', DraftSettings.create());
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
