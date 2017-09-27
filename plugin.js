CKEDITOR.plugins.add('womlink', {
    icons: 'womlink',
    init: function (editor) {
        editor.addCommand('womlink', {
            exec: function (editor) {
                console.log('editor, here we go');
            }
        });
        editor.ui.addButton('womlink', {
            label: 'insert Byl Link',
            command: 'womlink',
            toolbar: 'insert'
        });
    }
});
