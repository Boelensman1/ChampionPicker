/*! ChampionPick - v0.1.0 - 2016-02-11
* https://github.com/Boelensman1/ChampionPicker.github.io
* Copyright (c) 2016 ; Licensed  */
/*
 * ====== PNotify ======
 *
 * http://sciactive.com/pnotify/
 *
 * Copyright 2009-2014 Hunter Perrin
 *
 * Triple licensed under the GPL, LGPL, and MPL.
 * 	http://gnu.org/licenses/gpl.html
 * 	http://gnu.org/licenses/lgpl.html
 * 	http://mozilla.org/MPL/MPL-1.1.html
 */

// Uses AMD or browser globals for jQuery.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a module.
        define('pnotify', ['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($){
	var default_stack = {
		dir1: "down",
		dir2: "left",
		push: "bottom",
		spacing1: 25,
		spacing2: 25,
		context: $("body")
	};
	var timer, // Position all timer.
		body,
		jwindow = $(window);
	// Set global variables.
	var do_when_ready = function(){
		body = $("body");
		PNotify.prototype.options.stack.context = body;
		jwindow = $(window);
		// Reposition the notices when the window resizes.
		jwindow.bind('resize', function(){
			if (timer)
				clearTimeout(timer);
			timer = setTimeout(function(){ PNotify.positionAll(true) }, 10);
		});
	};
	PNotify = function(options){
		this.parseOptions(options);
		this.init();
	};
	$.extend(PNotify.prototype, {
		// The current version of PNotify.
		version: "2.0.1",

		// === Options ===

		// Options defaults.
		options: {
			// The notice's title.
			title: false,
			// Whether to escape the content of the title. (Not allow HTML.)
			title_escape: false,
			// The notice's text.
			text: false,
			// Whether to escape the content of the text. (Not allow HTML.)
			text_escape: false,
			// What styling classes to use. (Can be either jqueryui or bootstrap.)
			styling: "bootstrap3",
			// Additional classes to be added to the notice. (For custom styling.)
			addclass: "",
			// Class to be added to the notice for corner styling.
			cornerclass: "",
			// Display the notice when it is created.
			auto_display: true,
			// Width of the notice.
			width: "300px",
			// Minimum height of the notice. It will expand to fit content.
			min_height: "16px",
			// Type of the notice. "notice", "info", "success", or "error".
			type: "notice",
			// Set icon to true to use the default icon for the selected
			// style/type, false for no icon, or a string for your own icon class.
			icon: true,
			// Opacity of the notice.
			opacity: 1,
			// The animation to use when displaying and hiding the notice. "none",
			// "show", "fade", and "slide" are built in to jQuery. Others require jQuery
			// UI. Use an object with effect_in and effect_out to use different effects.
			animation: "fade",
			// Speed at which the notice animates in and out. "slow", "def" or "normal",
			// "fast" or number of milliseconds.
			animate_speed: "slow",
			// Specify a specific duration of position animation
			position_animate_speed: 500,
			// Display a drop shadow.
			shadow: true,
			// After a delay, remove the notice.
			hide: true,
			// Delay in milliseconds before the notice is removed.
			delay: 8000,
			// Reset the hide timer if the mouse moves over the notice.
			mouse_reset: true,
			// Remove the notice's elements from the DOM after it is removed.
			remove: true,
			// Change new lines to br tags.
			insert_brs: true,
			// Whether to remove notices from the global array.
			destroy: true,
			// The stack on which the notices will be placed. Also controls the
			// direction the notices stack.
			stack: default_stack
		},

		// === Modules ===

		// This object holds all the PNotify modules. They are used to provide
		// additional functionality.
		modules: {},
		// This runs an event on all the modules.
		runModules: function(event, arg){
			var curArg;
			for (var module in this.modules) {
				curArg = ((typeof arg === "object" && module in arg) ? arg[module] : arg);
				if (typeof this.modules[module][event] === 'function')
					this.modules[module][event](this, typeof this.options[module] === 'object' ? this.options[module] : {}, curArg);
			}
		},

		// === Class Variables ===

		state: "initializing", // The state can be "initializing", "opening", "open", "closing", and "closed".
		timer: null, // Auto close timer.
		styles: null,
		elem: null,
		container: null,
		title_container: null,
		text_container: null,
		animating: false, // Stores what is currently being animated (in or out).
		timerHide: false, // Stores whether the notice was hidden by a timer.

		// === Events ===

		init: function(){
			var that = this;

			// First and foremost, we don't want our module objects all referencing the prototype.
			this.modules = {};
			$.extend(true, this.modules, PNotify.prototype.modules);

			// Get our styling object.
			if (typeof this.options.styling === "object") {
				this.styles = this.options.styling;
			} else {
				this.styles = PNotify.styling[this.options.styling];
			}

			// Create our widget.
			// Stop animation, reset the removal timer when the user mouses over.
			this.elem = $("<div />", {
				"class": "ui-pnotify "+this.options.addclass,
				"css": {"display": "none"},
				"mouseenter": function(e){
					if (that.options.mouse_reset && that.animating === "out") {
						if (!that.timerHide)
							return;
						that.cancelRemove();
					}
					// Stop the close timer.
					if (that.options.hide && that.options.mouse_reset) that.cancelRemove();
				},
				"mouseleave": function(e){
					// Start the close timer.
					if (that.options.hide && that.options.mouse_reset) that.queueRemove();
					PNotify.positionAll();
				}
			});
			// Create a container for the notice contents.
			this.container = $("<div />", {"class": this.styles.container+" ui-pnotify-container "+(this.options.type === "error" ? this.styles.error : (this.options.type === "info" ? this.styles.info : (this.options.type === "success" ? this.styles.success : this.styles.notice)))})
			.appendTo(this.elem);
			if (this.options.cornerclass !== "")
				this.container.removeClass("ui-corner-all").addClass(this.options.cornerclass);
			// Create a drop shadow.
			if (this.options.shadow)
				this.container.addClass("ui-pnotify-shadow");


			// Add the appropriate icon.
			if (this.options.icon !== false) {
				$("<div />", {"class": "ui-pnotify-icon"})
				.append($("<span />", {"class": this.options.icon === true ? (this.options.type === "error" ? this.styles.error_icon : (this.options.type === "info" ? this.styles.info_icon : (this.options.type === "success" ? this.styles.success_icon : this.styles.notice_icon))) : this.options.icon}))
				.prependTo(this.container);
			}

			// Add a title.
			this.title_container = $("<h4 />", {
				"class": "ui-pnotify-title"
			})
			.appendTo(this.container);
			if (this.options.title === false)
				this.title_container.hide();
			else if (this.options.title_escape)
				this.title_container.text(this.options.title);
			else
				this.title_container.html(this.options.title);

			// Add text.
			this.text_container = $("<div />", {
				"class": "ui-pnotify-text"
			})
			.appendTo(this.container);
			if (this.options.text === false)
				this.text_container.hide();
			else if (this.options.text_escape)
				this.text_container.text(this.options.text);
			else
				this.text_container.html(this.options.insert_brs ? String(this.options.text).replace(/\n/g, "<br />") : this.options.text);

			// Set width and min height.
			if (typeof this.options.width === "string")
				this.elem.css("width", this.options.width);
			if (typeof this.options.min_height === "string")
				this.container.css("min-height", this.options.min_height);


			// Add the notice to the notice array.
			if (this.options.stack.push === "top")
				PNotify.notices = $.merge([this], PNotify.notices);
			else
				PNotify.notices = $.merge(PNotify.notices, [this]);
			// Now position all the notices if they are to push to the top.
			if (this.options.stack.push === "top")
				this.queuePosition(false, 1);




			// Mark the stack so it won't animate the new notice.
			this.options.stack.animation = false;

			// Run the modules.
			this.runModules('init');

			// Display the notice.
			if (this.options.auto_display)
				this.open();
			return this;
		},

		// This function is for updating the notice.
		update: function(options){
			// Save old options.
			var oldOpts = this.options;
			// Then update to the new options.
			this.parseOptions(oldOpts, options);
			// Update the corner class.
			if (this.options.cornerclass !== oldOpts.cornerclass)
				this.container.removeClass("ui-corner-all "+oldOpts.cornerclass).addClass(this.options.cornerclass);
			// Update the shadow.
			if (this.options.shadow !== oldOpts.shadow) {
				if (this.options.shadow)
					this.container.addClass("ui-pnotify-shadow");
				else
					this.container.removeClass("ui-pnotify-shadow");
			}
			// Update the additional classes.
			if (this.options.addclass === false)
				this.elem.removeClass(oldOpts.addclass);
			else if (this.options.addclass !== oldOpts.addclass)
				this.elem.removeClass(oldOpts.addclass).addClass(this.options.addclass);
			// Update the title.
			if (this.options.title === false)
				this.title_container.slideUp("fast");
			else if (this.options.title !== oldOpts.title) {
				if (this.options.title_escape)
					this.title_container.text(this.options.title);
				else
					this.title_container.html(this.options.title);
				if (oldOpts.title === false)
					this.title_container.slideDown(200)
			}
			// Update the text.
			if (this.options.text === false) {
				this.text_container.slideUp("fast");
			} else if (this.options.text !== oldOpts.text) {
				if (this.options.text_escape)
					this.text_container.text(this.options.text);
				else
					this.text_container.html(this.options.insert_brs ? String(this.options.text).replace(/\n/g, "<br />") : this.options.text);
				if (oldOpts.text === false)
					this.text_container.slideDown(200)
			}
			// Change the notice type.
			if (this.options.type !== oldOpts.type)
				this.container.removeClass(
					this.styles.error+" "+this.styles.notice+" "+this.styles.success+" "+this.styles.info
				).addClass(this.options.type === "error" ?
					this.styles.error :
					(this.options.type === "info" ?
						this.styles.info :
						(this.options.type === "success" ?
							this.styles.success :
							this.styles.notice
						)
					)
				);
			if (this.options.icon !== oldOpts.icon || (this.options.icon === true && this.options.type !== oldOpts.type)) {
				// Remove any old icon.
				this.container.find("div.ui-pnotify-icon").remove();
				if (this.options.icon !== false) {
					// Build the new icon.
					$("<div />", {"class": "ui-pnotify-icon"})
					.append($("<span />", {"class": this.options.icon === true ? (this.options.type === "error" ? this.styles.error_icon : (this.options.type === "info" ? this.styles.info_icon : (this.options.type === "success" ? this.styles.success_icon : this.styles.notice_icon))) : this.options.icon}))
					.prependTo(this.container);
				}
			}
			// Update the width.
			if (this.options.width !== oldOpts.width)
				this.elem.animate({width: this.options.width});
			// Update the minimum height.
			if (this.options.min_height !== oldOpts.min_height)
				this.container.animate({minHeight: this.options.min_height});
			// Update the opacity.
			if (this.options.opacity !== oldOpts.opacity)
				this.elem.fadeTo(this.options.animate_speed, this.options.opacity);
			// Update the timed hiding.
			if (!this.options.hide)
				this.cancelRemove();
			else if (!oldOpts.hide)
				this.queueRemove();
			this.queuePosition(true);

			// Run the modules.
			this.runModules('update', oldOpts);
			return this;
		},

		// Display the notice.
		open: function(){
			this.state = "opening";
			// Run the modules.
			this.runModules('beforeOpen');

			var that = this;
			// If the notice is not in the DOM, append it.
			if (!this.elem.parent().length)
				this.elem.appendTo(this.options.stack.context ? this.options.stack.context : body);
			// Try to put it in the right position.
			if (this.options.stack.push !== "top")
				this.position(true);
			// First show it, then set its opacity, then hide it.
			if (this.options.animation === "fade" || this.options.animation.effect_in === "fade") {
				// If it's fading in, it should start at 0.
				this.elem.show().fadeTo(0, 0).hide();
			} else {
				// Or else it should be set to the opacity.
				if (this.options.opacity !== 1)
					this.elem.show().fadeTo(0, this.options.opacity).hide();
			}
			this.animateIn(function(){
				that.queuePosition(true);

				// Now set it to hide.
				if (that.options.hide)
					that.queueRemove();

				that.state = "open";

				// Run the modules.
				that.runModules('afterOpen');
			});

			return this;
		},

		// Remove the notice.
		remove: function(timer_hide) {
			this.state = "closing";
			this.timerHide = !!timer_hide; // Make sure it's a boolean.
			// Run the modules.
			this.runModules('beforeClose');

			var that = this;
			if (this.timer) {
				window.clearTimeout(this.timer);
				this.timer = null;
			}
			this.animateOut(function(){
				that.state = "closed";
				// Run the modules.
				that.runModules('afterClose');
				that.queuePosition(true);
				// If we're supposed to remove the notice from the DOM, do it.
				if (that.options.remove)
					that.elem.detach();
				// Run the modules.
				that.runModules('beforeDestroy');
				// Remove object from PNotify.notices to prevent memory leak (issue #49)
				// unless destroy is off
				if (that.options.destroy) {
					if (PNotify.notices !== null) {
						var idx = $.inArray(that,PNotify.notices);
						if (idx !== -1) {
							PNotify.notices.splice(idx,1);
						}
					}
				}
				// Run the modules.
				that.runModules('afterDestroy');
			});

			return this;
		},

		// === Class Methods ===

		// Get the DOM element.
		get: function(){ return this.elem; },

		// Put all the options in the right places.
		parseOptions: function(options, moreOptions){
			this.options = $.extend(true, {}, PNotify.prototype.options);
			// This is the only thing that *should* be copied by reference.
			this.options.stack = PNotify.prototype.options.stack;
			var optArray = [options, moreOptions], curOpts;
			for (var curIndex in optArray) {
				curOpts = optArray[curIndex];
				if (typeof curOpts == "undefined")
					break;
				if (typeof curOpts !== 'object') {
					this.options.text = curOpts;
				} else {
					for (var option in curOpts) {
						if (this.modules[option]) {
							// Avoid overwriting module defaults.
							$.extend(true, this.options[option], curOpts[option]);
						} else {
							this.options[option] = curOpts[option];
						}
					}
				}
			}
		},

		// Animate the notice in.
		animateIn: function(callback){
			// Declare that the notice is animating in. (Or has completed animating in.)
			this.animating = "in";
			var animation;
			if (typeof this.options.animation.effect_in !== "undefined")
				animation = this.options.animation.effect_in;
			else
				animation = this.options.animation;
			if (animation === "none") {
				this.elem.show();
				callback();
			} else if (animation === "show")
				this.elem.show(this.options.animate_speed, callback);
			else if (animation === "fade")
				this.elem.show().fadeTo(this.options.animate_speed, this.options.opacity, callback);
			else if (animation === "slide")
				this.elem.slideDown(this.options.animate_speed, callback);
			else if (typeof animation === "function")
				animation("in", callback, this.elem);
			else
				this.elem.show(animation, (typeof this.options.animation.options_in === "object" ? this.options.animation.options_in : {}), this.options.animate_speed, callback);
			if (this.elem.parent().hasClass('ui-effects-wrapper'))
				this.elem.parent().css({"position": "fixed", "overflow": "visible"});
			if (animation !== "slide")
				this.elem.css("overflow", "visible");
			this.container.css("overflow", "hidden");
		},

		// Animate the notice out.
		animateOut: function(callback){
			// Declare that the notice is animating out. (Or has completed animating out.)
			this.animating = "out";
			var animation;
			if (typeof this.options.animation.effect_out !== "undefined")
				animation = this.options.animation.effect_out;
			else
				animation = this.options.animation;
			if (animation === "none") {
				this.elem.hide();
				callback();
			} else if (animation === "show")
				this.elem.hide(this.options.animate_speed, callback);
			else if (animation === "fade")
				this.elem.fadeOut(this.options.animate_speed, callback);
			else if (animation === "slide")
				this.elem.slideUp(this.options.animate_speed, callback);
			else if (typeof animation === "function")
				animation("out", callback, this.elem);
			else
				this.elem.hide(animation, (typeof this.options.animation.options_out === "object" ? this.options.animation.options_out : {}), this.options.animate_speed, callback);
			if (this.elem.parent().hasClass('ui-effects-wrapper'))
				this.elem.parent().css({"position": "fixed", "overflow": "visible"});
			if (animation !== "slide")
				this.elem.css("overflow", "visible");
			this.container.css("overflow", "hidden");
		},

		// Position the notice. dont_skip_hidden causes the notice to
		// position even if it's not visible.
		position: function(dontSkipHidden){
			// Get the notice's stack.
			var s = this.options.stack,
				e = this.elem;
			if (e.parent().hasClass('ui-effects-wrapper'))
				e = this.elem.css({"left": "0", "top": "0", "right": "0", "bottom": "0"}).parent();
			if (typeof s.context === "undefined")
				s.context = body;
			if (!s) return;
			if (typeof s.nextpos1 !== "number")
				s.nextpos1 = s.firstpos1;
			if (typeof s.nextpos2 !== "number")
				s.nextpos2 = s.firstpos2;
			if (typeof s.addpos2 !== "number")
				s.addpos2 = 0;
			var hidden = e.css("display") === "none";
			// Skip this notice if it's not shown.
			if (!hidden || dontSkipHidden) {
				var curpos1, curpos2;
				// Store what will need to be animated.
				var animate = {};
				// Calculate the current pos1 value.
				var csspos1;
				switch (s.dir1) {
					case "down":
						csspos1 = "top";
						break;
					case "up":
						csspos1 = "bottom";
						break;
					case "left":
						csspos1 = "right";
						break;
					case "right":
						csspos1 = "left";
						break;
				}
				curpos1 = parseInt(e.css(csspos1).replace(/(?:\..*|[^0-9.])/g, ''));
				if (isNaN(curpos1))
					curpos1 = 0;
				// Remember the first pos1, so the first visible notice goes there.
				if (typeof s.firstpos1 === "undefined" && !hidden) {
					s.firstpos1 = curpos1;
					s.nextpos1 = s.firstpos1;
				}
				// Calculate the current pos2 value.
				var csspos2;
				switch (s.dir2) {
					case "down":
						csspos2 = "top";
						break;
					case "up":
						csspos2 = "bottom";
						break;
					case "left":
						csspos2 = "right";
						break;
					case "right":
						csspos2 = "left";
						break;
				}
				curpos2 = parseInt(e.css(csspos2).replace(/(?:\..*|[^0-9.])/g, ''));
				if (isNaN(curpos2))
					curpos2 = 0;
				// Remember the first pos2, so the first visible notice goes there.
				if (typeof s.firstpos2 === "undefined" && !hidden) {
					s.firstpos2 = curpos2;
					s.nextpos2 = s.firstpos2;
				}
				// Check that it's not beyond the viewport edge.
				if ((s.dir1 === "down" && s.nextpos1 + e.height() > (s.context.is(body) ? jwindow.height() : s.context.prop('scrollHeight')) ) ||
					(s.dir1 === "up" && s.nextpos1 + e.height() > (s.context.is(body) ? jwindow.height() : s.context.prop('scrollHeight')) ) ||
					(s.dir1 === "left" && s.nextpos1 + e.width() > (s.context.is(body) ? jwindow.width() : s.context.prop('scrollWidth')) ) ||
					(s.dir1 === "right" && s.nextpos1 + e.width() > (s.context.is(body) ? jwindow.width() : s.context.prop('scrollWidth')) ) ) {
					// If it is, it needs to go back to the first pos1, and over on pos2.
					s.nextpos1 = s.firstpos1;
					s.nextpos2 += s.addpos2 + (typeof s.spacing2 === "undefined" ? 25 : s.spacing2);
					s.addpos2 = 0;
				}
				// Animate if we're moving on dir2.
				if (s.animation && s.nextpos2 < curpos2) {
					switch (s.dir2) {
						case "down":
							animate.top = s.nextpos2+"px";
							break;
						case "up":
							animate.bottom = s.nextpos2+"px";
							break;
						case "left":
							animate.right = s.nextpos2+"px";
							break;
						case "right":
							animate.left = s.nextpos2+"px";
							break;
					}
				} else {
					if(typeof s.nextpos2 === "number")
						e.css(csspos2, s.nextpos2+"px");
				}
				// Keep track of the widest/tallest notice in the column/row, so we can push the next column/row.
				switch (s.dir2) {
					case "down":
					case "up":
						if (e.outerHeight(true) > s.addpos2)
							s.addpos2 = e.height();
						break;
					case "left":
					case "right":
						if (e.outerWidth(true) > s.addpos2)
							s.addpos2 = e.width();
						break;
				}
				// Move the notice on dir1.
				if (typeof s.nextpos1 === "number") {
					// Animate if we're moving toward the first pos.
					if (s.animation && (curpos1 > s.nextpos1 || animate.top || animate.bottom || animate.right || animate.left)) {
						switch (s.dir1) {
							case "down":
								animate.top = s.nextpos1+"px";
								break;
							case "up":
								animate.bottom = s.nextpos1+"px";
								break;
							case "left":
								animate.right = s.nextpos1+"px";
								break;
							case "right":
								animate.left = s.nextpos1+"px";
								break;
						}
					} else
						e.css(csspos1, s.nextpos1+"px");
				}
				// Run the animation.
				if (animate.top || animate.bottom || animate.right || animate.left)
					e.animate(animate, {duration: this.options.position_animate_speed, queue: false});
				// Calculate the next dir1 position.
				switch (s.dir1) {
					case "down":
					case "up":
						s.nextpos1 += e.height() + (typeof s.spacing1 === "undefined" ? 25 : s.spacing1);
						break;
					case "left":
					case "right":
						s.nextpos1 += e.width() + (typeof s.spacing1 === "undefined" ? 25 : s.spacing1);
						break;
				}
			}
			return this;
		},
		// Queue the position all function so it doesn't run repeatedly and
		// use up resources.
		queuePosition: function(animate, milliseconds){
			if (timer)
				clearTimeout(timer);
			if (!milliseconds)
				milliseconds = 10;
			timer = setTimeout(function(){ PNotify.positionAll(animate) }, milliseconds);
			return this;
		},


		// Cancel any pending removal timer.
		cancelRemove: function(){
			if (this.timer)
				window.clearTimeout(this.timer);
			if (this.state === "closing") {
				// If it's animating out, animate back in really quickly.
				this.elem.stop(true);
				this.state = "open";
				this.animating = "in";
				this.elem.css("height", "auto").animate({"width": this.options.width, "opacity": this.options.opacity}, "fast");
			}
			return this;
		},
		// Queue a removal timer.
		queueRemove: function(){
			var that = this;
			// Cancel any current removal timer.
			this.cancelRemove();
			this.timer = window.setTimeout(function(){
				that.remove(true);
			}, (isNaN(this.options.delay) ? 0 : this.options.delay));
			return this;
		}
	});
	// These functions affect all notices.
	$.extend(PNotify, {
		// This holds all the notices.
		notices: [],
		removeAll: function () {
			$.each(PNotify.notices, function(){
				if (this.remove)
					this.remove();
			});
		},
		positionAll: function (animate) {
			// This timer is used for queueing this function so it doesn't run
			// repeatedly.
			if (timer)
				clearTimeout(timer);
			timer = null;
			// Reset the next position data.
			$.each(PNotify.notices, function(){
				var s = this.options.stack;
				if (!s) return;
				s.nextpos1 = s.firstpos1;
				s.nextpos2 = s.firstpos2;
				s.addpos2 = 0;
				s.animation = animate;
			});
			$.each(PNotify.notices, function(){
				this.position();
			});
		},
		styling: {
			jqueryui: {
				container: "ui-widget ui-widget-content ui-corner-all",
				notice: "ui-state-highlight",
				// (The actual jQUI notice icon looks terrible.)
				notice_icon: "ui-icon ui-icon-info",
				info: "",
				info_icon: "ui-icon ui-icon-info",
				success: "ui-state-default",
				success_icon: "ui-icon ui-icon-circle-check",
				error: "ui-state-error",
				error_icon: "ui-icon ui-icon-alert"
			},
			bootstrap2: {
				container: "alert",
				notice: "",
				notice_icon: "icon-exclamation-sign",
				info: "alert-info",
				info_icon: "icon-info-sign",
				success: "alert-success",
				success_icon: "icon-ok-sign",
				error: "alert-error",
				error_icon: "icon-warning-sign"
			},
			bootstrap3: {
				container: "alert",
				notice: "alert-warning",
				notice_icon: "glyphicon glyphicon-exclamation-sign",
				info: "alert-info",
				info_icon: "glyphicon glyphicon-info-sign",
				success: "alert-success",
				success_icon: "glyphicon glyphicon-ok-sign",
				error: "alert-danger",
				error_icon: "glyphicon glyphicon-warning-sign"
			}
		}
	});
	/*
	 * uses icons from http://fontawesome.io/
	 * version 4.0.3
	 */
	PNotify.styling.fontawesome = $.extend({}, PNotify.styling.bootstrap3);
	$.extend(PNotify.styling.fontawesome, {
		notice_icon: "fa fa-exclamation-circle",
		info_icon: "fa fa-info",
		success_icon: "fa fa-check",
		error_icon: "fa fa-warning"
	});

	if (document.body)
		do_when_ready();
	else
		$(do_when_ready);
	return PNotify;
}));

