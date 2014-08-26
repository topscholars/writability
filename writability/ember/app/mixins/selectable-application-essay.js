import Ember from 'ember';

export default Ember.Mixin.create({
    actions: {
        selectApplicationEssay: function(applicationEssayAssociation) {
            applicationEssayAssociation.set('state', 'selected');
            applicationEssayAssociation.save();
        }
    }
});
