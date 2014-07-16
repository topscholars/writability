import DetailsView from 'writability/views/-core/details';
import StudentTabView from './student/tab';

export default DetailsView.extend({
    selectedTab: 'overview',
    tabsViewClass: StudentTabView,

    tabs: [
        {key: 'overview', title: 'Overview'},
    ],

    didInsertElement: function () {
        this.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        select: function (tabKey) {
            //TODO: make this cleaner
            this.$('.tab-header').each(function (index, el) {
                var elID = this.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    this.$(el).addClass("is-selected");
                } else {
                    this.$(el).removeClass("is-selected");
                }
            }.bind(this));
        }
    }
});
