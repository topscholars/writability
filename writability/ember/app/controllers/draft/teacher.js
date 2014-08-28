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

    //current_ess_template

    tags: function() {
        return this.store.find('tag', { is_simple_tag: true } );
        //var a =  this.store.find('tag', { tag_type: "POSITIVE" } );
        //var b =  this.store.find('tag', { tag_type: "NEGATIVE" } );
        //////var d =  this.store.find('criteria', { essay_template_id: this.get('myAliasID') } );
        //var stream = Ember.A();
//
        //return Ember.RSVP.all([a, b]).then( function (objs) {
        //    stream.pushObjects(objs[0].toArray());
        //    stream.pushObjects(objs[1].toArray());
        //    //debugger
        //    return stream;
        //});

        //Concatenate these and return
        // Criteria extends Tag, with 2 added attributes on Criteria
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
            Ember.run.debounce(this, this.saveReview, autosaveTimout);
        }
    }.observes('review.text'),

    actions: {

        next: function () {
            var draft = this.get('model'),
                controller = this;

            //// Removes obsolete Annotation spans from draft content on save.
            //// This includes both types: id='annotation-99' and 'annotation-in-progress'
            //// This works but the review submission breaks for some reason.
            
            var div_container = $('<div>').html(this.get('formatted_text'));   // Holds text from draft textarea
            
            var annotation_objs;
            var annotation_ids;
            draft.get('review')
                .then( function(review) { review.get('annotations')
                    .then( function(annotations) {
                        annotation_objs = annotations; // Array of Anno IDs. ["45","47"..]
                        annotation_ids = annotation_objs.mapBy('id');
                    
                        // Remove annotations from content that dont exist in DB
                        div_container.find( 'span[id*=annotation-]' ).each(function() {
                            var annotation_span = $(this);
                            var id_num = (this.id).split("-").pop(); // Handles "annotation-15", pop() returns last element in array: "15"
                            if (annotation_ids.indexOf(id_num) == -1) {  // If existing anno array does not contain current anno span
                                annotation_span.replaceWith(annotation_span.contents());
                            }
                        });

                        // Remove any in progress annotations (should be max of 1)
                        var currentInProgress = div_container.find('#annotation-in-progress');
                        if (currentInProgress.length > 0) {
                            currentInProgress.replaceWith(currentInProgress.contents());
                        }
                        var newFormattedText = div_container.html();

                        controller.set('formatted_text', newFormattedText);
                        controller.set('formatted_text_buffer', newFormattedText);
                        // not using debounce because this needs to happen immediately
                        // When review is saved, the new draft is created and must have updated text 
                        draft.save();

                        //TODO this called draft.get multiple times and can be refactored

                        //// Original handling without change to Draft Content
                        controller.updateEssayDueDate().then(function() {
                            draft.get('review')
                                .then(function (review) {
                                    review.set('state', 'completed');
                                    // Save draft
                                    return review.save();
                                })
                                .then(function (savedReview) {
                                    var essay_id = draft.get('essay_id'),
                                        student_id = controller.get('student.id'),
                                        essayPromise = draft.get('essay');

                                    // This should really be refactored
                                    essayPromise.then(function(essay) {
                                        essay.reload().then(function() {
                                            controller.send('alert', 'Review submitted.', 'success');

                                            if (draft.get('essay_type') === 'application') {
                                                controller.transitionToRoute('student.essays.show-application', student_id, essay_id);
                                            } else if (draft.get('essay_type') === 'theme') {
                                                controller.transitionToRoute('student.essays.show-theme', student_id, essay_id);
                                            }
                                        });
                                    });
                                });
                        });
                    });  
                });
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
                    var essay_id = draft.get('essay_id'),
                        student_id = this.get('student.id');

                    if (draft.get('essay_type') === 'application') {
                        this.transitionToRoute('student.essays.show-application', student_id, essay_id);
                    } else if (draft.get('essay_type') === 'theme') {
                        this.transitionToRoute('student.essays.show-theme', student_id, essay_id);
                    }
                }.bind(this));
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
            workingAnnotation.attr('id', anno_id).addClass(tag_type);   // Adds Positive or Negative for the underline color
            var newFormattedText = stuff.html();

            this.set('formatted_text', newFormattedText);
            this.set('formatted_text_buffer', newFormattedText);
            Ember.run.debounce(this, this.saveDraft, autosaveTimout);

            this.set('newAnnotation', null);
        },
        //// For 'Save Essay' button in review settings box.
        //saveEssay: function(essay) {
        //    essay.save();
        //},

        teacherDeleteAnnotation: function (annotation) {
            var anno_id = '#annotation-' + annotation.id;                   // Note inclusion of #, unlike in hasSavedAnnotation()
            var div_container = $('<div>').html(this.get('formatted_text'));   // Holds text from draft textarea

            var annotation_to_remove = div_container.find(anno_id);         //Get text, replace span with text
            var text = annotation_to_remove.text();
            annotation_to_remove.replaceWith(text);

            var newFormattedText = div_container.html();                    // Set draft textarea to new content

            this.set('formatted_text', newFormattedText);
            this.set('formatted_text_buffer', newFormattedText);
            Ember.run.debounce(this, this.saveDraft, autosaveTimout);

            annotation.destroyRecord();

        }
    }
});