// Nonblock
// Uses AMD or browser globals for jQuery.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a module.
        define('pnotify.nonblock', ['jquery', 'pnotify'], factory);
    } else {
        // Browser globals
        factory(jQuery, PNotify);
    }
}(function($, PNotify){
	// Some useful regexes.
	var re_on = /^on/,
		re_mouse_events = /^(dbl)?click$|^mouse(move|down|up|over|out|enter|leave)$|^contextmenu$/,
		re_ui_events = /^(focus|blur|select|change|reset)$|^key(press|down|up)$/,
		re_html_events = /^(scroll|resize|(un)?load|abort|error)$/;
	// Fire a DOM event.
	var dom_event = function(e, orig_e){
		var event_object;
		e = e.toLowerCase();
		if (document.createEvent && this.dispatchEvent) {
			// FireFox, Opera, Safari, Chrome
			e = e.replace(re_on, '');
			if (e.match(re_mouse_events)) {
				// This allows the click event to fire on the notice. There is
				// probably a much better way to do it.
				$(this).offset();
				event_object = document.createEvent("MouseEvents");
				event_object.initMouseEvent(
					e, orig_e.bubbles, orig_e.cancelable, orig_e.view, orig_e.detail,
					orig_e.screenX, orig_e.screenY, orig_e.clientX, orig_e.clientY,
					orig_e.ctrlKey, orig_e.altKey, orig_e.shiftKey, orig_e.metaKey, orig_e.button, orig_e.relatedTarget
				);
			} else if (e.match(re_ui_events)) {
				event_object = document.createEvent("UIEvents");
				event_object.initUIEvent(e, orig_e.bubbles, orig_e.cancelable, orig_e.view, orig_e.detail);
			} else if (e.match(re_html_events)) {
				event_object = document.createEvent("HTMLEvents");
				event_object.initEvent(e, orig_e.bubbles, orig_e.cancelable);
			}
			if (!event_object) return;
			this.dispatchEvent(event_object);
		} else {
			// Internet Explorer
			if (!e.match(re_on)) e = "on"+e;
			event_object = document.createEventObject(orig_e);
			this.fireEvent(e, event_object);
		}
	};


	// This keeps track of the last element the mouse was over, so
	// mouseleave, mouseenter, etc can be called.
	var nonblock_last_elem;
	// This is used to pass events through the notice if it is non-blocking.
	var nonblock_pass = function(notice, e, e_name){
		notice.elem.css("display", "none");
		var element_below = document.elementFromPoint(e.clientX, e.clientY);
		notice.elem.css("display", "block");
		var jelement_below = $(element_below);
		var cursor_style = jelement_below.css("cursor");
		notice.elem.css("cursor", cursor_style !== "auto" ? cursor_style : "default");
		// If the element changed, call mouseenter, mouseleave, etc.
		if (!nonblock_last_elem || nonblock_last_elem.get(0) != element_below) {
			if (nonblock_last_elem) {
				dom_event.call(nonblock_last_elem.get(0), "mouseleave", e.originalEvent);
				dom_event.call(nonblock_last_elem.get(0), "mouseout", e.originalEvent);
			}
			dom_event.call(element_below, "mouseenter", e.originalEvent);
			dom_event.call(element_below, "mouseover", e.originalEvent);
		}
		dom_event.call(element_below, e_name, e.originalEvent);
		// Remember the latest element the mouse was over.
		nonblock_last_elem = jelement_below;
	};


	PNotify.prototype.options.nonblock = {
		// Create a non-blocking notice. It lets the user click elements underneath it.
		nonblock: false,
		// The opacity of the notice (if it's non-blocking) when the mouse is over it.
		nonblock_opacity: .2
	};
	PNotify.prototype.modules.nonblock = {
		// This lets us update the options available in the closures.
		myOptions: null,

		init: function(notice, options){
			var that = this;
			this.myOptions = options;
			notice.elem.on({
				"mouseenter": function(e){
					if (that.myOptions.nonblock) e.stopPropagation();
					if (that.myOptions.nonblock) {
						// If it's non-blocking, animate to the other opacity.
						notice.elem.stop().animate({"opacity": that.myOptions.nonblock_opacity}, "fast");
					}
				},
				"mouseleave": function(e){
					if (that.myOptions.nonblock) e.stopPropagation();
					nonblock_last_elem = null;
					notice.elem.css("cursor", "auto");
					// Animate back to the normal opacity.
					if (that.myOptions.nonblock && notice.animating !== "out")
						notice.elem.stop().animate({"opacity": notice.options.opacity}, "fast");
				},
				"mouseover": function(e){
					if (that.myOptions.nonblock) e.stopPropagation();
				},
				"mouseout": function(e){
					if (that.myOptions.nonblock) e.stopPropagation();
				},
				"mousemove": function(e){
					if (that.myOptions.nonblock) {
						e.stopPropagation();
						nonblock_pass(notice, e, "onmousemove");
					}
				},
				"mousedown": function(e){
					if (that.myOptions.nonblock) {
						e.stopPropagation();
						e.preventDefault();
						nonblock_pass(notice, e, "onmousedown");
					}
				},
				"mouseup": function(e){
					if (that.myOptions.nonblock) {
						e.stopPropagation();
						e.preventDefault();
						nonblock_pass(notice, e, "onmouseup");
					}
				},
				"click": function(e){
					if (that.myOptions.nonblock) {
						e.stopPropagation();
						nonblock_pass(notice, e, "onclick");
					}
				},
				"dblclick": function(e){
					if (that.myOptions.nonblock) {
						e.stopPropagation();
						nonblock_pass(notice, e, "ondblclick");
					}
				}
			});
		},
		update: function(notice, options){
			this.myOptions = options;
		}
	};
}));

