//Swipenav is based on:
// addSwipe :: adding swipe gesture support to a layer http://lazaworx.com/addswipe-plugin/
//with updates and revisions by Cole Thorsen (impulsestudios.ca)

(function($) {

	$.extend( $.support, {
		touch: "ontouchend" in document
	});
	
	// Easing function by George Smith
	
	$.extend( jQuery.easing, {
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
	
	$.fn.addSwipe = function( leftFn, rightFn, settings ) {
		
		settings = $.extend( {}, $.fn.addSwipe.defaults, settings );
		var effect = settings.snapGrid? 'easeOutBack' : 'easeOutQuad';
		
		return this.each(function() {
			
			var t = $(this);
			var xs, dist, ex = 0, ey = 0, tx = 0, ty = 0, tx1 = 0, x0, tt, speed;
			
			//t.attr('draggable', 'true');
			
			// retrieving the event's X position
			
			var getX = function(e) {
				return ex = ( e.touches && e.touches.length > 0 )? e.touches[0].clientX : ( e.clientX ? e.clientX : ex );
			};
			
			var getY = function(e) {
				return ey = ( e.touches && e.touches.length > 0 )? e.touches[0].clientY : ( e.clientY ? e.clientY : ey );
			};

			// registering start position
			
			var setPos = function(e) {
				tx = getX(e);
				ty = getY(e);
			};
			
			var noAction = function(e) {
				return false;
			};
			
			// moving the element
			
			var animate = function(left, time) {
				
				var transform = 'translate3d('+left+'px,0,0)',
					transition = time ? 'transform '+time+'ms ease' : 'transform 0';

				t.css({
					WebkitTransform		: transform,
					MOZTransform		: transform,
					OTransform			: transform,
					MSTransform			: transform,
					Transform			: transform,
					WebkitTransition	: '-webkit-'+transition,
					MozTransition		: '-moz-'+transition,
					OTransition			: '-o-'+transition,
					MSTransition		: '-ms-'+transition,
					Transition			: transition
				});
			};

			var dragMove = function(e) {
				
				if ( tx ) {
				
					if(Math.abs(getX(e) - tx) > Math.abs(getY(e) - ty)) {

						animate(getX(e) - tx + x0);

						return false;
					} else {
						return true;
					}
				} else { // Wrong dragstart event coordinate :: starting now
					tx = getX(e);
					ty = getY(e);
					return false;
				}
				
			};
			
			// stopped dragging
			
			var dragStop = function(e) {
				
				var dx = getX(e) - tx;
				tx1 = t.position().left;
				
				// detach handlers
				
				if ( $.support.touch ) {
					this.ontouchmove = null;
					this.ontouchend = null;
				} /*else {
					$(document).off('mousemove', dragMove).off('mouseup click', dragStop);
				}*/
				
				if ( Math.abs(dx) > settings.minDist ) {
					
					// Swipe detected
					
					var x1, cw = t.parent().width(), tw = t.width(), gw, eff = effect;
					
					speed = 1000 * dx / (new Date().getTime() - tt);
					x1 = tx1 + Math.round(speed / 2);
					
					if ( settings.snapGrid ) {
						gw = cw / settings.snapGrid;
						x1 = Math.round(Math.round(x1 / gw) * gw);
					}

					if ( settings.keepWithin ) {
						if ( x1 < 0 && (tw + x1) < cw ) {
							x1 = cw - tw;
							eff = 'easeOutBack';
						} else if ( x1 > 0 && (tw + x1) > cw ) {
							x1 = 0;
							eff = 'easeOutBack';
						}
					}

					if ( settings.maxLeft !== false) {
						if ( x1 <  -settings.maxLeft) {
							x1 = - settings.maxLeft;
							eff = 'easeOutBack';
						}
					}

					if ( settings.maxRight !== false) {
						if ( x1 > settings.maxRight) {
							x1 = settings.maxRight;
							eff = 'easeOutBack';
						}
					}

					animate(x1, 250);
					
					// Calling the appropriate function
					
					if ( dx < 0 ) {
						if ( $.isFunction(leftFn) ) {
							leftFn.call(this, x1);
						}
					} else if ( $.isFunction(rightFn) ) {
						rightFn.call(this, x1);
					}
					
				} else {
					
					// Just a small move - let the click event happen
					
					animate(x0, 200);
					
					t.trigger('touchstart');
				}
				
				return false;
			};
			
			// registering start position on touch devices
			
			var touchStart = function(e) {
				
				if(settings.enableSwipe) {

					if ( (e.type === 'touchstart' || e.type === 'touchmove') &&
						(!e.touches || e.touches.length > 1 || t.is(':animated')) ) {
						
						e.trigger('touchend');

						return true;
					}
					setPos(e);
					dragStart(e);
				}
			};
			
			// start dragging
			
			var dragStart = function(e) {
				
				
				x0 = t.position().left;
				tt = new Date().getTime();
				dist = 0;
				
				if ( $.support.touch ) {
					this.ontouchmove = dragMove;
					this.ontouchend = dragStop;
					return true;
				} /*else {
					t.off('click');
					t.click(noAction);
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
					e.cancelBubble = true;
					return false;
				}*/
			};
			
			// initializing 
			
			if ($.support.touch) {
				this.ontouchstart = touchStart;
			}/* else {
				t.on({
					'dragstart': dragStart,
					'mousedown': setPos
				});
			}*/
			
			// reset function
			
			xs = t.position().left;
			
			t.on('resetswipe', function() {
			
				animate(xs, 250);

				return false;
			});

			t.on('swipeto', function(e, x1, time) {

				if(e.target.className == t.context.className) { //this solves a weird problem of the homepage swipe triggering the nav

					if ( settings.keepWithin ) {

						var cw = t.parent().width(), tw = t.width(), gw;
							
						if ( settings.snapGrid ) {
							gw = cw / settings.snapGrid;
							x1 = Math.round(Math.round(x1 / gw) * gw);
						}

						if ( settings.keepWithin ) {
							if ( x1 < 0 && (tw + x1) < cw ) {
								x1 = cw - tw;
							} else if ( x1 > 0 && (tw + x1) > cw ) {
								x1 = 0;
							}
						}
					}

					animate(x1, time);

					leftFn.call(this, x1);
				}
			});
			
			// removing the event handler
			
			t.on('unswipe', function() {
				if ( $.support.touch ) {
					this.ontouchmove = null;
					this.ontouchend = null;
					this.ontouchstart = null;
				} else {
					if ( $.isFunction(t.noAction) ) {
						t.off(noAction);
					}
					if ( $.isFunction(t.dragStart) ) {
						t.off(dragStart);
					}
					$(document).off('mousemove', dragMove).off('mouseup', dragStop);
				}
			});
			
			// disabling text selection, because it conflicts with drag
			
			//t.on('selectstart', noAction); 

		});
	};
	
	$.fn.addSwipe.defaults = {
		minDist: 80,
		snapGrid: 0,
		keepWithin: true,
		enableSwipe: true,
		maxLeft: false,
		maxRight: false
	};
	
})(jQuery);
