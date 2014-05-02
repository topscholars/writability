/* App.DraftController = Ember.ObjectController.extend({
    // Is this function necessary?
    essay: function () {
        return this.get('model').get('essay');
    }.property('model.essay')
}); */


App.DraftView = App.EditorView.extend({
    templateName: 'modules/draft',

    _editor: null,

    didInsertElement: function () {
        // this._setupEditor();
        this._setupInlineEditor();
    },

    _setupEditor: function () {
        CKEDITOR.replace(
            'draft-editor',
            this._getEditorConfig());
    },

    _setupInlineEditor: function () {
        CKEDITOR.inline(
            'draft-editor',
            this._getEditorConfig());

        var view = this;
        CKEDITOR.on('instanceReady', function (e) {
            console.log('bogus');
            view.set ("_editor", CKEDITOR.instances[e.editor.name]);
            console.log(view.get('_editor').commands);
        });
    },

    _getEditorConfig: function () {
        return {
            removePlugins: 'magicline',
            extraPlugins: 'sharedspace',
            startupFocus: true,
            //toolbarStartupExpanded: true,
            toolbar: [
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['NumberedList', 'BulletedList']
            ],
            sharedSpaces: {
                top: "editor-toolbar",
            },
            //removePlugins: 'toolbar,elementspath,resize'
            title: false, // hide hover title
            //removePlugins: 'toolbar' // turn off toolbar
        };
    },

    _getEditorData: function () {
        return this._editor.getData();
    },

    _setEditorData: function (textData) {
        // editor.setData(data, callback, internal);
        this._editor.setData(textData);
    },

    _executeEditorCommand: function (command) {
        console.log(command);
        this._editor.execCommand(command);
        this._editor.focus();

    },

    actions: {
        bold: function () {
            this._executeEditorCommand('bold');
        },

        italic: function () {
            this._executeEditorCommand('italic');
        },

        underline: function () {
            this._executeEditorCommand('underline');
        },

        number: function () {
            this._executeEditorCommand('numberedList');
        },

        bullet: function () {
            this._executeEditorCommand('bulletedList');
        },

        undo: function () {
            this._executeEditorCommand('undo');
        },

        redo: function () {
            this._executeEditorCommand('redo');
        }
    }
});
