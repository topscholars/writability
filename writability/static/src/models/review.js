/* globals App, DS */
App.Review = DS.Model.extend({
    // properties
    text: DS.attr('string'),
    is_draft_approved: DS.attr('boolean'),
    due_date: DS.attr('string'),
    review_type: DS.attr('string'),

    next_states: DS.attr('array', {readOnly: true}),
    state: DS.attr('string'),
    annotations: DS.hasMany('annotation', {async: true}),

    all_annotations_resolved: function() {
        var annotations = this._data.annotations;
        var annos = this.get('annotations');
        console.log("annotations[0].get('state'): " + annotations[0].get('state') );

        for (i=0; i < annotations.length; i++) {
            var anno_state = annotations[i].get('state');
            console.log(anno_state);
            if (anno_state == "new" ) {
                return false;
            }
        }
        return true;
        // NONE OF THE BELOW WORK. Why ?? Leave this here until we get some answers.

        // annotations[0] = an annotations ember object
        //for (anno in annotations) {
            //console.log('anno.get("state": ' + anno.get('state'));
            //console.log('anno.state": ' + anno.state);
            //console.log('anno.isResolved": ' + anno.isResolved);
            //console.log('anno.isResolved()": ' + anno.isResolved() );
        //    debugger
            //console.log(anno._data.state);
        //    if ( anno._data.state == "new") {
        //        return false;                 
        //    }
        //}

        //this.get('annotations')                   // Same problem without the .then() for async
        //  .then(function(annotations) { 
        //    for (anno in annotations) {
        //        if ( anno.get('state') == "new") {  // annos is an Ember obj of ~130 elements instead of 4
        //            return false;                   // so can't use != "resolved" .. goddamnit ember
        //        }
        //    }
        //});
        //return true;
    }.property('annotations.@each.state'),

    // relationships
    draft: DS.belongsTo('draft'),
    teacher: DS.belongsTo('teacher')
});
