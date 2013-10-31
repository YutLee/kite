(function($, undefined) {
	var kite = window.kite,
		ui = kite.ui,
		Widget = ui.Widget;
		
	var Tabs = Widget.extend({
		init: function(element, options) {
			var that = this;
			that.element = element;
			Widget.fn.init.call(that, element, options);
			var o = that.options,
				el = that.element;
			//that.tabify();
			that.create(el);
			var item = el.children('ul').children('li'),
				content = el.children('div');
			if(o.event !== 'mouseover') {
				item.bind(o.event, function() {
					var self = $(this);
					self.addClass('k-tabs-item-select').siblings('.k-tabs-item-select').removeClass('k-tabs-item-select');
					content.eq(that.getIndex(self)).show().siblings('.k-tabs-content').hide();
				});
				item.hover(function() {
					$(this).addClass('k-tabs-item-hover');
				}, function() {
					$(this).removeClass('k-tabs-item-hover');
				});	
			}
			
			
		},
		options: {
			name: 'Tabs',
			event: 'click'
		},
		create: function(a) {
			a.children('ul').children('li').addClass('k-tabs-item').first().addClass('k-tabs-item-first k-tabs-item-select').end().last().addClass('k-tabs-item-last');
			a.children('div').addClass('k-tabs-content').first().show();
		},
		tabify: function() {
			var that = this,
				el = that.element,
				o = that.options;
			that.list = el.find('ol, ul').eq(0);
			that.lis = $(' >li:has(a[href])', that.list);
			alert(that.lis);
		},
		getIndex: function(a) {
			return a.index();
		}
	});
	
	ui.plugin(Tabs);
})(jQuery);
