(function($, undefined) {
	
	var kite = window.kite,
		ui = kite.ui,
		Widget = ui.Widget;
	
	var Draggable = Widget.extend({
		init: function(element, options) {
			var that = this;
			element = $(element);			
			Widget.fn.init.call(that, element, options);

			var o = that.options;
			
			if($.browser.msie && document.documentMode == 7) { //fix the mousedown event bug for ie7 
				element.css({'min-height':0});
			}
			
			element.bind({
				mousedown: function(e) {
					var self = $(this);

					var getPosition = that.getPosition(element, element.parent()),
						positionLeft = getPosition.left,
						positionTop = getPosition.top;
						//alert(positionTop);
					var dragLeft = e.pageX - that.dragOffset(self, self.parent()).left + positionLeft,
						dragTop = e.pageY - that.dragOffset(self, self.parent()).top + positionTop;
					var containment = false,
						minLeft = 0,
						minTop = 0,
						contElement,
						hadPosition = that.hadPosition(self);
						
					if(typeof(o.containment) === 'string') {
						var cont = $(o.containment);
						if(cont.length != 0) {
							containment = true;
							contElement = cont;
							minLeft = -that.getPosition(element, contElement).left;
							minTop = -that.getPosition(element, contElement).top;
						}
						if(o.containment == 'parent') {	
							containment = true;
							contElement = element.parent();
							if(hadPosition.isStatic || hadPosition.isRelative) {
								minLeft = -that.getPosition(element, contElement).left;
								minTop = -that.getPosition(element, contElement).left;
							}else {
								minLeft = ((contElement.offset().left + that.getBorder(contElement).left + that.getPadding(contElement).left) - (element.offsetParent().offset().left + that.getBorder(element.offsetParent()).left));
								minTop = ((contElement.offset().top + that.getBorder(contElement).top + that.getPadding(contElement).top) - (element.offsetParent().offset().top + that.getBorder(element.offsetParent()).top));
							}
						}
					}
					$(document).bind({
						mousemove: function(e) {
							var 
								isFixed = hadPosition.isFixed,
								isAbsolute = hadPosition.isAbsolute,
								parentLeft = isFixed ? 0 : that.parentOffset(self.parent()).left,
								parentTop = isFixed ? 0 : that.parentOffset(self.parent()).top,
								left = e.pageX - parentLeft - dragLeft,
								top = e.pageY - parentTop - dragTop;
							
							//drag start to reaize the drag x and y
							that.start = o.start || $.noop;
							if(!self.hasClass('k-draggable-dragging')) {
								that.start();
							}
							if(hadPosition.isStatic) {
								self.css({
									'position': 'relative'
								})
							}
							

							if(containment) {
								var parent = that.getContainment(self, contElement, minLeft, minTop, left, top);
									left = parent.left;
									top = parent.top;
							}

							
							if(o.axis && o.axis == 'x') {
								self.css({'left': left});
							}else if(o.axis && o.axis == 'y') {
								self.css({'top': top});
							}else {
								self.css({
									'left': left,
									'top': top
								});
							}
							
							self.addClass('k-draggable-dragging');
							//drag
							that.drag = o.drag || $.noop;
							that.drag();
							return false;
						},
					    mouseup: function(e) {
					    	//drag end
					    	that.stop = o.stop || $.noop;
					    	that.stop();
					    	self.removeClass('k-draggable-dragging');
					    	$(document).unbind('mousemove').unbind('mouseup');
					    	
					  		return false;
					  	}
					});
					return false;
				}
			});
		},
		options: {
			name: 'Draggable',
			axis: false,
			cursor: 'auto',
			containment: false
		},
		getContainment: function(el, contEl, minLeft, minTop, left, top) {
			var that = this,
				hadPosition = that.hadPosition(el);
			
				var selfParent = contEl,
					maxLeft = minLeft + (selfParent.width() - el.outerWidth(true)),
					maxTop = minTop + (selfParent.height() - el.outerHeight(true));
					
				left = left <= minLeft ? minLeft : (left > maxLeft ? maxLeft : left);
				top = top <= minTop ? minTop : (top > maxTop ? maxTop : top);
			
			return {
				left: left,
				top: top
			};
		},
		parentOffset: function(a) {
			var that = this,
				left = a.offset().left,
				top = a.offset().top;
			return {
				left: left,
				top: top
			};
		},
		dragOffset: function(a, parentEl) {
			var that = this,
				parentPadding = that.getPadding(parentEl),
				parentBorder = that.getBorder(parentEl),
				marginTop = (parentPadding.top == 0 && parentBorder.top == 0) ? 0 : that.getMargin(a).top,
				left = a.offset().left - that.getMargin(a).left - parentPadding.left - parentBorder.left,
				top = a.offset().top - marginTop - parentPadding.top - parentBorder.top;
			return {
				left: left,
				top: top
			};
		},
		getMargin: function(a) {
			return {
				left: parseInt(a.css('marginLeft'), 10) || 0,
				top: parseInt(a.css('marginTop'), 10) || 0
			};
		},
		getPadding: function(a) {
			return {
				left: parseInt(a.css('paddingLeft'), 10),
				top: parseInt(a.css('paddingTop'), 10)
			};
		},
		getBorder: function(a) {
			return {
				left: parseInt(a.css('borderLeftWidth'), 10) || 0,
				top: parseInt(a.css('borderTopWidth'), 10) || 0
			};
		},
		getPosition: function(a, parentEl) {
			var that = this,
				pEl = parentEl,
				hadPosition = that.hadPosition(a),
				offsetLeft = that.dragOffset(a, pEl).left - that.parentOffset(pEl).left,
				offsetTop = that.dragOffset(a, pEl).top - that.parentOffset(pEl).top,
				positionLeft = parseInt(a.css('left'), 10),
				positionTop = parseInt(a.css('top'), 10),
				positionRight = parseInt(a.css('right'), 10),
				positionBottom = parseInt(a.css('bottom'), 10),
				initPositionLeft = -(a.offset().left - (a.offset().left - pEl.offset().left - that.getBorder(pEl).left - that.getPadding(pEl).left)  - a.offsetParent().offset().left - that.getBorder(a.offsetParent()).left),
				initPositionTop = -(a.offset().top - (a.offset().top - pEl.offset().top - that.getBorder(pEl).top - that.getPadding(pEl).top) - a.offsetParent().offset().top - that.getBorder(a.offsetParent()).top),
				initFixedPositionLeft = 0,//-(a.offset().left - (a.offset().left - pEl.offset().left - that.getBorder(pEl).left - that.getPadding(pEl).left) - $('body').offset().left - that.getBorder($('body')).left),
				initFixedPositionTop = 0,//-(a.offset().top - (a.offset().top - pEl.offset().top - that.getBorder(pEl).top - that.getPadding(pEl).top) - $('body').offset().top - that.getBorder($('body')).top),
				left, 
				top;
			if(hadPosition.isStatic) {
				left = offsetLeft;
				top = offsetTop;
			}else if(hadPosition.isRelative) {
				left = offsetLeft - (positionLeft || -positionRight || 0);
				top = offsetTop - (positionTop || -positionBottom || 0);
			}else if(hadPosition.isAbsolute) {
				left = (positionLeft || positionRight) ? offsetLeft - (positionLeft || -positionRight || 0) : initPositionLeft;
				top = (positionTop || positionBottom) ? offsetTop - (positionTop || -positionBottom || 0) : initPositionTop;
			}else {
				left = (positionLeft || positionRight) ? that.dragOffset(a, pEl).left - (positionLeft || -positionRight || 0) : initFixedPositionLeft;
				top = (positionTop || positionBottom) ? that.dragOffset(a, pEl).top - (positionTop || -positionBottom || 0) : initFixedPositionTop;
			}
			return {
				left: left,
				top: top
			}
		},
		getScroll: function(a) {
			return {
				left: a.scrollLeft(),
				top: a.scrollTop()
			};
		},
		hadPosition: function(a) {
			var position = a.css('position'),
				isStatic = false,
				isRelative = false,
				isAbsolute = false,
				isFixed = false;
			if(position == 'static') {
				isStatic = true;
			}else if(position == 'relative') {
				isRelative = true;
			}else if(position == 'absolute') {
				isAbsolute = true;
			}else if(position == 'fixed') {
				isFixed = true;
			}
			return {
				isStatic: isStatic,
				isRelative: isRelative,
				isAbsolute: isAbsolute,
				isFixed: isFixed
			};
		}
		
	})

	kite.ui.plugin(Draggable);
	
})(jQuery);