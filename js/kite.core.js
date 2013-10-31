(function($, undefined){
	/**
	 * @name kite
	 * @namespace This object contains all code introduced by the kite project, plus helper functions that are used across all Widgets.
	 */
	var kite = window.kite = window.kite || {};

	var Class = function(){}
	/**
	 * @name Class.extend
	 * @namespace A Class init() method is used to extend the classes constructor method.
	 */
	Class.extend = function(proto){
		var that = this,
			fn,
			base = function() {},
			subClass = proto && proto.init ? proto.init : function() {
				that.apply(this, arguments);
			};
		base.prototype = that.prototype;
		fn = subClass.fn = subClass.prototype = $.extend(new base, proto);
		subClass.extend = that.extend;
		return subClass;
	}
	
	
	/**
	 * @lends kite
	 */
	$.extend(kite, {
		/**
		 * @name kite.ui
		 * @namespace Contains all classes for the kite UI Widgets.
		 */
		ui: {
			
		}
	});
	
	/** 
	 * @lends kite.ui.Widget.prototype
	 */
	var Widget = Class.extend({ 
		/**
	     * Initializes Widget. Sets `element` and `options` properties.
	     * @constructs
	     * @class Represents a UI Widget. Base class for all kite Widgets
	     * @extends kite.Class
	     */
		init: function(element, options) {
			var that = this;
			that.element = $(element);
			that.options = $.extend(true, {}, that.options, options);
		}
	});
	
	
	
	/**
	 * @lends kite.ui
	 */
	$.extend(kite.ui, {
		Widget: Widget,
		/**
         * Helper method for writing new Widgets.
         * Exposes a jQuery plug-in that will handle the Widget creation and attach its client-side object in the appropriate data-kite* attribute.
         * Also triggers the init event, when the Widget has been created.
         * @name kite.ui.plugin
         * @function
         * @param {String} name The name of the Widget.
         * @param {kite.ui.Widget} Widget The Widget function.
         * @example
         * function TextBox(element, options);
         * kite.ui.plugin("TextBox", TextBox);
         *
         * // initialize a new TextBox for each input, with the given options object.
         * $("input").kiteTextBox({ });
         * // get the TextBox object and call the value API method
         * $("input").data("kiteTextBox").value();
         */
		plugin: function(widget) {
			var name = widget.fn.options.name;
			name = "kite" + name;
			$.fn[name] = function(options) {
				return this.each(function() {
					var comp = new widget(this, options);
					$(this).data(name, comp);
				});
			}
		}
	});

	
})(jQuery);