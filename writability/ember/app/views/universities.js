import ListView from './-core/list';
import ItemView from './universities/list-item';
import NewView from './universities/new-item';

export default ListView.extend({
    title: 'Universities',
    listItem: ItemView,
    newItem: NewView
});
