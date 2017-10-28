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

    this.initToggleButton();
    this.buildEmailAddress();
    this.buildBalloon();
    this.setHeadline();
    this.wrapHeadline();
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
    key: "createHeadlineItem",
    value: function createHeadlineItem(url, title, description, published_time) {
      var $container = $("<div class='headline-item'>");
      $container.append($("<div class='headline-title'>").append("<a href=\"" + url + "\" " + (description ? 'title=' + description : '') + "\">" + title + "</a>")).append("<div class='headline-meta'>" + published_time + "</div>");

      return $container;
    }
  }, {
    key: "setHeadline",
    value: function setHeadline() {
      var _this = this;

      var articles = $$article_list(); // Comes from external <script> tag.
      if (!articles) {
        return;
      }

      var lang = $("html").attr("lang") || "ja";
      var article_tree = articles[lang];

      var active_topic = $("head > meta[property='article:section']").attr("content");
      var active_subtopic = $("head > meta[property='article:tag']").attr("content");

      var $topic_container = $("#topic-list").find(".tags");

      Object.keys(article_tree).forEach(function (val, index) {
        var $topic = $("<a><span class='tag'>" + val + "</span></a>");

        if (val === active_topic || !active_topic && index === 0) {
          $topic.addClass("active");
        }

        $topic_container.append($topic);
      });

      var $subtopic_container = $("#subtopic-list").find(".tags");

      Object.keys(article_tree[active_topic]).forEach(function (val, index) {
        var $subtopic = $("<a><span class='tag'>" + val + "</span></a>");

        if (val === active_subtopic || !active_subtopic && index === 0) {
          $subtopic.addClass("active");
        }

        $subtopic_container.append($subtopic);
      });

      var $article_container = $("#article-list").find(".headline");

      Object.keys(article_tree[active_topic][active_subtopic]).forEach(function (v, index) {
        var article = article_tree[active_topic][active_subtopic][v];
        var article_dtime = new Date(article.published_time).toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" });

        var $headline = _this.createHeadlineItem("#", article.title, article.description, article_dtime);
        $article_container.append($headline);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7O0FDQUE7Ozs7QUFJQyxXQUFTLENBQVQsRUFBVztBQUNWLElBQUUsRUFBRixDQUFLLE9BQUwsR0FBZSxVQUFTLElBQVQsRUFBYztBQUMzQixRQUFNLFVBQVUsRUFBRSxNQUFGLENBQVM7QUFDdkIsbUJBQWEsTUFEVTtBQUV2QixlQUFTLFNBRmM7QUFHdkIsbUJBQWEsQ0FIVTtBQUl2QixvQkFBYztBQUpTLEtBQVQsRUFLYixJQUxhLENBQWhCOztBQU9BLFFBQUcsQ0FBQyxDQUFDLFFBQUQsRUFBVSxPQUFWLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLENBQW1DLFFBQVEsU0FBM0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLG9CQUFWLENBQU47QUFDRDtBQUNELFFBQUcsQ0FBQyxDQUFDLFNBQUQsRUFBVyxPQUFYLEVBQW1CLFNBQW5CLEVBQThCLFFBQTlCLENBQXVDLFFBQVEsS0FBL0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLGdCQUFWLENBQU47QUFDRDs7QUFFRCxRQUFNLHNCQUFzQjtBQUMxQixrQkFBWSxPQURjO0FBRTFCLGlCQUFXLENBRmU7QUFHMUIsaUJBQVcsQ0FBQyxDQUhjO0FBSTFCLG9CQUFjO0FBSlksS0FBNUI7O0FBT0EsUUFBSSxZQUFZLEVBQUUsUUFBRixDQUFoQjs7QUFFQSxTQUFLLElBQUwsQ0FBVSxZQUFVO0FBQ2xCLFVBQUksS0FBSyxFQUFFLElBQUYsQ0FBVDtBQUNBLFVBQUksWUFBWSxHQUFHLElBQUgsQ0FBUSxtQkFBUixDQUFoQjs7QUFFQSxVQUFHLENBQUMsU0FBRCxJQUFjLFVBQVUsTUFBVixHQUFtQixDQUFwQyxFQUFzQztBQUNwQztBQUNEOztBQUVELFVBQU0sV0FBVyxFQUFFLE9BQUYsRUFDZCxRQURjLENBQ0wsU0FESyxFQUVkLFFBRmMsQ0FFTCxRQUFRLFNBRkgsRUFHZCxJQUhjLENBR1QsVUFBVSxJQUFWLEVBSFMsQ0FBakI7O0FBS0EsVUFBRyxRQUFRLEtBQVgsRUFBaUI7QUFDZixpQkFBUyxRQUFULENBQWtCLFFBQVEsS0FBMUI7QUFDRDs7QUFFRCxVQUFNLFdBQVcsRUFBRSxPQUFGLEVBQVcsR0FBWCxDQUFlLG1CQUFmLENBQWpCOztBQUVBLGVBQVMsTUFBVCxDQUFnQixRQUFoQjtBQUNBLFNBQUcsTUFBSCxDQUFVLFFBQVY7QUFDQSxnQkFBVSxNQUFWOztBQUVBLFVBQUksY0FBYyxDQUFsQixDQXZCa0IsQ0F1Qkc7QUFDckIsVUFBTSxjQUFjLEVBQXBCLENBeEJrQixDQXdCTTs7QUFFeEIsU0FBRyxFQUFILENBQU0sWUFBTixFQUFvQixVQUFDLENBQUQsRUFBTztBQUN6QixZQUFJLE9BQU8sRUFBWDtBQUNBLFlBQUksU0FBUyxJQUFiOztBQUVBLFlBQU0sZUFBZSxTQUFmLFlBQWUsR0FBVTtBQUM3QixjQUFJLFlBQUo7QUFBQSxjQUFRLGFBQVI7O0FBRUEsa0JBQU8sUUFBUSxTQUFmO0FBQ0UsaUJBQUssUUFBTDtBQUNFLG9CQUFNLEtBQUssTUFBTCxHQUFjLEdBQWQsR0FBb0IsVUFBVSxTQUFWLEVBQXBCLEdBQTRDLEtBQUssTUFBTCxFQUE1QyxHQUE0RCxRQUFRLFNBQTFFO0FBQ0EscUJBQU8sS0FBSyxNQUFMLEdBQWMsSUFBZCxHQUFxQixVQUFVLFVBQVYsRUFBckIsR0FBOEMsV0FBOUMsR0FBNEQsUUFBUSxVQUEzRTtBQUNBO0FBQ0YsaUJBQUssTUFBTDtBQUNFLHVCQUFTLEdBQVQsQ0FBYSxFQUFDLEtBQUssQ0FBTixFQUFTLE1BQU0sQ0FBZixFQUFiLEVBREYsQ0FDbUM7QUFDakMsb0JBQU0sS0FBSyxNQUFMLEdBQWMsR0FBZCxHQUFvQixVQUFVLFNBQVYsRUFBcEIsR0FBNEMsV0FBNUMsR0FBMEQsUUFBUSxTQUF4RTtBQUNBLHFCQUFPLEtBQUssTUFBTCxHQUFjLElBQWQsR0FBcUIsVUFBVSxVQUFWLEVBQXJCLEdBQThDLFNBQVMsS0FBVCxFQUE5QyxHQUFpRSxRQUFRLFVBQWhGOztBQUVBLGtCQUFJLGlCQUFpQixTQUFTLE1BQVQsRUFBckI7QUFDQSxrQkFBTSxTQUFVLE1BQU0sY0FBUCxHQUF5QixPQUFPLFdBQS9DO0FBQ0Esa0JBQUcsU0FBUyxDQUFaLEVBQWM7QUFDWixzQkFBTSxNQUFNLGNBQU4sR0FBdUIsY0FBYyxDQUEzQztBQUNBLHlCQUFTLFFBQVQsQ0FBa0IsT0FBbEI7QUFDRCxlQUhELE1BSUk7QUFDRix5QkFBUyxXQUFULENBQXFCLE9BQXJCO0FBQ0Q7QUFDRDtBQUNGLGlCQUFLLE9BQUw7QUFDRSx1QkFBUyxHQUFULENBQWEsRUFBQyxLQUFLLENBQU4sRUFBUyxPQUFPLENBQWhCLEVBQWIsRUFERixDQUNvQztBQUNsQyxvQkFBTSxLQUFLLE1BQUwsR0FBYyxHQUFkLEdBQW9CLFVBQVUsU0FBVixFQUFwQixHQUE0QyxXQUE1QyxHQUEwRCxRQUFRLFNBQXhFO0FBQ0EscUJBQU8sS0FBSyxNQUFMLEdBQWMsSUFBZCxHQUFxQixVQUFVLFVBQVYsRUFBckIsR0FBOEMsS0FBSyxLQUFMLEVBQTlDLEdBQTZELFFBQVEsVUFBNUU7QUFDQTtBQXhCSjs7QUEyQkEsaUJBQU8sRUFBQyxRQUFELEVBQU0sVUFBTixFQUFQO0FBQ0QsU0EvQkQ7O0FBaUNBLFlBQUksV0FBVyxjQUFmOztBQUVBLGlCQUNHLEdBREgsQ0FDTztBQUNILGlCQUFPLFNBQVMsR0FEYjtBQUVILGtCQUFRLFNBQVMsSUFGZDtBQUdILHFCQUFXLE1BSFI7QUFJSCxxQkFBVztBQUpSLFNBRFA7O0FBUUEsc0JBQWMsQ0FBZDs7QUFFQSxVQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsZ0JBQWIsRUFBK0IsVUFBQyxDQUFELEVBQU87QUFDcEMsY0FBSSxXQUFXLGNBQWY7QUFDQSxtQkFBUyxHQUFULENBQWE7QUFDWCxpQkFBSyxTQUFTLEdBREg7QUFFWCxrQkFBTSxTQUFTO0FBRkosV0FBYjtBQUlELFNBTkQ7QUFRRCxPQXpERDs7QUEyREEsU0FBRyxFQUFILENBQU0sWUFBTixFQUFvQixVQUFDLENBQUQsRUFBTztBQUN6QixpQkFBUyxHQUFULENBQWE7QUFDWCxxQkFBVztBQURBLFNBQWI7O0FBSUEsc0JBQWMsQ0FBZDs7QUFFQSxVQUFFLE1BQUYsRUFBVSxHQUFWLENBQWMsZ0JBQWQ7QUFDRCxPQVJEOztBQVVBLFNBQUcsRUFBSCxDQUFNLGtEQUFOLEVBQTBELFVBQUMsQ0FBRCxFQUFPO0FBQy9ELFlBQUcsZ0JBQWdCLENBQW5CLEVBQXFCO0FBQ25CLG1CQUFTLEdBQVQsQ0FBYSxTQUFiLEVBQXdCLENBQUMsQ0FBekI7QUFDRDtBQUNGLE9BSkQ7QUFLRCxLQXBHRDs7QUFzR0EsV0FBTyxJQUFQO0FBQ0QsR0EvSEQ7QUFnSUQsQ0FqSUEsRUFpSUMsTUFqSUQsQ0FBRDs7Ozs7Ozs7Ozs7OztJQ0pxQixNO0FBQ25CLG9CQUFhO0FBQUE7O0FBQ1gsU0FBSyxRQUFMLEdBQWdCLGVBQWhCOztBQUVBLFNBQUssTUFBTDtBQUNEOzs7OzZCQUVPO0FBQ04sVUFBSSxzQkFBc0IsR0FBMUI7QUFDQSxVQUFJLG9CQUFvQixHQUF4QjtBQUNBLFVBQUksbUJBQW1CLGlFQUF2Qjs7QUFFQSxVQUFJLFVBQVUsRUFBRSxNQUFGLENBQWQ7QUFDQSxVQUFJLFNBQVMsRUFBRSxLQUFLLFFBQVAsQ0FBYjtBQUNBLFVBQUksV0FBVyxLQUFmOztBQUVBLFVBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsQ0FBRCxFQUFPO0FBQzdCLGVBQU8sV0FBUCxDQUFtQiwwQkFBbkI7QUFDQSxtQkFBVyxLQUFYO0FBQ0QsT0FIRDs7QUFLQSxhQUFPLEVBQVAsQ0FBVSxrREFBVixFQUE4RCxlQUE5RDs7QUFFQSxjQUFRLEVBQVIsQ0FBVyxRQUFYLEVBQXFCLFVBQUMsQ0FBRCxFQUFPO0FBQzFCLFlBQUcsQ0FBQyxPQUFPLFVBQVAsQ0FBa0IsZ0JBQWxCLEVBQW9DLE9BQXJDLElBQWdELFFBQW5ELEVBQTZEOztBQUU3RCxZQUFNLFlBQVksUUFBUSxTQUFSLEVBQWxCOztBQUVBLFlBQUcsb0JBQW9CLFNBQXBCLElBQWlDLFlBQVksbUJBQWhELEVBQW9FO0FBQ2xFLGNBQUcsQ0FBQyxPQUFPLFFBQVAsQ0FBZ0IsY0FBaEIsQ0FBSixFQUFxQzs7QUFFckMsY0FBRyxDQUFDLE9BQU8sUUFBUCxDQUFnQixlQUFoQixDQUFKLEVBQXNDLE9BQU8sUUFBUCxDQUFnQixlQUFoQjs7QUFFdEMsY0FBSSxnQkFBZ0IsTUFBTSxFQUFOLEdBQVcsU0FBL0I7QUFDQSxpQkFBTyxHQUFQLENBQVc7QUFDVCxvQkFBUSxhQURDO0FBRVQscUNBQXVCLGFBQXZCO0FBRlMsV0FBWDs7QUFLQTtBQUNEOztBQUVELFlBQUcsYUFBYSxtQkFBaEIsRUFBb0M7QUFDbEMsY0FBRyxPQUFPLFFBQVAsQ0FBZ0IsY0FBaEIsQ0FBSCxFQUFvQzs7QUFFcEMscUJBQVcsSUFBWDtBQUNBLGlCQUFPLFFBQVAsQ0FBZ0IsY0FBaEI7QUFDRCxTQUxELE1BTUssSUFBRyxhQUFhLGlCQUFoQixFQUFrQztBQUNyQyxjQUFHLENBQUMsT0FBTyxRQUFQLENBQWdCLGNBQWhCLENBQUosRUFBcUM7O0FBRXJDLGlCQUFPLFVBQVAsQ0FBa0IsT0FBbEI7QUFDQSxpQkFBTyxXQUFQLENBQW1CLGVBQW5COztBQUVBLHFCQUFXLElBQVg7QUFDQSxpQkFBTyxRQUFQLENBQWdCLDBCQUFoQjtBQUNBLGlCQUFPLFdBQVAsQ0FBbUIsY0FBbkI7QUFDRDtBQUNGLE9BbkNEO0FBb0NEOzs7Ozs7a0JBM0RrQixNOzs7Ozs7Ozs7Ozs7O0lDQUEsTztBQUNuQixxQkFBYTtBQUFBOztBQUNYLFNBQUssUUFBTCxHQUFnQixtQkFBaEI7O0FBRUEsU0FBSyxnQkFBTDtBQUNBLFNBQUssaUJBQUw7QUFDQSxTQUFLLFlBQUw7QUFDQSxTQUFLLFdBQUw7QUFDQSxTQUFLLFlBQUw7QUFDRDs7OzttQ0FFYTtBQUNaLFVBQUksZ0JBQWdCLEVBQUUsS0FBSyxRQUFQLEVBQWlCLElBQWpCLENBQXNCLDJCQUF0QixDQUFwQjtBQUNBLG9CQUFjLFNBQWQsQ0FBd0I7QUFDdEIsa0JBQVUsUUFEWTtBQUV0QixlQUFPO0FBRmUsT0FBeEI7QUFJRDs7O3VDQUVrQixHLEVBQUssSyxFQUFPLFcsRUFBYSxjLEVBQWU7QUFDekQsVUFBSSxhQUFhLEVBQUUsNkJBQUYsQ0FBakI7QUFDQSxpQkFDRyxNQURILENBRUksRUFBRSw4QkFBRixFQUFrQyxNQUFsQyxnQkFDYyxHQURkLFlBQ3NCLGNBQWMsV0FBUyxXQUF2QixHQUFtQyxFQUR6RCxZQUNnRSxLQURoRSxVQUZKLEVBTUcsTUFOSCxpQ0FNd0MsY0FOeEM7O0FBU0EsYUFBTyxVQUFQO0FBQ0Q7OztrQ0FFWTtBQUFBOztBQUNYLFVBQU0sV0FBVyxnQkFBakIsQ0FEVyxDQUN3QjtBQUNuQyxVQUFHLENBQUMsUUFBSixFQUFhO0FBQ1g7QUFDRDs7QUFFRCxVQUFNLE9BQU8sRUFBRSxNQUFGLEVBQVUsSUFBVixDQUFlLE1BQWYsS0FBMEIsSUFBdkM7QUFDQSxVQUFNLGVBQWUsU0FBUyxJQUFULENBQXJCOztBQUVBLFVBQU0sZUFBZSxFQUFFLHlDQUFGLEVBQTZDLElBQTdDLENBQWtELFNBQWxELENBQXJCO0FBQ0EsVUFBTSxrQkFBa0IsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUF4Qjs7QUFFQSxVQUFNLG1CQUFtQixFQUFFLGFBQUYsRUFBaUIsSUFBakIsQ0FBc0IsT0FBdEIsQ0FBekI7O0FBRUEsYUFBTyxJQUFQLENBQVksWUFBWixFQUEwQixPQUExQixDQUFrQyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ2hELFlBQUksU0FBUyw0QkFBMEIsR0FBMUIsaUJBQWI7O0FBRUEsWUFBRyxRQUFRLFlBQVIsSUFBeUIsQ0FBQyxZQUFELElBQWlCLFVBQVUsQ0FBdkQsRUFBMEQ7QUFDeEQsaUJBQU8sUUFBUCxDQUFnQixRQUFoQjtBQUNEOztBQUVELHlCQUFpQixNQUFqQixDQUF3QixNQUF4QjtBQUNELE9BUkQ7O0FBVUEsVUFBTSxzQkFBc0IsRUFBRSxnQkFBRixFQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUE1Qjs7QUFFQSxhQUFPLElBQVAsQ0FBWSxhQUFhLFlBQWIsQ0FBWixFQUF3QyxPQUF4QyxDQUFnRCxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQzlELFlBQUksWUFBWSw0QkFBMEIsR0FBMUIsaUJBQWhCOztBQUVBLFlBQUcsUUFBUSxlQUFSLElBQTRCLENBQUMsZUFBRCxJQUFvQixVQUFVLENBQTdELEVBQWdFO0FBQzlELG9CQUFVLFFBQVYsQ0FBbUIsUUFBbkI7QUFDRDs7QUFFRCw0QkFBb0IsTUFBcEIsQ0FBMkIsU0FBM0I7QUFDRCxPQVJEOztBQVVBLFVBQU0scUJBQXFCLEVBQUUsZUFBRixFQUFtQixJQUFuQixDQUF3QixXQUF4QixDQUEzQjs7QUFFQSxhQUFPLElBQVAsQ0FBWSxhQUFhLFlBQWIsRUFBMkIsZUFBM0IsQ0FBWixFQUF5RCxPQUF6RCxDQUFpRSxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQWM7QUFDN0UsWUFBSSxVQUFVLGFBQWEsWUFBYixFQUEyQixlQUEzQixFQUE0QyxDQUE1QyxDQUFkO0FBQ0EsWUFBSSxnQkFBaUIsSUFBSSxJQUFKLENBQVMsUUFBUSxjQUFqQixDQUFELENBQ2pCLGtCQURpQixDQUNFLElBREYsRUFDUSxFQUFDLE1BQU0sU0FBUCxFQUFrQixPQUFPLE1BQXpCLEVBQWlDLEtBQUssU0FBdEMsRUFEUixDQUFwQjs7QUFHQSxZQUFJLFlBQVksTUFBSyxrQkFBTCxDQUF3QixHQUF4QixFQUE2QixRQUFRLEtBQXJDLEVBQTRDLFFBQVEsV0FBcEQsRUFBaUUsYUFBakUsQ0FBaEI7QUFDQSwyQkFBbUIsTUFBbkIsQ0FBMEIsU0FBMUI7QUFDRCxPQVBEO0FBUUQ7Ozt1Q0FFaUI7QUFDaEIsVUFBSSxZQUFZLEVBQUUsUUFBRixDQUFoQjtBQUNBLFVBQUksV0FBVyxFQUFFLEtBQUssUUFBUCxDQUFmO0FBQ0EsVUFBSSxRQUFRLFNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBWjtBQUNBLFVBQUksVUFBVSxFQUFFLHdCQUFGLENBQWQ7O0FBRUEsVUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFDLENBQUQsRUFBTztBQUMxQjtBQUNBO0FBQ0EsWUFBRyxDQUFDLE9BQU8sVUFBUCxDQUFrQixvQkFBbEIsRUFBd0MsT0FBekMsSUFDRCxTQUFTLEVBQVQsQ0FBWSxFQUFFLE1BQWQsQ0FEQyxJQUN3QixTQUFTLEdBQVQsQ0FBYSxFQUFFLE1BQWYsRUFBdUIsTUFBdkIsR0FBZ0MsQ0FEM0QsRUFDNkQ7QUFDM0Q7QUFDRDs7QUFFRCxpQkFBUyxXQUFULENBQXFCLFNBQXJCO0FBQ0QsT0FURDs7QUFXQSxVQUFNLHdCQUF3QixTQUF4QixxQkFBd0IsQ0FBQyxDQUFELEVBQU87QUFDbkMsVUFBRSxjQUFGO0FBQ0EsVUFBRSxlQUFGOztBQUVBLFlBQUcsU0FBUyxRQUFULENBQWtCLFNBQWxCLENBQUgsRUFBZ0M7QUFDOUIsbUJBQVMsV0FBVCxDQUFxQixTQUFyQjtBQUNBLG9CQUFVLEdBQVYsQ0FBYyxvQkFBZDtBQUNELFNBSEQsTUFJSTtBQUNGLG1CQUFTLFFBQVQsQ0FBa0IsU0FBbEI7QUFDQSxvQkFBVSxFQUFWLENBQWEsb0JBQWIsRUFBbUMsWUFBbkM7QUFDRDtBQUNGLE9BWkQ7O0FBY0EsY0FBUSxFQUFSLENBQVcsT0FBWCxFQUFvQixxQkFBcEI7QUFDRDs7QUFFRDs7Ozs7O3dDQUdtQjtBQUNqQixVQUFJLGFBQWEsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFqQjtBQUNBLFVBQUksaUJBQWlCLEtBQXJCO0FBQ0EsVUFBSSxTQUFTLEVBQUUseUJBQUYsQ0FBYjs7QUFFQSxVQUFNLE9BQU8sQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsQ0FBQyxJQUFoQyxFQUFzQyxJQUF0QyxFQUE0QyxJQUE1QyxFQUFrRCxJQUFsRCxFQUF3RCxJQUF4RCxFQUE4RCxJQUE5RCxFQUFvRSxJQUFwRSxFQUEwRSxDQUFDLElBQTNFLEVBQWlGLElBQWpGLEVBQXVGLElBQXZGLEVBQTZGLElBQTdGLEVBQW1HLElBQW5HLEVBQXlHLElBQXpHLEVBQStHLElBQS9HLEVBQXFILElBQXJILEVBQTJILElBQTNILEVBQWlJLElBQWpJLEVBQXVJLElBQXZJLEVBQTZJLElBQTdJLEVBQW1KLENBQUMsR0FBcEosRUFBeUosSUFBekosRUFBK0osSUFBL0osRUFBcUssSUFBckssRUFBMkssSUFBM0ssRUFBaUwsSUFBakwsRUFBdUwsQ0FBQyxJQUF4TCxFQUE4TCxJQUE5TCxFQUFvTSxJQUFwTSxFQUEwTSxJQUExTSxDQUFiOztBQUVBLFVBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxDQUFELEVBQU87QUFDekIsWUFBRyxrQkFBbUIsSUFBSSxJQUFKLEdBQVcsT0FBWCxLQUF1QixVQUF4QixHQUFzQyxJQUEzRCxFQUFpRTs7QUFFakUsZUFBTyxJQUFQLENBQVksTUFBWixFQUFvQixZQUFZLEtBQUssR0FBTCxDQUFTLFVBQVMsQ0FBVCxFQUFXO0FBQ2xELGlCQUFPLE9BQU8sWUFBUCxDQUFvQixLQUFLLElBQUwsQ0FBVSxJQUFFLElBQVosQ0FBcEIsQ0FBUDtBQUNELFNBRitCLEVBRTdCLElBRjZCLENBRXhCLEVBRndCLENBQWhDO0FBR0QsT0FORDs7QUFRQSxhQUFPLEVBQVAsQ0FBVSxzQkFBVixFQUFrQyxXQUFsQztBQUNEOzs7bUNBRWE7QUFDWixRQUFFLEtBQUssUUFBTCxHQUFnQixpQkFBbEIsRUFBcUMsT0FBckMsQ0FBNkM7QUFDM0MsbUJBQVcsTUFEZ0M7QUFFM0MsZUFBTyxPQUZvQztBQUczQyxtQkFBVyxFQUFFLG9CQUFGLEVBQXdCLE1BQXhCLEtBQW1DO0FBSEgsT0FBN0M7QUFLRDs7Ozs7O2tCQTlJa0IsTzs7Ozs7QUNBckI7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxHQUFVO0FBQ3JCLE1BQU0sU0FBUyxzQkFBZjtBQUNBLE1BQU0sVUFBVSx1QkFBaEI7QUFDRCxDQUhEOztBQUtBLEVBQUUsSUFBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vc3RhbmRhcmQnO1xuIiwiLyoqXG4gKiBBdXRvIGRpc3BsYXkgYmFsbG9vbiBmb3IgZWxlbWVudHNcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xuKGZ1bmN0aW9uKCQpe1xuICAkLmZuLmJhbGxvb24gPSBmdW5jdGlvbihvcHRzKXtcbiAgICBjb25zdCBzZXR0aW5nID0gJC5leHRlbmQoe1xuICAgICAgXCJwbGFjZW1lbnRcIjogXCJsZWZ0XCIsXG4gICAgICBcImNvbG9yXCI6IHVuZGVmaW5lZCxcbiAgICAgIFwibWFyZ2luVG9wXCI6IDAsXG4gICAgICBcIm1hcmdpbkxlZnRcIjogMFxuICAgIH0sIG9wdHMpO1xuICAgIFxuICAgIGlmKCFbXCJib3R0b21cIixcInJpZ2h0XCIsXCJsZWZ0XCJdLmluY2x1ZGVzKHNldHRpbmcucGxhY2VtZW50KSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYWNlbWVudC5cIik7XG4gICAgfVxuICAgIGlmKCFbXCJkZWZhdWx0XCIsXCJibGFja1wiLHVuZGVmaW5lZF0uaW5jbHVkZXMoc2V0dGluZy5jb2xvcikpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvci5cIik7XG4gICAgfVxuICBcbiAgICBjb25zdCB3cmFwcGVySW5pdGlhbFN0eWxlID0ge1xuICAgICAgXCJwb3NpdGlvblwiOiBcImZpeGVkXCIsXG4gICAgICBcIm9wYWNpdHlcIjogMCxcbiAgICAgIFwiei1pbmRleFwiOiAtMSxcbiAgICAgIFwidHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgZWFzZSAuM3NcIlxuICAgIH07XG4gICAgXG4gICAgbGV0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuICBcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIGxldCAkdCA9ICQodGhpcyk7XG4gICAgICBsZXQgJGNvbnRlbnRzID0gJHQuZmluZChcIi5iYWxsb29uLWNvbnRlbnRzXCIpO1xuICAgICAgXG4gICAgICBpZighJGNvbnRlbnRzIHx8ICRjb250ZW50cy5sZW5ndGggPCAxKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgY29uc3QgJGJhbGxvb24gPSAkKFwiPGRpdj5cIilcbiAgICAgICAgLmFkZENsYXNzKFwiYmFsbG9vblwiKVxuICAgICAgICAuYWRkQ2xhc3Moc2V0dGluZy5wbGFjZW1lbnQpXG4gICAgICAgIC5odG1sKCRjb250ZW50cy5odG1sKCkpO1xuICAgICAgXG4gICAgICBpZihzZXR0aW5nLmNvbG9yKXtcbiAgICAgICAgJGJhbGxvb24uYWRkQ2xhc3Moc2V0dGluZy5jb2xvcik7XG4gICAgICB9XG4gICAgXG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKS5jc3Mod3JhcHBlckluaXRpYWxTdHlsZSk7XG4gICAgXG4gICAgICAkd3JhcHBlci5hcHBlbmQoJGJhbGxvb24pO1xuICAgICAgJHQuYXBwZW5kKCR3cmFwcGVyKTtcbiAgICAgICRjb250ZW50cy5yZW1vdmUoKTtcbiAgXG4gICAgICBsZXQgcG9wVXBTdGF0dXMgPSAwOyAvLyAwOiBoaWRkZW4sIDE6IHZpc2libGVcbiAgICAgIGNvbnN0IGFycm93TWFyZ2luID0gMjc7IC8vIFNlZSBhc3NldC5zdHlsLiAkYmFsbG9vbi10cmlhbmdsZS1zaXplID0gMTFweCwgJGJhbGxvb24tdHJpYW5nbGUtbGVmdCA9IDE2cHhcbiAgXG4gICAgICAkdC5vbihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICAgICAgbGV0IHNlbGYgPSAkdDtcbiAgICAgICAgbGV0IHpJbmRleCA9IDk5OTk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjYWxjUG9zaXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgIGxldCB0b3AsbGVmdDtcbiAgXG4gICAgICAgICAgc3dpdGNoKHNldHRpbmcucGxhY2VtZW50KXtcbiAgICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgKyBzZWxmLmhlaWdodCgpICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHt0b3A6IDAsIGxlZnQ6IDB9KTsgLy8gUHJldmVudCBjb250ZW50cyB3cmFwcGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgJHdyYXBwZXIud2lkdGgoKVxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpIC0gJHdyYXBwZXIud2lkdGgoKSAtIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgXG4gICAgICAgICAgICAgIGxldCB3cmFwcGVyX2hlaWdodCA9ICR3cmFwcGVyLmhlaWdodCgpO1xuICAgICAgICAgICAgICBjb25zdCByZW1haW4gPSAodG9wICsgd3JhcHBlcl9oZWlnaHQpIC0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICBpZihyZW1haW4gPiAwKXtcbiAgICAgICAgICAgICAgICB0b3AgPSB0b3AgLSB3cmFwcGVyX2hlaWdodCArIGFycm93TWFyZ2luICogMjtcbiAgICAgICAgICAgICAgICAkYmFsbG9vbi5hZGRDbGFzcyhcInVwcGVyXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJGJhbGxvb24ucmVtb3ZlQ2xhc3MoXCJ1cHBlclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAkd3JhcHBlci5jc3Moe3RvcDogMCwgcmlnaHQ6IDB9KTsgLy8gUHJldmVudCBjb250ZW50cyB3cmFwcGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgJHdyYXBwZXIud2lkdGgoKVxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpICsgc2VsZi53aWR0aCgpIC0gc2V0dGluZy5tYXJnaW5MZWZ0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIHJldHVybiB7dG9wLCBsZWZ0fTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICBcbiAgICAgICAgJHdyYXBwZXJcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgIFwidG9wXCI6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIFwibGVmdFwiOiBwb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgXCJ6LWluZGV4XCI6IHpJbmRleCxcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDE7XG4gIFxuICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGwuYmFsbG9vblwiLCAoZSkgPT4ge1xuICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgJHQub24oXCJtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgXCJvcGFjaXR5XCI6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDA7XG4gICAgICAgIFxuICAgICAgICAkKHdpbmRvdykub2ZmKFwic2Nyb2xsLmJhbGxvb25cIik7XG4gICAgICB9KTtcbiAgXG4gICAgICAkdC5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCAoZSkgPT4ge1xuICAgICAgICBpZihwb3BVcFN0YXR1cyA9PT0gMCl7XG4gICAgICAgICAgJHdyYXBwZXIuY3NzKFwiei1pbmRleFwiLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufShqUXVlcnkpKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IGhlYWRlclwiO1xuICAgIFxuICAgIHRoaXMuc3RpY2t5KCk7XG4gIH1cbiAgXG4gIHN0aWNreSgpe1xuICAgIGxldCBzY3JvbGxEb3duVGhyZXNob2xkID0gMjAwO1xuICAgIGxldCBzY3JvbGxVcFRocmVzaG9sZCA9IDEwMDtcbiAgICBsZXQgbWVkaWFRdWVyeVN0cmluZyA9IFwiKG1pbi13aWR0aDogMTIwMHB4KSwgKG1pbi13aWR0aDogODAwcHgpIGFuZCAobWF4LXdpZHRoOiAxMTk5cHgpXCI7XG4gICAgXG4gICAgbGV0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG4gICAgbGV0IGhlYWRlciA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgbGV0IHJlc2l6aW5nID0gZmFsc2U7XG4gIFxuICAgIGNvbnN0IG9uVHJhbnNpdGlvbkVuZCA9IChlKSA9PiB7XG4gICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICByZXNpemluZyA9IGZhbHNlO1xuICAgIH07XG4gIFxuICAgIGhlYWRlci5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCBvblRyYW5zaXRpb25FbmQpO1xuICBcbiAgICAkd2luZG93Lm9uKFwic2Nyb2xsXCIsIChlKSA9PiB7XG4gICAgICBpZighd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeVN0cmluZykubWF0Y2hlcyB8fCByZXNpemluZykgcmV0dXJuO1xuICAgIFxuICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICBcbiAgICAgIGlmKHNjcm9sbFVwVGhyZXNob2xkIDwgc2Nyb2xsVG9wICYmIHNjcm9sbFRvcCA8IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcInNjcm9sbC1tYXJnaW5cIikpIGhlYWRlci5hZGRDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgbGV0IGhlYWRlcl9oZWlnaHQgPSAzMDAgKyAyMCAtIHNjcm9sbFRvcDtcbiAgICAgICAgaGVhZGVyLmNzcyh7XG4gICAgICAgICAgaGVpZ2h0OiBoZWFkZXJfaGVpZ2h0LFxuICAgICAgICAgIGJvdHRvbTogYGNhbGMoMTAwJSAtICR7aGVhZGVyX2hlaWdodH1weClgXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgaWYoc2Nyb2xsVG9wID49IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZihoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoc2Nyb2xsVG9wIDw9IHNjcm9sbFVwVGhyZXNob2xkKXtcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBoZWFkZXIuYWRkQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gbWFpbiA+IG5hdlwiO1xuICAgIFxuICAgIHRoaXMuaW5pdFRvZ2dsZUJ1dHRvbigpO1xuICAgIHRoaXMuYnVpbGRFbWFpbEFkZHJlc3MoKTtcbiAgICB0aGlzLmJ1aWxkQmFsbG9vbigpO1xuICAgIHRoaXMuc2V0SGVhZGxpbmUoKTtcbiAgICB0aGlzLndyYXBIZWFkbGluZSgpO1xuICB9XG4gIFxuICB3cmFwSGVhZGxpbmUoKXtcbiAgICBsZXQgaGVhZGxpbmVUaXRsZSA9ICQodGhpcy5zZWxlY3RvcikuZmluZChcIi5oZWFkbGluZSAuaGVhZGxpbmUtdGl0bGVcIik7XG4gICAgaGVhZGxpbmVUaXRsZS5kb3Rkb3Rkb3Qoe1xuICAgICAgdHJ1bmNhdGU6IFwibGV0dGVyXCIsXG4gICAgICB3YXRjaDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlSGVhZGxpbmVJdGVtKHVybCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBwdWJsaXNoZWRfdGltZSl7XG4gICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0naGVhZGxpbmUtaXRlbSc+XCIpO1xuICAgICRjb250YWluZXJcbiAgICAgIC5hcHBlbmQoXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdoZWFkbGluZS10aXRsZSc+XCIpLmFwcGVuZChcbiAgICAgICAgICBgPGEgaHJlZj1cIiR7dXJsfVwiICR7ZGVzY3JpcHRpb24gPyAndGl0bGU9JytkZXNjcmlwdGlvbjonJ31cIj4ke3RpdGxlfTwvYT5gXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5hcHBlbmQoYDxkaXYgY2xhc3M9J2hlYWRsaW5lLW1ldGEnPiR7cHVibGlzaGVkX3RpbWV9PC9kaXY+YClcbiAgICA7XG5cbiAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgfVxuXG4gIHNldEhlYWRsaW5lKCl7XG4gICAgY29uc3QgYXJ0aWNsZXMgPSAkJGFydGljbGVfbGlzdCgpOyAvLyBDb21lcyBmcm9tIGV4dGVybmFsIDxzY3JpcHQ+IHRhZy5cbiAgICBpZighYXJ0aWNsZXMpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKSB8fCBcImphXCI7XG4gICAgY29uc3QgYXJ0aWNsZV90cmVlID0gYXJ0aWNsZXNbbGFuZ107XG5cbiAgICBjb25zdCBhY3RpdmVfdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IGFjdGl2ZV9zdWJ0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTp0YWcnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcblxuICAgIGNvbnN0ICR0b3BpY19jb250YWluZXIgPSAkKFwiI3RvcGljLWxpc3RcIikuZmluZChcIi50YWdzXCIpO1xuXG4gICAgT2JqZWN0LmtleXMoYXJ0aWNsZV90cmVlKS5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgJHRvcGljID0gJChgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHt2YWx9PC9zcGFuPjwvYT5gKTtcblxuICAgICAgaWYodmFsID09PSBhY3RpdmVfdG9waWMgfHwgKCFhY3RpdmVfdG9waWMgJiYgaW5kZXggPT09IDApKXtcbiAgICAgICAgJHRvcGljLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgfVxuXG4gICAgICAkdG9waWNfY29udGFpbmVyLmFwcGVuZCgkdG9waWMpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgJHN1YnRvcGljX2NvbnRhaW5lciA9ICQoXCIjc3VidG9waWMtbGlzdFwiKS5maW5kKFwiLnRhZ3NcIik7XG5cbiAgICBPYmplY3Qua2V5cyhhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0ICRzdWJ0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG5cbiAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3N1YnRvcGljIHx8ICghYWN0aXZlX3N1YnRvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICRzdWJ0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cblxuICAgICAgJHN1YnRvcGljX2NvbnRhaW5lci5hcHBlbmQoJHN1YnRvcGljKTtcbiAgICB9KTtcblxuICAgIGNvbnN0ICRhcnRpY2xlX2NvbnRhaW5lciA9ICQoXCIjYXJ0aWNsZS1saXN0XCIpLmZpbmQoXCIuaGVhZGxpbmVcIik7XG5cbiAgICBPYmplY3Qua2V5cyhhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXVthY3RpdmVfc3VidG9waWNdKS5mb3JFYWNoKCh2LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGFydGljbGUgPSBhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXVthY3RpdmVfc3VidG9waWNdW3ZdO1xuICAgICAgbGV0IGFydGljbGVfZHRpbWUgPSAobmV3IERhdGUoYXJ0aWNsZS5wdWJsaXNoZWRfdGltZSkpXG4gICAgICAgIC50b0xvY2FsZURhdGVTdHJpbmcobGFuZywge3llYXI6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCJ9KTtcblxuICAgICAgbGV0ICRoZWFkbGluZSA9IHRoaXMuY3JlYXRlSGVhZGxpbmVJdGVtKFwiI1wiLCBhcnRpY2xlLnRpdGxlLCBhcnRpY2xlLmRlc2NyaXB0aW9uLCBhcnRpY2xlX2R0aW1lKTtcbiAgICAgICRhcnRpY2xlX2NvbnRhaW5lci5hcHBlbmQoJGhlYWRsaW5lKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgaW5pdFRvZ2dsZUJ1dHRvbigpe1xuICAgIGxldCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbiAgICBsZXQgJHNpZGViYXIgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGxldCAkdGFncyA9ICRzaWRlYmFyLmZpbmQoXCIudGFnc1wiKTtcbiAgICBsZXQgJGJ1dHRvbiA9ICQoXCIjc2lkZWJhci10b2dnbGUtYnV0dG9uXCIpO1xuICAgIFxuICAgIGNvbnN0IGNsb3NlU2lkZWJhciA9IChlKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nIGlmIG91dHNpZGUgb2Ygc2lkZWJhciBoYXMgYmVlbiBjbGlja2VkLlxuICAgICAgLy8gSG93ZXZlciwgaWYgc2NyZWVuIHNpemUgaXMgZm9yIG1vYmlsZSwgY2xvc2Ugc2lkZWJhciB3aGVyZXZlciBpcyBjbGlja2VkLlxuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzk5cHgpXCIpLm1hdGNoZXMgJiZcbiAgICAgICAgJHNpZGViYXIuaXMoZS50YXJnZXQpIHx8ICRzaWRlYmFyLmhhcyhlLnRhcmdldCkubGVuZ3RoID4gMCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgXG4gICAgICAkc2lkZWJhci5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XG4gICAgfTtcbiAgICBcbiAgICBjb25zdCBvblRvZ2dsZUJ1dHRvbkNsaWNrZWQgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIFxuICAgICAgaWYoJHNpZGViYXIuaGFzQ2xhc3MoXCJ2aXNpYmxlXCIpKXtcbiAgICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub2ZmKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgJHNpZGViYXIuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub24oXCJjbGljay5jbG9zZVNpZGViYXJcIiwgY2xvc2VTaWRlYmFyKTtcbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICAkYnV0dG9uLm9uKFwiY2xpY2tcIiwgb25Ub2dnbGVCdXR0b25DbGlja2VkKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFByZXZlbnRpbmcgZW1haWwgc3BhbVxuICAgKi9cbiAgYnVpbGRFbWFpbEFkZHJlc3MoKXtcbiAgICBsZXQgcGFnZU9wZW5lZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGxldCBpc0FscmVhZHlCdWlsdCA9IGZhbHNlO1xuICAgIGxldCAkZW1haWwgPSAkKFwiLnByb2ZpbGUgLnNvY2lhbCAuZW1haWxcIik7XG4gICAgXG4gICAgY29uc3QgYWRkciA9IFs4MDU5LCA2MDg4LCA3MTYzLCA1MDYzLCA3Mzg0LCAtMjgyMSwgNTg3OSwgNjA4OCwgNzE2MywgNDQ3MiwgODI4OCwgNTI2NCwgLTMwODgsIDU2NzIsIDYwODgsIDg1MTksIDU4NzksIDg3NTIsIDQ2NjcsIDc2MDcsIDQ0NzIsIDU2NzIsIDUyNjQsIDgyODgsIC04NDEsIDU2NzIsIDY5NDQsIDQ0NzIsIDYwODgsIDY3MjcsIC0yODIxLCA0ODY0LCA3Mzg0LCA2OTQ0XTtcbiAgICBcbiAgICBjb25zdCBtYWtlQWRkcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZihpc0FscmVhZHlCdWlsdCAmJiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwYWdlT3BlbmVkKSA+IDE1MDApIHJldHVybjtcbiAgICAgIFxuICAgICAgJGVtYWlsLmF0dHIoXCJocmVmXCIsIFwibWFpbHRvOlwiICsgYWRkci5tYXAoZnVuY3Rpb24odil7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKE1hdGguc3FydCh2KzQ5MzcpKVxuICAgICAgfSkuam9pbihcIlwiKSk7XG4gICAgfTtcbiAgICBcbiAgICAkZW1haWwub24oXCJtb3VzZW92ZXIgdG91Y2hzdGFydFwiLCBtYWtlQWRkcmVzcyk7XG4gIH1cbiAgXG4gIGJ1aWxkQmFsbG9vbigpe1xuICAgICQodGhpcy5zZWxlY3RvciArIFwiIFtkYXRhLWJhbGxvb25dXCIpLmJhbGxvb24oe1xuICAgICAgcGxhY2VtZW50OiBcImxlZnRcIixcbiAgICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgICBtYXJnaW5Ub3A6ICQoXCIucHJvZmlsZS1hdHRyaWJ1dGVcIikuaGVpZ2h0KCkgLyAyXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBcIi4vYXNzZXRcIjtcbmltcG9ydCBIZWFkZXIgZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkZXJcIjtcbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL2NvbXBvbmVudHMvc2lkZWJhclwiO1xuXG5jb25zdCBtYWluID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgaGVhZGVyID0gbmV3IEhlYWRlcigpO1xuICBjb25zdCBzaWRlYmFyID0gbmV3IFNpZGViYXIoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
