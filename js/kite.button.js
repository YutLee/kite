(function($, undefined) {
	var kite = window.kite,
		ui = kite.ui,
		Widget = ui.Widget;
		
	var Button = Widget.extend({
		init: function(element, options) {
			var that = this;
			that.element = element;
			Widget.fn.init.call(that, element, options);
			var baseClass = 'k-button';
			formResetHandler = function() {
				var buttons = $( this ).find( ":k-button" );
				setTimeout(function() {
					buttons.button( "refresh" );
				}, 1 );
			},
			radioGroup = function( radio ) {
				var name = radio.name,
					form = radio.form,
					radios = $( [] );
				if ( name ) {
					if ( form ) {
						radios = $( form ).find( "[name='" + name + "']" );
					} else {
						radios = $( "[name='" + name + "']", radio.ownerDocument )
							.filter(function() {
								return !this.form;
							});
					}
				}
				return radios;
			};
			that.create();
			
		},
		options: {
			name: 'Button',
			label: null
		},
		create: function() {
			this.determineButtonType();
			
			var self = this,
				el = self.element,
				options = this.options,
				toggleButton = this.type === "checkbox" || this.type === "radio",
				hoverClass = "k-state-hover" + ( !toggleButton ? " k-state-active" : "" ),
				focusClass = "k-state-focus";
			if ( options.label === null ) {
				options.label = this.buttonElement.html();
			}
			this.buttonElement.addClass('k-button')
				.attr('role','button')
				.bind( "mouseenter.button", function() {
					if ( options.disabled ) {
						return;
					}
					$( this ).addClass( "k-state-hover" );
					/*
					if ( this === lastActive ) {
						$( this ).addClass( "k-state-active" );
					}*/
				})
				.bind( "mouseleave.button", function() {
					if ( options.disabled ) {
						return;
					}
					$( this ).removeClass( hoverClass );
				})
				.bind( "click.button", function( event ) {
					if ( options.disabled ) {
						event.preventDefault();
						event.stopImmediatePropagation();
					}
				});
			if ( toggleButton ) {
				el.bind( "change.button", function() {
					if ( clickDragged ) {
						return;
					}
					self.refresh();
				});
				// if mouse moves between mousedown and mouseup (drag) set clickDragged flag
				// prevents issue where button state changes but checkbox/radio checked state
				// does not in Firefox (see ticket #6970)
				this.buttonElement
					.bind( "mousedown.button", function( event ) {
						if ( options.disabled ) {
							return;
						}
						clickDragged = false;
						startXPos = event.pageX;
						startYPos = event.pageY;
					})
					.bind( "mouseup.button", function( event ) {
						if ( options.disabled ) {
							return;
						}
						if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
							clickDragged = true;
						}
				});
			}
			
			if ( this.type === "checkbox" ) {
				this.buttonElement.bind( "click.button", function() {
					if ( options.disabled || clickDragged ) {
						return false;
					}
					$( this ).toggleClass( "k-state-active" );
					self.buttonElement.attr( "aria-pressed", self.element[0].checked );
				});
			} else if ( this.type === "radio" ) {
				this.buttonElement.bind( "click.button", function() {
					if ( options.disabled || clickDragged ) {
						return false;
					}
					$( this ).addClass( "k-state-active" );
					self.buttonElement.attr( "aria-pressed", "true" );
	
					var radio = self.element[ 0 ];
					radioGroup( radio )
						.not( radio )
						.map(function() {
							return $( this ).button( "widget" )[ 0 ];
						})
						.removeClass( "k-state-active" )
						.attr( "aria-pressed", "false" );
				});
			} else {
				this.buttonElement
					.bind( "mousedown.button", function() {
						if ( options.disabled ) {
							return false;
						}
						$( this ).addClass( "k-state-active" );
						lastActive = this;
						$( document ).one( "mouseup", function() {
							lastActive = null;
						});
					})
					.bind( "mouseup.button", function() {
						if ( options.disabled ) {
							return false;
						}
						$( this ).removeClass( "k-state-active" );
					})
					.bind( "keydown.button", function(event) {
						if ( options.disabled ) {
							return false;
						}
						if ( event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
							$( this ).addClass( "k-state-active" );
						}
					})
					.bind( "keyup.button", function() {
						$( this ).removeClass( "k-state-active" );
					});
	
				if ( this.buttonElement.is("a") ) {
					this.buttonElement.keyup(function(event) {
						if ( event.keyCode === $.ui.keyCode.SPACE ) {
							// TODO pass through original event correctly (just as 2nd argument doesn't work)
							$( this ).click();
						}
					});
				}
			}
			this.resetButton();
		},
		determineButtonType: function() {
			var el = this.element;
			if ( el.is(":checkbox") ) {
				this.type = "checkbox";
			} else if ( el.is(":radio") ) {
				this.type = "radio";
			} else if ( el.is("input") ) {
				this.type = "input";
			} else {
				this.type = "button";
			}
	
			if ( this.type === "checkbox" || this.type === "radio" ) {
				// we don't search against the document in case the element
				// is disconnected from the DOM
				var ancestor = el.parents().filter(":last"),
					labelSelector = "label[for='" + el.attr("id") + "']";
				this.buttonElement = ancestor.find( labelSelector );
				if ( !this.buttonElement.length ) {
					ancestor = ancestor.length ? ancestor.siblings() : el.siblings();
					this.buttonElement = ancestor.filter( labelSelector );
					if ( !this.buttonElement.length ) {
						this.buttonElement = ancestor.find( labelSelector );
					}
				}
				el.addClass( "k-helper-hidden-accessible" );
	
				var checked = el.is( ":checked" );
				if ( checked ) {
					this.buttonElement.addClass( "k-state-active" );
				}
				this.buttonElement.attr( "aria-pressed", checked );
			} else {
				this.buttonElement = el;
			}
		},
		refresh: function() {
			var el = this.element;
			var isDisabled = el.is( ":disabled" );
			if ( isDisabled !== this.options.disabled ) {
				this._setOption( "disabled", isDisabled );
			}
			if ( this.type === "radio" ) {
				radioGroup( el[0] ).each(function() {
					if ( $( this ).is( ":checked" ) ) {
						$( this ).button( "widget" )
							.addClass( "k-state-active" )
							.attr( "aria-pressed", "true" );
					} else {
						$( this ).button( "widget" )
							.removeClass( "k-state-active" )
							.attr( "aria-pressed", "false" );
					}
				});
			} else if ( this.type === "checkbox" ) {
				if ( el.is( ":checked" ) ) {
					this.buttonElement
						.addClass( "k-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					this.buttonElement
						.removeClass( "k-state-active" )
						.attr( "aria-pressed", "false" );
				}
			}
		},
		resetButton: function() {
			var el = this.element;
			if ( this.type === "input" ) {
				if ( this.options.label ) {
					el.val( this.options.label );
				}
				return;
			}
			var buttonElement = this.buttonElement.removeClass( '' ),
				buttonText = $( "<span></span>", el )
					.addClass( "k-button-text" )
					.html( this.options.label )
					.appendTo( buttonElement.empty() )
					.text(),
				icons = this.options.icons,
				buttonClasses = [];  
			
			buttonClasses.push( "k-button-text-only" );

			buttonElement.addClass( buttonClasses.join( " " ) );
		}
	});
	
	ui.plugin(Button);
})(jQuery);
