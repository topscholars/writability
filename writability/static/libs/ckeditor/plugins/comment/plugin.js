CKEDITOR.plugins.add( 'comment', {
    icons: 'comment',
    init: function( editor ) {
        // Plugin logic goes here...

        // Add dialog command
        editor.addCommand( 'commentDialog', new CKEDITOR.dialogCommand( 'commentDialog' ) );

        // Define a button associated with the dialog window
        // This creates a button named 'Comment' with 3 properties
        editor.ui.addButton( 'Comment', {
            label: 'Insert Comment',
            command: 'commentDialog',
            toolbar: 'insert'           // This is a toolbar group the button is inserted into 
        });
    }
});
