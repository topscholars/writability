import Ember from 'ember';
import ListItem from './list-item';

export default Ember.View.extend({
    templateName: 'essays/list',
    // templateName: 'modules/student/essays/list',
    title: 'Essays',
    //sections: ['To do', 'Not to do'],
    listItem: ListItem
});
