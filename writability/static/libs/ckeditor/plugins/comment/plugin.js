CKEDITOR.plugins.add( 'comment', {
    icons: 'comment',
    init: function( editor ) {
        console.log('CKEDITOR comment plugin init()');
        // Plugin logic goes here...

        // Add dialog command
        //editor.addCommand( 'commentDialog', new CKEDITOR.dialogCommand( 'commentDialog' ) );

        editor.addCommand( 'insertComment', {
            exec: function( editor ) {
                //alert('button clicked!');
                console.log('hey');
                var now = new Date();
                editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
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
