/*! ChampionPick - v0.1.0 - 2015-03-05
* https://github.com/Boelensman1/ChampionPicker.github.io
* Copyright (c) 2015 ; Licensed  */
/*!
 * Bootstrap v3.3.2 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.2",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.2",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active"));a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.2",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&"show"==b&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a(this.options.trigger).filter('[href="#'+b.id+'"], [data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.2",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0,trigger:'[data-toggle="collapse"]'},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":a.extend({},e.data(),{trigger:this});c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=c(d),f={relatedTarget:this};e.hasClass("open")&&(e.trigger(b=a.Event("hide.bs.dropdown",f)),b.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.2",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27|32)/.test(b.which)&&!/input|textarea/i.test(b.target.tagName)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g&&27!=b.which||g&&27==b.which)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.divider):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(b.target);38==b.which&&j>0&&j--,40==b.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="menu"]',g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.2",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.options.backdrop&&d.adjustBackdrop(),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in").attr("aria-hidden",!1),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$element.find(".modal-dialog").one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a('<div class="modal-backdrop '+e+'" />').prependTo(this.$element).on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.options.backdrop&&this.adjustBackdrop(),this.adjustDialog()},c.prototype.adjustBackdrop=function(){this.$backdrop.css("height",0).css("height",this.$element[0].scrollHeight)},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){this.bodyIsOverflowing=document.body.scrollHeight>document.documentElement.clientHeight,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.3.2",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c&&c.$tip&&c.$tip.is(":visible")?void(c.hoverState="in"):(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.options.container?a(this.options.container):this.$element.parent(),p=this.getPosition(o);h="bottom"==h&&k.bottom+m>p.bottom?"top":"top"==h&&k.top-m<p.top?"bottom":"right"==h&&k.right+l>p.width?"left":"left"==h&&k.left-l<p.left?"right":h,f.removeClass(n).addClass(h)}var q=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(q,h);var r=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",r).emulateTransitionEnd(c.TRANSITION_DURATION):r()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=this.tip(),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type)})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.2",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},c.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){var e=a.proxy(this.process,this);this.$body=a("body"),this.$scrollElement=a(a(c).is("body")?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",e),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.2",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b="offset",c=0;a.isWindow(this.$scrollElement[0])||(b="position",c=this.$scrollElement.scrollTop()),this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight();var d=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+c,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){d.offsets.push(this[0]),d.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.2",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()
}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.2",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=a("body").height();"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
+function ($) {
  'use strict';

  // SIDEBAR PUBLIC CLASS DEFINITION
  // ================================

  var Sidebar = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Sidebar.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Sidebar.DEFAULTS = {
    toggle: true
  }

  Sidebar.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('sidebar-open')) return


    var startEvent = $.Event('show.bs.sidebar')
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return

    this.$element
      .addClass('sidebar-open')

    this.transitioning = 1

    var complete = function () {
      this.$element
      this.transitioning = 0
      this.$element.trigger('shown.bs.sidebar')
    }

    if(!$.support.transition) return complete.call(this)

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(400)
  }

  Sidebar.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('sidebar-open')) return

    var startEvent = $.Event('hide.bs.sidebar')
    this.$element.trigger(startEvent)
    if(startEvent.isDefaultPrevented()) return

    this.$element
      .removeClass('sidebar-open')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.sidebar')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(400)
  }

  Sidebar.prototype.toggle = function () {
    this[this.$element.hasClass('sidebar-open') ? 'hide' : 'show']()
  }

  var old = $.fn.sidebar

  $.fn.sidebar = function (option) {
    return this.each(function (){
      var $this = $(this)
      var data = $this.data('bs.sidebar')
      var options = $.extend({}, Sidebar.DEFAULTS, $this.data(), typeof options == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.sidebar', (data = new Sidebar(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.sidebar.Constructor = Sidebar

  $.fn.sidebar.noConflict = function () {
    $.fn.sidebar = old
    return this
  }

  $(document).on('click.bs.sidebar.data-api', '[data-toggle="sidebar"]', function (e) {
    var $this = $(this), href
    var target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')
    var $target = $(target)
    var data = $target.data('bs.sidebar')
    var option = data ? 'toggle' : $this.data()

    $target.sidebar(option)
  })

  $('html').on('click.bs.sidebar.autohide', function(event){
    var $this = $(event.target);
    var isButtonOrSidebar = $this.is('.sidebar, [data-toggle="sidebar"]') || $this.parents('.sidebar, [data-toggle="sidebar"]').length;
    if (isButtonOrSidebar) {
      return;
    } else {
      var $target = $('.sidebar');
      $target.each(function(i, trgt) {
        var $trgt = $(trgt);
        if($trgt.data('bs.sidebar') && $trgt.hasClass('sidebar-open')) {
            $trgt.sidebar('hide');
        }
      })
    }
  });
}(jQuery);

(function($) {

var $event = $.event,
	$special,
	resizeTimeout;

$special = $event.special.debouncedresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments,
			dispatch = function() {
				// set correct event type
				event.type = "debouncedresize";
				$event.dispatch.apply( context, args );
			};

		if ( resizeTimeout ) {
			clearTimeout( resizeTimeout );
		}

		execAsap ?
			dispatch() :
			resizeTimeout = setTimeout( dispatch, $special.threshold );
	},
	threshold: 150
};

})(jQuery);

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function t(t){var r,i,n,o=arguments.length,s=window[t],a=arguments,u=a[1];if(2>o)throw Error("Minimum 2 arguments must be given");if(e.isArray(u)){i={};for(var f in u){r=u[f];try{i[r]=JSON.parse(s.getItem(r))}catch(c){i[r]=s.getItem(r)}}return i}if(2!=o){try{i=JSON.parse(s.getItem(u))}catch(c){throw new ReferenceError(u+" is not defined in this storage")}for(var f=2;o-1>f;f++)if(i=i[a[f]],void 0===i)throw new ReferenceError([].slice.call(a,1,f+1).join(".")+" is not defined in this storage");if(e.isArray(a[f])){n=i,i={};for(var m in a[f])i[a[f][m]]=n[a[f][m]];return i}return i[a[f]]}try{return JSON.parse(s.getItem(u))}catch(c){return s.getItem(u)}}function r(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1],u=s[2],f={};if(2>n||!e.isPlainObject(a)&&3>n)throw Error("Minimum 3 arguments must be given or second parameter must be an object");if(e.isPlainObject(a)){for(var c in a)r=a[c],e.isPlainObject(r)?o.setItem(c,JSON.stringify(r)):o.setItem(c,r);return a}if(3==n)return"object"==typeof u?o.setItem(a,JSON.stringify(u)):o.setItem(a,u),u;try{i=o.getItem(a),null!=i&&(f=JSON.parse(i))}catch(m){}i=f;for(var c=2;n-2>c;c++)r=s[c],i[r]&&e.isPlainObject(i[r])||(i[r]={}),i=i[r];return i[s[c]]=s[c+1],o.setItem(a,JSON.stringify(f)),f}function i(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1];if(2>n)throw Error("Minimum 2 arguments must be given");if(e.isArray(a)){for(var u in a)o.removeItem(a[u]);return!0}if(2==n)return o.removeItem(a),!0;try{r=i=JSON.parse(o.getItem(a))}catch(f){throw new ReferenceError(a+" is not defined in this storage")}for(var u=2;n-1>u;u++)if(i=i[s[u]],void 0===i)throw new ReferenceError([].slice.call(s,1,u).join(".")+" is not defined in this storage");if(e.isArray(s[u]))for(var c in s[u])delete i[s[u][c]];else delete i[s[u]];return o.setItem(a,JSON.stringify(r)),!0}function n(t,r){var n=a(t);for(var o in n)i(t,n[o]);if(r)for(var o in e.namespaceStorages)u(o)}function o(r){var i=arguments.length,n=arguments,s=(window[r],n[1]);if(1==i)return 0==a(r).length;if(e.isArray(s)){for(var u=0;u<s.length;u++)if(!o(r,s[u]))return!1;return!0}try{var f=t.apply(this,arguments);e.isArray(n[i-1])||(f={totest:f});for(var u in f)if(!(e.isPlainObject(f[u])&&e.isEmptyObject(f[u])||e.isArray(f[u])&&!f[u].length)&&f[u])return!1;return!0}catch(c){return!0}}function s(r){var i=arguments.length,n=arguments,o=(window[r],n[1]);if(2>i)throw Error("Minimum 2 arguments must be given");if(e.isArray(o)){for(var a=0;a<o.length;a++)if(!s(r,o[a]))return!1;return!0}try{var u=t.apply(this,arguments);e.isArray(n[i-1])||(u={totest:u});for(var a in u)if(void 0===u[a]||null===u[a])return!1;return!0}catch(f){return!1}}function a(r){var i=arguments.length,n=window[r],o=arguments,s=(o[1],[]),a={};if(a=i>1?t.apply(this,o):n,a._cookie)for(var u in e.cookie())""!=u&&s.push(u.replace(a._prefix,""));else for(var f in a)s.push(f);return s}function u(t){if(!t||"string"!=typeof t)throw Error("First parameter must be a string");g?(window.localStorage.getItem(t)||window.localStorage.setItem(t,"{}"),window.sessionStorage.getItem(t)||window.sessionStorage.setItem(t,"{}")):(window.localCookieStorage.getItem(t)||window.localCookieStorage.setItem(t,"{}"),window.sessionCookieStorage.getItem(t)||window.sessionCookieStorage.setItem(t,"{}"));var r={localStorage:e.extend({},e.localStorage,{_ns:t}),sessionStorage:e.extend({},e.sessionStorage,{_ns:t})};return e.cookie&&(window.cookieStorage.getItem(t)||window.cookieStorage.setItem(t,"{}"),r.cookieStorage=e.extend({},e.cookieStorage,{_ns:t})),e.namespaceStorages[t]=r,r}function f(e){if(!window[e])return!1;var t="jsapi";try{return window[e].setItem(t,t),window[e].removeItem(t),!0}catch(r){return!1}}var c="ls_",m="ss_",g=f("localStorage"),h={_type:"",_ns:"",_callMethod:function(e,t){var r=[this._type],t=Array.prototype.slice.call(t),i=t[0];return this._ns&&r.push(this._ns),"string"==typeof i&&-1!==i.indexOf(".")&&(t.shift(),[].unshift.apply(t,i.split("."))),[].push.apply(r,t),e.apply(this,r)},get:function(){return this._callMethod(t,arguments)},set:function(){var t=arguments.length,i=arguments,n=i[0];if(1>t||!e.isPlainObject(n)&&2>t)throw Error("Minimum 2 arguments must be given or first parameter must be an object");if(e.isPlainObject(n)&&this._ns){for(var o in n)r(this._type,this._ns,o,n[o]);return n}var s=this._callMethod(r,i);return this._ns?s[n.split(".")[0]]:s},remove:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(i,arguments)},removeAll:function(e){return this._ns?(r(this._type,this._ns,{}),!0):n(this._type,e)},isEmpty:function(){return this._callMethod(o,arguments)},isSet:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(s,arguments)},keys:function(){return this._callMethod(a,arguments)}};if(e.cookie){window.name||(window.name=Math.floor(1e8*Math.random()));var l={_cookie:!0,_prefix:"",_expires:null,_path:null,_domain:null,setItem:function(t,r){e.cookie(this._prefix+t,r,{expires:this._expires,path:this._path,domain:this._domain})},getItem:function(t){return e.cookie(this._prefix+t)},removeItem:function(t){return e.removeCookie(this._prefix+t)},clear:function(){for(var t in e.cookie())""!=t&&(!this._prefix&&-1===t.indexOf(c)&&-1===t.indexOf(m)||this._prefix&&0===t.indexOf(this._prefix))&&e.removeCookie(t)},setExpires:function(e){return this._expires=e,this},setPath:function(e){return this._path=e,this},setDomain:function(e){return this._domain=e,this},setConf:function(e){return e.path&&(this._path=e.path),e.domain&&(this._domain=e.domain),e.expires&&(this._expires=e.expires),this},setDefaultConf:function(){this._path=this._domain=this._expires=null}};g||(window.localCookieStorage=e.extend({},l,{_prefix:c,_expires:3650}),window.sessionCookieStorage=e.extend({},l,{_prefix:m+window.name+"_"})),window.cookieStorage=e.extend({},l),e.cookieStorage=e.extend({},h,{_type:"cookieStorage",setExpires:function(e){return window.cookieStorage.setExpires(e),this},setPath:function(e){return window.cookieStorage.setPath(e),this},setDomain:function(e){return window.cookieStorage.setDomain(e),this},setConf:function(e){return window.cookieStorage.setConf(e),this},setDefaultConf:function(){return window.cookieStorage.setDefaultConf(),this}})}e.initNamespaceStorage=function(e){return u(e)},g?(e.localStorage=e.extend({},h,{_type:"localStorage"}),e.sessionStorage=e.extend({},h,{_type:"sessionStorage"})):(e.localStorage=e.extend({},h,{_type:"localCookieStorage"}),e.sessionStorage=e.extend({},h,{_type:"sessionCookieStorage"})),e.namespaceStorages={},e.removeAllStorages=function(t){e.localStorage.removeAll(t),e.sessionStorage.removeAll(t),e.cookieStorage&&e.cookieStorage.removeAll(t),t||(e.namespaceStorages={})}});
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

/*global Modernizr */
/*jshint latedef:false, unused: false, undef:false */

