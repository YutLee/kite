(function($){
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
})(jQuery);
