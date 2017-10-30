(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./standard');

},{"./standard":6}],2:[function(require,module,exports){
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
    this.setupLangButton();
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
      $container.append($("<div class='headline-title'>").append("<a href=\"" + url + "\" " + (description ? 'title="' + description + '"' : '') + "\">" + title + "</a>")).append("<div class='headline-meta'>" + published_time + "</div>");

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

      if (!article_tree[active_topic]) {
        return;
      }

      var $subtopic_container = $("#subtopic-list").find(".tags");

      Object.keys(article_tree[active_topic]).forEach(function (val, index) {
        var $subtopic = $("<a><span class='tag'>" + val + "</span></a>");

        if (val === active_subtopic || !active_subtopic && index === 0) {
          $subtopic.addClass("active");
        }

        $subtopic_container.append($subtopic);
      });

      if (!article_tree[active_topic][active_subtopic]) {
        return;
      }

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
  }, {
    key: "setupLangButton",
    value: function setupLangButton() {
      var $anker = $(".language.profile-attribute a[data-lang]");
      var current_lang = $("html").attr("lang");
      var article_id = $("head > meta[name='articleID'][content]").attr("content");
      var topic = $("head > meta[property='article:section']").attr("content");
      var subtopic = $("head > meta[property='article:tag']").attr("content");
      var article = $$article_list()[current_lang][topic][subtopic][article_id];
      var basedir = /^(.+)[/]([^/]*)$/.exec(article.path)[1];

      $anker.each(function () {
        var $this = $(this);
        var target_lang = $this.data("lang");
        $this.attr("href", "/" + basedir + "/" + article_id + "_" + target_lang + ".html");
      });
    }
  }]);

  return Sidebar;
}();

exports.default = Sidebar;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Content = function () {
  function Content() {
    _classCallCheck(this, Content);

    this.selector = "body > main > article";

    this.buildArticleHeader();
  }

  _createClass(Content, [{
    key: "buildArticleHeader",
    value: function buildArticleHeader() {
      var $article = $(this.selector);
      var $header = $article.find(".article-header");
      var lang = $("html").attr("lang") || "ja";
      var title = $("head > meta[property='og:title']").attr("content");
      var topic = $("head > meta[property='article:section']").attr("content");
      var subtopic = $("head > meta[property='article:tag']").attr("content");
      var published_time = $("head > meta[property='article:published_time']").attr("content");

      published_time = new Date(Date.parse(published_time)).toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      var header_string = "\n      <div class='tags'>\n        <a><span class='tag'>" + topic + "</span>\n        <a><span class='tag'>" + subtopic + "</span>\n      </div>\n      <h1 class='article-title'>" + title + "</h1>\n      <div class='article-date'>\n      <i class='fa fa-clock-o'></i> " + published_time + "</div>\n    ";

      $header.html(header_string);
    }
  }]);

  return Content;
}();

