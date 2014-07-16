import ThickListItem from 'writability/views/-core/thick-list-item';

export default ThickListItem.extend({
    templateName: "student/essays/list-item",

    didInsertElement: function() {
        this.isSelectedHasChanged();
    },
    isSelectedHasChanged: function() {
        if (this.get('controller.selectedEssay.id') === this.get('context.id')) {
            this.$().addClass('is-selected');
        } else {
            this.$().removeClass('is-selected');
        }
    }.observes('controller.selectedEssay'),

    click: function () {
        this.get('controller').send('selectEssay', this.get('context'));
    }
});
