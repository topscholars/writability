/* globals App, Ember */

App.StudentOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/_student-details-overview"
});

App.StudentApplicationsTab = Ember.View.extend({
    name: "Applications",
    templateName: "modules/_student-details-overview"
});

App.StudentTabs = Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', App.StudentOverviewTab.create());
        this.set('application', App.StudentApplicationsTab.create());
        this.set('childViews', ['overview']);
        this._super();
    }
});

App.StudentView = App.DetailsView.extend({
    selectedTab: 'overview',
    tabView: App.StudentTabs,

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
    ],

    didInsertElement: function () {
        Ember.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        select: function (tabKey) {
            //TODO: make this cleaner
            Ember.$('.tab-header').each(function (index, el) {
                var elID = Ember.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    Ember.$(el).addClass("is-selected");
                } else {
                    Ember.$(el).removeClass("is-selected");
                }
            });
        }
    }
});
