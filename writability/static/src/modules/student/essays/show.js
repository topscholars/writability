App.StudentEssaysShowController = Ember.ObjectController.extend({
    currentDraft: function () {
        return this.draftByMostCurrent(0);
    }.property('drafts'),

    recentDraft: Ember.computed.alias('model.drafts.lastObject'),
    draft_ready_for_review: Ember.computed.equal('recentDraft.state', 'submitted'),

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
        },
        splitEssay: function(model) {
            model.set('parent_id', null);
            model.save();
        },
        selectApplicationEssay: function(applicationEssay) {
            var newSelectedEssays = this.get('model.selected_essays').concat([applicationEssay.id]);
            this.set('model.selected_essays', newSelectedEssays);

            var selectApplicationEssayUrl = '/api/theme-essays/' + this.get('model.id') + '/select-application-essay/' + applicationEssay.id;
            var data = {};
            data[applicationEssay.id] = 'selected';

            var selectApplicationEssayPromise = new Ember.RSVP.Promise(function(resolve) {
                Ember.$.ajax({
                    url: selectApplicationEssayUrl,
                    method: 'PUT',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(data)
                }).then(function(data) { console.log(data); resolve(); });
            });
        }
    }
});

App.StudentEssaysShowOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/student/essays/show/_overview"
});

App.StudentEssaysShowApplicationsTab = App.DetailsListView.extend({
    templateName: 'modules/student/essays/show/_details-list',
    name: "Applications",
    summaryText: "Click on an application question to exclusively associate it with this essay. Each question must be associated with a single essay.",
    listItemController: "modules/student/essays/show/_app-item"
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