//init all variables
var roles = [false, false, false, false, false];
var roleTypeOptions = ['All', 'Loose', 'Normal', 'Strict'];
var roleType = 2;
var rolesPos = ['Toplane', 'Jungle', 'Midlane', 'Marksman', 'Support'];
var rolesJSON;

var champions = [];
var order = [];
var largeNames = [];
var championsDisabled;
var champPlayed = {};

var free2play = [];
var free2playState = true;
var free2playError = false;
var free2playTimout;
var free2playURL = "http://wwbtestserver.cloudapp.net:8080/free2play.json";

var doingRandom = true;
var doingNext = false;
var randomChamp;
var randomChampId;
var champsExcluded;

var loading = 8; //countdown till all JSON is loaded
var loadedOnce=false;
var loadingProgress = 0; //the progress bar

var DOMReady = false;
var region = 'EUW';

var exportKeys=['champPlayed', 'free2playState', 'roleType', 'roles','championsDisabled'];

//set pnotify styling and options
/* global PNotify */
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.delay = 3000;//3 seconds

//init easy storage
//var ns = $.initNamespaceStorage('championPicker');
//check if we support localstorage
if (Modernizr.localstorage) {
    var storage = $.localStorage;
}
else {
    //no, lets do cookies
    var storage = $.cookieStorage;
}
if (storage.isSet('championsDisabled')) {
    championsDisabled = storage.get('championsDisabled');
}
else {
    championsDisabled = null;
}


