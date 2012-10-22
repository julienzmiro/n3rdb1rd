/* jQuery.contentEditable Plugin
Copyright © 2011 FreshCode
http://www.freshcode.co.za/

DHTML text editor jQuery plugin that uses contentEditable attribute in modern browsers for in-place editing.

Dependencies
------------
 - jQuery core
 - shortcut.js for keyboard hotkeys
 
Issues
------
 - no image support
 - no <code> or <blockquote> buttons (use Tab key for quotes)
 - no text alignment support
 
To Do
-----
 - let plugin build the toolbar
 - moves hard-coded IDs to options

License
-------
Let's keep it simple:
 1. You may use this code however you wish, including for commercial projects.
 2. You may not sell it or charge for it without my written permission.
 3. You muse retain the license information in this file.
 4. You are encouraged to contribute to the plugin on bitbucket (https://bitbucket.org/freshcode/jquery.contenteditable)
 5. You are encouraged to link back to www.freshcode.co.za if you publish something about it so everyone can benefit from future updates.

Best regards
Petrus Theron
contenteditable@freshcode.co.za
FreshCode Software Development
 
*/
(function ($) {

	var methods = {
		edit: function (isEditing) {
			return this.each(function () {
				$(this).attr("contentEditable", (isEditing === true) ? true : false);
			});
		},
		bold: function () {
			document.execCommand("bold", false, null);
		},
		italicize: function () {
			document.execCommand("italic", false, null);
		},
		underline: function () {
			document.execCommand("underline", false, null);
		},
		orderedList: function () {
			document.execCommand("InsertOrderedList", false, null);
		},
		unorderedList: function () {
			document.execCommand("InsertUnorderedList", false, null);
		},
		indent: function () {
			document.execCommand("indent", false, null);
		},
		outdent: function () {
			document.execCommand("outdent", false, null);
		},
		superscript: function () {
			document.execCommand("superscript", false, null);
		},
		subscript: function () {
			document.execCommand("subscript", false, null);
		},
		createLink: function () { /* This can be improved */
			var urlPrompt = prompt("Enter URL:", "http://");
			document.execCommand("createLink", false, urlPrompt);
		},
		insertImage: function () { /* This can be improved */
			var urlPrompt = prompt("Enter Image URL:", "http://");
			document.execCommand("InsertImage", false, urlPrompt);
		},
		formatBlock: function (block) {
			document.execCommand("FormatBlock", null, block);
		},
		removeFormat: function () {
			document.execCommand("removeFormat", false, null);
		},
		copy: function () {
			document.execCommand("Copy", false, null);
		},
		paste: function () {
			document.execCommand("Paste", false, null);
		},
		save: function (callback) {
			return this.each(function () {
				(callback)($(this).attr("id"), $(this).html());
			});
		},
		postExec: function () {
			/*console.log("Test : " + window.TESTAB);
			console.log("postExec : " + $(window.MOONJ.currentElement).html());
			$(this).addClass('currentEditable');
			$(this).addClass('notDraggable');
			*/
		},
		init: function (options) {

			var $toolbar = $(".mjToolbar"); // put in options

			/* Bind Toolbar Clicks */

			$("#mjToolbarButtonBold", $toolbar).click(function () { methods.bold.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonItalic", $toolbar).click(function () { methods.italicize.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonUnderline", $toolbar).click(function () { methods.underline.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonClear", $toolbar).click(function () { methods.removeFormat.apply(this); methods.postExec.apply(this); return false; });
			
			$("#mjToolbarButtonAlignLeft", $toolbar).click(function () { methods.alignLeft.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonAlignCenter", $toolbar).click(function () { methods.alignCenter.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonAlignRight", $toolbar).click(function () { methods.alignRight.apply(this); methods.postExec.apply(this); return false; });

			$("#mjToolbarButtonAddLink", $toolbar).click(function () { methods.createLink.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonAddImage", $toolbar).click(function () { methods.insertImage.apply(this); methods.postExec.apply(this); return false; });

			$("#mjToolbarButtonOrdoList", $toolbar).click(function () { methods.orderedList.apply(this); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonUnordoList", $toolbar).click(function () { methods.unorderedList.apply(this); methods.postExec.apply(this); return false; });

			$("#mjToolbarButtonStyleP", $toolbar).click(function () { methods.formatBlock.apply(this, ["<P>"]); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonStyleH1", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H1>"]); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonStyleH2", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H2>"]); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonStyleH3", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H3>"]); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonStyleH4", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H4>"]); methods.postExec.apply(this); return false; });
			$("#mjToolbarButtonStyleH5", $toolbar).click(function () { methods.formatBlock.apply(this, ["<H5>"]); methods.postExec.apply(this); return false; });
			

			var shortcuts = [
				{ keys: 'Ctrl+l', method: function () { methods.createLink.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+g', method: function () { methods.insertImage.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+U', method: function () { methods.unorderedList.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+O', method: function () { methods.orderedList.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+0', method: function () { methods.formatBlock.apply(this, ["p"]); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+b', method: function () { methods.bold.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+i', method: function () { methods.italicize.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+1', method: function () { methods.formatBlock.apply(this, ["h1"]); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+2', method: function () { methods.formatBlock.apply(this, ["h2"]); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+3', method: function () { methods.formatBlock.apply(this, ["h3"]); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+4', method: function () { methods.formatBlock.apply(this, ["h4"]); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+Alt+4', method: function () { methods.formatBlock.apply(this, ["h4"]); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+m', method: function () { methods.removeFormat.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+u', method: function () { methods.underline.apply(this); methods.postExec.apply(this); } },
				{ keys: 'tab', method: function () { methods.indent.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Ctrl+tab', method: function () { methods.indent.apply(this); methods.postExec.apply(this); } },
				{ keys: 'Shift+tab', method: function () { methods.outdent.apply(this); methods.postExec.apply(this); } }
			];

			$.each(shortcuts, function (index, elem) {
				shortcut.add(elem.keys, function () {
					elem.method();
					return false;
				}, { 'type': 'keydown', 'propagate': false });
			});

			return this.each(function () {

				var $this = $(this), data = $this.data('fresheditor'),
					tooltip = $('<div />', {
						text: $this.attr('title')
					});

				// If the plugin hasn't been initialized yet
				if (!data) {
					/* Do more setup stuff here */

					$(this).data('fresheditor', {
						target: $this,
						tooltip: tooltip
					});
				}
			});
		}
	};

	$.fn.fresheditor = function (method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.contentEditable');
		}

		return;
	};

})(jQuery);
