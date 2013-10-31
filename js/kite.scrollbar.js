/**
 * jQuery mousehold plugin - fires an event while the mouse is clicked down.
 * Additionally, the function, when executed, is passed a single
 * argument representing the count of times the event has been fired during
 * this session of the mouse hold.
 *
 * @author Remy Sharp (leftlogic.com)
 * @date 2006-12-15
 * @example $("img").mousehold(200, function(i){  })
 * @desc Repeats firing the passed function while the mouse is clicked down
 *
 * @name mousehold
 * @type jQuery
 * @param Number timeout The frequency to repeat the event in milliseconds
 * @param Function fn A function to execute
 * @cat Plugin
 */

jQuery.fn.mousehold = function(timeout, f) {
	if (timeout && typeof timeout == 'function') {
		f = timeout;
		timeout = 100;
	}
	if (f && typeof f == 'function') {
		var timer = 0;
		var fireStep = 0;
		return this.each(function() {
			jQuery(this).mousedown(function() {
				fireStep = 1;
				var ctr = 0;
				var t = this;
				timer = setInterval(function() {
					ctr++;
					f.call(t, ctr);
					fireStep = 2;
				}, timeout);
			})

			clearMousehold = function() {
				clearInterval(timer);
				if (fireStep == 1) f.call(this, 1);
				fireStep = 0;
			}
			
			jQuery(this).mouseout(clearMousehold);
			jQuery(this).mouseup(clearMousehold);
		})
	}
};

/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */ 
(function ($, h, c) {
	var a = $([]),
		e = $.resize = $.extend($.resize, {}),
		i, k = "setTimeout",
		j = "resize",
		d = j + "-special-event",
		b = "delay",
		f = "throttleWindow";
	e[b] = 200;
	e[f] = true;
	$.event.special[j] = {
		setup: function () {
			if (!e[f] && this[k]) {
				return false
			}
			var l = $(this);
			a = a.add(l);
			$.data(this, d, {
				w: l.width(),
				h: l.height()
			});
			if (a.length === 1) {
				g()
			}
		},
		teardown: function () {
			if (!e[f] && this[k]) {
				return false
			}
			var l = $(this);
			a = a.not(l);
			l.removeData(d);
			if (!a.length) {
				clearTimeout(i)
			}
		},
		add: function (l) {
			if (!e[f] && this[k]) {
				return false
			}
			var n;

			function m(s, o, p) {
				var q = $(this),
					r = $.data(this, d);
				r.w = o !== c ? o : q.width();
				r.h = p !== c ? p : q.height();
				n.apply(this, arguments)
			}
			if ($.isFunction(l)) {
				n = l;
				return m
			} else {
				n = l.handler;
				l.handler = m
			}
		}
	};

	function g() {
		i = h[k](function () {
			a.each(function () {
				var n = $(this),
					m = n.width(),
					l = n.height(),
					o = $.data(this, d);
				if (m !== o.w || l !== o.h) {
					n.trigger(j, [o.w = m, o.h = l])
				}
			});
			g()
		}, e[b])
	}
})(jQuery, this);

$.fn.extend({//添加滚轮事件//by jun
	mousewheel:function(Func){
		return this.each(function(){
			var _self = this;
		    _self.D = 0;//滚动方向
			if($.browser.msie||$.browser.safari){
			   _self.onmousewheel=function(){_self.D = event.wheelDelta;event.returnValue = false;Func && Func.call(_self);};
			}else{
			   _self.addEventListener("DOMMouseScroll",function(e){
					_self.D = e.detail>0?-1:1;
					e.preventDefault();
					Func && Func.call(_self);
			   },false); 
			}
		});
	}
});

/**
 * jQuery scrollbar 
 * @author YutLee
 * @date 2012.3.29
 * @version 1.0
 */

