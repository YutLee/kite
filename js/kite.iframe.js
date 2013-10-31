(function($, undefined) {
	
	var kite = window.kite,
		ui  = kite.ui;
		Widget = ui.Widget;
		
	var HrefRegExp = /^(http)$/;
	
	var Iframe = Widget.extend({
		init: function(element, options) {
			var that = this,
				element = $(element);
			Widget.fn.init.call(that, element, options);
			options = that.options;
			
			/**
			 * @name kite.iframe.getIframeContent 
			 */
			element.bind(options.eventType, function(event) {
				options.url = this.href;
				if(true) {
					that.loadIframe();
				}
				event.preventDefault();
			});
		},
		options: {
			name: 'Iframe',
			eventType: 'click',
			iframe: 'k-iframe',
			type: 'GET',
			url: '',
			crossDomain: true,
			beforeSend: function() {
				$('#'+this.iframe).html('The Ajax is loading...');
			},
			success: function(msg) {
				$('#'+this.iframe).html(msg);
			},
			error: function() {
				$('#'+this.iframe).html('The Ajax is faile.');
			}
		},
		loadIframe: function() {		
			var that = this;
			$.ajax({
				type: that.options.type,
				url: that.options.url,
				dataType: 'html',
				beforeSend: function() {
					that.options.beforeSend();
				},
				success: function(msg) {
					that.options.success(msg);
					var msgChild = $('#'+that.options.iframe).find('a');
					msgChild.kiteIframe();
				},
				error: function() {
					that.options.error();
				}
			});
		}
	})
	
	
	kite.ui.plugin(Iframe);
	
})(jQuery);