exports.default = Content;

},{}],6:[function(require,module,exports){
"use strict";

require("./asset");

var _header = require("./components/header");

var _header2 = _interopRequireDefault(_header);

var _sidebar = require("./components/sidebar");

var _sidebar2 = _interopRequireDefault(_sidebar);

var _contents = require("./contents");

var _contents2 = _interopRequireDefault(_contents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var main = function main() {
  var header = new _header2.default();
  var sidebar = new _sidebar2.default();
  var content = new _contents2.default();
};

$(main);

},{"./asset":2,"./components/header":3,"./components/sidebar":4,"./contents":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb250ZW50cy9pbmRleC5qcyIsInNzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7OztBQ0FBOzs7O0FBSUMsV0FBUyxDQUFULEVBQVc7QUFDVixJQUFFLEVBQUYsQ0FBSyxPQUFMLEdBQWUsVUFBUyxJQUFULEVBQWM7QUFDM0IsUUFBTSxVQUFVLEVBQUUsTUFBRixDQUFTO0FBQ3ZCLG1CQUFhLE1BRFU7QUFFdkIsZUFBUyxTQUZjO0FBR3ZCLG1CQUFhLENBSFU7QUFJdkIsb0JBQWM7QUFKUyxLQUFULEVBS2IsSUFMYSxDQUFoQjs7QUFPQSxRQUFHLENBQUMsQ0FBQyxRQUFELEVBQVUsT0FBVixFQUFrQixNQUFsQixFQUEwQixRQUExQixDQUFtQyxRQUFRLFNBQTNDLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7QUFDRCxRQUFHLENBQUMsQ0FBQyxTQUFELEVBQVcsT0FBWCxFQUFtQixTQUFuQixFQUE4QixRQUE5QixDQUF1QyxRQUFRLEtBQS9DLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBTSxzQkFBc0I7QUFDMUIsa0JBQVksT0FEYztBQUUxQixpQkFBVyxDQUZlO0FBRzFCLGlCQUFXLENBQUMsQ0FIYztBQUkxQixvQkFBYztBQUpZLEtBQTVCOztBQU9BLFFBQUksWUFBWSxFQUFFLFFBQUYsQ0FBaEI7O0FBRUEsU0FBSyxJQUFMLENBQVUsWUFB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LE1BQWYsS0FBMEIsSUFBdkM7QUFDQSxVQUFNLFFBQVEsRUFBRSxrQ0FBRixFQUFzQyxJQUF0QyxDQUEyQyxTQUEzQyxDQUFkO0FBQ0EsVUFBTSxRQUFRLEVBQUUseUNBQUYsRUFBNkMsSUFBN0MsQ0FBa0QsU0FBbEQsQ0FBZDtBQUNBLFVBQU0sV0FBVyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWpCO0FBQ0EsVUFBSSxpQkFBaUIsRUFBRSxnREFBRixFQUFvRCxJQUFwRCxDQUF5RCxTQUF6RCxDQUFyQjs7QUFFQSx1QkFBa0IsSUFBSSxJQUFKLENBQVMsS0FBSyxLQUFMLENBQVcsY0FBWCxDQUFULENBQUQsQ0FDZCxrQkFEYyxDQUNLLElBREwsRUFDVztBQUN4QixjQUFNLFNBRGtCO0FBRXhCLGVBQU8sTUFGaUI7QUFHeEIsYUFBSztBQUhtQixPQURYLENBQWpCOztBQU9BLFVBQUksOEVBRXVCLEtBRnZCLDhDQUd1QixRQUh2QiwrREFLMEIsS0FMMUIscUZBTzhCLGNBUDlCLGlCQUFKOztBQVVBLGNBQVEsSUFBUixDQUFhLGFBQWI7QUFDRDs7Ozs7O2tCQWxDa0IsTzs7Ozs7QUNBckI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLEdBQVU7QUFDckIsTUFBTSxTQUFTLHNCQUFmO0FBQ0EsTUFBTSxVQUFVLHVCQUFoQjtBQUNBLE1BQU0sVUFBVSx3QkFBaEI7QUFDRCxDQUpEOztBQU1BLEVBQUUsSUFBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vc3RhbmRhcmQnO1xuIiwiLyoqXG4gKiBBdXRvIGRpc3BsYXkgYmFsbG9vbiBmb3IgZWxlbWVudHNcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xuKGZ1bmN0aW9uKCQpe1xuICAkLmZuLmJhbGxvb24gPSBmdW5jdGlvbihvcHRzKXtcbiAgICBjb25zdCBzZXR0aW5nID0gJC5leHRlbmQoe1xuICAgICAgXCJwbGFjZW1lbnRcIjogXCJsZWZ0XCIsXG4gICAgICBcImNvbG9yXCI6IHVuZGVmaW5lZCxcbiAgICAgIFwibWFyZ2luVG9wXCI6IDAsXG4gICAgICBcIm1hcmdpbkxlZnRcIjogMFxuICAgIH0sIG9wdHMpO1xuICAgIFxuICAgIGlmKCFbXCJib3R0b21cIixcInJpZ2h0XCIsXCJsZWZ0XCJdLmluY2x1ZGVzKHNldHRpbmcucGxhY2VtZW50KSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYWNlbWVudC5cIik7XG4gICAgfVxuICAgIGlmKCFbXCJkZWZhdWx0XCIsXCJibGFja1wiLHVuZGVmaW5lZF0uaW5jbHVkZXMoc2V0dGluZy5jb2xvcikpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvci5cIik7XG4gICAgfVxuICBcbiAgICBjb25zdCB3cmFwcGVySW5pdGlhbFN0eWxlID0ge1xuICAgICAgXCJwb3NpdGlvblwiOiBcImZpeGVkXCIsXG4gICAgICBcIm9wYWNpdHlcIjogMCxcbiAgICAgIFwiei1pbmRleFwiOiAtMSxcbiAgICAgIFwidHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgZWFzZSAuM3NcIlxuICAgIH07XG4gICAgXG4gICAgbGV0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuICBcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIGxldCAkdCA9ICQodGhpcyk7XG4gICAgICBsZXQgJGNvbnRlbnRzID0gJHQuZmluZChcIi5iYWxsb29uLWNvbnRlbnRzXCIpO1xuICAgICAgXG4gICAgICBpZighJGNvbnRlbnRzIHx8ICRjb250ZW50cy5sZW5ndGggPCAxKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgY29uc3QgJGJhbGxvb24gPSAkKFwiPGRpdj5cIilcbiAgICAgICAgLmFkZENsYXNzKFwiYmFsbG9vblwiKVxuICAgICAgICAuYWRkQ2xhc3Moc2V0dGluZy5wbGFjZW1lbnQpXG4gICAgICAgIC5odG1sKCRjb250ZW50cy5odG1sKCkpO1xuICAgICAgXG4gICAgICBpZihzZXR0aW5nLmNvbG9yKXtcbiAgICAgICAgJGJhbGxvb24uYWRkQ2xhc3Moc2V0dGluZy5jb2xvcik7XG4gICAgICB9XG4gICAgXG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKS5jc3Mod3JhcHBlckluaXRpYWxTdHlsZSk7XG4gICAgXG4gICAgICAkd3JhcHBlci5hcHBlbmQoJGJhbGxvb24pO1xuICAgICAgJHQuYXBwZW5kKCR3cmFwcGVyKTtcbiAgICAgICRjb250ZW50cy5yZW1vdmUoKTtcbiAgXG4gICAgICBsZXQgcG9wVXBTdGF0dXMgPSAwOyAvLyAwOiBoaWRkZW4sIDE6IHZpc2libGVcbiAgICAgIGNvbnN0IGFycm93TWFyZ2luID0gMjc7IC8vIFNlZSBhc3NldC5zdHlsLiAkYmFsbG9vbi10cmlhbmdsZS1zaXplID0gMTFweCwgJGJhbGxvb24tdHJpYW5nbGUtbGVmdCA9IDE2cHhcbiAgXG4gICAgICAkdC5vbihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICAgICAgbGV0IHNlbGYgPSAkdDtcbiAgICAgICAgbGV0IHpJbmRleCA9IDk5OTk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjYWxjUG9zaXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgIGxldCB0b3AsbGVmdDtcbiAgXG4gICAgICAgICAgc3dpdGNoKHNldHRpbmcucGxhY2VtZW50KXtcbiAgICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgKyBzZWxmLmhlaWdodCgpICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHt0b3A6IDAsIGxlZnQ6IDB9KTsgLy8gUHJldmVudCBjb250ZW50cyB3cmFwcGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgJHdyYXBwZXIud2lkdGgoKVxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpIC0gJHdyYXBwZXIud2lkdGgoKSAtIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgXG4gICAgICAgICAgICAgIGxldCB3cmFwcGVyX2hlaWdodCA9ICR3cmFwcGVyLmhlaWdodCgpO1xuICAgICAgICAgICAgICBjb25zdCByZW1haW4gPSAodG9wICsgd3JhcHBlcl9oZWlnaHQpIC0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICBpZihyZW1haW4gPiAwKXtcbiAgICAgICAgICAgICAgICB0b3AgPSB0b3AgLSB3cmFwcGVyX2hlaWdodCArIGFycm93TWFyZ2luICogMjtcbiAgICAgICAgICAgICAgICAkYmFsbG9vbi5hZGRDbGFzcyhcInVwcGVyXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJGJhbGxvb24ucmVtb3ZlQ2xhc3MoXCJ1cHBlclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAkd3JhcHBlci5jc3Moe3RvcDogMCwgcmlnaHQ6IDB9KTsgLy8gUHJldmVudCBjb250ZW50cyB3cmFwcGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgJHdyYXBwZXIud2lkdGgoKVxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpICsgc2VsZi53aWR0aCgpIC0gc2V0dGluZy5tYXJnaW5MZWZ0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIHJldHVybiB7dG9wLCBsZWZ0fTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICBcbiAgICAgICAgJHdyYXBwZXJcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgIFwidG9wXCI6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIFwibGVmdFwiOiBwb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgXCJ6LWluZGV4XCI6IHpJbmRleCxcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDE7XG4gIFxuICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGwuYmFsbG9vblwiLCAoZSkgPT4ge1xuICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgJHQub24oXCJtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgXCJvcGFjaXR5XCI6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDA7XG4gICAgICAgIFxuICAgICAgICAkKHdpbmRvdykub2ZmKFwic2Nyb2xsLmJhbGxvb25cIik7XG4gICAgICB9KTtcbiAgXG4gICAgICAkdC5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCAoZSkgPT4ge1xuICAgICAgICBpZihwb3BVcFN0YXR1cyA9PT0gMCl7XG4gICAgICAgICAgJHdyYXBwZXIuY3NzKFwiei1pbmRleFwiLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufShqUXVlcnkpKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IGhlYWRlclwiO1xuICAgIFxuICAgIHRoaXMuc3RpY2t5KCk7XG4gIH1cbiAgXG4gIHN0aWNreSgpe1xuICAgIGxldCBzY3JvbGxEb3duVGhyZXNob2xkID0gMjAwO1xuICAgIGxldCBzY3JvbGxVcFRocmVzaG9sZCA9IDEwMDtcbiAgICBsZXQgbWVkaWFRdWVyeVN0cmluZyA9IFwiKG1pbi13aWR0aDogMTIwMHB4KSwgKG1pbi13aWR0aDogODAwcHgpIGFuZCAobWF4LXdpZHRoOiAxMTk5cHgpXCI7XG4gICAgXG4gICAgbGV0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG4gICAgbGV0IGhlYWRlciA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgbGV0IHJlc2l6aW5nID0gZmFsc2U7XG4gIFxuICAgIGNvbnN0IG9uVHJhbnNpdGlvbkVuZCA9IChlKSA9PiB7XG4gICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICByZXNpemluZyA9IGZhbHNlO1xuICAgIH07XG4gIFxuICAgIGhlYWRlci5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCBvblRyYW5zaXRpb25FbmQpO1xuICBcbiAgICAkd2luZG93Lm9uKFwic2Nyb2xsXCIsIChlKSA9PiB7XG4gICAgICBpZighd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeVN0cmluZykubWF0Y2hlcyB8fCByZXNpemluZykgcmV0dXJuO1xuICAgIFxuICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICBcbiAgICAgIGlmKHNjcm9sbFVwVGhyZXNob2xkIDwgc2Nyb2xsVG9wICYmIHNjcm9sbFRvcCA8IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcInNjcm9sbC1tYXJnaW5cIikpIGhlYWRlci5hZGRDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgbGV0IGhlYWRlcl9oZWlnaHQgPSAzMDAgKyAyMCAtIHNjcm9sbFRvcDtcbiAgICAgICAgaGVhZGVyLmNzcyh7XG4gICAgICAgICAgaGVpZ2h0OiBoZWFkZXJfaGVpZ2h0LFxuICAgICAgICAgIGJvdHRvbTogYGNhbGMoMTAwJSAtICR7aGVhZGVyX2hlaWdodH1weClgXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgaWYoc2Nyb2xsVG9wID49IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZihoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoc2Nyb2xsVG9wIDw9IHNjcm9sbFVwVGhyZXNob2xkKXtcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBoZWFkZXIuYWRkQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gbWFpbiA+IG5hdlwiO1xuICAgIFxuICAgIHRoaXMuaW5pdFRvZ2dsZUJ1dHRvbigpO1xuICAgIHRoaXMuYnVpbGRFbWFpbEFkZHJlc3MoKTtcbiAgICB0aGlzLmJ1aWxkQmFsbG9vbigpO1xuICAgIHRoaXMuc2V0SGVhZGxpbmUoKTtcbiAgICB0aGlzLndyYXBIZWFkbGluZSgpO1xuICAgIHRoaXMuc2V0dXBMYW5nQnV0dG9uKCk7XG4gIH1cbiAgXG4gIHdyYXBIZWFkbGluZSgpe1xuICAgIGxldCBoZWFkbGluZVRpdGxlID0gJCh0aGlzLnNlbGVjdG9yKS5maW5kKFwiLmhlYWRsaW5lIC5oZWFkbGluZS10aXRsZVwiKTtcbiAgICBoZWFkbGluZVRpdGxlLmRvdGRvdGRvdCh7XG4gICAgICB0cnVuY2F0ZTogXCJsZXR0ZXJcIixcbiAgICAgIHdhdGNoOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVIZWFkbGluZUl0ZW0odXJsLCB0aXRsZSwgZGVzY3JpcHRpb24sIHB1Ymxpc2hlZF90aW1lKXtcbiAgICBsZXQgJGNvbnRhaW5lciA9ICQoXCI8ZGl2IGNsYXNzPSdoZWFkbGluZS1pdGVtJz5cIik7XG4gICAgJGNvbnRhaW5lclxuICAgICAgLmFwcGVuZChcbiAgICAgICAgJChcIjxkaXYgY2xhc3M9J2hlYWRsaW5lLXRpdGxlJz5cIikuYXBwZW5kKFxuICAgICAgICAgIGA8YSBocmVmPVwiJHt1cmx9XCIgJHtkZXNjcmlwdGlvbiA/ICd0aXRsZT1cIicrZGVzY3JpcHRpb24rJ1wiJzonJ31cIj4ke3RpdGxlfTwvYT5gXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5hcHBlbmQoYDxkaXYgY2xhc3M9J2hlYWRsaW5lLW1ldGEnPiR7cHVibGlzaGVkX3RpbWV9PC9kaXY+YClcbiAgICA7XG5cbiAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgfVxuXG4gIHNldEhlYWRsaW5lKCl7XG4gICAgY29uc3QgYXJ0aWNsZXMgPSAkJGFydGljbGVfbGlzdCgpOyAvLyBDb21lcyBmcm9tIGV4dGVybmFsIDxzY3JpcHQ+IHRhZy5cbiAgICBpZighYXJ0aWNsZXMpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKSB8fCBcImphXCI7XG4gICAgY29uc3QgYXJ0aWNsZV90cmVlID0gYXJ0aWNsZXNbbGFuZ107XG5cbiAgICBjb25zdCBhY3RpdmVfdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IGFjdGl2ZV9zdWJ0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTp0YWcnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcblxuICAgIGNvbnN0ICR0b3BpY19jb250YWluZXIgPSAkKFwiI3RvcGljLWxpc3RcIikuZmluZChcIi50YWdzXCIpO1xuXG4gICAgT2JqZWN0LmtleXMoYXJ0aWNsZV90cmVlKS5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgJHRvcGljID0gJChgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHt2YWx9PC9zcGFuPjwvYT5gKTtcblxuICAgICAgaWYodmFsID09PSBhY3RpdmVfdG9waWMgfHwgKCFhY3RpdmVfdG9waWMgJiYgaW5kZXggPT09IDApKXtcbiAgICAgICAgJHRvcGljLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgfVxuXG4gICAgICAkdG9waWNfY29udGFpbmVyLmFwcGVuZCgkdG9waWMpO1xuICAgIH0pO1xuXG4gICAgaWYoIWFydGljbGVfdHJlZVthY3RpdmVfdG9waWNdKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCAkc3VidG9waWNfY29udGFpbmVyID0gJChcIiNzdWJ0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcblxuICAgIE9iamVjdC5rZXlzKGFydGljbGVfdHJlZVthY3RpdmVfdG9waWNdKS5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgJHN1YnRvcGljID0gJChgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHt2YWx9PC9zcGFuPjwvYT5gKTtcblxuICAgICAgaWYodmFsID09PSBhY3RpdmVfc3VidG9waWMgfHwgKCFhY3RpdmVfc3VidG9waWMgJiYgaW5kZXggPT09IDApKXtcbiAgICAgICAgJHN1YnRvcGljLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgfVxuXG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmFwcGVuZCgkc3VidG9waWMpO1xuICAgIH0pO1xuXG4gICAgaWYoIWFydGljbGVfdHJlZVthY3RpdmVfdG9waWNdW2FjdGl2ZV9zdWJ0b3BpY10pe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0ICRhcnRpY2xlX2NvbnRhaW5lciA9ICQoXCIjYXJ0aWNsZS1saXN0XCIpLmZpbmQoXCIuaGVhZGxpbmVcIik7XG5cbiAgICBPYmplY3Qua2V5cyhhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXVthY3RpdmVfc3VidG9waWNdKS5mb3JFYWNoKCh2LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGFydGljbGUgPSBhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXVthY3RpdmVfc3VidG9waWNdW3ZdO1xuICAgICAgbGV0IGFydGljbGVfZHRpbWUgPSAobmV3IERhdGUoYXJ0aWNsZS5wdWJsaXNoZWRfdGltZSkpXG4gICAgICAgIC50b0xvY2FsZURhdGVTdHJpbmcobGFuZywge3llYXI6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCJ9KTtcblxuICAgICAgbGV0ICRoZWFkbGluZSA9IHRoaXMuY3JlYXRlSGVhZGxpbmVJdGVtKFwiI1wiLCBhcnRpY2xlLnRpdGxlLCBhcnRpY2xlLmRlc2NyaXB0aW9uLCBhcnRpY2xlX2R0aW1lKTtcbiAgICAgICRhcnRpY2xlX2NvbnRhaW5lci5hcHBlbmQoJGhlYWRsaW5lKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgaW5pdFRvZ2dsZUJ1dHRvbigpe1xuICAgIGxldCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbiAgICBsZXQgJHNpZGViYXIgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGxldCAkdGFncyA9ICRzaWRlYmFyLmZpbmQoXCIudGFnc1wiKTtcbiAgICBsZXQgJGJ1dHRvbiA9ICQoXCIjc2lkZWJhci10b2dnbGUtYnV0dG9uXCIpO1xuICAgIFxuICAgIGNvbnN0IGNsb3NlU2lkZWJhciA9IChlKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nIGlmIG91dHNpZGUgb2Ygc2lkZWJhciBoYXMgYmVlbiBjbGlja2VkLlxuICAgICAgLy8gSG93ZXZlciwgaWYgc2NyZWVuIHNpemUgaXMgZm9yIG1vYmlsZSwgY2xvc2Ugc2lkZWJhciB3aGVyZXZlciBpcyBjbGlja2VkLlxuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzk5cHgpXCIpLm1hdGNoZXMgJiZcbiAgICAgICAgJHNpZGViYXIuaXMoZS50YXJnZXQpIHx8ICRzaWRlYmFyLmhhcyhlLnRhcmdldCkubGVuZ3RoID4gMCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgXG4gICAgICAkc2lkZWJhci5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XG4gICAgfTtcbiAgICBcbiAgICBjb25zdCBvblRvZ2dsZUJ1dHRvbkNsaWNrZWQgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIFxuICAgICAgaWYoJHNpZGViYXIuaGFzQ2xhc3MoXCJ2aXNpYmxlXCIpKXtcbiAgICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub2ZmKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgJHNpZGViYXIuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub24oXCJjbGljay5jbG9zZVNpZGViYXJcIiwgY2xvc2VTaWRlYmFyKTtcbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICAkYnV0dG9uLm9uKFwiY2xpY2tcIiwgb25Ub2dnbGVCdXR0b25DbGlja2VkKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFByZXZlbnRpbmcgZW1haWwgc3BhbVxuICAgKi9cbiAgYnVpbGRFbWFpbEFkZHJlc3MoKXtcbiAgICBsZXQgcGFnZU9wZW5lZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGxldCBpc0FscmVhZHlCdWlsdCA9IGZhbHNlO1xuICAgIGxldCAkZW1haWwgPSAkKFwiLnByb2ZpbGUgLnNvY2lhbCAuZW1haWxcIik7XG4gICAgXG4gICAgY29uc3QgYWRkciA9IFs4MDU5LCA2MDg4LCA3MTYzLCA1MDYzLCA3Mzg0LCAtMjgyMSwgNTg3OSwgNjA4OCwgNzE2MywgNDQ3MiwgODI4OCwgNTI2NCwgLTMwODgsIDU2NzIsIDYwODgsIDg1MTksIDU4NzksIDg3NTIsIDQ2NjcsIDc2MDcsIDQ0NzIsIDU2NzIsIDUyNjQsIDgyODgsIC04NDEsIDU2NzIsIDY5NDQsIDQ0NzIsIDYwODgsIDY3MjcsIC0yODIxLCA0ODY0LCA3Mzg0LCA2OTQ0XTtcbiAgICBcbiAgICBjb25zdCBtYWtlQWRkcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZihpc0FscmVhZHlCdWlsdCAmJiAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwYWdlT3BlbmVkKSA+IDE1MDApIHJldHVybjtcbiAgICAgIFxuICAgICAgJGVtYWlsLmF0dHIoXCJocmVmXCIsIFwibWFpbHRvOlwiICsgYWRkci5tYXAoZnVuY3Rpb24odil7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKE1hdGguc3FydCh2KzQ5MzcpKVxuICAgICAgfSkuam9pbihcIlwiKSk7XG4gICAgfTtcbiAgICBcbiAgICAkZW1haWwub24oXCJtb3VzZW92ZXIgdG91Y2hzdGFydFwiLCBtYWtlQWRkcmVzcyk7XG4gIH1cbiAgXG4gIGJ1aWxkQmFsbG9vbigpe1xuICAgICQodGhpcy5zZWxlY3RvciArIFwiIFtkYXRhLWJhbGxvb25dXCIpLmJhbGxvb24oe1xuICAgICAgcGxhY2VtZW50OiBcImxlZnRcIixcbiAgICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgICBtYXJnaW5Ub3A6ICQoXCIucHJvZmlsZS1hdHRyaWJ1dGVcIikuaGVpZ2h0KCkgLyAyXG4gICAgfSk7XG4gIH1cblxuICBzZXR1cExhbmdCdXR0b24oKXtcbiAgICBjb25zdCAkYW5rZXIgPSAkKFwiLmxhbmd1YWdlLnByb2ZpbGUtYXR0cmlidXRlIGFbZGF0YS1sYW5nXVwiKTtcbiAgICBjb25zdCBjdXJyZW50X2xhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKTtcbiAgICBjb25zdCBhcnRpY2xlX2lkID0gJChcImhlYWQgPiBtZXRhW25hbWU9J2FydGljbGVJRCddW2NvbnRlbnRdXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnNlY3Rpb24nXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCBzdWJ0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTp0YWcnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBsZXQgYXJ0aWNsZSA9ICQkYXJ0aWNsZV9saXN0KClbY3VycmVudF9sYW5nXVt0b3BpY11bc3VidG9waWNdW2FydGljbGVfaWRdO1xuICAgIGxldCBiYXNlZGlyID0gL14oLispWy9dKFteL10qKSQvLmV4ZWMoYXJ0aWNsZS5wYXRoKVsxXTtcblxuICAgICRhbmtlci5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBjb25zdCB0YXJnZXRfbGFuZyA9ICR0aGlzLmRhdGEoXCJsYW5nXCIpO1xuICAgICAgJHRoaXMuYXR0cihcImhyZWZcIiwgYC8ke2Jhc2VkaXJ9LyR7YXJ0aWNsZV9pZH1fJHt0YXJnZXRfbGFuZ30uaHRtbGApO1xuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IG1haW4gPiBhcnRpY2xlXCI7XG5cbiAgICB0aGlzLmJ1aWxkQXJ0aWNsZUhlYWRlcigpO1xuICB9XG5cbiAgYnVpbGRBcnRpY2xlSGVhZGVyKCl7XG4gICAgY29uc3QgJGFydGljbGUgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGNvbnN0ICRoZWFkZXIgPSAkYXJ0aWNsZS5maW5kKFwiLmFydGljbGUtaGVhZGVyXCIpO1xuICAgIGNvbnN0IGxhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKSB8fCBcImphXCI7XG4gICAgY29uc3QgdGl0bGUgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J29nOnRpdGxlJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3QgdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHN1YnRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnRhZyddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGxldCBwdWJsaXNoZWRfdGltZSA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpwdWJsaXNoZWRfdGltZSddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuXG4gICAgcHVibGlzaGVkX3RpbWUgPSAobmV3IERhdGUoRGF0ZS5wYXJzZShwdWJsaXNoZWRfdGltZSkpKVxuICAgICAgLnRvTG9jYWxlRGF0ZVN0cmluZyhsYW5nLCB7XG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICBtb250aDogXCJsb25nXCIsXG4gICAgICAgIGRheTogXCJudW1lcmljXCJcbiAgICAgIH0pO1xuXG4gICAgbGV0IGhlYWRlcl9zdHJpbmcgPSBgXG4gICAgICA8ZGl2IGNsYXNzPSd0YWdzJz5cbiAgICAgICAgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHt0b3BpY308L3NwYW4+XG4gICAgICAgIDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7c3VidG9waWN9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8aDEgY2xhc3M9J2FydGljbGUtdGl0bGUnPiR7dGl0bGV9PC9oMT5cbiAgICAgIDxkaXYgY2xhc3M9J2FydGljbGUtZGF0ZSc+XG4gICAgICA8aSBjbGFzcz0nZmEgZmEtY2xvY2stbyc+PC9pPiAke3B1Ymxpc2hlZF90aW1lfTwvZGl2PlxuICAgIGA7XG5cbiAgICAkaGVhZGVyLmh0bWwoaGVhZGVyX3N0cmluZyk7XG4gIH1cbn1cbiIsImltcG9ydCBcIi4vYXNzZXRcIjtcbmltcG9ydCBIZWFkZXIgZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkZXJcIjtcbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL2NvbXBvbmVudHMvc2lkZWJhclwiO1xuaW1wb3J0IENvbnRlbnQgZnJvbSBcIi4vY29udGVudHNcIjtcblxuY29uc3QgbWFpbiA9IGZ1bmN0aW9uKCl7XG4gIGNvbnN0IGhlYWRlciA9IG5ldyBIZWFkZXIoKTtcbiAgY29uc3Qgc2lkZWJhciA9IG5ldyBTaWRlYmFyKCk7XG4gIGNvbnN0IGNvbnRlbnQgPSBuZXcgQ29udGVudCgpO1xufTtcblxuJChtYWluKTtcbiJdfQ==
