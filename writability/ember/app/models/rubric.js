import DS from 'ember-data';
import Ember from 'ember';
//import FixtureData from 'writability/fixtures/rubric';

var Rubric = DS.Model.extend({
	review: DS.belongsTo('review'),
	name: DS.attr(),
	rubric_associations: DS.hasMany('rubric-association'),//, {async: true})

  essay_template: DS.belongsTo('essay-template'), //only for below alias
  all_criteria: Ember.computed.alias('essay_template.criteria'), // [1, 2 ,3]
  // filter 2 by "impact'"


  //impact_criteria: function (key, value) {
  //  if (arguments.length > 1) { // > 1 args = this is a `set`
  //    return value;
  //  } else {

  load_impact_criteria: function(selectedCategory) {
      var model = this;
      var all_criteria = this.get('all_criteria');
      var impact_criteria = [];
      // content, impact, quality, style
      // var a = model.store.findQuery('rubric-criterion', { essay_template_id: "454" }); // , { id: "454" })
      // var b = model.store.all('criterion');
      // debugger
       // .then( function (y) { 
       //   debugger
       // });

      var category = model.store.findQuery('rubric-category', { name: selectedCategory.get('name')} ).then(function(cat) {
        return cat.get('firstObject');
      });
      var criteria = model.store.findQuery('rubric-criterion', { essay_template_id: model.get("essay_template.id") });


      return Ember.RSVP.all([category, criteria]).then( function (objs) {
        var category = objs[0],
            criteria = objs[1];

          return criteria.filter(function(current) {
            return current.get('rubriccategory.id') === category.get('id');
          });
        });

      //var peters2 = this.store.find('rubric-criterion', { id: crit.id, rubriccategory: "2" });

       
      //var all_criteria_length = all_criteria.length;
      ////debugger
      //all_criteria.forEach (function(crit, index) {
      //  var crit_id = crit.id;
      //  model.store.find('rubric-criterion', crit_id )
      //    .then( function (crit_obj) {
      //      var category_name = crit_obj.get('rubriccategory.name').toLowerCase();
      //      if (category_name == "impact") {
      //        impact_criteria.push(crit);
      //      }
      //      //debugger
      //      if ((index+1) == all_criteria_length) {
      //        return impact_criteria;
      //        //model.set("impact_criteria", impact_criteria);
      //        //debugger
      //      }
      //    });
//
      //  
      //});
      //return impact_criteria;
      // returns null if the promise doesn't resolve immediately, or 
      // the calculated value if it's ready
      // return value;
  },

  impact_criteria: function (key, value) {
    if(arguments.length > 1) {
      return value;
    } else {
      this.load_impact_criteria();
    }
  }.property('all_criteria')

  //var impact_crit = all_criteria.filterBy('')
  //selectedEssays: function() {
  //  return this.get('content').filterBy('onboarding_is_selected', true);
  //}.property('content.@each.onboarding_is_selected'),
});

//Rubric.reopenClass({
//	FIXTURES: FixtureData
//});

export default Rubric;
