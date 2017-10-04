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
		let dialog = this.getDialog();

		let linktypeSelectBox = dialog.getContentElement('tab-basic', 'linktyp').getInputElement().$;
		let projektartikelSelectBox = dialog.getContentElement('tab-basic', 'projektartikel').getInputElement().$;
		let projektSelectBox = dialog.getContentElement('tab-basic', 'projekt').getInputElement().$;

		let hideProjektartikelSelectBox = true;
		if ('PROJECT_ARTICLE' === linktypeSelectBox.value) {
			hideProjektartikelSelectBox = false;
			projektartikelSelectBox.options.length = 0;
			projektartikelSelectBox.removeAttribute("disabled");
			let psn = dialog.getContentElement('tab-basic', 'projekt').getInputElement().$.value;
			let url = '/getSuggestions?projectShortname=' + psn + '&navTargetType=projektartikel&shapeId=byl';
			CKEDITOR.ajax.load(url, function (data) {
				let jsonData = JSON.parse(data);
				for (i = 0; i < jsonData.length; i++) {
					let v = jsonData[i]['value'];
					let k = jsonData[i]['text'];
					projektartikelSelectBox.options[i] = new Option(k, v);
				}

			});
		}
		if ('EXTERNAL_LINK' === linktypeSelectBox.value) {
			projektSelectBox.setAttribute("disabled", "disabled");
		} else {
			projektSelectBox.removeAttribute("disabled");
		}

		if (hideProjektartikelSelectBox) {
			projektartikelSelectBox.options.length = 0;
			projektartikelSelectBox.setAttribute("disabled", "disabled");
		}
	};
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
						minWidth: '200px',
						items: [],
						onLoad: function (element) {
							//TODO: find out how to call setup .... 
							// this.getInputElement().$ refers to the "real" select box
							// you can add or remove options and modify as needed
							let selectBox = this.getInputElement().$;

							CKEDITOR.ajax.load('/getSelectChoices', function (data) {
								let jsonData = JSON.parse(data);
								let navTargets = jsonData['navigationTargetChoices']['types'];
								let pos = 0;
								for (i = 0; i < navTargets.length; i++) {
									let v = navTargets[i]['value'];
									//wir fangen klein an
									if ('PROJECT_ARTICLE' === v || 'PROJECT_MAIN_ARTICLE' === v || 'EXTERNAL_LINK' === v)
										selectBox.options[pos++] = new Option(navTargets[i]['text'], v);
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
						minWidth: '200px',
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
						onChange: linktypeChanged
						//validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty." )
					},
					{
						type: 'select',
						id: 'projektartikel',
						label: 'Projektartikel',
						items: [],
						attributes: {
							'styles': 'width:200px'
						},
						onLoad: function (element) {
							//TODO: find out how to call setup .... 
							// this.getInputElement().$ refers to the "real" select box
							// you can add or remove options and modify as needed
							let selectBox = this.getInputElement().$;
						},
						onChange: function () {
							console.log('not implemented');
						}
						//validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty." )
					},
					{
						type: 'text',
						id: 'linktext',
						label: 'Link Text',
						validate: CKEDITOR.dialog.validate.notEmpty("Der Linktext darf nicht leer sein.")
					},
					{
						type: 'text',
						id: 'linkziel',
						label: 'Link Ziel',
						//validate: CKEDITOR.dialog.validate.notEmpty("Der Linktext darf nicht leer sein.")
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
			var abbr = editor.document.createElement('a');

			// Set element attribute and text by getting the defined field values.
			let linktype = dialog.getValueOf('tab-basic', 'linktyp');
			if ('PROJECT_MAIN_ARTICLE' === linktype) {
				let target = '/project/' + dialog.getValueOf('tab-basic', 'projekt') + '/main.html';
				let text = dialog.getValueOf('tab-basic', 'linktext');
				abbr.setAttribute('href', target);
				abbr.setText(text);

			} else if ('PROJECT_ARTICLE' === linktype) {
				let p = dialog.getValueOf('tab-basic', 'projekt');
				let a = dialog.getValueOf('tab-basic', 'projektartikel');
				let target = '/project/' + p + '/article/' + a + '/show.html';
				let text = dialog.getValueOf('tab-basic', 'linktext');
				abbr.setAttribute('href', target);
				abbr.setText(text);
			} else if ('EXTERNAL_LINK' === linktype) {
				let text = dialog.getValueOf('tab-basic', 'linktext');
				let target = dialog.getValueOf('tab-basic', 'linkziel');
				abbr.setAttribute('href', target);
				abbr.setText(text);
			}

			// Finally, insert the element into the editor at the caret position.
			editor.insertElement(abbr);
		}

	};
});
