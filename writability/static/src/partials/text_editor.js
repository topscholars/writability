/* globals App, Ember, CKEDITOR */

function addTag () {
    var tag_box =   '<div id="tag_box">'
                   +'    <input placeholder="Tag it   (to demo on Monday)" class="tag_input">'
                   +'</div>';
    $('.annotations-column').append(tag_box);
} 
function removeTagBoxes () {
    $('#tag_box').remove();
} 
function addDemoTag (floatFromTopInPX) {
    var tag_box =   '<div style="top:' +floatFromTopInPX+ 'px" class="existing_tag">'
                   +'    <p class="">Run-on Sentence</p>'
                   +'</div>';
    $('.annotations-column').append(tag_box);
}
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
    isReadOnly: false,
    _suspendValueChange: false,
    _minimumChangeMilliseconds: 1000,

    didInsertElement: function () {
        this._setupInlineEditor();
    },

    _setupInlineEditor: function () {
        var context = {
            controller: this
        };
        var id = this.get('elementId');
        var config = this._getEditorConfig();

        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline(id, config);

        CKEDITOR.once('instanceReady', function (e) {
            var editor = CKEDITOR.instances[e.editor.name];
            context.editor = editor;
            this.set ('editor', editor);

            editor.setReadOnly(this.get('isReadOnly'));

            // This fires for all 3 cols
            var text_column = editor.document.on("mouseup", this.checkForSelection, context );
            //works  // $(text_column).on("click", function () { alert('hey'); });
            //doesnt // $(text_column).on("mouseup", context, this.checkForSelection );
            //doesnt // $(text_column).on('mouseup', this.checkForSelection, context); 
            editor.on('change', this._onChange, this);
            editor.on('focus', this._onFocus, this);
            
            // Test UI
            addDemoTag(100);

        }, this);
    },

    checkForSelection: function() {
        var editor = this.editor,
            controller = this.controller;
        var selectedText = editor.getSelection().getSelectedText();

        if (selectedText) {

            alert('You selected: ' + selectedText);

            // Insert UI on right column
            removeTagBoxes();  
            addTag(200);
            
            //this.displayTagEntry();   // This isn't able to call the method in this class
                                        //  displayTagEntry, this.displayTagEntry, App.TextEditor.displayTagEntry() also fail
        }
    },
    //displayTagEntry: function () {
    //    alert('displayTagEntry');
    //    // pass in height of selected text to a function for displaying 
    //},


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

    _getEditorConfig: function () {
        return {
            removePlugins: 'magicline,scayt',
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
    }
});
