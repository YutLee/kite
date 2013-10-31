(function($, undefined) {
	
	var kite = window.kite,
		ui  = kite.ui;
		Widget = ui.Widget;
	
	
	var Popup = Widget.extend({
		init: function(element, options) {
			var that = this;
			
			Widget.fn.init.call(that, element, options);
			element = $(element);
			options = that.options;
			
			element.hide()
				.addClass('k-popup')
				.appendTo($(options.appendTo))
				.bind('mouseenter mouseleave', function(e) {
					that.hover = e.type === 'mouseenter';
				});
			
		},
		options: {
			name: 'Popup',
			toggleType: 'click',
			appendTo: 'body'
		}
	});

	ui.plugin(Popup);
	
})(jQuery);