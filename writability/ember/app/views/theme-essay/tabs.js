import Ember from 'ember';
import OverviewTabView from './overview';
import ApplicationTabView from './application';

export default Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', OverviewTabView.create());
        this.set('application', ApplicationTabView.create());
        this.set('childViews', ['overview']);
        this._super();
    },

    showTab: function (tabKey) {
        this.popObject();
        this.pushObject(this.get(tabKey));
    }
});