if (storage.isSet('roleType')) {
    roleType = storage.get('roleType');
} else {
    //roleType is not set, so this prob. the first time the user went to this website
    var notice = new PNotify({
        title: 'Info',
        text: 'Click on a champion to disable it.',
        opacity: 0.9,
        icon: 'glyphicon glyphicon-envelope',
        nonblock: {
            nonblock: true,
            nonblock_opacity: 0.2
        },
        history: {
            history: false
        },
        delay: 10000
    });
    notice.get().click(function () {
        notice.options.animation = 'none';
        notice.remove();
    });

    roleType = 2;
    storage.set('roleType', roleType);
}

$('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');


if (storage.isSet('free2playState')) {

    free2playState = storage.get('free2playState');
} else {
    free2playState = 1;
    storage.set('free2playState', free2playState);
}


var $free2play = $('.free2play');
$free2play.removeClass('btn-success');

//set button to correct color and text
switch (free2playState) {
    case 0:
    {
        $free2play.addClass('btn-warning');
        $free2play.find('p').text('Disabled');
        break;
    }
    case 1:
    {
        $free2play.addClass('btn-success');
        $free2play.find('p').text('Enabled');
        break;
    }
    case 2:
    {
        $free2play.addClass('btn-primary');
        $free2play.find('p').text('Only');
        break;
    }
}

