export default DS.Model.extend({
    category: DS.attr(),
    name: DS.attr(),
    description: DS.attr(),
    tag_type: DS.attr(),


    isPositive: function() {
    var model = this;
    var tag_type = model.get('tag_type');
    var result = (tag_type == "POSITIVE" ? true : false);
        return result;
    }.property('tag_type'),
});
