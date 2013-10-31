(function($, undefined) {
	var kite = window.kite,
		ui = kite.ui,
		Widget = ui.Widget;
		
	var Resizable = Widget.extend({
		init: function(element, options) {
			var that = this;
			element = $(element);
			Widget.fn.init.call(that, element, options);
			
			that.create(element);
			
			element.children('.k-resizable-e').bind('mousedown', function(e) {
				var seft = $(this);
				var left = e.pageX;
				var elementWidth = element.width();
				that.resizeStart();
				$(document).bind('mousemove', function(e) {
					var w = elementWidth + (e.pageX - left);
					that.resizing(element, w);
					return false;
				}).bind('mouseup', function(e) {
					that.resizeStop();
					return false;
				});
				return false;
			});
			
			element.children('.k-resizable-s').bind('mousedown', function(e) {
				var seft = $(this);
				var top = e.pageY;
				var elementHeight = element.height();
				that.resizeStart();
				$(document).bind('mousemove', function(e) {
					var w = 'auto',
						h = elementHeight + (e.pageY - top);
					
					that.resizing(element, w, h);
					return false;
				}).bind('mouseup', function(e) {
					that.resizeStop();
					return false;
				});
				return false;
			});
			
			element.children('.k-resizable-se').bind('mousedown', function(e) {
				var seft = $(this);
				var top = e.pageY, left = e.pageX;
				var elementHeight = element.height(),
					elementWidth = element.width();
				that.resizeStart();
				$(document).bind('mousemove', function(e) {
					var h = elementHeight + (e.pageY - top),
						w = elementWidth + (e.pageX - left);
					that.resizing(element, w, h);
					return false;
				}).bind('mouseup', function(e) {
					that.resizeStop();
					return false;
				});
				return false;
			});
			
		},
		options: {
			name: 'Resizable'
		},
		create: function(el) {
			this.handles = this.options.handles || {
				n: '.k-resizable-n', 
				e: '.k-resizable-e', 
				s: '.k-resizable-s', 
				w: '.k-resizable-w', 
				se: '.k-resizable-se', 
				sw: '.k-resizable-sw', 
				ne: '.k-resizable-ne', 
				nw: '.k-resizable-nw'
			}
			this.handles = this.handles == 'all' ? 'n,e,s,w,se,sw,ne,nw' : 'e,s,se';
			var n = this.handles.split(',');
			if(el.css('position') === 'static') {
				el.css({'position': 'relative'});
			}
			for(var i = 0; i < n.length; i++) {
				var hande = $.trim(n[i]),
					hname = 'k-resizable-' + hande,
					axis = $('<div class="' + hname + '"></div>');
				el.append(axis);
			}
		},
		resizeStart: function() {
			
		},
		resizing: function(a, w, h) {
			a.css({
				'width': w,
				'height': h
			});
		},
		resizeStop: function() {
			$(document).unbind('mousemove').unbind('mouseup');
			$('body').css({
				'cursor':'auto'
			});
		}
	});
	
	ui.plugin(Resizable);
})(jQuery);
