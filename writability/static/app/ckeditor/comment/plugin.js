CKEDITOR.plugins.add( 'comment', {
    icons: 'comment',
    init: function( editor ) {
        console.log('CKEDITOR comment plugin init()');
        // Plugin logic goes here...

        // Add dialog command
        //editor.addCommand( 'commentDialog', new CKEDITOR.dialogCommand( 'commentDialog' ) );

        editor.addCommand( 'insertComment', {
            exec: function( editor ) {
                var currentInProgress = $('#annotation-in-progress');

                if (currentInProgress.length > 0) {
                    $(currentInProgress).replaceWith(currentInProgress.contents());
                }

                //if (selectedText.length < 1) {
                //    alert('Comments require a selected text area. <br />'
                //        + 'Please select text to comment on, then hit the Comment button.');
                //    return;
                //}
                // TODO -> check that something is already selected, or show a popup.

                //Should be moved out..
                function getSelectionHtml(editor) {
                    var sel = editor.getSelection();
                    var ranges = sel.getRanges();
                    var el = new CKEDITOR.dom.element("div");
                    for (var i = 0, len = ranges.length; i < len; ++i) {
                        el.append(ranges[i].cloneContents());
                    }
                    return el.getHtml();
                }

                //// This Breaks addcomment if called above function definition
                // includes HTML within the selection, e.g. <span> tags
                var selectedText = getSelectionHtml(editor);   
                
                // Enforce non-overlapping tags.
                if (selectedText.indexOf("span") >= 0) {
                    alert('Sorry, but comments cannot overlap.'
                         +'Please select nearby text to add another comment.');
                    return;
                } else {
                    // This applies a style to the current selection.
                    var style = new CKEDITOR.style({attributes: {class: "annotation", id: "annotation-in-progress"}});
                    editor.applyStyle(style);
                }
                //alert( 'DEMO: You selected this text: ' + getSelectionHtml(editor) );
            }
        });

        //Define a button associated with the above command
        // This creates a button named 'Comment' with 3 properties
        editor.ui.addButton( 'Comment', {
            label: 'Insert Comment',
            command: 'insertComment'
            //toolbar: 'insert'           // This is a toolbar group the button is inserted into
        });
    }
});
