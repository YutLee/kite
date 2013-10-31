(function($, undefined) {
	
	var kite = window.kite,
		ui  = kite.ui;
		Widget = ui.Widget;
	
	var ITEM = 'k-item',
		PANEL = 'k-panel',
		TITLE = 'k-title';
	
	var PanelBar = Widget.extend({
		init: function(element, options) {
			var that = this;
			element = $(element);
			Widget.fn.init.call(that, element, options);
			
			var item = element.find('.k-item').children('.k-title');
			that.setItem(item);
			item.bind('click', function(e) {
				that.taggleItem($(this));
				event.stopPropagation();
			});
			
		},
		options: {
			name: 'PanelBar',
			panel: 'k-panel',
			title: 'k-title',
			mode: 'multipel'	
		},
		setItem: function(item) {
			item.each(function() {
				var itemChild = $(this).next('.k-panel');
				if(itemChild.length != 0) {
					$(this).attr('href','javascript:void(0)');
				}
			});
		},
		taggleItem: function(item) {
			var itemChild = item.next('.k-panel'),
				itemDisplay = itemChild.css('display');
			var mode = this.options.mode === 'single' ? true : false;
			if(itemDisplay === 'none') {
				if(mode) {
					itemChild.parent().siblings().find('.k-panel').hide();
				}
				itemChild.show();
			}else {
				itemChild.hide();
			}
		}
	});

	kite.ui.plugin(PanelBar);
	
})(jQuery);