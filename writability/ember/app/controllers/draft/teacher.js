import Ember from 'ember';
import DraftController from 'writability/controllers/draft';
import DomAnnotation from 'writability/models/dom-annotation';
import { autosaveTimout } from 'writability/config';

export default DraftController.extend({

    isTeacher: true,
    annotationSelector: null,
    newAnnotation: null,
    // Page displays blank anno's when this is used.
    //annotations: Ember.computed.alias('review.annotations'),

    tags: function() {
        return this.store.find('tag');
    }.property(),

    formattedTextObserver: function () {
        if (this.get('formatted_text').indexOf('id="annotation-in-progress"') > -1) {
            this.send('createNewAnnotation');
        } else {
            this._super();
        }
    }.observes('formatted_text'),

    reviewMode: true,

    saveReview: function () {
        this.get('review').then(function (review) {
            review.save();
        });
    },

    _onReviewChange: function () {
        if (this.get('review.isDirty')) {
            Ember.run.debounce(this, this.saveReview, autosaveTimout, true);
        }
    }.observes('review.text'),

    actions: {

        next: function () {
            var draft = this.get('model');

            this.updateEssayDueDate().then(function() {
                draft.get('review')
                    .then(function (review) {
                        review.set('state', 'completed');
                        // Save draft
                        return review.save();
                    })
                    .then(function (savedReview) {
                        var essay_id = draft._data.essay.id;
                        this.transitionToRoute('students');
                    }.bind(this));
            }.bind(this));
        },

        back: function () {
            // make sure the review is saved.
            var draft = this.get('model'),
                controller = this;

            draft.get('review')
                .then(function (review) {
                    return review.save();
                })
                .then(function (savedReview) {
                    var essay_id = draft.get('essay.id'),
                        student_id = controller.get('student.id');

                    controller.transitionToRoute('student.essays.show', student_id, essay_id);
                });
        },

        createNewAnnotation: function () {
            var existingNewAnnotation = this.get('newAnnotation');

            if (existingNewAnnotation) {
                existingNewAnnotation.get('annotation').destroyRecord();
                existingNewAnnotation.destroy();
            }

            this.get('review').then(function (review) {
                var newAnnotationSpan = $('#annotation-in-progress');

                var annotationText = newAnnotationSpan.html(),
                    annotationOffset = newAnnotationSpan.offset(),
                    newAnnotation = this.store.createRecord('annotation', {
                        original: annotationText,
                        review: review
                    });

                var newDomAnnotation = DomAnnotation.create({
                    offset: annotationOffset,
                    annotation: newAnnotation
                });

                this.set('newAnnotation', newDomAnnotation);
                this.set('annotationSelector', newAnnotationSpan);
            }.bind(this));
        },

        hasSavedAnnotation: function(annotation) {
            var tag_type = annotation.get('tag.tag_type'); // 'POSITIVE' or 'NEGATIVE'

            // Update comment's span to include the annotation's DB ID
            var anno_id = 'annotation-' + annotation.id;

            var stuff = $('<div>').html(this.get('formatted_text'));
            var workingAnnotation = stuff.find('#annotation-in-progress');
            workingAnnotation.attr('id', anno_id).addClass(tag_type);
            var newFormattedText = stuff.html();

            this.set('formatted_text', newFormattedText);
            this.set('formatted_text_buffer', newFormattedText);
            Ember.run.debounce(this, this.saveDraft, autosaveTimout, true);

            this.set('newAnnotation', null);
        },

        saveEssay: function(essay) {
            essay.save();
        }
    }
});
