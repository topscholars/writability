App.TextEditor = Ember.TextArea.extend({
    classNames: ['draft-text'],
    attributeBindings: ['contenteditable'],

    contenteditable: 'true',

    editor: null,

    didInsertElement: function () {
        this._setupInlineEditor();
    },

    _setupInlineEditor: function () {
        var id = this.get('elementId');
        console.log(id);
        var config = this._getEditorConfig();
        CKEDITOR.inline(id, config);

        var view = this;
        CKEDITOR.on('instanceReady', function (e) {
            view.set ("editor", CKEDITOR.instances[e.editor.name]);
        });
    },

    _getEditorConfig: function () {
        return {
            removePlugins: 'magicline',
            extraPlugins: 'sharedspace',
            startupFocus: true,
            toolbar: [
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['NumberedList', 'BulletedList']
            ],
            sharedSpaces: {
                top: "editor-toolbar",
            },
            title: false, // hide hover title
        };
    },

    _getEditorData: function () {
        return this.get('editor').getData();
    },

    _setEditorData: function (textData) {
        // editor.setData(data, callback, internal);
        this.get('editor').setData(textData);
    }
});
