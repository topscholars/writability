import ListView from 'writability/views/-core/list';
import ItemView from './add/list-item';
import NewView from './add/new-item';
import OptionsView from './add/options-item';

export default ListView.extend({
	templateName: 'universities/add',
    title: 'Universities',
    listItem: ItemView,
    newItem: NewView,
    optionsItem: OptionsView
});
