import ListView from 'writability/views/-core/list';
import StudentItem from './list-item';
import Ember from 'ember';

export default ListView.extend({
    title: 'Students',
    listItem: StudentItem,
    classNames: ["module", "list-module", 'auto-height']
});
