/* globals Ember, App */

App.DraftController = Ember.ObjectController.extend({

    formattedTextObserver: function () {
        var draft = this.get('model');
        if (draft.get('isDirty')) {
            draft.save().then(this.onSuccess, this.onFailure);
        }
    }.observes('formatted_text'),

    onSuccess: function () {
        console.log("Saved draft to server.");
    },

    onFailure: function () {
        console.log("Failure to sync draft to server.");
    },

    actions: {
        /**
         * When the user started writing make sure the server is in sync.
         */
        startedWriting: function (cb) {
            var draft = this.get('model');
            draft.reload().then(cb, this.onFailure);
        },
    }
});


App.StudentDraftController = App.DraftController.extend({

    reviewMode: false,

    actions: {
        /**
         * Respond to next by submitting draft.
         */
        next: function () {
            // TODO XXX: Add modal confirmation dialog with callbacks.
            // Change draft state to "submitted"
            var draft = this.get('model');
            draft.set('state', 'submitted');
            // Save draft
            draft.save().then(function (draft) {
                var essay_id = draft._data.essay.id;
                // Transition to essays page
                this.transitionToRoute('essay', essay_id);
            }.bind(this));
        },

        back: function () {
            // make sure the draft is saved.
            var draft = this.get('model');
            draft.save().then(function (draft) {
                var essay_id = draft._data.essay.id;
                // Transition to essays page
                this.transitionToRoute('essay', essay_id);
            }.bind(this));
        }
    }
});


App.TeacherDraftController = App.DraftController.extend({

    reviewMode: true,

    actions: {

        next: function () {
            console.log('todo teacher next');
        },

        back: function () {
            console.log('todo teacher back');
        },
    }
});


App.DraftView = App.EditorView.extend({
    templateName: 'modules/draft',

    toggleSelector: '.panel-toggle',

    actions: {
        /*
         * Clicking the Details / Review button toggles the current displayed
         * item.
         */
        togglePanel: function (panelKey) {
            var summaryPanel = this.get('summaryPanel');
            var activePanel = summaryPanel.get('activePanel');

            if (panelKey === activePanel) {
                Ember.$('.' + panelKey + this.toggleSelector).removeClass('active');
                summaryPanel.hide();
            } else {
                if (activePanel) {
                    Ember.$('.' + activePanel + this.toggleSelector).removeClass('active');
                    summaryPanel.hide();
                }
                Ember.$('.' + panelKey + this.toggleSelector).addClass('active');
                summaryPanel.show(panelKey);
            }
        }
    }
});

App.SummaryPanel = Ember.ContainerView.extend({
    classNames: ['summary-panel'],

    activePanel: null,

    init: function () {
        this.set('details', Ember.View.create({
            templateName: "modules/_draft-details-panel"
        }));
        this.set('review', Ember.View.create({
            templateName: "modules/_draft-review-panel"
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
