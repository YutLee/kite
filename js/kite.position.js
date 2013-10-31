(function(){
		$.fn.extend({
		autoposition: function(timeout) {
			var that = $(this);
			timeout = timeout || 500;
			var left = 100, 
				top = 100,
				right = 100,
				bottom = 100;
			ap();
			function ap() {
				setTimeout(function() {
					var l = $(window).width() - that.outerWidth() - that.offset().left,
						t = $(window).height() - that.outerHeight() - that.offset().top;
						
					
					ap();				
				}, timeout);
			}
		}
	});
})(jQuery);
