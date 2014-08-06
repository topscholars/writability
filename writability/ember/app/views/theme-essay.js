import DetailsView from 'writability/views/-core/details';
import TabsView from './theme-essay/tabs';
import Ember from 'ember';

export default DetailsView.extend({

    tabsViewClass: TabsView,

    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
    ],

    didInsertElement: function () {
        this.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        selectTab: function (tabKey) {
            //TODO: make this cleaner
            this.$('.tab-header').each(function (index, el) {
                var elID = this.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    this.$(el).addClass("is-selected");
                } else {
                    this.$(el).removeClass("is-selected");
                }
            }.bind(this));
            this.get('tabsView').showTab(tabKey);
        }
    }
});
