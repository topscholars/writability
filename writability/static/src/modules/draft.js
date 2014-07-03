/* globals Ember, App */

App.DraftController = Ember.ObjectController.extend({
    saveDraft: function() {
        var draft = this.get('model');
        if (draft.get('isDirty')) {
            draft.save().then(this.onSuccess, this.onFailure);
        }
    },

    formattedTextObserver: function () {
        Ember.run.debounce(this, this.saveDraft, 10000);
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

    needs: ['essay', 'themeEssay'],

    reviewMode: false,

    currentReview: null,

    getCurrentReview: function () {
        var essay = this.get('essay');
        var essayController = this.get('controllers.themeEssay').set('model', essay);
        essayController.currentReviewWithState('completed')
            .then(function (review) {
                this.set('currentReview', review);
            }.bind(this));
    }.observes('essay'),

    onNewDraftOpened: function () {
        var draft = this.get('model');
        if (draft.get('state') === 'new') {
            draft.set('state', 'in_progress');
            draft.save();
        }
    }.observes('model'),

    refreshAndTransitionEssay: function (draft) {
        var controller = this,
            essay = draft.get('essay');

        essay.reload().then(function () {
            controller.transitionToRoute('essay', essay);
        });
    },

    actions: {
        /**
         * Respond to next by submitting draft.
         */
        next: function () {
            if (confirm('Are you sure you want to submit this draft?')) {
                var draft = this.get('model');
                draft.set('state', 'submitted');

                // Save draft
                draft.save().then(
                    this.refreshAndTransitionEssay.bind(this)
                );
            }
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

    annotationSelector: null,
    newAnnotation: null,
    annotations: [],

    tags: function() {
        return this.store.find('tag');
    }.property(),

    formattedTextObserver: function () {
        console.log(this.get('formatted_text').indexOf('id="annotation-in-progress"'));
        if (this.get('formatted_text').indexOf('id="annotation-in-progress"') > -1) {
            this.send('createNewAnnotation');
        } else {
            this._super();
        }
    }.observes('formatted_text'),

    reviewMode: true,

    _onReviewChange: function () {
        if (this.get('review.isDirty')) {
            this.get('review').then(function (review) {
                review.save();
            });
        }
    }.observes('review.text'),

    actions: {

        next: function () {
            var draft = this.get('model');
            draft.get('review')
                .then(function (review) {
                    review.set('state', 'completed');
                    // Save draft
                    return review.save();
                })
                .then(function (savedReview) {
                    var essay_id = draft._data.essay.id;
                    // Transition to essays page
                    // TODO: convert this to essays once it's complete
                    this.transitionToRoute('students');
                }.bind(this));
        },

        back: function () {
            // make sure the review is saved.
            var draft = this.get('model');
            draft.get('review')
                .then(function (review) {
                    return review.save();
                })
                .then(function (savedReview) {
                    var essay_id = draft._data.essay.id;
                    // Transition to essays page
                    // TODO: convert this to essays once it's complete
                    this.transitionToRoute('students');
                }.bind(this));
        },

        createNewAnnotation: function () {
            this.get('review').then(function (review) {
                var newAnnotationSpan = $('#annotation-in-progress');

                var annotationText = newAnnotationSpan.html(),
                    annotationOffset = newAnnotationSpan.offset(),
                    newAnnotation = this.store.createRecord('annotation', {
                        original: annotationText,
                        review: review
                    });

                var newDomAnnotation = App.DomAnnotation.create({
                    offset: annotationOffset,
                    annotation: newAnnotation
                });

                this.set('newAnnotation', newDomAnnotation);
                this.set('annotationSelector', newAnnotationSpan);
            }.bind(this));
        },

        hasSavedAnnotation: function(annotation) {
            var newFormattedText = this.get('formatted_text').replace('annotation-in-progress', 'annotation-' + annotation.id);

            this.set('formatted_text', newFormattedText);
            this.set('newAnnotation', null);
        }
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