(function($) {
	$.fn.scrollbar = function(options) {
		var s = $.extend({
			time: 0
		},options||{});
		var o = {
			createScroll: function(a,c,s,aa,b,u,d){
				aa.append(b);
				s.append(u,aa,d).hide();
				a.wrapInner(c).append(s);
			},
			updateScroll: function(ts,scrollContent,vScroll,vScrollArea,vScrollBlock,vScrollUp,vScrollDown){
				var hasVScroll = ts.innerHeight()/scrollContent.outerHeight();
				if(hasVScroll<1){
					vScroll.show();
					var vp = vScrollBlock.outerHeight() - vScrollBlock.height();
					vScrollArea.height(vScroll.outerHeight() - vScrollUp.outerHeight() - vScrollDown.outerHeight());
					var newTop = (vScrollBlock.position().top) * hasVScroll;
					var newHeight = vScrollArea.height() * hasVScroll - vp;
					vScrollBlock.css({'height':newHeight,'top':newTop}).attr('newHeight',newHeight+vp);
				}else{
					vScroll.hide();
				}
			},
			scrollNow: function(maxTop,newTop,vScrollBlock,scrollContent,scale,scMaxTop){
				if(newTop<0){
					newTop = 0;
				}
				if(newTop>maxTop){
					newTop = maxTop;
				}
				vScrollBlock.css({'top':newTop});
				var scNewTop = (newTop*scale);
				if(scNewTop>scMaxTop){
					scNewTop = scMaxTop;
				}
				scrollContent.css({'top':-scNewTop});
			},
			updateClass: function(a,hoverClass,downClass,ud){
				a.bind({
					mouseenter: function() {
						$(this).addClass(hoverClass);
					},
					mouseleave: function() {
						if(ud){
							$(this).removeClass(hoverClass+' '+downClass);
						}else{
							$(this).removeClass(hoverClass);	
						}
					},
					mousedown: function() {
						$(this).addClass(downClass);
					},
					mouseup: function() {
						$(this).removeClass(downClass);
					}
				});
			}
		};
		return this.each(function(){
			var ts = $(this);
			var	scrollContent = $('<div>',{'class':'scrollcontent'}),
				vScroll       = $('<div>',{'class':'vscroll'}),
				vScrollArea   = $('<div>',{'class':'vscrollarea'}),
				vScrollBlock  = $('<div>',{'class':'vscrollblock'}),
				vScrollUp     = $('<div>',{'class':'vscrollup'}).html('&and;'),
				vScrollDown   = $('<div>',{'class':'vscrolldown'}).html('&or;');
			
			var vScrollBlockHover = 'vscrollblockhover',
				vScrollUpHover = 'vscrolluphover',
				vScrollDownHover = 'vscrolldownhover',
				vScrollBlockDown = 'vscrollblockdown',
				vScrollUpDown = 'vscrollupdown',
				vScrollDownDown = 'vscrolldowndown';

			o.createScroll(ts,scrollContent,vScroll,vScrollArea,vScrollBlock,vScrollUp,vScrollDown);
			
			scrollContent  = ts.children('.scrollcontent');
			vScroll        = ts.children('.vscroll');
			vScrollBlock   = ts.find('.vscrollblock');
			vScrollUp      = ts.find('.vscrollup');
			vScrollDown    = ts.find('.vscrolldown');
			vScrollArea    = ts.find('.vscrollarea');
			
			var	scale,maxTop,scMaxTop;
			
			function resetScroll(){
				scale = scrollContent.outerHeight()/vScrollArea.innerHeight();
				maxTop = vScrollArea.innerHeight()-Math.floor(parseInt(vScrollBlock.attr('newHeight')));
				scMaxTop = scrollContent.outerHeight()-ts.innerHeight();
			}
			
			o.updateScroll(ts,scrollContent,vScroll,vScrollArea,vScrollBlock,vScrollUp,vScrollDown);
			resetScroll();
			
			ts.resize(function(){
				o.updateScroll(ts,scrollContent,vScroll,vScrollArea,vScrollBlock,vScrollUp,vScrollDown);
				resetScroll();
			});
			
			scrollContent.resize(function(){
				o.updateScroll(ts,scrollContent,vScroll,vScrollArea,vScrollBlock,vScrollUp,vScrollDown);
				resetScroll();
			});
			
			
			var ord = ts.innerHeight()/scrollContent.outerHeight();
			
			if(ord<1){
				var step = 6;
				var newTop;
				
				o.updateClass(vScrollBlock,vScrollBlockHover,vScrollBlockDown,0);
				o.updateClass(vScrollUp,vScrollUpHover,vScrollUpDown,1);
				o.updateClass(vScrollDown,vScrollDownHover,vScrollDownDown,1);
				
				vScrollBlock.bind({
					mousedown: function(event){
						var vs = $(this);
						var top = event.pageY - vs.offset().top;
						$('html').bind('mousemove',function(event){
							var newTop = event.pageY-vScrollArea.offset().top-top;
							o.scrollNow(maxTop,newTop,vs,scrollContent,scale,scMaxTop);
							return false;
						}).bind('mouseup', function(event) {
						  	$(this).unbind('mousemove');
						  	vs.removeClass(vScrollBlockDown);
						});
						return false;
					}
				});
				
				vScrollUp.mousehold(20,function(){
					newTop = parseInt(vScrollBlock.css('top'))-step;
					o.scrollNow(maxTop,newTop,vScrollBlock,scrollContent,scale,scMaxTop);
					return false;
				});
				
				vScrollDown.mousehold(20,function(){
					newTop = parseInt(vScrollBlock.css('top'))+step;
					o.scrollNow(maxTop,newTop,vScrollBlock,scrollContent,scale,scMaxTop);
					return false;
				});
				
				vScrollArea.bind('mousedown',function(event){
					newTop = event.pageY-$(this).offset().top-(vScrollBlock.height()*.5);
					o.scrollNow(maxTop,newTop,vScrollBlock,scrollContent,scale,scMaxTop);
					return false;
				});
				
				ts.mousewheel(function(){
					if(this.D>0){
						newTop = parseInt(vScrollBlock.css('top'))-step;
						o.scrollNow(maxTop,newTop,vScrollBlock,scrollContent,scale,scMaxTop);
					}else{
						newTop = parseInt(vScrollBlock.css('top'))+step;
						o.scrollNow(maxTop,newTop,vScrollBlock,scrollContent,scale,scMaxTop);
					}
				});
			}
			
		});
	}
})(jQuery);
