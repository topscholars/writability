import EditorView from './draft/editor';

export default EditorView.extend({
    templateName: 'draft',

    toggleSelector: '.panel-toggle',

    actions: {
        /*
         * Clicking the Details / Review button toggles the current displayed
         * item.
         */
        togglePanel: function (panelKey) {
            var summaryPanel = this.get('summaryPanel');
            var activePanel = summaryPanel.get('activePanel');

            if (panelKey === activePanel) {
                this.$('.' + panelKey + this.toggleSelector).removeClass('active');
                summaryPanel.hide();
            } else {
                if (activePanel) {
                    this.$('.' + activePanel + this.toggleSelector).removeClass('active');
                    summaryPanel.hide();
                }
                this.$('.' + panelKey + this.toggleSelector).addClass('active');
                summaryPanel.show(panelKey);
            }
        }
    }
});
