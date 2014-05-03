App.TextEditor = Ember.TextArea.extend({
    classNames: ['draft-text'],
    attributeBindings: ['contenteditable'],
    contenteditable: 'true',
    editor: null,
    _suspendValueChange: false,

    didInsertElement: function () {
        this._setupInlineEditor();
    },

    _setupInlineEditor: function () {
        var id = this.get('elementId');
        var config = this._getEditorConfig();

        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline(id, config);

        var view = this;
        CKEDITOR.on('instanceReady', function (e) {
            var editor = CKEDITOR.instances[e.editor.name];
            view.set ("editor", editor);
            editor.on("change", function() {
                view.suspendValueChange(function() {
                    view.set("value", editor.getData());
                });
            });
        });
    },

    _getEditorConfig: function () {
        return {
            removePlugins: 'magicline',
            extraPlugins: 'sharedspace,onchange',
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

            //minimumChangeMilliseconds: 100, // 100 is default for onchange
        };
    },

    suspendValueChange: function(cb) {
        this._suspendValueChange = true;
        cb();
        this._suspendValueChange = false;
    },

    valueChanged: function() {
        if (this._suspendValueChange) { return; }
        var content = this.get("value");
        this.get("editor").setData(content);
    }.observes("value"),

    willDestroyElement: function() {
        //var context = this.get('context');
        //var editor = context.get('editor');
        this.get('editor').destroy(false);
        this.get('editor').remove();
    }
});
