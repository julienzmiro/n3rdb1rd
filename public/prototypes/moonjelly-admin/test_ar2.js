// TODO : Passer tout le metier des methodes publiques dans des methodes privees
// x Faire caretSelection
// x Faire le get du selecteur d'images des zones editables
// x Faire le metier de isEditing
// x Resoudre le pb 1)
// x Tester l'ouverture (et la fermeture) de plusieurs popups simultannees
// x Ajouter les listener de la toolbar a l'init
// x Faire les exec
// x Voir pourquoi les execCommand du format, de la liste ordonnee et desordonnee ne fonctionnent pas (alors que http://freshcode.co/plugins/jquery.contenteditable/demo.html ca marche)
// 		=> Les ordonnedList et unordonnedList pourraient toujours etre buguees selon les contextes (selon la hierarchie du DOM)
// x Voir pourquoi le bouton Bold prend les styles "currentEditable" et "notDraggable" lorsqu'il est clique (peut etre postExec ?)
// x Faire le postExec pour toutes les commands qui changent le balisage (listes, titres, ?)
// x Il faudra detecter la balise en cours pour que la toolbar reagisse correctement (mettre le mjSelected ou il faut, dropdown,...)
// x Faire la toolbar des images
//		x Faire le bouton change qui rouvrira un prompt et qui remplacera l'attr src de current elem
//		x Faire le supprimer qui supprimera le current elem
// x Faire le discard
// x Faire le save
// x Toolbar nouvelle page
//		x Faire eventuellement un layer qui simule une nouvelle page blanche
//		x Faire le create en console.log
// x Faire les layers site et pages
// x Ajouter le listener de l'extension chrome
// --------------- V2 :
// - Gerer l'affichage de l'editor selon la session admin (extension chrome / url + mot de passe statique)
// - Faire un système de gestion des layers (ouvertures etc) equivalent a celui des popups
// - Faire les popups
// - Eventuellement supprimer l'aspect "namespace" et n'avoir que MOONJ = (fun...
// - Faire des boutons undo / redo (la fonctionnalite existe deja avec ctrl-z)
// - Faire doc
// - Ajouter les shortcuts
// - A la place du isEditing il faudra plutot faire des states de l'admin pour inclure l'etat de creation d'une nouvelle page
var MOONJ = MOONJ || {};

// Namespace handler
MOONJ.namespace = function (ns_string) {
	var parts = ns_string.split('.'),
		parent = MOONJ,
		i;
	
	if (parts[0] === "MOONJ") {
		parts = parts.slice(1);
	}
	
	for (i = 0; i < parts.length; i += 1) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	
	return parent;
}

MOONJ.namespace('MOONJ.editor');

