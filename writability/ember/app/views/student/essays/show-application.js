import DetailsView from 'writability/views/-core/details';
import StudentEssaysShowTabsView from './show-application/tabs';

export default DetailsView.extend({

    tabsViewClass: StudentEssaysShowTabsView,

    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'}
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
