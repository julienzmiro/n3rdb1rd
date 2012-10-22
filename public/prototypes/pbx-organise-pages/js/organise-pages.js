$(document).ready(function() {
	var doublePageMode = false,
		isDragging = false,
		pageModeLabel = "page",
		mouseX = 0,
		mouseY = 0,
		mainLayout = function() {
		$("#editionArea").css("height", function() {
			return pbxpcui.contentHeight() - $("#libArea").height() - 60;
		});
		$(".buttonBar.mainActions").css("left", function() {
			return ($("#editionToolsBar .center").width() / 2) - ($(".buttonBar.mainActions").width() / 2);
		});
		$("#content").width(($(window).width() - 60));
		$("#content").height($("#editionArea").height());
	},
		setCurrentPage = function(newPage) {
			var pageSelectorDom = $(".pageSelector");
			$(".currentPage").removeClass("currentPage");
			$(newPage).addClass("currentPage");
			$(".pageSelector").detach();
			if(doublePageMode) {
				$(newPage).find(".pageWrapper").each(function(index) {
					if($(this).hasClass("left")) {
						$(this).find("footer").prepend(pageSelectorDom);	
					} else if($(this).hasClass("right")) {
						$(".pageSelector").clone().prependTo($(this).find("footer"));
					}
				});
			} else {
				$(newPage).find("footer").prepend(pageSelectorDom);
			}
	},
		changePageBackgroundColor = function(color, page) {
			var direction = {},
				bgString = "background: #" + color + ";";

			direction = direction = {
				from: $(page).closest(".pageWrapper").hasClass("left") ? "right" : "left",
				to: $(page).closest(".pageWrapper").hasClass("left") ? "left" : "right"
			};

			bgString += "background: -moz-linear-gradient(" + direction.from + ",  rgba(0,0,0,0.7) 0%, rgba(79,79,79,0.4) 5%, rgba(186,186,186,0.5) 14%, rgba(170,170,170,0) 100%), #" + color + ";";
			bgString += "background: -webkit-gradient(linear, " + direction.from + " top, " + direction.to + " top, color-stop(0%,rgba(0,0,0,0.7)), color-stop(5%,rgba(79,79,79,0.4)), color-stop(14%,rgba(186,186,186,0.5)), color-stop(100%,rgba(170,170,170,0))), #" + color + ";";
			bgString += "background: -webkit-linear-gradient(" + direction.from + ",  rgba(0,0,0,0.7) 0%,rgba(79,79,79,0.4) 5%,rgba(186,186,186,0.5) 14%,rgba(170,170,170,0) 100%), #" + color + ";";
			bgString += "background: -o-linear-gradient(" + direction.from + ",  rgba(0,0,0,0.7) 0%,rgba(79,79,79,0.4) 5%,rgba(186,186,186,0.5) 14%,rgba(170,170,170,0) 100%), #" + color + ";";
			bgString += "background: -ms-linear-gradient(" + direction.from + ",  rgba(0,0,0,0.7) 0%,rgba(79,79,79,0.4) 5%,rgba(186,186,186,0.5) 14%,rgba(170,170,170,0) 100%), #" + color + ";";
			bgString += "background: linear-gradient(" + direction.from + ",  rgba(0,0,0,0.7) 0%,rgba(79,79,79,0.4) 5%,rgba(186,186,186,0.5) 14%,rgba(170,170,170,0) 100%), #" + color + ";";
			$(page).attr("style", bgString);
	},
		resetMouseCursors = function() {
			if(!isDragging) {
				$(".dpWrapper:not(.coverWrapper)").css("cursor", "move");
				$(".dpWrapper:not(.coverWrapper) .pageWrapper").css("cursor", "");
				$(".libContent img, .pageContent img").css("cursor", "-moz-grab");
				$("#container").css("cursor", "default");
			}	
	},
		displayTooltip = function(msg) {
			hideTooltip();
			$("#tooltip").html(msg);
			window.setTimeout(function() {
				$("#tooltip").css("display", "block");
			}, 100);
	},
		hideTooltip = function() {
			$("#tooltip").css("display", "none");
	},
		applyStaticLayout = function(page, layoutId) {
			// TODO : rendre dynamique grace au layoutId et a un objet qui contiendra les infos du layout (nb photos, coordonnes, ...)
			// TODO : cropper les images pour ne pas les deformer
			var nImg = $(page).find("img").length;
			while(nImg > 3) {
				$(page).find("img:last").detach();
				nImg -= 1;
			}
			$(page).find("img:eq(0)").css("width", "45px");
			$(page).find("img:eq(0)").css("height", "80px");
			$(page).find("img:eq(0)").css("left", "5px");
			$(page).find("img:eq(0)").css("top", "8px");

			$(page).find("img:eq(1)").css("width", "60px");
			$(page).find("img:eq(1)").css("height", "40px");
			$(page).find("img:eq(1)").css("left", "55px");
			$(page).find("img:eq(1)").css("top", "8px");

			$(page).find("img:eq(2)").css("width", "60px");
			$(page).find("img:eq(2)").css("height", "40px");
			$(page).find("img:eq(2)").css("left", "55px");
			$(page).find("img:eq(2)").css("top", "50px");
	},
		refreshPageLayout = function(page) {
			// TODO : Refresh double page avec melange des photos d'une page a l'autre
			// TODO : Voir pour faire mise en page sans chevauchements
			var nWidth,
				nHeight,
				nImg = $(page).find("img").length,
				maxWidth = 100,
				maxHeight = 80,
				minWidth = maxWidth / nImg * (Math.random() * (0.9 - 0.4) + 0.4),
				minHeight = maxHeight / nImg * (Math.random() * (0.9 - 0.4) + 0.4);

			if(doublePageMode) {
				$(page).closest(".dpWrapper").find(".pageContent").each(function(index){
					$(this).find("img").each(function(index) {
						if($(this).width() > $(this).height()) {
							nWidth = Math.floor((Math.random() * (maxWidth - minWidth) + minWidth));
							nHeight = nWidth * ($(this).height() / $(this).width());
							$(this).css("width", nWidth);
							$(this).css("height", nHeight);
						} else {
							nHeight = Math.floor((Math.random() * (maxHeight - minHeight) + minHeight));
							nWidth = nHeight * ($(this).width() / $(this).height());
							$(this).css("height", nHeight);
							$(this).css("width", nWidth);
						}
						$(this).css("left", function() {
							var nLeft = Math.random() * (123 - $(this).width());
							return nLeft;
						});
						$(this).css("top", function() {
							var nTop = Math.random() * (85 - $(this).height());
							return nTop;
						});
					});
				});
			} else {
				$(page).find("img").each(function(index) {
					if($(this).width() > $(this).height()) {
						nWidth = Math.floor((Math.random() * (maxWidth - minWidth) + minWidth));
						nHeight = nWidth * ($(this).height() / $(this).width());
						$(this).css("width", nWidth);
						$(this).css("height", nHeight);
					} else {
						nHeight = Math.floor((Math.random() * (maxHeight - minHeight) + minHeight));
						nWidth = nHeight * ($(this).width() / $(this).height());
						$(this).css("height", nHeight);
						$(this).css("width", nWidth);
					}
					$(this).css("left", function() {
						var nLeft = Math.random() * (123 - $(this).width());
						return nLeft;
					});
					$(this).css("top", function() {
						var nTop = Math.random() * (85 - $(this).height());
						return nTop;
					});
				});
			}
	},
		addImageToPage = function(imageObject, pageObject) {
			$(imageObject).removeClass("libImgDrag");
			$(imageObject).removeClass("ui-draggable");
			$(imageObject).addClass("pageImg");
			$(imageObject).draggable("destroy");

			$(pageObject).append(imageObject);

			refreshPageLayout(pageObject);
			initUI();
	},
		replaceImage = function(newImg, oldImg) {
			// TODO : Faire en sorte que les images inversees ne puissent pas deborder de leurs nouvelles pages
			var newImgRatio = $(newImg).width() / $(newImg).height(),
				apertureW = $(oldImg).width(),
				apertureH = $(oldImg).height();

			$(oldImg).attr("src", $(newImg).attr("src"));

			if($(newImg).css("width") > $(newImg).css("height")) {
				$(oldImg).css("width", apertureW + "px");
				$(oldImg).css("height", function() {
					var result = apertureW / newImgRatio + "px";
					return result;
				});
			} else {
				$(oldImg).css("height", apertureH + "px");
				$(oldImg).css("width", function() {
					var result = apertureH * newImgRatio + "px";
					return result;
				});
			}

			initUI();
	},
		invertImages = function(imgDragged, imgDroppable) {
			// TODO : Faire en sorte que les images inversees ne puissent pas deborder de leurs nouvelles pages
			var imgASrc = $(imgDragged).attr("src"),
				imgBSrc = $(imgDroppable).attr("src"),
				imgAWidth = $(imgDragged).width(),
				imgBWidth = $(imgDroppable).width(),
				imgAHeight =  $(imgDragged).height(),
				imgBHeight =  $(imgDroppable).height();

			$(imgDragged).attr("src", imgBSrc);
			$(imgDroppable).attr("src", imgASrc);

			if(imgAWidth > imgAHeight) {
				console.log("OK");
				$(imgDroppable).css("width", imgBWidth + "px");
				$(imgDroppable).css("height", function() {
					return imgBWidth * (imgAHeight / imgAWidth) + "px";
				});
			} else {
				$(imgDroppable).css("height", imgBHeight + "px");
				$(imgDroppable).css("width", function() {
					return imgBHeight * (imgAWidth / imgAHeight) + "px";
				});
			}
			if(imgBWidth > imgBHeight) {
				$(imgDragged).css("width", imgAWidth + "px");
				$(imgDragged).css("height", function() {
					return imgAWidth * (imgBHeight / imgBWidth) + "px";
				});
			} else {
				$(imgDragged).css("height", imgAHeight + "px");
				$(imgDragged).css("width", function() {
					return imgAHeight * (imgBWidth / imgBHeight) + "px";
				});
			}
			initUI();
	},
		moveImage = function(img, newPage) {
			var imgContainer = $(img).closest(".pageContent");
			$(newPage).append(img);
			$(img).css("top", "5px");
			$(img).css("left", "5px");
			refreshPageLayout(newPage);
			initUI();
	},
		addImageDroppableHoverEffect = function(img) {
			var layer = '<div class="layerImgDroppable"></div>';

			$(img).closest(".pageContent").append(layer);
			$(".layerImgDroppable").width($(img).width());
			$(".layerImgDroppable").height($(img).height());
			$(".layerImgDroppable").css("top", $(img).css("top"));
			$(".layerImgDroppable").css("left", $(img).css("left"));
	},
		rmImageDroppableHoverEffect = function(img) {
			$(".layerImgDroppable").remove();
	},
		addImageDraggableHoverEffect = function(img) {
			var layer = '<div class="layerImgDraggable"></div>';

			$(img).closest(".pageContent").append(layer);
			$(".layerImgDraggable").width($(img).width());
			$(".layerImgDraggable").height($(img).height());
			$(".layerImgDraggable").css("top", $(img).css("top"));
			$(".layerImgDraggable").css("left", $(img).css("left"));
	},
		rmImageDraggableHoverEffect = function(img) {
			$(".layerImgDraggable").remove();
	},
		addImageDraggredSourceEffect = function(img) {
			var layer = '<div class="layerImgDraggedSource"></div>';

			$(img).closest(".pageContent").append(layer);
			$(".layerImgDraggedSource").width($(img).width());
			$(".layerImgDraggedSource").height($(img).height());
			$(".layerImgDraggedSource").css("top", $(img).css("top"));
			$(".layerImgDraggedSource").css("left", $(img).css("left"));
	},
		rmImageDraggredSourceEffect = function(img) {
			$(".layerImgDraggedSource").remove();
	},
		removeImage = function(img) {
			window.setTimeout(function() {
				$(img).remove();
			}, 100);
	},
	// Interactions methods
		initUI = function() {

			$(".libContent img").draggable("destroy");
			$(".pageContent img").draggable("destroy");
			$(".dpWrapper").droppable("destroy");
			$(".dpWrapper .pageWrapper").droppable("destroy");
			$(".pageContent img").droppable("destroy");
			/*$("#container").droppable("destroy");*/
			/*$("#content").sortable("destroy");*/

			$(".libContent img").draggable({
				revert: "invalid",
				opacity: 0.7,
				cursor: "-moz-grabbing",
				cursorAt: {
					top: -5,
					left: -5
				},
				helper: 'clone',
				zIndex: 990,
				start: function(event, ui) {
					isDragging = true;
				},
				stop: function(event, ui) {
					isDragging = false;
				}
			});
			$(".pageContent img").draggable({
				revert: "invalid",
				opacity: 0.7,
				cursor: "-moz-grabbing",
				cursorAt: {
					top: -5,
					left: -5
				},
				helper: 'clone',
				zIndex: 990,
				start: function(event, ui) {
					addImageDraggredSourceEffect(this);
					if(doublePageMode) {
						$(this).closest(".dpWrapper").addClass("currentDraggedImg");	
					} else {
						$(this).closest(".pageWrapper").addClass("currentDraggedImg");
					}
					isDragging = true;
				},
				stop: function(event, ui) {
					rmImageDraggredSourceEffect(this);
					$(".currentDraggedImg").removeClass("currentDraggedImg");
					isDragging = false;
				}
			});

			if(doublePageMode) {
				$(".dpWrapper").droppable({
					accept: '.libContent img, .pageContent img',
					tolerance: 'pointer',
					greedy: true,
					over: function(event, ui) {
						if(!$(this).closest(".dpWrapper").hasClass("currentDraggedImg")) {
							$(this).css("cursor", "-moz-grabbing");
							if($(ui.draggable).parent().hasClass("pageContent")) {
								displayTooltip("Move this photo to this " + pageModeLabel);
							} else {
								displayTooltip("Add this photo to this " + pageModeLabel);
							}
							$(this).find(".pageWrapper").each(function(index) {
								$(this).addClass("pageWrapperDroppableHover");
							});
							$(this).find(".pageWrapper.left .pageContent").addClass("pageContentDroppableHoverLeft");
							$(this).find(".pageWrapper.right .pageContent").addClass("pageContentDroppableHoverRight");	
						}
					},
					out: function(event, ui) {
						if(!$(this).closest(".dpWrapper").hasClass("currentDraggedImg")) {
							hideTooltip();
							$(this).find(".pageWrapper").each(function(index) {
								$(this).removeClass("pageWrapperDroppableHover");
							});
							$(this).find(".pageWrapper.left .pageContent").removeClass("pageContentDroppableHoverLeft");
							$(this).find(".pageWrapper.right .pageContent").removeClass("pageContentDroppableHoverRight");
						}
					},
					drop: function(event, ui) {
						if(!$(this).closest(".dpWrapper").hasClass("currentDraggedImg")) {
							var randomPn = Math.random();
							isDragging = false;
							hideTooltip();
							resetMouseCursors();
							$(".currentDraggedImg").removeClass("currentDraggedImg");
							$(this).find(".pageWrapper").each(function(index) {
								$(this).removeClass("pageWrapperDroppableHover");
							});
							$(this).find(".pageWrapper.left .pageContent").removeClass("pageContentDroppableHoverLeft");
							$(this).find(".pageWrapper.right .pageContent").removeClass("pageContentDroppableHoverRight");
							if($(ui.draggable).parent().hasClass("pageContent")) {
								if(randomPn > 0.4) {
									moveImage($(ui.draggable), $(this).find(".left .pageContent"));
								} else {
									moveImage($(ui.draggable), $(this).find(".right .pageContent"));
								}
							} else {
								if(randomPn > 0.4) {
									addImageToPage($(ui.draggable).clone(), $(this).find(".left .pageContent"));
								} else {
									addImageToPage($(ui.draggable).clone(), $(this).find(".right .pageContent"));
								}
							}
							setCurrentPage($(this));
						}
			        }
				});
			} else {
				$(".dpWrapper .pageWrapper").droppable({
					accept: '.libContent img, .pageContent img',
					tolerance: 'pointer',
					greedy: true,
					over: function(event, ui) {
						if(!$(this).closest(".pageWrapper").hasClass("currentDraggedImg")) {
							$(this).css("cursor", "-moz-grabbing");
							if($(ui.draggable).parent().hasClass("pageContent")) {
								displayTooltip("Move this photo to this " + pageModeLabel);
							} else {
								displayTooltip("Add this photo to this " + pageModeLabel);
							}
							$(this).addClass("pageWrapperDroppableHover");
							$(this).find(".pageContent").addClass("pageContentDroppableHover");
						}
					},
					out: function(event, ui) {
						if(!$(this).closest(".pageWrapper").hasClass("currentDraggedImg")) {
							hideTooltip();
							$(this).removeClass("pageWrapperDroppableHover");
							$(this).find(".pageContent").removeClass("pageContentDroppableHover");
						}
					},
					drop: function(event, ui) {
						if(!$(this).closest(".pageWrapper").hasClass("currentDraggedImg")) {
							isDragging = false;
							hideTooltip();
							resetMouseCursors();
							$(".currentDraggedImg").removeClass("currentDraggedImg");
							$(this).removeClass("pageWrapperDroppableHover");
				        	$(this).find(".pageContent").removeClass("pageContentDroppableHover");
				        	if($(ui.draggable).parent().hasClass("pageContent")) {
								moveImage($(ui.draggable), $(this).find(".pageContent"));
							} else {
								addImageToPage($(ui.draggable).clone(), $(this).find(".pageContent"));
							}
				        	setCurrentPage($(this));
						}
			        }
				});
			}
			$(".pageContent img").droppable({
				accept: '.libContent img, .pageContent img',
				tolerance: 'pointer',
				greedy: true,
				over: function(event, ui) {
					$(this).css("cursor", "-moz-grabbing");
					if($(ui.draggable).parent().hasClass("pageContent")) {
						displayTooltip("Invert these photos");
					} else {
						displayTooltip("Replace this photo");
					}
					addImageDroppableHoverEffect(this);
				},
				out: function(event, ui) {
					hideTooltip();
					rmImageDroppableHoverEffect(this);
				},
				drop: function(event, ui) {
					isDragging = false;
					hideTooltip();
					resetMouseCursors();
					$(".currentDraggedImg").removeClass("currentDraggedImg");
					rmImageDroppableHoverEffect(this);
					if($(ui.draggable).parent().hasClass("pageContent")) {
						invertImages($(ui.draggable), $(this));
					} else {
						replaceImage($(ui.draggable), this);
					}

		        	if(doublePageMode) {
		        		setCurrentPage($(this).closest(".dpWrapper"));
		        	} else {
		        		setCurrentPage($(this).closest(".pageWrapper"));
		        	}
		        }
			});
			$("#content").sortable({
				placeholder: "dpSortablePlaceholder",
				containment: 'parent',
				cursor: "move",
				cursorAt: {
					top: -5,
					left: -5
				},
				items: '.dpWrapper:not(#dpWrapperCover, #dpWrapperBackCover)',
				opacity: 0.7
			});
			/*
			$("#container").droppable({
				accept: '.pageContent img',
				tolerance: 'pointer',
				greedy: true,
				over: function(event, ui) {
					displayTooltip("Remove this photo");
				},
				out: function(event, ui) {
					hideTooltip();
				},
				drop: function(event, ui) {
					hideTooltip();
					resetMouseCursors();
		        	removeImage($(ui.draggable));
		        }
			});
			$("#libArea").resizable({
				handles: 'n'
			});
			*/
	};

	// Listeners
	$(window).resize(function() {
		mainLayout();
	});
	var z = 0;
	$(".pageWrapper").bind("mouseover", function(e) {
		if(doublePageMode) {
			$(this).closest(".dpWrapper").find(".pageWrapper").each(function(index) {
				$(this).addClass("pageWrapperHover");
				if($(this).hasClass("right") && !isDragging) {
					$(this).find("header a").css("display", "block");
				}
			});
		} else {
			$(this).addClass("pageWrapperHover");
			$(this).find("header a").each(function(index) {
				if(!isDragging) {
					$(this).css("display", "block");	
				}
			});
		}
	});
	$(".pageWrapper").bind("mouseout", function(e) {
		if(doublePageMode) {
			$(this).closest(".dpWrapper").find(".pageWrapper").each(function(index) {
				$(this).removeClass("pageWrapperHover");
				if($(this).hasClass("right")) {
					$(this).find("header a").css("display", "none");	
				}
			});
		} else {
			$(this).removeClass("pageWrapperHover");
			$(this).find("header a").each(function(index) {
				$(this).css("display", "none");
			});
		}
	});
	$("#checkboxPageMode").bind("click", function(e) {
		$(this).toggleClass("selected");
		if(doublePageMode) {
			doublePageMode = false;
			pageModeLabel = "page";
			setCurrentPage($(".pageSelector:first").closest(".pageWrapper"));
			$("#btnAddPage").html("Add page");
			$("#btnRemovePage").html("Remove page");
			$(".buttonBar.mainActions").css("left", function() {
				return ($("#editionToolsBar .center").width() / 2) - ($(".buttonBar.mainActions").width() / 2);
			});
		} else {
			doublePageMode = true;
			pageModeLabel = "double page";
			setCurrentPage($(".pageSelector").closest(".dpWrapper"));
			$("#btnAddPage").html("Add double page");
			$("#btnRemovePage").html("Remove double page");
			$(".buttonBar.mainActions").css("left", function() {
				return ($("#editionToolsBar .center").width() / 2) - ($(".buttonBar.mainActions").width() / 2);
			});
		}
		initUI();
		return null;
	});
	$(".dpWrapper").bind("click", function(e) {
		if(doublePageMode) {
			setCurrentPage($(this));
		} else {
			setCurrentPage($(e.target).closest(".pageWrapper"));
		}
	});
	$(".dpWrapper:not(.coverWrapper)").bind("mouseover", function(e) {
		if(!isDragging) {
			$(this).css("cursor", "move");	
		}
	});
	$(".dpWrapper:not(.coverWrapper)").bind("mouseout", function(e) {
		if(!isDragging) {
			$(this).css("cursor", "default");
		}
	});
	$(".pageContent img").bind("mouseover", function(e) {
		if(!isDragging) {
			$(this).css("cursor", "-moz-grab");
		}
	});
	$(".pageContent img").bind("mouseout", function(e) {
		if(!isDragging) {
			$(this).css("cursor", "default");
		}
	});
	$("#libTab").bind("click", function(e) {
		if($(e.target).attr("id") == "libTabBg") {
			$("#libTab").find(".current").removeClass("current");
			$("#libTabBg").addClass("current");
			$("#libArea").find(".libContentContainer.current").removeClass("current");
			$("#libArea .libBg").addClass("current");
		} else if($(e.target).attr("id") == "libTabPhotos") {
			$("#libTab").find(".current").removeClass("current");
			$("#libTabPhotos").addClass("current");
			$("#libArea").find(".libContentContainer.current").removeClass("current");
			$("#libArea .libPhotos").addClass("current");
		} else if($(e.target).attr("id") == "libTabLayouts") {
			$("#libTab").find(".current").removeClass("current");
			$("#libTabLayouts").addClass("current");
			$("#libArea").find(".libContentContainer.current").removeClass("current");
			$("#libArea .libLayouts").addClass("current");
		}
		return false;
	});
	$(".libBg .colorItem").bind("click", function(e) {
		if(doublePageMode) {
			$(".currentPage").find(".pageWrapper").each(function(index) {
				changePageBackgroundColor($(e.target).attr("data-color"), $(this).find(".pageContent"));
			});	
		} else {
			changePageBackgroundColor($(e.target).attr("data-color"), $(".currentPage").find(".pageContent"));
		}
	});
	$(".libLayouts .layoutItem").bind("click", function(e) {
		if($(e.target).parent().attr("id") == "layoutItem01") {
			if(doublePageMode) {
				applyStaticLayout($(".currentPage").closest(".dpWrapper").find(".pageContent:eq(0)"), $(e.target).parent().attr("data-layoutid"));	
			} else {
				applyStaticLayout($(".currentPage").find(".pageContent"), $(e.target).parent().attr("data-layoutid"));
			}
		}
		return false;
	});
	$(".btnSmallShufflePage").bind("click", function(e) {
		if(doublePageMode) {
			$(e.target).closest(".dpWrapper").find(".pageContent").each(function(index) {
				refreshPageLayout($(this));
			});
		} else {
			refreshPageLayout($(e.target).closest(".pageWrapper").find(".pageContent"));	
		}
		return false;
	});
	$(document).bind("mousemove", function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
		$("#tooltip").css("left", mouseX);
		$("#tooltip").css("top", mouseY - 40);
	})

	// Init
	mainLayout();
	initUI();
});