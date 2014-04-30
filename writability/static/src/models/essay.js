App.Essay = DS.Model.extend({
    audience: DS.attr('string'),
    context: DS.attr('string'),
    due_date: DS.attr('string'),
    essay_prompt: DS.attr('string'),
    num_of_drafts: DS.attr('number'),
    topic: DS.attr('string'),
    word_count: DS.attr('number')
});
