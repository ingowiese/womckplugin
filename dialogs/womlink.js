/**
 * Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * The abbr plugin dialog window definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add('womlinkDialog', function (editor) {
	// this.getInputElement().$ refers to the "real" select box
	// you can add or remove options and modify as needed
	let linktypeChanged = function (element) {
		let linktypeSelectBox = this.getInputElement().$
		let dialog = this.getDialog();
		let ce = dialog.getContentElement('tab-basic', 'projektartikel');
		let projektartikelSelectBox = ce.getInputElement().$;
		if ('PROJECT_ARTICLE' === linktypeSelectBox.value) {
			projektartikelSelectBox.options.length = 0;
			projektartikelSelectBox.options[0] = new Option('hans', 'Hans');
			projektartikelSelectBox.options[1] = new Option('franz', 'franz');
			projektartikelSelectBox.removeAttribute("disabled");
		} else {
			projektartikelSelectBox.options.length = 0;
			projektartikelSelectBox.setAttribute("disabled","disabled");
		}
	}
	return {

		// Basic properties of the dialog window: title, minimum size.
		title: 'Link Properties',
		minWidth: 400,
		minHeight: 200,

		// Dialog window content definition.
		contents: [{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-basic',
				label: 'Link Settings',

				// The tab content.
				elements: [{
						type: 'select',
						id: 'linktyp',
						label: 'Linktyp',
						items: [],
						onLoad: function (element) {
							//TODO: find out how to call setup .... 
							// this.getInputElement().$ refers to the "real" select box
							// you can add or remove options and modify as needed
							let selectBox = this.getInputElement().$;

							CKEDITOR.ajax.load('/getSelectChoices', function (data) {
								let jsonData = JSON.parse(data);
								let navTargets = jsonData['navigationTargetChoices']['types'];
								for (i = 0; i < navTargets.length; i++) {
									selectBox.options[i] = new Option(navTargets[i]['text'], navTargets[i]['value']);
								}
							});
						},
						onChange: linktypeChanged
						//validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty." )
					},
					{
						type: 'select',
						id: 'projekt',
						label: 'Projekt',
						items: [],
						onLoad: function (element) {
							//TODO: find out how to call setup .... 
							let selectBox = this.getInputElement().$;

							CKEDITOR.ajax.load('/getSelectChoices', function (data) {
								let jsonData = JSON.parse(data);
								let navTargets = jsonData['projectChoices'];
								for (i = 0; i < navTargets.length; i++) {
									selectBox.options[i] = new Option(navTargets[i]['text'], navTargets[i]['value']);
								}
							});
						},
						onChange: function (element) {
							let selectBox = this.getInputElement().$;
							console.log('projekt on change called, new value is ' + selectBox.value);
						}
						//validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty." )
					},
					{
						type: 'select',
						id: 'projektartikel',
						label: 'Projektartikel',
						items: [],
						onLoad: function (element) {
							//TODO: find out how to call setup .... 
							// this.getInputElement().$ refers to the "real" select box
							// you can add or remove options and modify as needed
							let selectBox = this.getInputElement().$;
						},
						onChange: function (element) {
							let selectBox = this.getInputElement().$;
							console.log('projekt on change called, new value is ' + selectBox.value);
						}
						//validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty." )
					}
				]
			},

			// Definition of the Advanced Settings dialog tab (page).
			{
				id: 'tab-adv',
				label: 'Advanced Settings',
				elements: [{
					// Another text field for the abbr element id.
					type: 'text',
					id: 'id',
					label: 'Id'
				}]
			}
		],

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function () {

			// The context of this function is the dialog object itself.
			// http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
			var dialog = this;

			// Create a new <abbr> element.
			var abbr = editor.document.createElement('abbr');

			// Set element attribute and text by getting the defined field values.
			abbr.setAttribute('title', dialog.getValueOf('tab-basic', 'title'));
			abbr.setText(dialog.getValueOf('tab-basic', 'abbr'));

			// Now get yet another field value from the Advanced Settings tab.
			var id = dialog.getValueOf('tab-adv', 'id');
			if (id)
				abbr.setAttribute('id', id);

			// Finally, insert the element into the editor at the caret position.
			editor.insertElement(abbr);
		}

	};
});