MOONJ.editor = (function (window, document, $, undefined) {
	// Private properties
	var _BASE_DIR = "http://www.illfish.fr/moonjelly/static/templates/",
		_editableAreas = ["article", ".mj"],
		_isEditing = false,
		_popupsOpen = [],
		_currentElement,
		_htmlContentSnapshot =[],
	
	// Private methods
		// _editableAreas
		_getEditableAreas = function () {
			var i,
				newEditableAreas = [];
				
			newEditableAreas[0] = _editableAreas[0];
				
			for (i = 1, j = _editableAreas.length; i < j; i += 1) {
				newEditableAreas[i] = " " + _editableAreas[i];
			}
			
			return newEditableAreas.toString();
		},
		_setEditableAreas = function (valueToSet, saveOver) {
			var newEditableAreas = [];
			if (saveOver) {
				newEditableAreas = valueToSet;
			} else {
				if ($.isArray(valueToSet)) {
					newEditableAreas = _editableAreas.concat(valueToSet);	
				} else if (typeof valueToSet === "string") {
					newEditableAreas = _editableAreas;
					newEditableAreas.push(valueToSet);
				} else {
					return;
				}
			}
			_editableAreas = newEditableAreas;
		},
		_getEditableAreasChilds = function (selector) {
			var i,
				result;
			
			if (_editableAreas.length !== 0) {
				result = _editableAreas[0] + " " + selector;
				for (i = 1, j = _editableAreas.length; i < j; i += 1) {
					result += ", " + _editableAreas[i] + " " + selector;
				}
			}
			
			return result;
		}
		// _isEditing
		_getIsEditing = function () {
			return _isEditing;
		},
		_setIsEditing = function (valueToSet) {
			var i;
		
			_isEditing = valueToSet;
			
			$(_getEditableAreas()).attr("contentEditable", (valueToSet === true) ? true : false);
			$(_getEditableAreas()).toggleClass("mjIsEditable", (valueToSet === true) ? true : false);
			$(_getEditableAreas()).sortable("option", "disabled", (valueToSet === true) ? false : true);
			
			$("#mjSaveButton, #mjDiscardButton, #mjHelpEditionMessage").toggleClass("mjHidden", (valueToSet === true) ? false : true);
			$("#mjEditButton, #mjNewPageButton, #mjSiteAdminLink, #mjPageAdminLink").toggleClass("mjHidden", (valueToSet === true) ? true : false);
			
			if (valueToSet) {

				_setHtmlContentSnapshot();

				$(_getEditableAreas()).bind('mouseup keyup', function (e) {
					
					_setCurrentElement(e.target);
					
					$('.currentEditable').removeClass('currentEditable');
					$(_currentElement).addClass('currentEditable');
				});
				
				$(_getEditableAreas()).mouseenter(function (e) {
					$(_getEditableAreasChilds("img")).css("cursor", "move");
				});
				
				$(_getEditableAreas()).mouseleave(function (e) {
					$(_getEditableAreasChilds("img")).css("cursor", "inherit");
				});
				
			} else {

				_clearHtmlContentSnapshot();

				$("#mjImagesButtons, #mjTextButtons").toggleClass("mjHidden", true);
				$('.currentEditable').removeClass('currentEditable');
				$(".mjToolbarButton ").toggleClass("mjSelected", false);
				$(_getEditableAreas()).unbind('mouseup keyup');
				$(_getEditableAreas()).unbind('mouseenter mouseleave');
			}
		},
		_createPageState = function () {
			$("#mjEditButton, #mjNewPageButton, #mjSiteAdminLink, #mjPageAdminLink").toggleClass("mjHidden", true);
			$("#mjNewPageButtons, #mjCreateButton, #mjDiscardButton").toggleClass("mjHidden", false);
			$("body *:not(#mjAdmin, #mjAdmin *)").toggleClass("mjHidden", true);
		},
		_hidePageCreation = function () {
			$("#mjEditButton, #mjNewPageButton, #mjSiteAdminLink, #mjPageAdminLink").toggleClass("mjHidden", false);
			$("#mjNewPageButtons, #mjCreateButton, #mjDiscardButton").toggleClass("mjHidden", true);
			$("body *:not(#mjAdmin, #mjAdmin *)").toggleClass("mjHidden", false);
		},
		// _popupsOpen
		_getPopupsOpen = function () {
			return _popupsOpen;
		},
		_setPopupsOpen = function (valueToSet) {
			var newPopupsOpen = [];
			if ($.isArray(valueToSet)) {
				newPopupsOpen = _popupsOpen.concat(valueToSet);	
			} else if (typeof valueToSet === "string") {
				newPopupsOpen = _popupsOpen;
				newPopupsOpen.push(valueToSet);
			} else {
				return;
			}
			_popupsOpen = newPopupsOpen;
		},
		_openPopup = function (popupId) {
			var _arguments = Array.prototype.slice.call(arguments),
				args,
				i;
			
			if (_arguments.length > 1) {
				args = _arguments.slice(1);
			}
			
			if ($("#mjAdmin #" + popupId).length === 0){
				$.ajax({
					url : "templates/" + popupId + ".html",
					success : function (data) {
						$("#mjAdmin").append(data);
					},
					async : false,
					dataType : "html"
				});
			}
			
			$("#mjAdmin #" + popupId).css("z-index", 999);

			for (i = 0, j = _popupsOpen.length; i < j; i += 1) {
				if (_popupsOpen[i] !== popupId) {
					$("#mjAdmin #" + _popupsOpen[i]).css("z-index", function () {
						return $("#mjAdmin #" + _popupsOpen[i]).css("z-index") - 2;
					});
				}
			}
	
			$("#mjAdmin #mjadminOverlay").css("height", $(window).height());
			$("#mjAdmin #mjadminOverlay").toggleClass("mjHidden", false);
			$("#mjAdmin #" + popupId).css("top", ($(window).height() / 2) - ($("#mjAdmin #" + popupId).height() / 2));
			$("#mjAdmin #" + popupId).css("left", ($(window).width() / 2) - ($("#mjAdmin #" + popupId).width() / 2));
			$("#mjAdmin #" + popupId).toggleClass("mjHidden", false);
			
			_setPopupsOpen(popupId);
			
		},
		// _currentElement
		_getCurrentElement = function () {
			return _currentElement;
		},
		_setCurrentElement = function (valueToSet) {
			if (valueToSet.nodeName === "IMG") {
				_currentElement = valueToSet;
			} else {
				_currentElement = _getCaretSelection().focusNode;
				if (!_currentElement.nodeName || _currentElement.nodeName === "#text") { _currentElement = _currentElement.parentNode; }
			}
			_updateToolbar();
		},
		_updateToolbar = function () {
			if (_getCaretSelection() && _getCaretSelection() !== null && _getCaretSelection() !== undefined) {
				$("#mjHelpEditionMessage").toggleClass("mjHidden", true);
			}
			
			if (!_currentElement) {
				$("#mjHelpEditionMessage").toggleClass("mjHidden", false);
				$("#mjImagesButtons").toggleClass("mjHidden", true);
				$("#mjTextButtons").toggleClass("mjHidden", true);
				
				return false;
			}
			
			$(".mjToolbarButton").toggleClass("mjSelected", false);
			if (_currentElement.nodeName === "IMG") {
				if ($("#mjImagesButtons").hasClass("mjHidden")) {
					$("#mjTextButtons").toggleClass("mjHidden", true);
					$("#mjImagesButtons").toggleClass("mjHidden", false);
				}
				if (_currentElement.parentNode.nodeName === "FIGURE") {
					$("#mjToolbarFieldImageLegend").val($(_currentElement.parentNode.lastChild).text());
				} else {
					$("#mjToolbarFieldImageLegend").val("");
				}
				if ($(_currentElement).css("float") === "left") {
					$("#mjToolbarButtonFloatLeft").toggleClass("mjSelected", true);
				}
				if ($(_currentElement).css("float") === "none" || !$(_currentElement).css("float")) {
					$("#mjToolbarButtonFloatNone").toggleClass("mjSelected", true);
				}
				if ($(_currentElement).css("float") === "right") {
					$("#mjToolbarButtonFloatRight").toggleClass("mjSelected", true);
				}
			} else {
				if ($("#mjTextButtons").hasClass("mjHidden")) {
					$("#mjTextButtons").toggleClass("mjHidden", false);
					$("#mjImagesButtons").toggleClass("mjHidden", true);
				}
				// TODO : Voir comment les commands gerent l'ajout de bold, italic,... pour pouvoir tester les bonnes conditions (STRONG, EM,...)
				// !! Attention : il faudra faire cette verification pour tous les navigateurs (mais pas faire de condition sur le browser dans le code...)
				console.log($(_currentElement).css("font-weight"));
				if ($(_currentElement).css("font-weight") === "bold" || $(_currentElement).css("font-weight") > 400 || _currentElement.nodeName === "STRONG") {
					$("#mjToolbarButtonBold").toggleClass("mjSelected", true);
				}
				if ($(_currentElement).css("font-style") === "italic" || _currentElement.nodeName === "EM") {
					$("#mjToolbarButtonItalic").toggleClass("mjSelected", true);
				}
				if ($(_currentElement).css("text-decoration") === "underline" || _currentElement.nodeName === "U") {
					$("#mjToolbarButtonUnderline").toggleClass("mjSelected", true);
				}
				if ($(_currentElement).css("text-align") === "right") {
					$("#mjToolbarButtonAlignRight").toggleClass("mjSelected", true);
				} else if ($(_currentElement).css("text-align") === "center") {
					$("#mjToolbarButtonAlignCenter").toggleClass("mjSelected", true);
				} else {
					$("#mjToolbarButtonAlignLeft").toggleClass("mjSelected", true);
				}
				if (_currentElement.nodeName === "UL") {
					$("#mjToolbarButtonUnordoList").toggleClass("mjSelected", true);
				}
				if (_currentElement.nodeName === "OL") {
					$("#mjToolbarButtonOrdoList").toggleClass("mjSelected", true);
				}
				if (_currentElement.nodeName === "LI") {
					if (_currentElement.parentNode.nodeName === "UL") {
						$("#mjToolbarButtonUnordoList").toggleClass("mjSelected", true);
					} else if (_currentElement.parentNode.nodeName === "OL") {
						$("#mjToolbarButtonOrdoList").toggleClass("mjSelected", true);
					}
				}
				if (_currentElement.nodeName === "H1") {
					$("#mjToolbarButtonStyle").text("Tr&egrave;s grand titre");
				} else if (_currentElement.nodeName === "H2") {
					$("#mjToolbarButtonStyle").text("Grand titre");
				} else if (_currentElement.nodeName === "H3") {
					$("#mjToolbarButtonStyle").text("Titre moyen");
				} else if (_currentElement.nodeName === "H4") {
					$("#mjToolbarButtonStyle").text("Petit titre");
				} else if (_currentElement.nodeName === "H5") {
					$("#mjToolbarButtonStyle").text("Tr&egrave;s petit titre");
				} else {
					$("#mjToolbarButtonStyle").text("Paragraphe");
				}
			}
		},
		// _htmlContentSnapshot
		_getHtmlContentSnapshot = function () {
			return _htmlContentSnapshot;
		},
		_setHtmlContentSnapshot = function () {
			var i;
				
			for (i = 0, j = _editableAreas.length; i < j; i += 1) {				
				_htmlContentSnapshot[i] = [];
				
				$(_editableAreas[i]).each(function (k) {
					_htmlContentSnapshot[i][k] = $(this).html();
				});
			}
		},
		_clearHtmlContentSnapshot = function () {
			_htmlContentSnapshot = [];
		},

		// _caretSelection
		_getCaretSelection = function () {
			if (window.getSelection) {
				return window.getSelection();
			} else if (document.getSelection) {
				return document.getSelection();
			} else {
				var selection = document.selection && document.selection.createRange();
				if (selection.text) {
					return selection.text;
				}
				return false;
			}
			return false;
		},
		// _exec
		_exec = {
			bold : function () {document.execCommand("bold", false, null); MOONJ.editor.exec.postExec();},
			italic : function () {document.execCommand("italic", false, null); MOONJ.editor.exec.postExec();},
			underline : function () {document.execCommand("underline", false, null); MOONJ.editor.exec.postExec();},
			alignLeft : function () {document.execCommand("justifyLeft", false, null); MOONJ.editor.exec.postExec();},
			alignCenter : function () {document.execCommand("justifyCenter", false, null); MOONJ.editor.exec.postExec();},
			alignRight : function () {document.execCommand("justifyRight", false, null); MOONJ.editor.exec.postExec();},
			orderedList : function () {document.execCommand("insertOrderedList", false, null); MOONJ.editor.exec.postExec();},
			unorderedList : function () {document.execCommand("insertUnorderedList", false, null); MOONJ.editor.exec.postExec();},
			createLink : function () {var urlPrompt = prompt("Enter URL:", "http://"); document.execCommand("createLink", false, urlPrompt); MOONJ.editor.exec.postExec();},
			insertImage : function () {var urlPrompt = prompt("Enter Image URL:", "http://"); document.execCommand("insertImage", false, urlPrompt); MOONJ.editor.exec.postExec();},
			formatBlock : function (block) {document.execCommand("formatBlock", false, block); MOONJ.editor.exec.postExec(); MOONJ.editor.exec.postExec();},
			copy : function () {document.execCommand("copy", false, null); MOONJ.editor.exec.postExec();},
			paste : function () {document.execCommand("paste", false, null); MOONJ.editor.exec.postExec();},
			floatLeft : function () {$(_currentElement).css("float", "left"); MOONJ.editor.exec.postExec();},
			floatNone : function () {$(_currentElement).css("float", "none"); MOONJ.editor.exec.postExec();},
			floatRight : function () {$(_currentElement).css("float", "right"); MOONJ.editor.exec.postExec();},
			addImageLegend : function () {$(_currentElement).wrap("<figure></figure>"); $("<figcaption>" + $("#mjToolbarFieldImageLegend").val() + "</figcaption>").insertAfter(_currentElement); MOONJ.editor.exec.postExec();},
			removeImageLegend : function () {				
				if (_currentElement.parentNode.nodeName === "FIGURE") {
					$(_currentElement.parentNode.lastChild).remove();
					$(_currentElement).unwrap();
					 MOONJ.editor.exec.postExec();
				}
			},
			changeImage : function () {var urlPrompt = prompt("Enter Image URL:", "http://"); $(_currentElement).attr("src", urlPrompt); MOONJ.editor.exec.postExec();},
			removeImage : function () {$(_currentElement).remove(); _currentElement = null; MOONJ.editor.exec.postExec();},
			postExec : function () {_updateToolbar(); $(_getEditableAreasChilds("*")).not("img").addClass("notDraggable");}
		},
		_init = function () {
			$.ajax({
				url : "templates/mjAdmin.html",
				success : function (data) {
					$("body").append(data);
					
					$("#mjEditButton").click(function () {
						_setIsEditing(true);
					});

					$("#mjDiscardButton").click(function () {
						var i,
							k;

						// TODO : Mieux gerer avec des states
						if (_isEditing) {
							for (i = 0, j = _htmlContentSnapshot.length; i < j; i += 1) {
								$(_editableAreas[i]).each(function (k) {
									$(_editableAreas[i].toString()).html(_htmlContentSnapshot[i][k]);
								});
							}	
						} else {
							_hidePageCreation();
						}
						
						_setIsEditing(false);
					});

					$("#mjSaveButton").click(function () {
						// TODO : on fera le vrai save ici en passant par sanitize
						var i;
						
						for (i = 0, j = _editableAreas.length; i < j; i += 1) {
							$(_editableAreas[i].toString()).each(function (k) {
								console.log("SAVED : " + _editableAreas[i]);
								console.log($(this).html());
							});
						}
						
						_setIsEditing(false);
						
						return false;
					});

					$("#mjCreateButton").click(function () {
						console.log("NEW PAGE");
						
						return false;
					});

					$("#mjNewPageButton").click(function () {
						_createPageState();
					});
					
					$("#mjToolbarButtonStyle").click(function () {
						$("#mjToolbarButtonStyleLayer").toggleClass("mjHidden");
						$("#mjToolbarButtonStyleLayer").offset({ top : $("#mjToolbarButtonStyle").offset().top + 27, left : $("#mjToolbarButtonStyle").offset().left });
						$("#mjToolbarButtonStyle").toggleClass("mjSelected");
						return false;
					});
					$("#mjToolbarButtonStyleLayer a").click(function (e) {
						$("#mjToolbarButtonStyleLayer").toggleClass("mjHidden");
						$("#mjToolbarButtonStyle").text($(e.target).text());
						return false;
					});

					$("#mjToolbarButtonCategory").click(function () {
						$("#mjToolbarButtonCategoryLayer").toggleClass("mjHidden");
						$("#mjToolbarButtonCategoryLayer").offset({ top : $("#mjToolbarButtonCategory").offset().top + 27, left : $("#mjToolbarButtonCategory").offset().left });
						$("#mjToolbarButtonCategory").toggleClass("mjSelected");
						return false;
					});
					$("#mjToolbarButtonCategoryLayer a").click(function (e) {
						$("#mjToolbarButtonCategoryLayer").toggleClass("mjHidden");
						$("#mjToolbarButtonCategory").text($(e.target).text());
						return false;
					});
					
					$("#mjToolbarButtonType").click(function () {
						$("#mjToolbarButtonTypeLayer").toggleClass("mjHidden");
						$("#mjToolbarButtonTypeLayer").offset({ top : $("#mjToolbarButtonType").offset().top + 27, left : $("#mjToolbarButtonType").offset().left });
						$("#mjToolbarButtonType").toggleClass("mjSelected");
						return false;
					});
					$("#mjToolbarButtonTypeLayer a").click(function (e) {
						$("#mjToolbarButtonTypeLayer").toggleClass("mjHidden");
						$("#mjToolbarButtonType").text($(e.target).text());
						return false;
					});

					$("#mjSiteAdminLink").click(function () {
						$("#mjSiteLayer").toggleClass("mjHidden");
						$("#mjSiteLayer").offset({ top : $("#mjSiteAdminLink").offset().top + 35, left : $("#mjSiteAdminLink").offset().left + 7 });
						$("#mjSiteAdminLink").toggleClass("mjSelected");
						return false;
					});
					$("#mjSiteLayer a").click(function (e) {
						$("#mjSiteLayer").toggleClass("mjHidden");
						return false;
					});

					$("#mjPageAdminLink").click(function () {
						$("#mjPageLayer").toggleClass("mjHidden");
						$("#mjPageLayer").offset({ top : $("#mjPageAdminLink").offset().top + 35, left : $("#mjPageAdminLink").offset().left + 7 });
						$("#mjPageAdminLink").toggleClass("mjSelected");
						return false;
					});
					$("#mjPageLayer a").click(function (e) {
						$("#mjPageLayer").toggleClass("mjHidden");
						return false;
					});

					$(_getEditableAreasChilds("*")).not("img").addClass("notDraggable");
					$(_getEditableAreas()).sortable({
						items : "> *",
						placeholder: "draggablePlaceholder",
						forcePlaceholderSize: true,
						cancel: ".notDraggable",
						disabled : true
					});
					
					// Text buttons
					$("#mjToolbarButtonBold", "#mjAdmin").click(function () {_exec.bold.apply(this); return false;});
					$("#mjToolbarButtonItalic", "#mjAdmin").click(function () {_exec.italic.apply(this); return false;});
					$("#mjToolbarButtonUnderline", "#mjAdmin").click(function () {_exec.underline.apply(this); return false;});
					$("#mjToolbarButtonAlignLeft", "#mjAdmin").click(function () {_exec.alignLeft.apply(this); return false;});
					$("#mjToolbarButtonAlignCenter", "#mjAdmin").click(function () {_exec.alignCenter.apply(this); return false;});
					$("#mjToolbarButtonAlignRight", "#mjAdmin").click(function () {_exec.alignRight.apply(this); return false;});
					$("#mjToolbarButtonAddLink", "#mjAdmin").click(function () {_exec.createLink.apply(this); return false;});
					$("#mjToolbarButtonAddImage", "#mjAdmin").click(function () {_exec.insertImage.apply(this); return false;});
					$("#mjToolbarButtonOrdoList", "#mjAdmin").click(function () {_exec.orderedList.apply(this); return false;});
					$("#mjToolbarButtonUnordoList", "#mjAdmin").click(function () {_exec.unorderedList.apply(this); return false;});
					$("#mjToolbarButtonStyleP", "#mjAdmin").click(function () {_exec.formatBlock.apply(this, ["<P>"]); return false;});
					$("#mjToolbarButtonStyleH1", "#mjAdmin").click(function () {_exec.formatBlock.apply(this, ["<H1>"]); return false;});
					$("#mjToolbarButtonStyleH2", "#mjAdmin").click(function () {_exec.formatBlock.apply(this, ["<H2>"]); return false;});
					$("#mjToolbarButtonStyleH3", "#mjAdmin").click(function () {_exec.formatBlock.apply(this, ["<H3>"]); return false;});
					$("#mjToolbarButtonStyleH4", "#mjAdmin").click(function () {_exec.formatBlock.apply(this, ["<H4>"]); return false;});
					$("#mjToolbarButtonStyleH5", "#mjAdmin").click(function () {_exec.formatBlock.apply(this, ["<H5>"]); return false;});
					// Images buttons
					$("#mjToolbarFieldImageLegend").change(function () {($("#mjToolbarFieldImageLegend").val()) ? _exec.addImageLegend.apply(this) : _exec.removeImageLegend.apply(this);});
					$("#mjToolbarButtonFloatLeft", "#mjAdmin").click(function () {_exec.floatLeft.apply(this); return false;});
					$("#mjToolbarButtonFloatNone", "#mjAdmin").click(function () {_exec.floatNone.apply(this); return false;});
					$("#mjToolbarButtonFloatRight", "#mjAdmin").click(function () {_exec.floatRight.apply(this); return false;});
					$("#mjToolbarButtonChangeImage", "#mjAdmin").click(function () {_exec.changeImage.apply(this); return false;});
					$("#mjToolbarButtonRemoveImage", "#mjAdmin").click(function () {_exec.removeImage.apply(this); return false;});

					// TODO : Ajouter les shortcuts
				},
				async : false,
				dataType : "html"
			});
		};

	// Init
	// On doit d'abord surveiller l'ouverture d'une session admin (extension ou url) et ensuite appeler l'init reel

	//x On met le contenu du success de l'ajac init dans une methode privee _init.
	//- On place l'ecouteur d'ext et un ecouteur sur l'url ?admin.
	//- On place lorsque l'on ouvre une session admin, on appelle _onAdmin
	//- _onAdmin, on va appeler _init puis openPopup login.
	//- Dans la popup login, on va appeler une methode _login a la validation

	// Listening the chrome extension event
	document.addEventListener("moonjellyClicked", function () {
		_init();
		_openPopup("mjLoginPopup", "chrome_ext");
	}, true);

	_init();
	//_openPopup("mjLoginPopup", "chrome_ext");
	
	
	// Revealed MOONJ.editor API
	return {
		// _editableAreas
		getEditableAreas : _getEditableAreas,
		setEditableAreas : _setEditableAreas,
		editableAreas : function (valueToSet, saveOver) {
			if (arguments.length !== 0) {
				_setEditableAreas(valueToSet, saveOver);
			} else {
				return _getEditableAreas();
			}
		},
		getEditableAreasChilds : _getEditableAreasChilds,
		// _isEditing
		getIsEditing : _getIsEditing,
		setIsEditing : _setIsEditing,
		isEditing : function (isEditing) {
			if (arguments.length !== 0) {
				_setIsEditing(isEditing);
			} else {
				return _getIsEditing();
			}
		},
		// _popupsOpen
		getPopupsOpen : _getPopupsOpen,
		openPopup : _openPopup,
		closePopup : function (popupId) {
			var i;
			
			for (i = 0, j = _popupsOpen.length; i < j; i += 1) {
				if (_popupsOpen[i] === popupId) {
					$("#mjAdmin #" + _popupsOpen[i]).toggleClass("mjHidden", true);
					$("#mjAdmin #mjadminOverlay").toggleClass("mjHidden", true);
					_popupsOpen.splice(i, 1);
					
					return;
				}
			}
		},
		closeAllPopups : function () {
			var i;
			
			for (i = 0, j = _popupsOpen.length; i < j; i += 1) {
				$("#mjAdmin #" + _popupsOpen[i]).toggleClass("mjHidden", true);
			}

			$("#mjAdmin #mjadminOverlay").toggleClass("mjHidden", true);
			
			_popupsOpen = [];
		},
		// _currentElement
		getCurrentElement : _getCurrentElement,
		setCurrentElement : _setCurrentElement,
		currentElement : function (valueToSet) {
			if (arguments.length !== 0) {
				_setCurrentElement(valueToSet);
			} else {
				return _getCurrentElement();
			}
		},
		// _caretSelection
		getCaretSelection : _getCaretSelection,
		// _exec
		exec : _exec
	};
})(this, document, jQuery);