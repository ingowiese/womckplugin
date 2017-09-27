CKEDITOR.plugins.add('womlink', {
    icons:'womlink',
    init: function (editor) {
        editor.addCommand('womlink', new CKEDITOR.dialogCommand( 'womlinkDialog' ));
        editor.ui.addButton('wom link', {
            label: 'insert Wom Link',
            command: 'womlink',
            toolbar: 'insert',
        });
        CKEDITOR.dialog.add( 'womlinkDialog', this.path + 'dialogs/womlink.js' );
    }
});
