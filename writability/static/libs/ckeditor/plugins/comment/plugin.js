CKEDITOR.plugins.add( 'comment', {
    icons: 'comment',
    init: function( editor ) {
        console.log('CKEDITOR comment plugin init()');
        // Plugin logic goes here...

        // Add dialog command
        //editor.addCommand( 'commentDialog', new CKEDITOR.dialogCommand( 'commentDialog' ) );

        editor.addCommand( 'insertComment', {
            exec: function( editor ) {

                selectedText = getSelectionHtml(editor);
                console.log('selected text: ' + selectedText);
                //if (selectedText.length < 1) {
                //    alert('Comments require a selected text area. <br />'
                //        + 'Please select text to comment on, then hit the Comment button.');
                //    return;
                //}
                // TODO -> check that something is already selected, or show a popup.

                // This applies a style to the current selection.
                var style = new CKEDITOR.style({attributes: {name:"changed", style:"border-bottom:1px solid red;"}});
                editor.applyStyle(style);

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

                //alert( 'DEMO: You selected this text: ' + getSelectionHtml(editor) );

                //var now = new Date();
                //editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
            }
        });

        //Define a button associated with the above command
        // This creates a button named 'Comment' with 3 properties
        editor.ui.addButton( 'Comment', {
            label: 'Insert Comment YAY!',
            command: 'insertComment'
            //toolbar: 'insert'           // This is a toolbar group the button is inserted into 
        });
    }
});
