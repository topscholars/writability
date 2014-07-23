import EditorView from './draft/editor';
import Ember from 'ember';

export default EditorView.extend({
    templateName: 'draft',

    toggleSelector: '.panel-toggle',

    activatePanel: function(panelKey) {
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
    },

    didInsertElement: function() {
        this.activatePanel('review');
    },

    actions: {
        /*
         * Clicking the Details / Review button toggles the current displayed
         * item.
         */
        togglePanel: function (panelKey) {
            this.activatePanel(panelKey);
        }
    }
});
