/* globals App, Ember */
App.EssayController = Ember.ObjectController.extend({

    // If we're explicit then Ember binding is simpler.
    proposed_topic_0: function () {
        console.log('PROP 0');
        // var proposed_topics = //TODO bug put an if statement around this
        return this.get('model').get('proposed_topics')[0];
    }.property('proposed_topics'),

    proposed_topic_1: function () {
        console.log('PROP 1');
        return this.get('model').get('proposed_topics')[1];
    }.property('proposed_topics'),

    /**
     * Helper method to cause observer to fire only once.
     */
    _proposed_topics_merged: function () {
        return this.get('proposed_topic_0') + this.get('proposed_topic_1');
    }.property('proposed_topic_0', 'proposed_topic_1'),

    proposedTopicsChanged: function () {
        var newProposedTopics = [
            this.get('proposed_topic_0'),
            this.get('proposed_topic_1')
        ];
        this.get('model').set('proposed_topics', newProposedTopics);
    }.observes('_proposed_topics_merged')
});

App.EssayView = App.DetailsView.extend({
    selectedTab: 'overview',

    tabs: [
        {key: 'overview', title: 'Overview'},
        {key: 'application', title: 'Applications'},
        {key: 'archive', title: 'Archive'},
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

App.EssayOverviewTab = Ember.View.extend({
    name: "Overview",
    templateName: "modules/_essay-details-overview"
});

App.EssayApplicationsTab = Ember.View.extend({
    name: "Applications",
    templateName: "modules/_essay-details-overview"
});

App.EssayArchiveTab = Ember.View.extend({
    name: "Archive",
    templateName: "modules/_essay-details-overview"
});

App.EssayTabs = Ember.ContainerView.extend({
    childViews: ['overview'],
    overview: App.EssayOverviewTab.create(),
    application: App.EssayApplicationsTab.create(),
    archive: App.EssayArchiveTab.create()
});