/*!
 * Bootstrap Confirmation 2.1.3
 * Copyright 2013 Nimit Suwannagate <ethaizone@hotmail.com>
 * Copyright 2015 Damien "Mistic" Sorel <http://www.strangeplanet.fr>
 * Licensed under the Apache License, Version 2.0 (the "License")
 */
!function(a){"use strict";function b(a){for(var b=window,c=a.split("."),d=c.pop(),e=0,f=c.length;f>e;e++)b=b[c[e]];return function(){b[d].call(this)}}if(!a.fn.popover)throw new Error("Confirmation requires popover.js");var c=function(b,c){this.init("confirmation",b,c);var d=this;this.options.selector||(this.$element.attr("href")&&(this.options.href=this.$element.attr("href"),this.$element.removeAttr("href"),this.$element.attr("target")&&(this.options.target=this.$element.attr("target"))),this.$element.on(d.options.trigger,function(a,b){b||(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation())}),this.$element.on("confirmed.bs.confirmation",function(b){a(this).trigger(d.options.trigger,[!0])}),this.$element.on("show.bs.confirmation",function(b){d.options.singleton&&a(d.options._selector).not(a(this)).filter(function(){return void 0!==a(this).data("bs.confirmation")}).confirmation("hide")})),this.options._isDelegate||(this.eventBody=!1,this.uid=this.$element[0].id||this.getUID("group_"),this.$element.on("shown.bs.confirmation",function(b){if(d.options.popout&&!d.eventBody){a(this);d.eventBody=a("body").on("click.bs.confirmation."+d.uid,function(b){a(d.options._selector).is(b.target)||(a(d.options._selector).filter(function(){return void 0!==a(this).data("bs.confirmation")}).confirmation("hide"),a("body").off("click.bs."+d.uid),d.eventBody=!1)})}}))};c.DEFAULTS=a.extend({},a.fn.popover.Constructor.DEFAULTS,{placement:"top",title:"Are you sure?",html:!0,href:!1,popout:!1,singleton:!1,target:"_self",onConfirm:a.noop,onCancel:a.noop,btnOkClass:"btn-xs btn-primary",btnOkIcon:"glyphicon glyphicon-ok",btnOkLabel:"Yes",btnCancelClass:"btn-xs btn-default",btnCancelIcon:"glyphicon glyphicon-remove",btnCancelLabel:"No",template:'<div class="popover confirmation"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content text-center"><div class="btn-group"><a class="btn" data-apply="confirmation"></a><a class="btn" data-dismiss="confirmation"></a></div></div></div>'}),c.prototype=a.extend({},a.fn.popover.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.init=function(b,c,d){a.fn.popover.Constructor.prototype.init.call(this,b,c,d),this.options._isDelegate=!1,d.selector?this.options._selector=this._options._selector=d._root_selector+" "+d.selector:d._selector?(this.options._selector=d._selector,this.options._isDelegate=!0):this.options._selector=d._root_selector},c.prototype.setContent=function(){var b=this,c=this.tip(),d=this.options;c.find(".popover-title")[d.html?"html":"text"](this.getTitle()),c.find('[data-apply="confirmation"]').addClass(d.btnOkClass).html(d.btnOkLabel).prepend(a("<i></i>").addClass(d.btnOkIcon)," ").off("click").one("click",function(a){b.getOnConfirm.call(b).call(b.$element),b.$element.trigger("confirmed.bs.confirmation"),b.$element.confirmation("hide")}),d.href&&"#"!=d.href&&c.find('[data-apply="confirmation"]').attr({href:d.href,target:d.target}),c.find('[data-dismiss="confirmation"]').addClass(d.btnCancelClass).html(d.btnCancelLabel).prepend(a("<i></i>").addClass(d.btnCancelIcon)," ").off("click").one("click",function(a){b.getOnCancel.call(b).call(b.$element),b.$element.trigger("canceled.bs.confirmation"),b.$element.confirmation("hide")}),c.removeClass("fade top bottom left right in"),c.find(".popover-title").html()||c.find(".popover-title").hide()},c.prototype.getOnConfirm=function(){return this.$element.attr("data-on-confirm")?b(this.$element.attr("data-on-confirm")):this.options.onConfirm},c.prototype.getOnCancel=function(){return this.$element.attr("data-on-cancel")?b(this.$element.attr("data-on-cancel")):this.options.onCancel};var d=a.fn.confirmation;a.fn.confirmation=function(b){var d="object"==typeof b&&b||{};return d._root_selector=this.selector,this.each(function(){var e=a(this),f=e.data("bs.confirmation");(f||"destroy"!=b)&&(f||e.data("bs.confirmation",f=new c(this,d)),"string"==typeof b&&f[b]())})},a.fn.confirmation.Constructor=c,a.fn.confirmation.noConflict=function(){return a.fn.confirmation=d,this}}(jQuery);
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2014 Rico Sta. Cruz
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/* jshint expr: true */

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }

}(this, function($) {

  $.transit = {
    version: "0.9.12",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft    : 'margin',
      marginRight   : 'margin',
      marginBottom  : 'margin',
      marginTop     : 'margin',
      paddingLeft   : 'padding',
      paddingRight  : 'padding',
      paddingBottom : 'padding',
      paddingTop    : 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: false
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (var i=0; i<prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) { return vendorProp; }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  support.transition      = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform       = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.filter          = getVendorPropertyName('Filter');
  support.transform3d     = checkTransform3dSupport();

  var eventNames = {
    'transition':       'transitionend',
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  // Detect the 'transitionend' event needed.
  var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

  // Populate jQuery's `$.support` with the vendor prefixes we know.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  for (var key in support) {
    if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
      $.support[key] = support[key];
    }
  }

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    '_default':       'ease',
    'in':             'ease-in',
    'out':            'ease-out',
    'in-out':         'ease-in-out',
    'snap':           'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks['transit:transform'] = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform') || new Transform();
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !isChrome) {
        elem.style[support.transform] = value.toString(true);
      } else {
        elem.style[support.transform] = value.toString();
      }

      $(elem).data('transform', value);
    }
  };

  // Add a CSS hook for `.css({ transform: '...' })`.
  // In jQuery 1.8+, this will intentionally override the default `transform`
  // CSS hook so it'll play well with Transit. (see issue #62)
  $.cssHooks.transform = {
    set: $.cssHooks['transit:transform'].set
  };

  // ## 'filter' CSS hook
  // Allows you to use the `filter` property in CSS.
  //
  //     $("#hello").css({ filter: 'blur(10px)' });
  //
  $.cssHooks.filter = {
    get: function(elem) {
      return elem.style[support.filter];
    },
    set: function(elem, value) {
      elem.style[support.filter] = value;
    }
  };

  // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
  // be necessary.
  if ($.fn.jquery < "1.8") {
    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
      get: function(elem) {
        return elem.style[support.transformOrigin];
      },
      set: function(elem, value) {
        elem.style[support.transformOrigin] = value;
      }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
      get: function(elem) {
        return elem.style[support.transition];
      },
      set: function(elem, value) {
        elem.style[support.transition] = value;
      }
    };
  }

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('scaleX');
  registerCssHook('scaleY');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') { this.parse(str); }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) { y = x; }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) { this._translateX = 0; }
        if (this._translateY === undefined) { this._translateY = 0; }

        if (x !== null && x !== undefined) { this._translateX = unit(x, 'px'); }
        if (y !== null && y !== undefined) { this._translateY = unit(y, 'px'); }

        this.translate = this._translateX + "," + this._translateY;
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) { s[0] = parseFloat(s[0]); }
        if (s[1]) { s[1] = parseFloat(s[1]); }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i=0; i<=3; ++i) {
          if (s[i]) { s[i] = parseFloat(s[i]); }
        }
        if (s[3]) { s[3] = unit(s[3], 'deg'); }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
            (i === 'rotateX') ||
            (i === 'rotateY') ||
            (i === 'perspective') ||
            (i === 'transformOrigin'))) { continue; }

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            } else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            } else {
              re.push(i + "(" + this[i] + ")");
            }
          }
        }
      }

      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {
    if (queue === true) {
      self.queue(fn);
    } else if (queue) {
      self.queue(queue, fn);
    } else {
      self.each(function () {
                fn.call(this);
            });
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || $.cssProps[key] || key;
      key = uncamel(key); // Convert back to dasherized

      // Get vendor specify propertie
      if (support[key])
        key = uncamel(support[key]);

      if ($.inArray(key, re) === -1) { re.push(key); }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);

    // Account for aliases (`in` => `ease-in`).
    if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    var attribs = '' + toMS(duration) + ' ' + easing;
    if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."
    var transitions = [];
    $.each(props, function(i, name) {
      transitions.push(name + ' ' + attribs);
    });

    return transitions.join(', ');
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //
  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self  = this;
    var delay = 0;
    var queue = true;

    var theseProperties = $.extend(true, {}, properties);

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, options)`.
    if (typeof duration === 'object') {
      easing = duration.easing;
      delay = duration.delay || 0;
      queue = typeof duration.queue === "undefined" ? true : duration.queue;
      callback = duration.complete;
      duration = duration.duration;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof theseProperties.easing !== 'undefined') {
      easing = theseProperties.easing;
      delete theseProperties.easing;
    }

    if (typeof theseProperties.duration !== 'undefined') {
      duration = theseProperties.duration;
      delete theseProperties.duration;
    }

    if (typeof theseProperties.complete !== 'undefined') {
      callback = theseProperties.complete;
      delete theseProperties.complete;
    }

    if (typeof theseProperties.queue !== 'undefined') {
      queue = theseProperties.queue;
      delete theseProperties.queue;
    }

    if (typeof theseProperties.delay !== 'undefined') {
      delay = theseProperties.delay;
      delete theseProperties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
    if (typeof easing === 'undefined')   { easing = $.cssEase._default; }

    duration = toMS(duration);

    // Build the `transition` property.
    var transitionValue = getTransition(theseProperties, duration, easing, delay);

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(theseProperties);
        if (callback) { callback.apply(self); }
        if (next) { next(); }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { self.unbind(transitionEnd, cb); }

        if (i > 0) {
          self.each(function() {
            this.style[support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') { callback.apply(self); }
        if (typeof nextCall === 'function') { nextCall(); }
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.bind(transitionEnd, cb);
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function() {
        if (i > 0) {
          this.style[support.transition] = transitionValue;
        }
        $(this).css(theseProperties);
      });
    };

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
        this.offsetWidth; // force a repaint
        run(next);
    };

    // Use jQuery's fx queue.
    callOrQueue(self, queue, deferredRun);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) { $.cssNumber[prop] = true; }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transit:transform');
        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transit:transform');
        t.setFromString(prop, value);

        $(elem).css({ 'transit:transform': t });
      }
    };

  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  // toMS('fast') => $.fx.speeds[i] => "200ms"
  // toMS('normal') //=> $.fx.speeds._default => "400ms"
  // toMS(10) //=> '10ms'
  // toMS('100ms') //=> '100ms'  
  //
  function toMS(duration) {
    var i = duration;

    // Allow string durations like 'fast' and 'slow', without overriding numeric values.
    if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) { i = $.fx.speeds[i] || $.fx.speeds._default; }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;

  return $;
}));

function adjustModalMaxHeightAndPosition(){
    $('.modal').each(function(){
        if($(this).hasClass('in') === false){
            $(this).show();
        }
        var contentHeight = $(window).height() - 60;
        var headerHeight = $(this).find('.modal-header').outerHeight() || 2;
        var footerHeight = $(this).find('.modal-footer').outerHeight() || 2;

        $(this).find('.modal-content').css({
            'max-height': function () {
                return contentHeight;
            }
        });

        $(this).find('.modal-body').css({
            'max-height': function () {
                return contentHeight - (headerHeight + footerHeight);
            }
        });

        $(this).find('.modal-dialog').addClass('modal-dialog-center').css({
            'margin-top': function () {
                return -($(this).outerHeight() / 2);
            },
            'margin-left': function () {
                return -($(this).outerWidth() / 2);
            }
        });
        if($(this).hasClass('in') === false){
            $(this).hide();
        }
    });
}