App.StudentEssaysShowController = Ember.ObjectController.extend({
    approveAndSelectTopic: function(model, approvedTopicField) {
        model.set('state', 'in_progress');
        model.set('topic', model.get(approvedTopicField));
        model.save();
    },
    actions: {
        approveProposedTopic: function(model, approvedTopicField) {
            if (confirm('Are you sure you want to approve these topics?')) {
                this.approveAndSelectTopic(model, approvedTopicField);
            }
        },
        update: function(model) {
            if (confirm('Are you sure you want to save these topics?')) {
                model.save();
            }
        },
        mergeEssay: function(model) {
            this.transitionToRoute('student.essays.show.merge');
        }
    }
});

App.StudentEssaysShowOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/student/essays/show/_overview"
});

App.StudentEssaysShowApplicationsTab = App.DetailsListView.extend({
    name: "Applications",
    summaryText: "Click on an application question to exclusively associate it with this essay. Each question must be associated with a single essay.",
    listItemPartial: "modules/_essay-app-tab-list-item"
});

App.StudentEssaysShowTabs = Ember.ContainerView.extend({
    /**
     * Create the child views in init so they are recreated on a later
     * transition.
     */
    init: function () {
        this.set('overview', App.StudentEssaysShowOverviewTab.create());
        this.set('application', App.StudentEssaysShowApplicationsTab.create());
        this.set('childViews', ['overview']);
        this._super();
    },

    showTab: function (tabKey) {
        this.popObject();
        this.pushObject(this.get(tabKey));
    }
});

App.StudentEssaysShowView = App.DetailsView.extend({

    tabsViewClass: App.StudentEssaysShowTabs,

    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
    ],

    didInsertElement: function () {
        Ember.$('#tab-' + this.selectedTab).addClass('is-selected');
    },

    actions: {
        selectTab: function (tabKey) {
            //TODO: make this cleaner
            Ember.$('.tab-header').each(function (index, el) {
                var elID = Ember.$(el).attr('id');
                if (elID === ("tab-" + tabKey)) {
                    Ember.$(el).addClass("is-selected");
                } else {
                    Ember.$(el).removeClass("is-selected");
                }
            });
            this.get('tabsView').showTab(tabKey);
        }
    }
});