//reset the button
free2playTimout = setTimeout(function () {
    'use strict';

    $free2play.find('p').text($free2play.data('text'));
}, 1000);

//load from storage (or from JSON)
if (storage.isSet('champions')) {
    champions = storage.get('champions');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {
    //load the champion data
    loadChampionData();
}

if (storage.isSet('order')) {
    order = storage.get('order');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {
    loadOrderData();

}
if (storage.isSet('free2play')) {
    free2play = storage.get('free2play');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {
    //load f2p
    loadF2PData();
}

if (storage.isSet('rolesJSON')) {
    rolesJSON = storage.get('rolesJSON');

    loading -= (roleTypeOptions.length - 1);
    updateProgress(2 * (roleTypeOptions.length - 1));
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {

    //init rolesJSON
    rolesJSON = [];

    //load roles
    loadRoleData();
}

$(function () {
    "use strict";//strict mode

    //DOM completed loading!
    DOMReady = true;

    if (free2playError) {
        showFree2PlayError();
    }
    loading--;
    updateProgress(2);

    //load the later scripts
    $.getScript("dist/ChampionPick-after.min.js", function(){
        loading--;

        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }

    });
});

function reloadActive(update) {
    "use strict";//strict mode

    var $championsli = $("#champions").find("li");
    var $btnRole = $('.btn-role');
    //check if all buttons are on or off:
    if ((roles[0] && roles[1] && roles[2] && roles[3] && roles[4]) || (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4])) {
        //activate everything
        $championsli.addClass('toShow');
        $championsli.removeClass('toHide');

        //toggle the appropriate button
        if (roles[0]) {
            $btnRole.addClass('active');
        }
        else {
            $btnRole.removeClass('active');
        }

        //show the all button
        $('.btn-all').show();


        if (update) {
            updateShowHide();
        }
        return true;
    }


    //update roleType, can't have a role selecten and ALL at the same time.
    if (roleType === 0) {
        roleType = 2;
        storage.set('roleType', roleType);
    }
    $('.btn-all').hide();


    //de-activate everything
    $championsli.addClass('toHide');
    $championsli.removeClass('toShow');
    $btnRole.removeClass('active');

    $('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');

    //if its not we have to some real work
    processRoles(update);
    return true;
}

function processRoles(update) {
    "use strict";//strict mode

    var index, index2;
    for (index = 0; index < roles.length; ++index) {
        if (roles[index]) {
            //activate the button
            $('.role_' + index).addClass('active');

            //we have to activate all champions who have this role
            for (index2 = 0; index2 < rolesJSON[roleType][index].length; ++index2) {
                var $championDiv = $('[data-championId=' + rolesJSON[roleType][index][index2] + ']');
                $championDiv.addClass('toShow');
                $championDiv.removeClass('toHide');
            }
        }
    }
    if (update) {
        updateShowHide();
    }
}

function updateShowHide() {
    "use strict";//strict mode

    $('.toShow').show();
    $('.toHide').hide();
}

function champTextFit() {
    "use strict";//strict mode

    var index, $label;
    //numbers are where bootstrap swithes
    if ($(window).width() > 992 || $(window).width() < 512) {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel');
            //0.6 and 11 are semi-randomly chosen but seem to fit
            $label.fitText(0.6 * ($label.html().length) / 11);
        }
    } else {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel');
            $label.removeAttr('style');
        }
    }
}
$(window).on("debouncedresize", function () {
    "use strict";//strict mode

    champTextFit();
    //320=where bootstrap swtiches
    if ($(window).height() >= 320) {
        adjustModalMaxHeightAndPosition();
    }
    modalLoreFit(false);
});

