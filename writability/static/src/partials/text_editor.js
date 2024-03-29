/* globals App, Ember, CKEDITOR */
App.TextEditor = Ember.TextArea.extend({

    actions: {
        sync: function () {
            console.log('wel then');
        }
    },
    classNames: ['draft-text'],
    attributeBindings: ['contenteditable'],
    contenteditable: 'true',
    editor: null,
    isReadOnly: false,  // This is obsolete if we use reviewMode
    reviewMode: false,
    _suspendValueChange: false,
    _minimumChangeMilliseconds: 1000,
    valueBuffer: null,

    didInsertElement: function () {
        this._setupInlineEditor();
        console.log(this.get('valueBuffer'));
    },

    _setupInlineEditor: function () {
        var context = {
            controller: this
        };

        var id = this.get('elementId');

        var config = this._getEditorConfig();   // This function returns config options
                                                // It thus isn't using config file...
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline(id, config);

        CKEDITOR.once('instanceReady', function (e) {
            var editor = CKEDITOR.instances[e.editor.name];
            console.log(editor.filter.allowedContent);
            this.set ('editor', editor);

            editor.setReadOnly(this.get('isReadOnly'));

            editor.on('change', this._onChange, this);
            editor.on('focus', this._onFocus, this);

            // Prevents all typing, deleting, pasting in editor. (blocks keypresses)
            // TODO this should include a serverside block for non-plugin insertions as well.
            if ( this.get('reviewMode') ) {
                $('#'+id).next().attr('onkeydown', 'return false;'); //This grabs the textarea, then nexts onto inline editor

                //$('#'+id).next().bind('keypress', function(e) {
                //  //if (e.which == '13') { //enter pressed
                //     return false;
                //});
            }
        }, this);
    },

    _onChange: function () {
        // use timer to make sure that change event handling is throttled
        // var timer;
        var component = this;

        //if (timer) { return; }

        // TODO: Return timer and non-instant updates. But stop caret reset
        // bug/
        //timer = setTimeout(function () {
        //    timer = 0;
            component.suspendValueChange(function() {
                component.set('value', component.get('editor').getData());
            });
        //}, view._minimumChangeMilliseconds);
    },

    /**
     * Handle focus by alerting a 'startedWriting' event and updating the text
     * editor's content if old.
     */
    _onFocus: function () {
        var component = this;
        this.sendAction('action', function () {
            var content = component.get('value');
            var editor = component.get('editor');
            if (content !== editor.getData()) {
                editor.setData(content);
            }
        });
    },

    _getEditorConfig: function () {     // This replace CKEditor config files
        config = {
            removePlugins: 'magicline,scayt',
            extraPlugins: 'sharedspace,comment',
            startupFocus: true,
            enterMode: CKEDITOR.ENTER_BR,
            toolbar: [
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['NumberedList', 'BulletedList']
                //['Comment']
            ],
            // {styles e.g. text-align}(class)(!requiredclass) [attr e.g. href]
            allowedContent: 'em strong u ol li ul; span[name,*](*){*}', // 'span[!data-commentID,name](*){*}', //Requires data-commentID, any class/style allowed
            sharedSpaces: {
                top: "editor-toolbar",
            },
            title: false, // hide hover title
        };

        // Remove toolbar option for Review Mode
        reviewMode = this.get('reviewMode');
        if (reviewMode) {
            config.toolbar = [ ['Comment'], [] ];
            config.keystrokes = [ [ 13 /*Enter*/, 'doNothing'] ];    //This uses blank plugin.
            //config.blockedKeystrokes = [13, CKEDITOR.SHIFT + 13];  // Doesn't work
        }

        return config;
    },

    suspendValueChange: function(cb) {
        this._suspendValueChange = true;
        cb();
        this._suspendValueChange = false;
    },

    valueChanged: function() {
        // FIXME: don't respond to changes on value. this was creating a bug
        // where pushes to the server caused setData and a caret reset. setData
        // is asynchronous. That was probably the problem. It's only needed if
        // multiple people are editing the document at the same time.
        if (this._suspendValueChange) { return; }

        // var content = this.get("value");
        // var editor = this.get("editor");
        // editor.setData(content);
    }.observes("value"),

    willDestroyElement: function() {
        // make sure the editor doesn't have any bound events before it's
        // destroyed.
        var editor = this.get('editor');
        editor.removeAllListeners();
        editor.destroy(false);
    },

    valueBufferPush: function() {
        var editor = this.get('editor'),
            newFormattedText = this.get('valueBuffer');

        editor.setData(newFormattedText);
    }.observes('valueBuffer')
});
