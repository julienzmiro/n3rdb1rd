/*
TODO :
X Ajouter une bordure aux éléments éditables lorsque edit est on
X Supprimer dans le js le code qui permet d'afficher la toolbar toujours au top de la fenetre (redondant avec fixed)
X Méler les css admin et jquery.contenteditable (et nettoyer la 2eme)
X Nettoyer le js jquery.contenteditable
X Voir l'utilité de sanitize
- IMPORTANT : comme ecrit dans la css, il faudra construire tous les elements html de l'admin dans un seul container (un overlay de la page pour l'admin) ce qui permettra de factoriser certains styles
- Faire le style de la toolbar
- Refaire les boutons de la toolbar
- Faire un vrai discard
- Faire un save node
- Gérer la session côté node
- Vérifier la session au save node
- Charger l'admin seulement si la session isAdmin côté node
- V2 : proposer des toolbars pour chaque type de block (image, texte, formContact,...) administrable (lors de la définition d'un nouveau bloc, on définit les controles qui permettent de l'editer depuis la toolbar) une toolbar texte et une autre toolbar image (et peut être d'autres comme formContact) selon la balise sur laquelle le curseur se trouve (getSelected). La toolbar peut s'afficher juste au dessus de l'élément.
  http://stackoverflow.com/questions/497094/how-do-i-find-out-which-javascript-element-has-focus
  
- ATTENTION BUG : Quand on effectue une execCommand sur un élément, il perd ses classes (dont notDraggable). Il faudrait les conserver.
	Il faudrait peut etre faire une methode postExecCommand pour appliquer certaines regles (dont la reactualisation des notDraggable).
- ATTENTION : Il faudra penser à récupérer le nom de l'élément en cours afin de le mettre en tant que text du styleButton
- ATTENTION : Il faut trouver une solution lorsque l'utilisateur sélectionne à la fois du texte et une image.
- IMPORTANT : Il faut faire un objet MjEditor
  
*/
window.TESTAB = 1;
window.MOONJ = (function ($) {
	$(document).ready(function () {

		var _isEditing = false,
		_rootEditable = "article, .fresheditable",
		_rootEditableImages = "article img, .fresheditable img",
		_isAPopupOpen =false;
		
		var currentElement;

		// A deplacer
		document.addEventListener('moonjellyClicked', function() {
			if(!_isAPopupOpen) {
				buildMjLoginPopup("chrome_ext");
			}
		});
			
		// Return selection of text (used to retrieve currentElement)
		function getSelected() {
			if(window.getSelection) { return window.getSelection(); }
			else if(document.getSelection) { return document.getSelection(); }
			else {
				var selection = document.selection && document.selection.createRange();
				if(selection.text) { return selection.text; }
				return false;
			}
			return false;
		}

		// Switch between edition on / off
		function setEditMode(isEditing) {
			_isEditing = isEditing;

			$(_rootEditable).fresheditor("edit", _isEditing);

			$('.currentEditable').removeClass('currentEditable');
			//$('#mjSaveButton, #mjDiscardButton, #mjHelpEditionMessage').toggleClass("mjHidden", !_isEditing);
			//$('#mjEditButton, #mjNewPageButton, #mjSiteAdminLink, #mjPageAdminLink').toggleClass("mjHidden", _isEditing);
			$(_rootEditable).toggleClass("mjIsEditable");
			$(_rootEditable).sortable('option', 'disabled', !_isEditing);

			if(isEditing) {
				$('#mjSaveButton, #mjDiscardButton, #mjHelpEditionMessage').toggleClass("mjHidden", false);
				$('#mjEditButton, #mjNewPageButton, #mjSiteAdminLink, #mjPageAdminLink').toggleClass("mjHidden", true);
				// Detect current element
				$(_rootEditable).bind('mouseup keyup', function (e) {
					console.log("Event : " + e.type);
					
					
					if(e.target.nodeName === "IMG") {
						currentElement = e.target;
						showEditorToolbar(currentElement);
					}
					else {
						currentElement = getSelected().focusNode;
						if (!currentElement.nodeName || currentElement.nodeName === "#text") { currentElement = currentElement.parentNode; }
						showEditorToolbar(currentElement);
					}
					$('.currentEditable').removeClass('currentEditable');
					
					$(currentElement).addClass('currentEditable');
					/*
					$(currentElement).addClass('notDraggable');
					*/
					console.log('Current element : ' + currentElement.nodeName);
				});
				
				// Change images cursor on rollover
				$(_rootEditableImages).mouseenter(function(e) {
					console.log("hover img");
					$(_rootEditableImages).css('cursor', 'move');
				});
				$(_rootEditableImages).mouseleave(function(e) {
					console.log("leave img");
					$(_rootEditableImages).css('cursor', 'inherit');
				});
			}
			else {
				$('#mjSaveButton, #mjDiscardButton, #mjHelpEditionMessage').toggleClass("mjHidden", true);
				$('#mjEditButton, #mjNewPageButton, #mjSiteAdminLink, #mjPageAdminLink').toggleClass("mjHidden", false);
				hideEditorToolbar();
				$(_rootEditable).unbind('mouseup keyup');
				$(_rootEditableImages).unbind('mouseenter mouseleave');
			}
		}

		function buildMjLoginPopup(source) {
			var _overlay,
					_loginPopup;
			_overlay = '<div id="mjadminOverlay" style="height : ' + $(window).height() + 'px;"></div>';
    	_loginPopup = _overlay
    								+ '<div id="mjLoginPopup" class="mjPopup">'
    								+ '\n \t'
    								+ '<header>'
    								+ '\n \t \t'
    								+ '<h1>Connexion &agrave; l\'administration</h1>'
    								+ '\n \t'
    								+ '</header>'
    								+ '\n \t'
    								+ '<form id="mjFormLogin">'
    								+ '\n \t \t'
    								+ '<input type="password" placeholder="Mot de passe" />'
    								+ '\n \t'
    								+ '</form>'
    								+ '\n \t'
    								+ '<a href="" title="Cliquez ici si vous avez perdu votre mot de passe.">Mot de passe perdu ?</a>'
    								+ '\n \t'
    								+ '<footer>'
    								+ '\n \t \t'
    								+ '<a href="" title="Annuler la connexion au site">Annuler</a>'
    								+ '\n \t \t'
    								+ '<input type="submit" form="mjFormLogin" value="Se connecter" class="mjMainButton" />'
    								+ '\n \t'
    								+ '</footer>'
    								+ '\n'
    								+ '</div>';
    	$("body").append(_loginPopup);
    	_isAPopupOpen = true;
		}
		
		function buildMjToolbars(callback) {
			var _adminContainer,
					_mainHeader,
					_subHeader,
					_textToolbar,
					_imagesToolbar;

			_textToolbar = '<div id="mjTextButtons" class="mjToolbar mjHidden">'
						+ '\n \t'
						+ '<ul class="mjToolbarSection">'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonBold" class="mjToolbarButton" title="Gras (Ctrl+B)">B</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonItalic" class="mjToolbarButton" title="Italique (Ctrl+I)" >I</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonUnderline" class="mjToolbarButton" title="Soulignement (Ctrl+U)">U</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonClear" title="Supprimer les styles (Ctrl+M)" class="mjToolbarButton mjLast">&minus;</a></li>'
						+ '\n \t'
						+ '</ul>'
						+ '\n \t'
						+ '<ul class="mjToolbarSection">'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonAlignLeft" title="Aligner le text &agrave; gauche" class="mjToolbarButton">&nbsp;</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonAlignCenter" title="Aligner le text au centre" class="mjToolbarButton">&nbsp;</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonAlignRight" title="Aligner le text &agrave; droite" class="mjToolbarButton mjLast">&nbsp;</a></li>'
						+ '\n \t'
						+ '</ul>'
						+ '\n \t'
						+ '<ul class="mjToolbarSection">'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonAddLink" title="Ajouter un lien vers une page (Ctrl+L)" class="mjToolbarButton">@</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" id="mjToolbarButtonAddImage" title="Ajouter une image (Ctrl+G)" class="mjToolbarButton mjLast">&nbsp;</a></li>'
						+ '\n \t'
						+ '</ul>'
						+ '\n \t'
						+ '<ul class="mjToolbarSection">'
						+ '\n \t \t'
						+ '<li><a href="#" title="Cr&eacute;er une liste ordonn&eacute;e (Ctrl+Alt+U)" id="mjToolbarButtonOrdoList" class="mjToolbarButton">&nbsp;</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" title="Cr&eacute;er une liste &agrave; puces (Ctrl+Alt+O)" id="mjToolbarButtonUnordoList" class="mjToolbarButton mjLast">&nbsp;</a></li>'
						+ '\n \t'
						+ '</ul>'
						+ '\n \t'
						+ '<a href="#" id="mjToolbarButtonStyle" title="Changer le style d\'affichage de votre texte">Paragraphe</a>'
						+ '\n \t'
						+ '<div id="mjToolbarButtonStyleLayer" class="mjHidden">'
						+ '\n \t \t'
						+ '<a href="#" title="Changer en paragraphe (Ctrl+Alt+0)" id="mjToolbarButtonStyleP" class="mjToolbarButtonStyleLayerButton">Paragraphe</a>'
						+ '\n \t \t'
						+ '<a href="#" title="Changer en tr&egrave;s grand titre (Ctrl+Alt+1)" id="mjToolbarButtonStyleH1" class="mjToolbarButtonStyleLayerButton">Tr&egrave;s grand titre</a>'
						+ '\n \t \t'
						+ '<a href="#" title="Changer en grand titre (Ctrl+Alt+2)" id="mjToolbarButtonStyleH2" class="mjToolbarButtonStyleLayerButton">Grand titre</a>'
						+ '\n \t \t'
						+ '<a href="#" title="Changer en titre moyen (Ctrl+Alt+3)" id="mjToolbarButtonStyleH3" class="mjToolbarButtonStyleLayerButton">Titre moyen</a>'
						+ '\n \t \t'
						+ '<a href="#" title="Changer en petit titre (Ctrl+Alt+4)" id="mjToolbarButtonStyleH4" class="mjToolbarButtonStyleLayerButton">Petit titre</a>'
						+ '\n \t \t'
						+ '<a href="#" title="Changer en tr&egrave;s petit titre (Ctrl+Alt+5)" id="mjToolbarButtonStyleH5" class="mjToolbarButtonStyleLayerButton mjLast">Tr&egrave;s petit titre</a>'
						+ '\n \t'
						+ '</div>'
						+ '\n'
						+ '</div>';
			
			_imagesToolbar = '<div id="mjImagesButtons" class="mjToolbar mjHidden">'
						+ '\n \t'
						+ '<ul class="mjToolbarSection">'
						+ '\n \t \t'
						+ '<li><a href="#" title="Link to a web page (Ctrl+L)" class="mjToolbarButton">@</a></li>'
						+ '\n \t \t'
						+ '<li><a href="#" title="Image (Ctrl+G)" class="mjToolbarButton">&nbsp;</a></li>'
						+ '\n \t'
						+ '</ul>'
						+ '\n'
						+ '</div>';

			_mainHeader = '<div id="mjMainHeader">'
										+ '\n \t'
										+ '<div class="mjLeft">'
										+ '\n \t \t'
										+ '<p>Moonjelly<span> :: Influelse</span></p>'
										+ '\n \t'
										+ '</div>'
										+ '\n \t'
										+ '<div class="mjRight">'
										+ '\n \t \t'
										+ '<a href="" title="Se déconnecter du mode administrateur" id="logoutButton">Se déconnecter</a>'
										+ '\n \t'
										+ '</div>'
										+ '\n'
										+ '</div>';

			_subHeader = '<div id="mjSubHeader">'
										+ '\n \t'
										+ '<div class="mjLeft">'
										+ '\n \t \t'
										+ '<a href="" title="Administrer ce site" id="mjSiteAdminLink">Site</a>'
										+ '\n \t \t'
										+ '<a href="" title="Administrer cette Page" id="mjPageAdminLink">Page</a>'
										+ '\n \t \t'
										+ '<p id="mjHelpEditionMessage" class="mjHidden">S&eacute;lectionnez l\'&eacute;l&eacute;ment de la page que vous souhaitez modifier</p>'
										+ '\n \t \t'
										+ _textToolbar
										+ '\n \t \t'
										+ _imagesToolbar
										+ '\n \t'
										+ '</div>'
										+ '\n \t'
										+ '<div class="mjRight">'
										+ '\n \t \t'
										+ '<button id="mjNewPageButton" title="Ajouter une nouvelle page &agrave; votre site" class="mjGreyButton">Cr&eacute;er une nouvelle page</button>'
										+ '\n \t \t'
										+ '<button id="mjEditButton" title="Editer cette page de votre" class="mjMainButton">Editer la page</button>'
										+ '\n \t \t'
										+ '<button id="mjDiscardButton" title="Annuler les changements effectu&eacute;s sur cette page" class="mjGreyButton mjHidden">Annuler</button>'
										+ '\n \t \t'
										+ '<button id="mjSaveButton" title="Sauvegarder les changements effectu&eacute;s sur cette page" class="mjMainButton mjHidden">Sauvegarder</button>'
										+ '\n \t'
										+ '</div>'
										+ '\n'
										+ '</div>';
				
			_adminContainer = '<div id="mjAdmin">'
												+ '\n \t'
												+ _mainHeader
												+ '\n \t'
												+ _subHeader
												+ '\n'
												+ '</div>';

			$("body").append(_adminContainer);
			
			if(callback) { callback(); }
		}

		function showEditorToolbar(currentElement) {
			console.log("SHOW EDITOR TB");
			$("#mjHelpEditionMessage").toggleClass("mjHidden", true);
			if(currentElement.nodeName === "IMG") {
				if($("#mjImagesButtons").hasClass("mjHidden")) {
					$("#mjTextButtons").toggleClass("mjHidden", true);
					$("#mjImagesButtons").toggleClass("mjHidden", false);
				}
			}
			else {
				if($("#mjTextButtons").hasClass("mjHidden")) {
					$("#mjTextButtons").toggleClass("mjHidden", false);
					$("#mjImagesButtons").toggleClass("mjHidden", true);
				}
			}
		}

		function hideEditorToolbar() {
			$("#mjImagesButtons").toggleClass("mjHidden", true);
			$("#mjTextButtons").toggleClass("mjHidden", true);
		}
		
		function onToolbarBuilt() {
			// Ici on devra verifier si on est admin et on devra rappeler cette fonction apres connexion en tant qu'admin
			$(_rootEditable).fresheditor();

			$("#mjEditButton").click(function () {
				setEditMode(true);
			});

			$("#mjDiscardButton").click(function () {
				setEditMode(false);
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

			$("#mjSaveButton").click(function () {
				$(_rootEditable).fresheditor("save", function (id, parsedHtml) {
						console.log(id + ": " + parsedHtml);
				});
				setEditMode(false);
			});
			$("article *").not("img").addClass("notDraggable");
			$(_rootEditable).sortable({
				items : '> *',
				placeholder: 'draggablePlaceholder',
				forcePlaceholderSize: true,
				cancel: '.notDraggable',
				disabled : true
			});
		}
		
		buildMjToolbars(onToolbarBuilt);

	});
})(jQuery);

