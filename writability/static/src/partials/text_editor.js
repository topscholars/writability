App.TextEditor = Ember.TextArea.extend({
    classNames: ['draft-text'],
    attributeBindings: ['contenteditable'],
    contenteditable: 'true',
    editor: null,
    _suspendValueChange: false,
    _minimumChangeMilliseconds: 5000,

    didInsertElement: function () {
        this._setupInlineEditor();
    },

    _setupInlineEditor: function () {
        var id = this.get('elementId');
        var config = this._getEditorConfig();
        var view = this;

        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline(id, config);

        CKEDITOR.on('instanceReady', function (e) {
            var editor = CKEDITOR.instances[e.editor.name];
            view.set ("editor", editor);
            editor.on("change", view._onChange, view);
        });
    },

    _onChange: function () {
        // use timer to make sure that change event handling is throttled
        var timer;
        var view = this;

        if (timer) { return; }

        timer = setTimeout(function () {
            timer = 0;
            view.suspendValueChange(function() {
                view.set("value", view.get('editor').getData());
            });
        }, view._minimumChangeMilliseconds);
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

    suspendValueChange: function(cb) {
        this._suspendValueChange = true;
        cb();
        this._suspendValueChange = false;
    },

    valueChanged: function() {
        // untested as all changes are propogating here.
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