function modalLoreFit(animate) {
    "use strict";//strict mode

    var width = $('.randomChampionDialog').width();
    var height = width * 0.590;//aspect ratio of splashes
    var $randomChampionModalLore = $('.randomChampionModalLore');
    var $randomChampionModalLinks = $('.randomChampionModalLinks');
    var $randomChampionModalLinks2 = $('.randomChampionModalLinks2');

    height -= 110;//height of title
    height -= 50;//height of bottom button

    if ($(window).width() >= 450) {
        //update visibility
        $randomChampionModalLore.show();
        $randomChampionModalLinks.show();
        $randomChampionModalLinks2.hide();

        height -= 70;//height of buttons
        if (animate) {
            $randomChampionModalLore.transition({height: (height) + 'px'},
                adjustModalMaxHeightAndPosition);
        }
        else {
            $randomChampionModalLore.height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
    else {
        //update visibility
        $randomChampionModalLore.hide();
        $randomChampionModalLinks.hide();
        $randomChampionModalLinks2.show();

        height -= 40;//margins
        if (animate) {
            $randomChampionModalLinks2.transition({height: (height) + 'px'},
                adjustModalMaxHeightAndPosition);
        }
        else {
            $randomChampionModalLinks2.height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
}

function updateFree2Play() {
    "use strict";//strict mode
    var $Free2PlayChampions;
    var $champion=$('.champion');
    switch (free2playState) {
        case 0://disabled
        {
            $Free2PlayChampions = $('.Free2Play.disabled_f2p');
            $Free2PlayChampions.addClass('disabled');
            $Free2PlayChampions.removeClass('disabled_f2p');

            $champion.removeClass('hiddenF2P');
            $champion.addClass('showF2P');
        break;
        }
        case 1://enabled
        {
            $Free2PlayChampions = $('.Free2Play.disabled');
            $Free2PlayChampions.addClass('disabled_f2p');
            $Free2PlayChampions.removeClass('disabled');

            $champion.removeClass('hiddenF2P');
            $champion.addClass('showF2P');
        break;
        }
        case 2://only
        {
            $Free2PlayChampions = $('.Free2Play');

            $champion.removeClass('showF2P');
            $champion.addClass('hiddenF2P');

            $Free2PlayChampions.removeClass('hiddenF2P');
            $Free2PlayChampions.addClass('showF2P');
            
            $Free2PlayChampions = $('.Free2Play.disabled');
            $Free2PlayChampions.addClass('disabled_f2p');
            $Free2PlayChampions.removeClass('disabled');
        }
    }
    //update f2p
    storage.set('free2playState', free2playState);
}

function loadChampionData() {
    "use strict";//strict mode

    $.getJSON("data/champions.json", function (championsJSON) {
        champions = championsJSON;
        storage.set('champions', champions);
        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}

function loadOrderData() {
    "use strict";//strict mode

    $.getJSON("data/order.json", function (orderJSON) {
        order = orderJSON;
        storage.set('order', order);
        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}

function loadRoleData() {
    "use strict";//strict mode

    var filename, index; //so we know what data we are parsing
    for (index = 1; index < roleTypeOptions.length; ++index) {
        filename = 'data/roles' + roleTypeOptions[index] + '.json';
        //lets load it
        $.ajax({
            dataType: "json",
            url: filename,
            success: loadRole,
            context: {index: index}
        });
    }
}
function loadRole(rolesJson) {
    "use strict";//strict mode

    rolesJSON[this.index] = rolesJson; // jshint ignore:line
    loading--;
    updateProgress(2);

    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
}

function loadF2PData() {
    "use strict";//strict mode

    //get free2play
    $.getJSON(free2playURL, function (free2playJSON) {
        if (free2playJSON.errors[region] === true) {
            if ((DOMReady === true) && (free2playError === false)) {
                //show error now
                free2playError = true;
                showFree2PlayError();
            }
            else {
                //if not, handle this when it is
                free2playError = true;
            }
        }

        free2play = free2playJSON.free2play[region];
        storage.set('free2play', free2play);

        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    }).error(function () {
        //something went wrong! Lets check if the dom is ready
        //If free2playError is true, it has already been showed sometime, so do not show it again.
        if ((DOMReady === true) && (free2playError === false)) {
            //show error now
            free2playError = true;
            showFree2PlayError();
        }
        else {
            //if not, handle this when it is
            free2playError = true;
        }

        //lets still do the rest, so we can continue loading
        //if we have data, lets use it instead of the online
        free2play = storage.get('free2play');
        if (free2play === null) {
            free2play = [];
        }

        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }

    });
}

function updateModal(divId, randomChamp, randomChampId, role, totalOptions) {
    "use strict";//strict mode

    divId.find('.randomChampionModalTitle').html(randomChamp.name + ': ' + randomChamp.title);
    divId.find('.randomChampionModalRole').html(role);
    divId.find('.randomChampionModalLore p').html(randomChamp.description);

    //probuilds
    divId.find('.randomChampionModalProbuildLink').attr("href", 'http://www.probuilds.net/champions/' + randomChamp.shortName);

    //mobafire
    divId.find('.randomChampionModalMobafireLink').attr("href", randomChamp.mobafireURL);

    //lolwiki
    divId.find('.randomChampionModalLoLWikiLink').attr("href", 'http://leagueoflegends.wikia.com/wiki/' + randomChamp.name);

    divId.find('.randomChampionModalBackground').css('background-image', 'url(' + randomChamp.splashSRC + ')');

    //enable both buttons
    divId.find('.randomChampionDontHaveButton').prop("disabled", false);
    divId.find('.randomChampionNextButton').prop("disabled", false);

    //check if its a free 2 play champion that has been disabled
    if (free2playState === true)//otherwise the champ would not have been chosen
    {
        if (free2play.indexOf(randomChampId) !== -1) {
            //okay, the champion is free2play, now lets see if its disabled
            if (championsDisabled[randomChampId] === true) {
                //okay, its already disabled, no use of the "i dont have this champion button now"
                divId.find('.randomChampionDontHaveButton').prop("disabled", true);
            }
        }
    }
    //check if we have no other option to switch to
    if (totalOptions === 1) {
        divId.find('.randomChampionNextButton').prop("disabled", true);
    }
}

function updateProgress(loadProgress) {
    "use strict";//strict mode

    loadingProgress += loadProgress;
    $("#loadingProgress").css('width', loadingProgress + '%');
}

//knuth-shuffle
function shuffle(array) {
    "use strict";//strict mode

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getRandomChampion(excluded) {

    "use strict";//strict mode

    var $optionDivs = $('.toShow.notDisabled.showSearch.showF2P, .toShow.disabled_f2p.showSearch.showF2P');

    //check if we have options:
    if ($optionDivs.length === 0) {
        return false;
    }

    //Get all possible champions for all roles
    var options = [];//all options, including not chosen lanes
    var realOptions = [[], [], [], [], []];//the real options
    var champId = 0;

    //now lets see what champions we haven't played or played the least:
    var leastPlayed = Number.MAX_VALUE;
    $optionDivs.each(function () {
        champId = $(this).data('championid');

        //check if not excluded
        if (excluded.indexOf(champId) === -1) {
            options.push(champId);

            //check if we have a playcount
            var played=0;
            if (champPlayed[champId]!==undefined)
            {
                played=champPlayed[champId];
            }

            //if smaller, replace the list
            if (played < leastPlayed) {
                //reset
                realOptions = [[], [], [], [], []];//the real options
                leastPlayed = played;
            }

            //if just as much (or smaller), add to the list
            if (played <= leastPlayed) {
                //go through all roles
                var i;
                for (i = 0; i < 5; ++i) {
                    if (roleType===0 || rolesJSON[roleType][i].indexOf(champId) !== -1) {
                        realOptions[i].push(champId);
                    }
                }
            }
        }
    });

    var rolesFiltered = roles.slice(0);//copy

    //count the amount of options
    if ((realOptions[0].length + realOptions[1].length + realOptions[2].length + realOptions[3].length + realOptions[4].length) === 0) {
        //something went wrong, we have no options!
        return false;
    }

    //if all roles are deselected it counts as all roles being selected
    if (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4]) {
        rolesFiltered = [true, true, true, true, true];
    }

    //filter the roles where there is no champion for
    var i;
    for (i = 0; i < 5; ++i) {
        if (realOptions[i].length === 0) {
            //no champions for this role
            rolesFiltered[i] = false;
        }
    }

    // choose a role
    var randomRole = Math.floor(Math.random() * 5);

    //make sure the role chosen is actually wanted
    while (!rolesFiltered[randomRole]) {
        randomRole = Math.floor(Math.random() * 5);
    }

    //go to the correct options
    realOptions = realOptions[randomRole];

    //lets get a random option
    var randomId = realOptions[Math.floor(Math.random() * realOptions.length)];

    return [randomId, randomRole, options];
}

function showFree2PlayError() {
    "use strict";//strict mode

    var notice = new PNotify({
        title: 'Riot server error',
        text: 'Failed to get free to play data from riot. Data may be missing or out of date.',
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
}

function searchFor(toSearch) {
    "use strict";//strict mode

    var results = [];
    toSearch = trimString(toSearch); // trim it
    for (var i = 0; i < order.length; i++) {
        if (champions[order[i]].nameLower.indexOf(toSearch) !== -1) {
            if (!itemExists(results, champions[order[i]])) {
                results.push(order[i]);
            }
        }
    }
    return results;
}
function forceReload()
{
    "use strict";

    loading = 6; //countdown till all JSON is loaded, one les than normal because DOM does not need to load.
    loadingProgress = 2; //the progress bar, 2 because dom is already loaded
    updateProgress(0);

    $('#ProgressContainer').show();
    loadChampionData();
    loadOrderData();
    loadF2PData();
    loadRoleData();
}
function trimString(s) {
    "use strict";//strict mode

    var l = 0, r = s.length - 1;
    while (l < s.length && s[l] === ' ') {
        l++;
    }
    while (r > l && s[r] === ' ') {
        r -= 1;
    }
    return s.substring(l, r + 1);
}


function compareObjects(o1, o2) {
    "use strict";//strict mode

    var k;
    for (k in o1) {
        //noinspection JSUnfilteredForInLoop
        if (o1[k] !== o2[k]) {
            return false;
        }
    }
    for (k in o2) {
        //noinspection JSUnfilteredForInLoop
        if (o1[k] !== o2[k]) {
            return false;
        }
    }
    return true;
}

function itemExists(haystack, needle) {
    "use strict";//strict mode

    for (var i = 0; i < haystack.length; i++) {
        if (compareObjects(haystack[i], needle)) {
            return true;
        }
    }
    return false;
}