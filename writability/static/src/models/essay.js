App.Essay = DS.Model.extend({
    //essay_prompt: DS.attr('string'),
    audience: DS.attr('string'),
    context: DS.attr('string'),
    topic: DS.attr('string'),
    word_count: DS.attr('number'),
    num_of_drafts: DS.attr('number'),
    due_date: DS.attr('string')
});
