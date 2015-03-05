/*! ChampionPick - v0.1.0 - 2015-03-05
* https://github.com/Boelensman1/ChampionPicker.github.io
* Copyright (c) 2015 ; Licensed  */
/*!
 * Bootstrap Confirmation 2.1.2
 * Copyright 2013 Nimit Suwannagate <ethaizone@hotmail.com>
 * Copyright 2014 Damien "Mistic" Sorel <http://www.strangeplanet.fr>
 * Licensed under the Apache License, Version 2.0 (the "License")
 */
!function(a){"use strict";function b(a){for(var b=window,c=a.split("."),d=c.pop(),e=0,f=c.length;f>e;e++)b=b[c[e]];return function(){b[d].call(this)}}if(!a.fn.popover)throw new Error("Confirmation requires popover.js");var c=function(b,c){this.init("confirmation",b,c);var d=this;this.options.selector||(this.$element.attr("href")&&(this.options.href=this.$element.attr("href"),this.$element.removeAttr("href"),this.$element.attr("target")&&(this.options.target=this.$element.attr("target"))),this.$element.on(d.options.trigger,function(a,b){b||(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation())}),this.$element.on("confirmed.bs.confirmation",function(){a(this).trigger(d.options.trigger,[!0])}),this.$element.on("show.bs.confirmation",function(){d.options.singleton&&a(d.options._selector).not(a(this)).filter(function(){return void 0!==a(this).data("bs.confirmation")}).confirmation("hide")})),this.options._isDelegate||(this.eventBody=!1,this.uid=this.$element[0].id||this.getUID("group_"),this.$element.on("shown.bs.confirmation",function(){if(d.options.popout&&!d.eventBody){{a(this)}d.eventBody=a("body").on("click.bs.confirmation."+d.uid,function(b){a(d.options._selector).is(b.target)||(a(d.options._selector).filter(function(){return void 0!==a(this).data("bs.confirmation")}).confirmation("hide"),a("body").off("click.bs."+d.uid),d.eventBody=!1)})}}))};c.DEFAULTS=a.extend({},a.fn.popover.Constructor.DEFAULTS,{placement:"top",title:"Are you sure?",html:!0,href:!1,popout:!1,singleton:!1,target:"_self",onConfirm:a.noop,onCancel:a.noop,btnOkClass:"btn-xs btn-primary",btnOkIcon:"glyphicon glyphicon-ok",btnOkLabel:"Yes",btnCancelClass:"btn-xs btn-default",btnCancelIcon:"glyphicon glyphicon-remove",btnCancelLabel:"No",template:'<div class="popover confirmation"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content text-center"><div class="btn-group"><a class="btn" data-apply="confirmation"></a><a class="btn" data-dismiss="confirmation"></a></div></div></div>'}),c.prototype=a.extend({},a.fn.popover.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.init=function(b,c,d){a.fn.popover.Constructor.prototype.init.call(this,b,c,d),this.options._isDelegate=!1,d.selector?this.options._selector=this._options._selector=d._root_selector+" "+d.selector:d._selector?(this.options._selector=d._selector,this.options._isDelegate=!0):this.options._selector=d._root_selector},c.prototype.setContent=function(){var b=this,c=this.tip(),d=this.options;c.find(".popover-title")[d.html?"html":"text"](this.getTitle()),c.find('[data-apply="confirmation"]').addClass(d.btnOkClass).html(d.btnOkLabel).prepend(a("<i></i>").addClass(d.btnOkIcon)," ").off("click").one("click",function(){b.getOnConfirm.call(b).call(b.$element),b.$element.trigger("confirmed.bs.confirmation"),b.leave(b)}),d.href&&c.find('[data-apply="confirmation"]').attr({href:d.href,target:d.target}),c.find('[data-dismiss="confirmation"]').addClass(d.btnCancelClass).html(d.btnCancelLabel).prepend(a("<i></i>").addClass(d.btnCancelIcon)," ").off("click").one("click",function(){b.getOnCancel.call(b).call(b.$element),b.$element.trigger("canceled.bs.confirmation"),b.leave(b)}),c.removeClass("fade top bottom left right in"),c.find(".popover-title").html()||c.find(".popover-title").hide()},c.prototype.getOnConfirm=function(){return this.$element.attr("data-on-confirm")?b(this.$element.attr("data-on-confirm")):this.options.onConfirm},c.prototype.getOnCancel=function(){return this.$element.attr("data-on-cancel")?b(this.$element.attr("data-on-cancel")):this.options.onCancel};var d=a.fn.confirmation;a.fn.confirmation=function(b){var d="object"==typeof b&&b||{};return d._root_selector=this.selector,this.each(function(){var e=a(this),f=e.data("bs.confirmation");(f||"destroy"!=b)&&(f||e.data("bs.confirmation",f=new c(this,d)),"string"==typeof b&&f[b]())})},a.fn.confirmation.Constructor=c,a.fn.confirmation.noConflict=function(){return a.fn.confirmation=d,this}}(jQuery);
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

function loadData() {
    "use strict";//strict mode

    //save the roles
    storage.set('rolesJSON', rolesJSON);

    if (loadedOnce===false) {
        loadedOnce=true;
        //reload the data after 5 seconds
        setTimeout(function () {
            loading=6;
            forceReload();
        }, 5000);

        //init everything
        init();
    }
    else
    {
        //empty, so we don't get double everything
        $('#champions').empty();
    }


    var i, index, divId, html = '';
    for (i = 0; i < order.length; ++i) {
        index = order[i];
        divId = champions[index].name.replace(/\W/g, '');
        champions[index].shortName = divId;
        if (champions[index].name.length > 8) {
            largeNames.push(divId);
        }

        //Insert the champion, first don't display because its still loading
        html += '<li style="display:none" id="champ' + divId + '" class="col-lg-1 col-md-1 col-sm-2 col-xs-3 champion toShow showSearch showF2P" data-championId="' + index + '"><img class="img-responsive championPortrait" src="' + champions[index].iconSRC + '"><span class="label label-default center-block championLabel">' + champions[index].name + '</span></li>';
    }
    $('#champions').append(html);

    //update active
    //loading
    var loaded = 0;
    var loadedPlus = (100-16)*1/(order.length);//16 == loading * 2;
    var $championPortrait = $('.championPortrait');
    $championPortrait.on('load', function () {
        loaded++;
        updateProgress(loadedPlus);
        if ($(this).parent().hasClass('toShow')) {
            $(this).parent().show();
        }
        if (loaded === order.length) {
            $('#ProgressContainer').hide();
            //make some big champion names smaller on big screen
            champTextFit();
        }
    });

    //if its in cache it might have already loaded.
    if (loaded !== order.length) {
        $championPortrait.each(function () {
            if (this.complete) {
                $(this).trigger('load');
            }
        });
    }
    reloadActive(false);

    //check if we have champions
    if (storage.isSet('championsDisabled') && !storage.isEmpty('championsDisabled')) {
        championsDisabled = storage.get('championsDisabled');
    }
    else{
        championsDisabled = {};
        for (i = 0; i < order.length; ++i) {
            index = order[i];
            championsDisabled[index] = false;
        }
        storage.set('championsDisabled', championsDisabled);
    }


    //get champion playcount
    if (storage.isSet('champPlayed') && !storage.isEmpty('champPlayed')) {
        champPlayed = storage.get('champPlayed');
    } else {
        champPlayed = {};
        storage.set('champPlayed', champPlayed);
    }

    //update disabled
    for (i = 0; i < order.length; ++i) {
        index = order[i];
        if (championsDisabled[index]) {
            $('[data-championId=' + index + ']').addClass('disabled');
        }
        else {
            $('[data-championId=' + index + ']').addClass('notDisabled');
        }
    }

    //free 2play
    var $championDiv;
    for (index = 0; index < free2play.length; ++index) {
        $championDiv = $('[data-championId=' + free2play[index] + ']');
        $championDiv.addClass('Free2Play');
        $championDiv.find('span').removeClass('label-default');
        $championDiv.find('span').addClass('label-success');
    }
    updateFree2Play();

    //load the champ click events
    $('.champion').click(function () {
        //toggle the classes
        $(this).toggleClass('notDisabled');

        var champId = $(this).data('championid');

        var disabled;
        if ($(this).hasClass('Free2Play')) {
            //if free 2 play enabled, only half disable it
            if (free2playState === 1) {
                $(this).toggleClass('disabled_f2p');
                disabled = $(this).hasClass('disabled_f2p');
            }
            else {
                //fully disable
                $(this).toggleClass('disabled');
                disabled = $(this).hasClass('disabled');
            }
        }
        else {
            $(this).toggleClass('disabled');
            disabled = $(this).hasClass('disabled');
        }

        championsDisabled[champId] = disabled;
        storage.set('championsDisabled', championsDisabled);
    });

    //enable random button
    doingRandom = false;
}



function init()
{
    'use strict';

    //init modal
    $('.randomChampionModal').modal({
        show: false
    });


    $('.randomChampionDontHaveButton').click(randomChampionDontHave);

    $('.randomChampionNextButton').click(randomChampionNew);

    function randomChampionDontHave() {
        //set champion to not have
        $('[data-championId=' + randomChampId + ']').click();

        randomChampionNew();

    }

    function randomChampionNew() {
        //check if we are not mid animation.
        if (doingNext === true) {
            return false;
        }

        doingNext = true;
        //apparently he does not have or like this champion. Lets decrease the playcount
        champPlayed[randomChampId] -= 1;

        //lets add it to the excluded champions
        champsExcluded.push(randomChampId);

        var random = getRandomChampion(champsExcluded);
        var randomRole, options;
        if (random === false) {
            //something went wrong, there are no options!
            //this is probably because someone clicked on "i don't have this champion. So lets hide the modal.
            $('.randomChampionModal').modal('hide');
            //and notify the user

            var notice = new PNotify({
                title: 'No champions',
                text: 'There are no champions left to choose from.',
                opacity: 0.9,
                icon: 'glyphicon glyphicon-envelope',
                nonblock: {
                    nonblock: true,
                    nonblock_opacity: 0.2
                },
                history: {
                    history: false
                }
            });
            notice.get().click(function () {
                notice.options.animation = 'none';
                notice.remove();
            });

            doingRandom = false;
            doingNext = false;
            return false;

        }
        else {
            randomChampId = random[0];
            randomRole = random[1];
            options = random[2];
            randomChamp = champions[randomChampId];
        }

        //update its playcount
        if (champPlayed[random]===undefined)
        {
            champPlayed[random]=0;
        }
        champPlayed[random] += 1;
        storage.set('champPlayed', champPlayed);

        //clone the modal
        var $randomChampionModal = $('.randomChampionDialog');
        var $randomChampionModal2 = $randomChampionModal.clone();

        //change the champion
        updateModal($randomChampionModal2, randomChamp, randomChampId, rolesPos[randomRole], options.length);

        //rotate and hide the modal
        $randomChampionModal2.css('opacity', 0);
        $randomChampionModal2.css('transform', 'perspective(550px) rotateY(180deg)');

        //insert the modal
        $randomChampionModal2.insertAfter('.randomChampionDialog');

        //do the transformation.
        /* fade out and rotate 3 times */
        $randomChampionModal.transition({
            opacity: 0,
            perspective: 550,
            rotateY: 540
        }, 1000);
        $randomChampionModal2.transition({
            opacity: 1,
            perspective: 550,
            rotateY: 360
        }, 1000, function () {
            $randomChampionModal.remove();

            //reset the click events
            $('.randomChampionDontHaveButton').click(randomChampionDontHave);

            $('.randomChampionNextButton').click(randomChampionNew);

            //reset the mid animation counter
            doingNext = false;
        });
    }

    //load search button
    $('#championSearch').keyup(function () {
        var val = $('#championSearch').val().toLowerCase();
        var $champion = $('.champion');
        if (val.length === 0) {
            $champion.removeClass('hiddenSearch');
            $champion.addClass('showSearch');
        }
        else {
            var i;
            val = val.split("|");
            var searchresults = [];
            for (i = 0; i < val.length; ++i) {
                var subresult = searchFor(val[i]);
                $.merge(searchresults, subresult);
            }
            //disable all champions
            $champion.addClass('hiddenSearch');
            $champion.removeClass('showSearch');
            var $championDiv;
            for (i = 0; i < searchresults.length; ++i) {
                $championDiv = $('[data-championId=' + searchresults[i] + ']');
                $championDiv.removeClass('hiddenSearch');
                $championDiv.addClass('showSearch');
            }
        }
    });

    //the free2play button
    $('.free2play').click(function () {
        var $free2play = $('.free2play');

        switch (free2playState) {
            case 0:
            {
                free2playState = 2;
                $free2play.removeClass('btn-warning');
                $free2play.removeClass('btn-success');
                $free2play.addClass('btn-primary');
                $free2play.find('p').text('Only');
                break;
            }
            case 1:
            {
                free2playState = 0;
                $free2play.removeClass('btn-success');
                $free2play.removeClass('btn-primary');
                $free2play.addClass('btn-warning');
                $free2play.find('p').text('Disabled');
                break;
            }
            case 2:
            {
                free2playState = 1;
                $free2play.removeClass('btn-warning');
                $free2play.removeClass('btn-primary');
                $free2play.addClass('btn-success');
                $free2play.find('p').text('Enabled');
                break;
            }
        }
        clearTimeout(free2playTimout);
        free2playTimout = setTimeout(function () {
            $free2play.find('p').text($free2play.data('text'));
        }, 1000);

        updateFree2Play();
    });

    //load the selection buttons
    $('.roles button').click(function () {
        //get class
        var roleId = $(this).data('roleid');

        //switch roles
        roles[roleId] = !roles[roleId];
        storage.set('roles', roles);
        //reload which champs should be active
        reloadActive(true);
    });

    $('.dropdownRole li a').click(function () {
        //update roleType
        roleType = $(this).data('roleid');
        storage.set('roleType', roleType);
        $('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');
        reloadActive(true);
    });


    $('#random').click(function () {
        //check if we are not already busy with the previous one
        if (doingRandom) {
            return false;
        }
        doingRandom = true;

        //reset the excluded champions
        champsExcluded = [];

        var random = getRandomChampion([]);//no excluded champions
        if (random === false) {
            //something went wrong, no champions
            doingRandom = false;
            //send a message
            var notice = new PNotify({
                title: 'No possible champions.',
                text: 'Please enable at least 1 champion.',
                opacity: 0.9,
                type: 'error',
                icon: 'glyphicon glyphicon-warning-sign',
                nonblock: {
                    nonblock: true,
                    nonblock_opacity: 0.2
                },
                history: {
                    history: false
                }
            });
            notice.get().click(function () {
                notice.options.animation = 'none';
                notice.remove();
            });

            return false;
        }
        randomChampId = random[0];
        var randomRole = random[1];
        var options = random[2];
        //because options is later padded
        var totalOptions = options.length;
        randomChamp = champions[randomChampId];


        //remove this champion from the option selection if there are enough champions
        if (options.length > 8) {
            options.splice(options.indexOf(randomChampId), 1);
        }

        //update its playcount
        if (champPlayed[randomChampId]===undefined)
        {
            champPlayed[randomChampId]=0;
        }
        champPlayed[randomChampId] += 1;
        storage.set('champPlayed', champPlayed);


        var $randomDiv = $('#randomtest');
        $randomDiv.empty();
        $('.randomChampionModalLore,.randomChampionModalLinks2').height(0);
        $randomDiv.css('transform', 'translate(200px,0px)');
        //champs before
        var location = Math.min(Math.max(20, options.length - 10), 35) + Math.floor(Math.random() * 10);

        //max is location, + 10 at the end
        if (options.length <= location + 10) {
            var len = options.length;
            //not enough options, fill it up!
            while (options.length <= location + 10) {
                var key = Math.floor(Math.random() * len);
                options.push(options[key]);
            }
        }

        shuffle(options);

        //insert the champion at the correct location
        options[location] = randomChampId;
        var index, html = '';
        for (index = 0; index <= location + 10; ++index) {
            if (options[index] !== -1) {
                html += ('<img src="' + champions[options[index]].iconSRC + '">');
            }
        }
        $randomDiv.append(html);

        setTimeout(function () {
            /* fade out and rotate 3 times */
            $('#randomButton').transition({
                opacity: 0,
                perspective: 550,
                rotateX: 180
            }, 1000);
            $('#randomSelecter').transition({
                opacity: 1,
                perspective: 550,
                rotateX: 360
            }, 1000);

            $randomDiv.transition({
                x: -(location) * 100 + $('#randomSelecterChild').width() / 2 + 400 - ((Math.random() * 70) + 15)
            }, 3000, 'cubic-bezier(.6,-.28,.48,1)', function () {

                var $randomChampionDialog = $('.randomChampionDialog');
                //set rotation
                $randomChampionDialog.css('transform', 'perspective(550px) rotateY(360deg)');

                updateModal($randomChampionDialog, randomChamp, randomChampId, rolesPos[randomRole], totalOptions);

                setTimeout(function () {
                    var $randomChampionModal = $('.randomChampionModal');

                    adjustModalMaxHeightAndPosition();
                    $randomChampionModal.modal('show');
                    setTimeout(function () {
                        modalLoreFit(false);
                    }, 200);

                    //sometimes above does not work, then use this one:
                    $randomChampionModal.on('shown.bs.modal', function () {
                        modalLoreFit(true);
                    });

                    //we can random again after the modal closes
                    $randomChampionModal.on('hidden.bs.modal', function () {
                        doingRandom = false;
                    });

                    setTimeout(function () {
                        $('#randomButton').transition({
                            opacity: 1,
                            perspective: 550,
                            rotateX: 0
                        }, 1000);
                        $('#randomSelecter').transition({
                            opacity: 0,
                            perspective: 550,
                            rotateX: 180
                        }, 1000);
                    }, 1000);
                }, 200);
            });
        }, 200);
        //false so no extra events get triggered
        return false;
    });

    //define the settings buttons
    $('#btn-force-reload').click(function(){
        forceReload();
    });

    $('#btn-reset-playcount').confirmation({onConfirm:function(){
        var i;
        champPlayed = {};
        storage.set('champPlayed', champPlayed);


        var notice = new PNotify({
            title: 'Playcount',
            text: 'The playcount has been reset.',
            opacity: 0.9,
            icon: 'glyphicon glyphicon-envelope',
            nonblock: {
                nonblock: true,
                nonblock_opacity: 0.2
            },
            history: {
                history: false
            }
        });

        notice.get().click(function () {
            notice.options.animation = 'none';
            notice.remove();
        });
    }});

    $('#btn-reset-champions').confirmation({onConfirm:function(){
        championsDisabled=[];
        storage.set('championsDisabled', championsDisabled);
        forceReload();
    }});

    //load export data
    $('.sidebar').on('show.bs.sidebar',function(){
        var i, exportString={};
        for (i = 0; i < exportKeys.length; ++i) {
            exportString[exportKeys[i]]=storage.get(exportKeys[i]);
        }
        $('#settingsExport').val(JSON.stringify(exportString));
    });

    //on click select all
    $('#settingsExport').click(function(){
        this.setSelectionRange(0, this.value.length);
    });

    //on double click, copy
    $('#settingsExport').dblclick(function(){

    });

    //on click import
    $('#settingsImportButton').click(function(){
        var i,key, keys, json=JSON.parse($('#settingsImport').val());
        keys=Object.keys(json);
        for (i = 0; i < keys.length; ++i) {
            key=keys[i];
            storage.set(key, json[key]);
            window[key]=json[key];
        }
        forceReload();
    });

    //load the email adress
    $.getJSON("data/email.json", function (emailJSON) {
        $('#email').text(emailJSON[0]);
        $("#email").attr("href", "mailto:" + emailJSON[0]);
    });
}
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