import DS from 'ember-data';

export default DS.Model.extend({
    category: DS.attr(),
    super_category: DS.attr(),
    name: DS.attr(),
    description: DS.attr(),
    tag_type: DS.attr(),
    is_simple_tag: DS.attr(),


    // Using redundant methods here because rubric is a 3rd category and handlebar templates cannot insert the response
    // value of a single method as an HTML element class. :/ Instead it will use an if to assign a class for each tag type
    isPositive: function() {
        var model = this;
        var tag_type = model.get('tag_type');
        var result = (tag_type === "POSITIVE" ? true : false);
        return result;
    }.property('tag_type'),

    isNegative: function() {
        var model = this;
        var tag_type = model.get('tag_type');
        var result = (tag_type === "POSITIVE" ? true : false);
        return result;
    }.property('tag_type'),

    isRubric: function() {
        var model = this;
        var super_category = model.get('super_category').toLowerCase();
        var result = (super_category === "rubric" ? true : false);
        return result;
    }.property('tag_type')
});
