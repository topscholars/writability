import DS from 'ember-data';

export default DS.Model.extend({
    // properties
    essay_prompt: DS.attr('string'),
    criteria: DS.hasMany('rubric-criterion') //, {async: true})
    //rubrics: DS.hasMany('rubric')
});
