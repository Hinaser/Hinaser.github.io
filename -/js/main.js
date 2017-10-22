(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./standard');

},{"./standard":5}],2:[function(require,module,exports){
"use strict";

/**
 * Auto display balloon for elements
 * @requires jQuery
 */
(function ($) {
  $.fn.balloon = function (opts) {
    var setting = $.extend({
      "placement": "left",
      "color": undefined,
      "marginTop": 0,
      "marginLeft": 0
    }, opts);

    if (!["bottom", "right", "left"].includes(setting.placement)) {
      throw new Error("Invalid placement.");
    }
    if (!["default", "black", undefined].includes(setting.color)) {
      throw new Error("Invalid color.");
    }

    var wrapperInitialStyle = {
      "position": "fixed",
      "opacity": 0,
      "z-index": -1,
      "transition": "opacity ease .3s"
    };

    var $document = $(document);

    this.each(function () {
      var $t = $(this);
      var $contents = $t.find(".balloon-contents");

      if (!$contents || $contents.length < 1) {
        return;
      }

      var $balloon = $("<div>").addClass("balloon").addClass(setting.placement).html($contents.html());

      if (setting.color) {
        $balloon.addClass(setting.color);
      }

      var $wrapper = $("<div>").css(wrapperInitialStyle);

      $wrapper.append($balloon);
      $t.append($wrapper);
      $contents.remove();

      var popUpStatus = 0; // 0: hidden, 1: visible
      var arrowMargin = 27; // See asset.styl. $balloon-triangle-size = 11px, $balloon-triangle-left = 16px

      $t.on("mouseenter", function (e) {
        var self = $t;
        var zIndex = 9999;

        var calcPosition = function calcPosition() {
          var top = void 0,
              left = void 0;

          switch (setting.placement) {
            case "bottom":
              top = self.offset().top - $document.scrollTop() + self.height() + setting.marginTop;
              left = self.offset().left - $document.scrollLeft() - arrowMargin + setting.marginLeft;
              break;
            case "left":
              $wrapper.css({ top: 0, left: 0 }); // Prevent contents wrapping before calculating $wrapper.width()
              top = self.offset().top - $document.scrollTop() - arrowMargin + setting.marginTop;
              left = self.offset().left - $document.scrollLeft() - $wrapper.width() - setting.marginLeft;

              var wrapper_height = $wrapper.height();
              var remain = top + wrapper_height - window.innerHeight;
              if (remain > 0) {
                top = top - wrapper_height + arrowMargin * 2;
                $balloon.addClass("upper");
              } else {
                $balloon.removeClass("upper");
              }
              break;
            case "right":
              $wrapper.css({ top: 0, right: 0 }); // Prevent contents wrapping before calculating $wrapper.width()
              top = self.offset().top - $document.scrollTop() - arrowMargin + setting.marginTop;
              left = self.offset().left - $document.scrollLeft() + self.width() - setting.marginLeft;
              break;
          }

          return { top: top, left: left };
        };

        var position = calcPosition();

        $wrapper.css({
          "top": position.top,
          "left": position.left,
          "z-index": zIndex,
          "opacity": 1
        });

        popUpStatus = 1;

        $(window).on("scroll.balloon", function (e) {
          var position = calcPosition();
          $wrapper.css({
            top: position.top,
            left: position.left
          });
        });
      });

      $t.on("mouseleave", function (e) {
        $wrapper.css({
          "opacity": 0
        });

        popUpStatus = 0;

        $(window).off("scroll.balloon");
      });

      $t.on("transitionend webkitTransitionEnd oTransitionEnd", function (e) {
        if (popUpStatus === 0) {
          $wrapper.css("z-index", -1);
        }
      });
    });

    return this;
  };
})(jQuery);

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function () {
  function Header() {
    _classCallCheck(this, Header);

    this.selector = "body > header";

    this.sticky();
  }

  _createClass(Header, [{
    key: "sticky",
    value: function sticky() {
      var scrollDownThreshold = 200;
      var scrollUpThreshold = 100;
      var mediaQueryString = "(min-width: 1200px), (min-width: 800px) and (max-width: 1199px)";

      var $window = $(window);
      var header = $(this.selector);
      var resizing = false;

      var onTransitionEnd = function onTransitionEnd(e) {
        header.removeClass("disable-height-animation");
        resizing = false;
      };

      header.on("transitionend webkitTransitionEnd oTransitionEnd", onTransitionEnd);

      $window.on("scroll", function (e) {
        if (!window.matchMedia(mediaQueryString).matches || resizing) return;

        var scrollTop = $window.scrollTop();

        if (scrollUpThreshold < scrollTop && scrollTop < scrollDownThreshold) {
          if (!header.hasClass("fixed-header")) return;

          if (!header.hasClass("scroll-margin")) header.addClass("scroll-margin");

          var header_height = 300 + 20 - scrollTop;
          header.css({
            height: header_height,
            bottom: "calc(100% - " + header_height + "px)"
          });

          return;
        }

        if (scrollTop >= scrollDownThreshold) {
          if (header.hasClass("fixed-header")) return;

          resizing = true;
          header.addClass("fixed-header");
        } else if (scrollTop <= scrollUpThreshold) {
          if (!header.hasClass("fixed-header")) return;

          header.removeAttr("style");
          header.removeClass("scroll-margin");

          resizing = true;
          header.addClass("disable-height-animation");
          header.removeClass("fixed-header");
        }
      });
    }
  }]);

  return Header;
}();

exports.default = Header;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sidebar = function () {
  function Sidebar() {
    _classCallCheck(this, Sidebar);

    this.selector = "body > main > nav";

    this.wrapHeadline();
    this.initToggleButton();
    this.buildEmailAddress();
    this.buildBalloon();
  }

  _createClass(Sidebar, [{
    key: "wrapHeadline",
    value: function wrapHeadline() {
      var headlineTitle = $(this.selector).find(".headline .headline-title");
      headlineTitle.dotdotdot({
        truncate: "letter",
        watch: true
      });
    }
  }, {
    key: "initToggleButton",
    value: function initToggleButton() {
      var $document = $(document);
      var $sidebar = $(this.selector);
      var $tags = $sidebar.find(".tags");
      var $button = $("#sidebar-toggle-button");

      var closeSidebar = function closeSidebar(e) {
        // Do nothing if outside of sidebar has been clicked.
        // However, if screen size is for mobile, close sidebar wherever is clicked.
        if (!window.matchMedia("(max-width: 799px)").matches && $sidebar.is(e.target) || $sidebar.has(e.target).length > 0) {
          return;
        }

        $sidebar.removeClass("visible");
      };

      var onToggleButtonClicked = function onToggleButtonClicked(e) {
        e.preventDefault();
        e.stopPropagation();

        if ($sidebar.hasClass("visible")) {
          $sidebar.removeClass("visible");
          $document.off("click.closeSidebar");
        } else {
          $sidebar.addClass("visible");
          $document.on("click.closeSidebar", closeSidebar);
        }
      };

      $button.on("click", onToggleButtonClicked);
    }

    /**
     * Preventing email spam
     */

  }, {
    key: "buildEmailAddress",
    value: function buildEmailAddress() {
      var pageOpened = new Date().getTime();
      var isAlreadyBuilt = false;
      var $email = $(".profile .social .email");

      var addr = [8059, 6088, 7163, 5063, 7384, -2821, 5879, 6088, 7163, 4472, 8288, 5264, -3088, 5672, 6088, 8519, 5879, 8752, 4667, 7607, 4472, 5672, 5264, 8288, -841, 5672, 6944, 4472, 6088, 6727, -2821, 4864, 7384, 6944];

      var makeAddress = function makeAddress(e) {
        if (isAlreadyBuilt && new Date().getTime() - pageOpened > 1500) return;

        $email.attr("href", "mailto:" + addr.map(function (v) {
          return String.fromCharCode(Math.sqrt(v + 4937));
        }).join(""));
      };

      $email.on("mouseover touchstart", makeAddress);
    }
  }, {
    key: "buildBalloon",
    value: function buildBalloon() {
      $(this.selector + " [data-balloon]").balloon({
        placement: "left",
        color: "black",
        marginTop: $(".profile-attribute").height() / 2
      });
    }
  }]);

  return Sidebar;
}();

exports.default = Sidebar;

},{}],5:[function(require,module,exports){
"use strict";

require("./asset");

var _header = require("./components/header");

var _header2 = _interopRequireDefault(_header);

var _sidebar = require("./components/sidebar");

var _sidebar2 = _interopRequireDefault(_sidebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var main = function main() {
  var header = new _header2.default();
  var sidebar = new _sidebar2.default();
};

$(main);

},{"./asset":2,"./components/header":3,"./components/sidebar":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7O0FDQUE7Ozs7QUFJQyxXQUFTLENBQVQsRUFBVztBQUNWLElBQUUsRUFBRixDQUFLLE9BQUwsR0FBZSxVQUFTLElBQVQsRUFBYztBQUMzQixRQUFNLFVBQVUsRUFBRSxNQUFGLENBQVM7QUFDdkIsbUJBQWEsTUFEVTtBQUV2QixlQUFTLFNBRmM7QUFHdkIsbUJBQWEsQ0FIVTtBQUl2QixvQkFBYztBQUpTLEtBQVQsRUFLYixJQUxhLENBQWhCOztBQU9BLFFBQUcsQ0FBQyxDQUFDLFFBQUQsRUFBVSxPQUFWLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLENBQW1DLFFBQVEsU0FBM0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLG9CQUFWLENBQU47QUFDRDtBQUNELFFBQUcsQ0FBQyxDQUFDLFNBQUQsRUFBVyxPQUFYLEVBQW1CLFNBQW5CLEVBQThCLFFBQTlCLENBQXVDLFFBQVEsS0FBL0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLGdCQUFWLENBQU47QUFDRDs7QUFFRCxRQUFNLHNCQUFzQjtBQUMxQixrQkFBWSxPQURjO0FBRTFCLGlCQUFXLENBRmU7QUFHMUIsaUJBQVcsQ0FBQyxDQUhjO0FBSTFCLG9CQUFjO0FBSlksS0FBNUI7O0FBT0EsUUFBSSxZQUFZLEVBQUUsUUFBRixDQUFoQjs7QUFFQSxTQUFLLElBQUwsQ0FBVSxZQUFVO0FBQ2xCLFVBQUksS0FBSyxFQUFFLElBQUYsQ0FBVDtBQUNB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SyxRQUFMLEdBQWdCLGlCQUFsQixFQUFxQyxPQUFyQyxDQUE2QztBQUMzQyxtQkFBVyxNQURnQztBQUUzQyxlQUFPLE9BRm9DO0FBRzNDLG1CQUFXLEVBQUUsb0JBQUYsRUFBd0IsTUFBeEIsS0FBbUM7QUFISCxPQUE3QztBQUtEOzs7Ozs7a0JBL0VrQixPOzs7OztBQ0FyQjs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLEdBQVU7QUFDckIsTUFBTSxTQUFTLHNCQUFmO0FBQ0EsTUFBTSxVQUFVLHVCQUFoQjtBQUNELENBSEQ7O0FBS0EsRUFBRSxJQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9zdGFuZGFyZCc7XG4iLCIvKipcbiAqIEF1dG8gZGlzcGxheSBiYWxsb29uIGZvciBlbGVtZW50c1xuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG4oZnVuY3Rpb24oJCl7XG4gICQuZm4uYmFsbG9vbiA9IGZ1bmN0aW9uKG9wdHMpe1xuICAgIGNvbnN0IHNldHRpbmcgPSAkLmV4dGVuZCh7XG4gICAgICBcInBsYWNlbWVudFwiOiBcImxlZnRcIixcbiAgICAgIFwiY29sb3JcIjogdW5kZWZpbmVkLFxuICAgICAgXCJtYXJnaW5Ub3BcIjogMCxcbiAgICAgIFwibWFyZ2luTGVmdFwiOiAwXG4gICAgfSwgb3B0cyk7XG4gICAgXG4gICAgaWYoIVtcImJvdHRvbVwiLFwicmlnaHRcIixcImxlZnRcIl0uaW5jbHVkZXMoc2V0dGluZy5wbGFjZW1lbnQpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGxhY2VtZW50LlwiKTtcbiAgICB9XG4gICAgaWYoIVtcImRlZmF1bHRcIixcImJsYWNrXCIsdW5kZWZpbmVkXS5pbmNsdWRlcyhzZXR0aW5nLmNvbG9yKSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yLlwiKTtcbiAgICB9XG4gIFxuICAgIGNvbnN0IHdyYXBwZXJJbml0aWFsU3R5bGUgPSB7XG4gICAgICBcInBvc2l0aW9uXCI6IFwiZml4ZWRcIixcbiAgICAgIFwib3BhY2l0eVwiOiAwLFxuICAgICAgXCJ6LWluZGV4XCI6IC0xLFxuICAgICAgXCJ0cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBlYXNlIC4zc1wiXG4gICAgfTtcbiAgICBcbiAgICBsZXQgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gIFxuICAgIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgbGV0ICR0ID0gJCh0aGlzKTtcbiAgICAgIGxldCAkY29udGVudHMgPSAkdC5maW5kKFwiLmJhbGxvb24tY29udGVudHNcIik7XG4gICAgICBcbiAgICAgIGlmKCEkY29udGVudHMgfHwgJGNvbnRlbnRzLmxlbmd0aCA8IDEpe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgXG4gICAgICBjb25zdCAkYmFsbG9vbiA9ICQoXCI8ZGl2PlwiKVxuICAgICAgICAuYWRkQ2xhc3MoXCJiYWxsb29uXCIpXG4gICAgICAgIC5hZGRDbGFzcyhzZXR0aW5nLnBsYWNlbWVudClcbiAgICAgICAgLmh0bWwoJGNvbnRlbnRzLmh0bWwoKSk7XG4gICAgICBcbiAgICAgIGlmKHNldHRpbmcuY29sb3Ipe1xuICAgICAgICAkYmFsbG9vbi5hZGRDbGFzcyhzZXR0aW5nLmNvbG9yKTtcbiAgICAgIH1cbiAgICBcbiAgICAgIGNvbnN0ICR3cmFwcGVyID0gJChcIjxkaXY+XCIpLmNzcyh3cmFwcGVySW5pdGlhbFN0eWxlKTtcbiAgICBcbiAgICAgICR3cmFwcGVyLmFwcGVuZCgkYmFsbG9vbik7XG4gICAgICAkdC5hcHBlbmQoJHdyYXBwZXIpO1xuICAgICAgJGNvbnRlbnRzLnJlbW92ZSgpO1xuICBcbiAgICAgIGxldCBwb3BVcFN0YXR1cyA9IDA7IC8vIDA6IGhpZGRlbiwgMTogdmlzaWJsZVxuICAgICAgY29uc3QgYXJyb3dNYXJnaW4gPSAyNzsgLy8gU2VlIGFzc2V0LnN0eWwuICRiYWxsb29uLXRyaWFuZ2xlLXNpemUgPSAxMXB4LCAkYmFsbG9vbi10cmlhbmdsZS1sZWZ0ID0gMTZweFxuICBcbiAgICAgICR0Lm9uKFwibW91c2VlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgICBsZXQgc2VsZiA9ICR0O1xuICAgICAgICBsZXQgekluZGV4ID0gOTk5OTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGNhbGNQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGV0IHRvcCxsZWZ0O1xuICBcbiAgICAgICAgICBzd2l0Y2goc2V0dGluZy5wbGFjZW1lbnQpe1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSArIHNlbGYuaGVpZ2h0KCkgKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAkd3JhcHBlci5jc3Moe3RvcDogMCwgbGVmdDogMH0pOyAvLyBQcmV2ZW50IGNvbnRlbnRzIHdyYXBwaW5nIGJlZm9yZSBjYWxjdWxhdGluZyAkd3JhcHBlci53aWR0aCgpXG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLSAkd3JhcHBlci53aWR0aCgpIC0gc2V0dGluZy5tYXJnaW5MZWZ0O1xuICBcbiAgICAgICAgICAgICAgbGV0IHdyYXBwZXJfaGVpZ2h0ID0gJHdyYXBwZXIuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbWFpbiA9ICh0b3AgKyB3cmFwcGVyX2hlaWdodCkgLSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgIGlmKHJlbWFpbiA+IDApe1xuICAgICAgICAgICAgICAgIHRvcCA9IHRvcCAtIHdyYXBwZXJfaGVpZ2h0ICsgYXJyb3dNYXJnaW4gKiAyO1xuICAgICAgICAgICAgICAgICRiYWxsb29uLmFkZENsYXNzKFwidXBwZXJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkYmFsbG9vbi5yZW1vdmVDbGFzcyhcInVwcGVyXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICR3cmFwcGVyLmNzcyh7dG9wOiAwLCByaWdodDogMH0pOyAvLyBQcmV2ZW50IGNvbnRlbnRzIHdyYXBwaW5nIGJlZm9yZSBjYWxjdWxhdGluZyAkd3JhcHBlci53aWR0aCgpXG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgKyBzZWxmLndpZHRoKCkgLSBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgcmV0dXJuIHt0b3AsIGxlZnR9O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgIFxuICAgICAgICAkd3JhcHBlclxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgXCJ0b3BcIjogcG9zaXRpb24udG9wLFxuICAgICAgICAgICAgXCJsZWZ0XCI6IHBvc2l0aW9uLmxlZnQsXG4gICAgICAgICAgICBcInotaW5kZXhcIjogekluZGV4LFxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHBvcFVwU3RhdHVzID0gMTtcbiAgXG4gICAgICAgICQod2luZG93KS5vbihcInNjcm9sbC5iYWxsb29uXCIsIChlKSA9PiB7XG4gICAgICAgICAgbGV0IHBvc2l0aW9uID0gY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgICAgJHdyYXBwZXIuY3NzKHtcbiAgICAgICAgICAgIHRvcDogcG9zaXRpb24udG9wLFxuICAgICAgICAgICAgbGVmdDogcG9zaXRpb24ubGVmdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICBcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAkdC5vbihcIm1vdXNlbGVhdmVcIiwgKGUpID0+IHtcbiAgICAgICAgJHdyYXBwZXIuY3NzKHtcbiAgICAgICAgICBcIm9wYWNpdHlcIjogMFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHBvcFVwU3RhdHVzID0gMDtcbiAgICAgICAgXG4gICAgICAgICQod2luZG93KS5vZmYoXCJzY3JvbGwuYmFsbG9vblwiKTtcbiAgICAgIH0pO1xuICBcbiAgICAgICR0Lm9uKFwidHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kXCIsIChlKSA9PiB7XG4gICAgICAgIGlmKHBvcFVwU3RhdHVzID09PSAwKXtcbiAgICAgICAgICAkd3JhcHBlci5jc3MoXCJ6LWluZGV4XCIsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KGpRdWVyeSkpO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gaGVhZGVyXCI7XG4gICAgXG4gICAgdGhpcy5zdGlja3koKTtcbiAgfVxuICBcbiAgc3RpY2t5KCl7XG4gICAgbGV0IHNjcm9sbERvd25UaHJlc2hvbGQgPSAyMDA7XG4gICAgbGV0IHNjcm9sbFVwVGhyZXNob2xkID0gMTAwO1xuICAgIGxldCBtZWRpYVF1ZXJ5U3RyaW5nID0gXCIobWluLXdpZHRoOiAxMjAwcHgpLCAobWluLXdpZHRoOiA4MDBweCkgYW5kIChtYXgtd2lkdGg6IDExOTlweClcIjtcbiAgICBcbiAgICBsZXQgJHdpbmRvdyA9ICQod2luZG93KTtcbiAgICBsZXQgaGVhZGVyID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBsZXQgcmVzaXppbmcgPSBmYWxzZTtcbiAgXG4gICAgY29uc3Qgb25UcmFuc2l0aW9uRW5kID0gKGUpID0+IHtcbiAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcImRpc2FibGUtaGVpZ2h0LWFuaW1hdGlvblwiKTtcbiAgICAgIHJlc2l6aW5nID0gZmFsc2U7XG4gICAgfTtcbiAgXG4gICAgaGVhZGVyLm9uKFwidHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kXCIsIG9uVHJhbnNpdGlvbkVuZCk7XG4gIFxuICAgICR3aW5kb3cub24oXCJzY3JvbGxcIiwgKGUpID0+IHtcbiAgICAgIGlmKCF3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5U3RyaW5nKS5tYXRjaGVzIHx8IHJlc2l6aW5nKSByZXR1cm47XG4gICAgXG4gICAgICBjb25zdCBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgIFxuICAgICAgaWYoc2Nyb2xsVXBUaHJlc2hvbGQgPCBzY3JvbGxUb3AgJiYgc2Nyb2xsVG9wIDwgc2Nyb2xsRG93blRocmVzaG9sZCl7XG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwic2Nyb2xsLW1hcmdpblwiKSkgaGVhZGVyLmFkZENsYXNzKFwic2Nyb2xsLW1hcmdpblwiKTtcbiAgICAgIFxuICAgICAgICBsZXQgaGVhZGVyX2hlaWdodCA9IDMwMCArIDIwIC0gc2Nyb2xsVG9wO1xuICAgICAgICBoZWFkZXIuY3NzKHtcbiAgICAgICAgICBoZWlnaHQ6IGhlYWRlcl9oZWlnaHQsXG4gICAgICAgICAgYm90dG9tOiBgY2FsYygxMDAlIC0gJHtoZWFkZXJfaGVpZ2h0fXB4KWBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgXG4gICAgICBpZihzY3JvbGxUb3AgPj0gc2Nyb2xsRG93blRocmVzaG9sZCl7XG4gICAgICAgIGlmKGhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIHJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgaGVhZGVyLmFkZENsYXNzKFwiZml4ZWQtaGVhZGVyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihzY3JvbGxUb3AgPD0gc2Nyb2xsVXBUaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaGVhZGVyLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcbiAgICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwic2Nyb2xsLW1hcmdpblwiKTtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImRpc2FibGUtaGVpZ2h0LWFuaW1hdGlvblwiKTtcbiAgICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwiZml4ZWQtaGVhZGVyXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBtYWluID4gbmF2XCI7XG4gICAgXG4gICAgdGhpcy53cmFwSGVhZGxpbmUoKTtcbiAgICB0aGlzLmluaXRUb2dnbGVCdXR0b24oKTtcbiAgICB0aGlzLmJ1aWxkRW1haWxBZGRyZXNzKCk7XG4gICAgdGhpcy5idWlsZEJhbGxvb24oKTtcbiAgfVxuICBcbiAgd3JhcEhlYWRsaW5lKCl7XG4gICAgbGV0IGhlYWRsaW5lVGl0bGUgPSAkKHRoaXMuc2VsZWN0b3IpLmZpbmQoXCIuaGVhZGxpbmUgLmhlYWRsaW5lLXRpdGxlXCIpO1xuICAgIGhlYWRsaW5lVGl0bGUuZG90ZG90ZG90KHtcbiAgICAgIHRydW5jYXRlOiBcImxldHRlclwiLFxuICAgICAgd2F0Y2g6IHRydWVcbiAgICB9KTtcbiAgfVxuICBcbiAgaW5pdFRvZ2dsZUJ1dHRvbigpe1xuICAgIGxldCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbiAgICBsZXQgJHNpZGViYXIgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGxldCAkdGFncyA9ICRzaWRlYmFyLmZpbmQoXCIudGFnc1wiKTtcbiAgICBsZXQgJGJ1dHRvbiA9ICQoXCIjc2lkZWJhci10b2dnbGUtYnV0dG9uXCIpO1xuICAgIFxuICAgIGNvbnN0IGNsb3NlU2lkZWJhciA9IChlKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nIGlmIG91dHNpZGUgb2Ygc2lkZWJhciBoYXMgYmVlbiBjbGlja2VkLlxuICAgICAgLy8gSG93ZXZlciwgaWYgc2NyZWVuIHNpemUgaXMgZm9yIG1vYmlsZSwgY2xvc2Ugc2lkZWJhciB3aGVyZXZlciBpcyBjbGlja2VkLlxuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzk5cHgpXCIpLm1hdGNoZXMgJiZcbiAgICAgICAgJHNpZGViYXIuaXMoZS50YXJnZXQpIHx8ICRzaWRlYmFyLmhhcyhlLnRhcmdldCkubGVuZ3RoID4gMCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgXG4gICAgICAkc2lkZWJhci5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XG4gICAgfTtcbiAgICBcbiAgICBjb25zdCBvblRvZ2dsZUJ1dHRvbkNsaWNrZWQgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIFxuICAgICAgaWYoJHNpZGViYXIuaGFzQ2xhc3MoXCJ2aXNpYmxlXCIpKXtcbiAgICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub2ZmKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgJHNpZGViYXIuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub24oXCJjbGljay5jbG9zZVNpZGViYXJcIiwgY2xvc2VTaWRlYmFyKTtcbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICAkYnV0dG9uLm9uKFwiY2xpY2tcIiwgb25Ub2dnbGVCdXR0b25DbGlja2VkKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFByZXZlbnRpbmcgZW1haWwgc3BhbVxuICAgKi9cbiAgYnVpbGRFbWFpbEFkZHJlc3MoKXtcbiAgICBsZXQgcGFnZU9wZW5lZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGxldCBpc0FscmVhZHlCdWlsdCA9IGZhbHNlO1xuICAgIGxldCAkZW1haWwgPSAkKFwiLnByb2ZpbGUgLnNvY2lhbCAuZW1haWxcIik7XG4gICAgXG4gICAgY29uc3QgYWRkciA9IFs4MDU5LCA2MDg4LCA3MTYzLCA1MDYzLCA3Mzg0LCAtMjgyMSwgNTg3OSwgNjA4OCwgNzE2MywgNDQ3MiwgODI4OCwgNTI2NCwgLTMwODgsIDU2NzIsIDYwODgsIDg1MTksIDU4NzksIDg3NTIsIDQ2NjcsIDc2MDcsIDQ0NzIsIDU2NzIsIDUyNjQsIDgyODgsIC04NDEsIDU2NzIsIDY5NDQsIDQ0NzIsIDYwODgsIDY3MjcsIC0yODIxLCA0ODY0LCA3Mzg0LCA2OTQ0XTtcbiAgICBcbiAgICBjb25zdCBtYWtlQWRkcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZihpc0FscmVhZHlCdWlsdCAmJiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwYWdlT3BlbmVkKSA+IDE1MDApIHJldHVybjtcbiAgICAgIFxuICAgICAgJGVtYWlsLmF0dHIoXCJocmVmXCIsIFwibWFpbHRvOlwiICsgYWRkci5tYXAoZnVuY3Rpb24odil7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKE1hdGguc3FydCh2KzQ5MzcpKVxuICAgICAgfSkuam9pbihcIlwiKSk7XG4gICAgfTtcbiAgICBcbiAgICAkZW1haWwub24oXCJtb3VzZW92ZXIgdG91Y2hzdGFydFwiLCBtYWtlQWRkcmVzcyk7XG4gIH1cbiAgXG4gIGJ1aWxkQmFsbG9vbigpe1xuICAgICQodGhpcy5zZWxlY3RvciArIFwiIFtkYXRhLWJhbGxvb25dXCIpLmJhbGxvb24oe1xuICAgICAgcGxhY2VtZW50OiBcImxlZnRcIixcbiAgICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgICBtYXJnaW5Ub3A6ICQoXCIucHJvZmlsZS1hdHRyaWJ1dGVcIikuaGVpZ2h0KCkgLyAyXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBcIi4vYXNzZXRcIjtcbmltcG9ydCBIZWFkZXIgZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkZXJcIjtcbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL2NvbXBvbmVudHMvc2lkZWJhclwiO1xuXG5jb25zdCBtYWluID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgaGVhZGVyID0gbmV3IEhlYWRlcigpO1xuICBjb25zdCBzaWRlYmFyID0gbmV3IFNpZGViYXIoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
