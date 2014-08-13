import ListView from 'writability/views/-core/list';
import EssayTemplateItemView from './essay-templates/list-item';

export default ListView.extend({
    classNames: ['application-essay-templates'],
    title: 'Application Essays',
    listItem: EssayTemplateItemView,
    newItem: null
});
