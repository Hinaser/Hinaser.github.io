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

        try {
          $this.attr("href", "/" + basedir + "/" + article_id + "_" + target_lang + ".html");
        } catch (e) {
          console.error(e);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb250ZW50cy9pbmRleC5qcyIsInNzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7OztBQ0FBOzs7O0FBSUMsV0FBUyxDQUFULEVBQVc7QUFDVixJQUFFLEVBQUYsQ0FBSyxPQUFMLEdBQWUsVUFBUyxJQUFULEVBQWM7QUFDM0IsUUFBTSxVQUFVLEVBQUUsTUFBRixDQUFTO0FBQ3ZCLG1CQUFhLE1BRFU7QUFFdkIsZUFBUyxTQUZjO0FBR3ZCLG1CQUFhLENBSFU7QUFJdkIsb0JBQWM7QUFKUyxLQUFULEVBS2IsSUFMYSxDQUFoQjs7QUFPQSxRQUFHLENBQUMsQ0FBQyxRQUFELEVBQVUsT0FBVixFQUFrQixNQUFsQixFQUEwQixRQUExQixDQUFtQyxRQUFRLFNBQTNDLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7QUFDRCxRQUFHLENBQUMsQ0FBQyxTQUFELEVBQVcsT0FBWCxFQUFtQixTQUFuQixFQUE4QixRQUE5QixDQUF1QyxRQUFRLEtBQS9DLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBTSxzQkFBc0I7QUFDMUIsa0JBQVksT0FEYztBQUUxQixpQkFBVyxDQUZlO0FBRzFCLGlCQUFXLENBQUMsQ0FIYztBQUkxQixvQkFBYztBQUpZLEtBQTVCOztBQU9BLFFBQUksWUFBWSxFQUFFLFFBQUYsQ0FBaEI7O0FBRUEsU0FBSyxJQUFMLENBQVUsWUFB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TSxVQUFVLFNBQVMsSUFBVCxDQUFjLGlCQUFkLENBQWhCO0FBQ0EsVUFBTSxPQUFPLEVBQUUsTUFBRixFQUFVLElBQVYsQ0FBZSxNQUFmLEtBQTBCLElBQXZDO0FBQ0EsVUFBTSxRQUFRLEVBQUUsa0NBQUYsRUFBc0MsSUFBdEMsQ0FBMkMsU0FBM0MsQ0FBZDtBQUNBLFVBQU0sUUFBUSxFQUFFLHlDQUFGLEVBQTZDLElBQTdDLENBQWtELFNBQWxELENBQWQ7QUFDQSxVQUFNLFdBQVcsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUFqQjtBQUNBLFVBQUksaUJBQWlCLEVBQUUsZ0RBQUYsRUFBb0QsSUFBcEQsQ0FBeUQsU0FBekQsQ0FBckI7O0FBRUEsdUJBQWtCLElBQUksSUFBSixDQUFTLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBVCxDQUFELENBQ2Qsa0JBRGMsQ0FDSyxJQURMLEVBQ1c7QUFDeEIsY0FBTSxTQURrQjtBQUV4QixlQUFPLE1BRmlCO0FBR3hCLGFBQUs7QUFIbUIsT0FEWCxDQUFqQjs7QUFPQSxVQUFJLDhFQUV1QixLQUZ2Qiw4Q0FHdUIsUUFIdkIsK0RBSzBCLEtBTDFCLHFGQU84QixjQVA5QixpQkFBSjs7QUFVQSxjQUFRLElBQVIsQ0FBYSxhQUFiO0FBQ0Q7Ozs7OztrQkFsQ2tCLE87Ozs7O0FDQXJCOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxHQUFVO0FBQ3JCLE1BQU0sU0FBUyxzQkFBZjtBQUNBLE1BQU0sVUFBVSx1QkFBaEI7QUFDQSxNQUFNLFVBQVUsd0JBQWhCO0FBQ0QsQ0FKRDs7QUFNQSxFQUFFLElBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICcuL3N0YW5kYXJkJztcbiIsIi8qKlxuICogQXV0byBkaXNwbGF5IGJhbGxvb24gZm9yIGVsZW1lbnRzXG4gKiBAcmVxdWlyZXMgalF1ZXJ5XG4gKi9cbihmdW5jdGlvbigkKXtcbiAgJC5mbi5iYWxsb29uID0gZnVuY3Rpb24ob3B0cyl7XG4gICAgY29uc3Qgc2V0dGluZyA9ICQuZXh0ZW5kKHtcbiAgICAgIFwicGxhY2VtZW50XCI6IFwibGVmdFwiLFxuICAgICAgXCJjb2xvclwiOiB1bmRlZmluZWQsXG4gICAgICBcIm1hcmdpblRvcFwiOiAwLFxuICAgICAgXCJtYXJnaW5MZWZ0XCI6IDBcbiAgICB9LCBvcHRzKTtcbiAgICBcbiAgICBpZighW1wiYm90dG9tXCIsXCJyaWdodFwiLFwibGVmdFwiXS5pbmNsdWRlcyhzZXR0aW5nLnBsYWNlbWVudCkpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwbGFjZW1lbnQuXCIpO1xuICAgIH1cbiAgICBpZighW1wiZGVmYXVsdFwiLFwiYmxhY2tcIix1bmRlZmluZWRdLmluY2x1ZGVzKHNldHRpbmcuY29sb3IpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IuXCIpO1xuICAgIH1cbiAgXG4gICAgY29uc3Qgd3JhcHBlckluaXRpYWxTdHlsZSA9IHtcbiAgICAgIFwicG9zaXRpb25cIjogXCJmaXhlZFwiLFxuICAgICAgXCJvcGFjaXR5XCI6IDAsXG4gICAgICBcInotaW5kZXhcIjogLTEsXG4gICAgICBcInRyYW5zaXRpb25cIjogXCJvcGFjaXR5IGVhc2UgLjNzXCJcbiAgICB9O1xuICAgIFxuICAgIGxldCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbiAgXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICBsZXQgJHQgPSAkKHRoaXMpO1xuICAgICAgbGV0ICRjb250ZW50cyA9ICR0LmZpbmQoXCIuYmFsbG9vbi1jb250ZW50c1wiKTtcbiAgICAgIFxuICAgICAgaWYoISRjb250ZW50cyB8fCAkY29udGVudHMubGVuZ3RoIDwgMSl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICBcbiAgICAgIGNvbnN0ICRiYWxsb29uID0gJChcIjxkaXY+XCIpXG4gICAgICAgIC5hZGRDbGFzcyhcImJhbGxvb25cIilcbiAgICAgICAgLmFkZENsYXNzKHNldHRpbmcucGxhY2VtZW50KVxuICAgICAgICAuaHRtbCgkY29udGVudHMuaHRtbCgpKTtcbiAgICAgIFxuICAgICAgaWYoc2V0dGluZy5jb2xvcil7XG4gICAgICAgICRiYWxsb29uLmFkZENsYXNzKHNldHRpbmcuY29sb3IpO1xuICAgICAgfVxuICAgIFxuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdj5cIikuY3NzKHdyYXBwZXJJbml0aWFsU3R5bGUpO1xuICAgIFxuICAgICAgJHdyYXBwZXIuYXBwZW5kKCRiYWxsb29uKTtcbiAgICAgICR0LmFwcGVuZCgkd3JhcHBlcik7XG4gICAgICAkY29udGVudHMucmVtb3ZlKCk7XG4gIFxuICAgICAgbGV0IHBvcFVwU3RhdHVzID0gMDsgLy8gMDogaGlkZGVuLCAxOiB2aXNpYmxlXG4gICAgICBjb25zdCBhcnJvd01hcmdpbiA9IDI3OyAvLyBTZWUgYXNzZXQuc3R5bC4gJGJhbGxvb24tdHJpYW5nbGUtc2l6ZSA9IDExcHgsICRiYWxsb29uLXRyaWFuZ2xlLWxlZnQgPSAxNnB4XG4gIFxuICAgICAgJHQub24oXCJtb3VzZWVudGVyXCIsIChlKSA9PiB7XG4gICAgICAgIGxldCBzZWxmID0gJHQ7XG4gICAgICAgIGxldCB6SW5kZXggPSA5OTk5O1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2FsY1Bvc2l0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICBsZXQgdG9wLGxlZnQ7XG4gIFxuICAgICAgICAgIHN3aXRjaChzZXR0aW5nLnBsYWNlbWVudCl7XG4gICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpICsgc2VsZi5oZWlnaHQoKSArIHNldHRpbmcubWFyZ2luVG9wO1xuICAgICAgICAgICAgICBsZWZ0ID0gc2VsZi5vZmZzZXQoKS5sZWZ0IC0gJGRvY3VtZW50LnNjcm9sbExlZnQoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5MZWZ0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICR3cmFwcGVyLmNzcyh7dG9wOiAwLCBsZWZ0OiAwfSk7IC8vIFByZXZlbnQgY29udGVudHMgd3JhcHBpbmcgYmVmb3JlIGNhbGN1bGF0aW5nICR3cmFwcGVyLndpZHRoKClcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luVG9wO1xuICAgICAgICAgICAgICBsZWZ0ID0gc2VsZi5vZmZzZXQoKS5sZWZ0IC0gJGRvY3VtZW50LnNjcm9sbExlZnQoKSAtICR3cmFwcGVyLndpZHRoKCkgLSBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gIFxuICAgICAgICAgICAgICBsZXQgd3JhcHBlcl9oZWlnaHQgPSAkd3JhcHBlci5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgY29uc3QgcmVtYWluID0gKHRvcCArIHdyYXBwZXJfaGVpZ2h0KSAtIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgICAgaWYocmVtYWluID4gMCl7XG4gICAgICAgICAgICAgICAgdG9wID0gdG9wIC0gd3JhcHBlcl9oZWlnaHQgKyBhcnJvd01hcmdpbiAqIDI7XG4gICAgICAgICAgICAgICAgJGJhbGxvb24uYWRkQ2xhc3MoXCJ1cHBlclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICRiYWxsb29uLnJlbW92ZUNsYXNzKFwidXBwZXJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHt0b3A6IDAsIHJpZ2h0OiAwfSk7IC8vIFByZXZlbnQgY29udGVudHMgd3JhcHBpbmcgYmVmb3JlIGNhbGN1bGF0aW5nICR3cmFwcGVyLndpZHRoKClcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luVG9wO1xuICAgICAgICAgICAgICBsZWZ0ID0gc2VsZi5vZmZzZXQoKS5sZWZ0IC0gJGRvY3VtZW50LnNjcm9sbExlZnQoKSArIHNlbGYud2lkdGgoKSAtIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICByZXR1cm4ge3RvcCwgbGVmdH07XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBsZXQgcG9zaXRpb24gPSBjYWxjUG9zaXRpb24oKTtcbiAgICAgICAgXG4gICAgICAgICR3cmFwcGVyXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICBcInRvcFwiOiBwb3NpdGlvbi50b3AsXG4gICAgICAgICAgICBcImxlZnRcIjogcG9zaXRpb24ubGVmdCxcbiAgICAgICAgICAgIFwiei1pbmRleFwiOiB6SW5kZXgsXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogMVxuICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcG9wVXBTdGF0dXMgPSAxO1xuICBcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwic2Nyb2xsLmJhbGxvb25cIiwgKGUpID0+IHtcbiAgICAgICAgICBsZXQgcG9zaXRpb24gPSBjYWxjUG9zaXRpb24oKTtcbiAgICAgICAgICAkd3JhcHBlci5jc3Moe1xuICAgICAgICAgICAgdG9wOiBwb3NpdGlvbi50b3AsXG4gICAgICAgICAgICBsZWZ0OiBwb3NpdGlvbi5sZWZ0XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gIFxuICAgICAgfSk7XG4gICAgICBcbiAgICAgICR0Lm9uKFwibW91c2VsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgICAkd3JhcHBlci5jc3Moe1xuICAgICAgICAgIFwib3BhY2l0eVwiOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcG9wVXBTdGF0dXMgPSAwO1xuICAgICAgICBcbiAgICAgICAgJCh3aW5kb3cpLm9mZihcInNjcm9sbC5iYWxsb29uXCIpO1xuICAgICAgfSk7XG4gIFxuICAgICAgJHQub24oXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmRcIiwgKGUpID0+IHtcbiAgICAgICAgaWYocG9wVXBTdGF0dXMgPT09IDApe1xuICAgICAgICAgICR3cmFwcGVyLmNzcyhcInotaW5kZXhcIiwgLTEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0oalF1ZXJ5KSk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBoZWFkZXJcIjtcbiAgICBcbiAgICB0aGlzLnN0aWNreSgpO1xuICB9XG4gIFxuICBzdGlja3koKXtcbiAgICBsZXQgc2Nyb2xsRG93blRocmVzaG9sZCA9IDIwMDtcbiAgICBsZXQgc2Nyb2xsVXBUaHJlc2hvbGQgPSAxMDA7XG4gICAgbGV0IG1lZGlhUXVlcnlTdHJpbmcgPSBcIihtaW4td2lkdGg6IDEyMDBweCksIChtaW4td2lkdGg6IDgwMHB4KSBhbmQgKG1heC13aWR0aDogMTE5OXB4KVwiO1xuICAgIFxuICAgIGxldCAkd2luZG93ID0gJCh3aW5kb3cpO1xuICAgIGxldCBoZWFkZXIgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGxldCByZXNpemluZyA9IGZhbHNlO1xuICBcbiAgICBjb25zdCBvblRyYW5zaXRpb25FbmQgPSAoZSkgPT4ge1xuICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwiZGlzYWJsZS1oZWlnaHQtYW5pbWF0aW9uXCIpO1xuICAgICAgcmVzaXppbmcgPSBmYWxzZTtcbiAgICB9O1xuICBcbiAgICBoZWFkZXIub24oXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmRcIiwgb25UcmFuc2l0aW9uRW5kKTtcbiAgXG4gICAgJHdpbmRvdy5vbihcInNjcm9sbFwiLCAoZSkgPT4ge1xuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnlTdHJpbmcpLm1hdGNoZXMgfHwgcmVzaXppbmcpIHJldHVybjtcbiAgICBcbiAgICAgIGNvbnN0IHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgXG4gICAgICBpZihzY3JvbGxVcFRocmVzaG9sZCA8IHNjcm9sbFRvcCAmJiBzY3JvbGxUb3AgPCBzY3JvbGxEb3duVGhyZXNob2xkKXtcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJzY3JvbGwtbWFyZ2luXCIpKSBoZWFkZXIuYWRkQ2xhc3MoXCJzY3JvbGwtbWFyZ2luXCIpO1xuICAgICAgXG4gICAgICAgIGxldCBoZWFkZXJfaGVpZ2h0ID0gMzAwICsgMjAgLSBzY3JvbGxUb3A7XG4gICAgICAgIGhlYWRlci5jc3Moe1xuICAgICAgICAgIGhlaWdodDogaGVhZGVyX2hlaWdodCxcbiAgICAgICAgICBib3R0b206IGBjYWxjKDEwMCUgLSAke2hlYWRlcl9oZWlnaHR9cHgpYFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICBcbiAgICAgIGlmKHNjcm9sbFRvcCA+PSBzY3JvbGxEb3duVGhyZXNob2xkKXtcbiAgICAgICAgaWYoaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBoZWFkZXIuYWRkQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHNjcm9sbFRvcCA8PSBzY3JvbGxVcFRocmVzaG9sZCl7XG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xuICAgICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJzY3JvbGwtbWFyZ2luXCIpO1xuICAgICAgXG4gICAgICAgIHJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgaGVhZGVyLmFkZENsYXNzKFwiZGlzYWJsZS1oZWlnaHQtYW5pbWF0aW9uXCIpO1xuICAgICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZWJhciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IG1haW4gPiBuYXZcIjtcbiAgICBcbiAgICB0aGlzLmluaXRUb2dnbGVCdXR0b24oKTtcbiAgICB0aGlzLmJ1aWxkRW1haWxBZGRyZXNzKCk7XG4gICAgdGhpcy5idWlsZEJhbGxvb24oKTtcbiAgICB0aGlzLnNldEhlYWRsaW5lKCk7XG4gICAgdGhpcy53cmFwSGVhZGxpbmUoKTtcbiAgICB0aGlzLnNldHVwTGFuZ0J1dHRvbigpO1xuICB9XG4gIFxuICB3cmFwSGVhZGxpbmUoKXtcbiAgICBsZXQgaGVhZGxpbmVUaXRsZSA9ICQodGhpcy5zZWxlY3RvcikuZmluZChcIi5oZWFkbGluZSAuaGVhZGxpbmUtdGl0bGVcIik7XG4gICAgaGVhZGxpbmVUaXRsZS5kb3Rkb3Rkb3Qoe1xuICAgICAgdHJ1bmNhdGU6IFwibGV0dGVyXCIsXG4gICAgICB3YXRjaDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlSGVhZGxpbmVJdGVtKHVybCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBwdWJsaXNoZWRfdGltZSl7XG4gICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0naGVhZGxpbmUtaXRlbSc+XCIpO1xuICAgICRjb250YWluZXJcbiAgICAgIC5hcHBlbmQoXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdoZWFkbGluZS10aXRsZSc+XCIpLmFwcGVuZChcbiAgICAgICAgICBgPGEgaHJlZj1cIiR7dXJsfVwiICR7ZGVzY3JpcHRpb24gPyAndGl0bGU9XCInK2Rlc2NyaXB0aW9uKydcIic6Jyd9XCI+JHt0aXRsZX08L2E+YFxuICAgICAgICApXG4gICAgICApXG4gICAgICAuYXBwZW5kKGA8ZGl2IGNsYXNzPSdoZWFkbGluZS1tZXRhJz4ke3B1Ymxpc2hlZF90aW1lfTwvZGl2PmApXG4gICAgO1xuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH1cblxuICBzZXRIZWFkbGluZSgpe1xuICAgIGNvbnN0IGFydGljbGVzID0gJCRhcnRpY2xlX2xpc3QoKTsgLy8gQ29tZXMgZnJvbSBleHRlcm5hbCA8c2NyaXB0PiB0YWcuXG4gICAgaWYoIWFydGljbGVzKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYW5nID0gJChcImh0bWxcIikuYXR0cihcImxhbmdcIikgfHwgXCJqYVwiO1xuICAgIGNvbnN0IGFydGljbGVfdHJlZSA9IGFydGljbGVzW2xhbmddO1xuXG4gICAgY29uc3QgYWN0aXZlX3RvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnNlY3Rpb24nXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCBhY3RpdmVfc3VidG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6dGFnJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG5cbiAgICBjb25zdCAkdG9waWNfY29udGFpbmVyID0gJChcIiN0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcblxuICAgIE9iamVjdC5rZXlzKGFydGljbGVfdHJlZSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0ICR0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG5cbiAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3RvcGljIHx8ICghYWN0aXZlX3RvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICR0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cblxuICAgICAgJHRvcGljX2NvbnRhaW5lci5hcHBlbmQoJHRvcGljKTtcbiAgICB9KTtcblxuICAgIGlmKCFhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgJHN1YnRvcGljX2NvbnRhaW5lciA9ICQoXCIjc3VidG9waWMtbGlzdFwiKS5maW5kKFwiLnRhZ3NcIik7XG5cbiAgICBPYmplY3Qua2V5cyhhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0ICRzdWJ0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG5cbiAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3N1YnRvcGljIHx8ICghYWN0aXZlX3N1YnRvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICRzdWJ0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cblxuICAgICAgJHN1YnRvcGljX2NvbnRhaW5lci5hcHBlbmQoJHN1YnRvcGljKTtcbiAgICB9KTtcblxuICAgIGlmKCFhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXVthY3RpdmVfc3VidG9waWNdKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCAkYXJ0aWNsZV9jb250YWluZXIgPSAkKFwiI2FydGljbGUtbGlzdFwiKS5maW5kKFwiLmhlYWRsaW5lXCIpO1xuXG4gICAgT2JqZWN0LmtleXMoYXJ0aWNsZV90cmVlW2FjdGl2ZV90b3BpY11bYWN0aXZlX3N1YnRvcGljXSkuZm9yRWFjaCgodiwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBhcnRpY2xlID0gYXJ0aWNsZV90cmVlW2FjdGl2ZV90b3BpY11bYWN0aXZlX3N1YnRvcGljXVt2XTtcbiAgICAgIGxldCBhcnRpY2xlX2R0aW1lID0gKG5ldyBEYXRlKGFydGljbGUucHVibGlzaGVkX3RpbWUpKVxuICAgICAgICAudG9Mb2NhbGVEYXRlU3RyaW5nKGxhbmcsIHt5ZWFyOiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wifSk7XG5cbiAgICAgIGxldCAkaGVhZGxpbmUgPSB0aGlzLmNyZWF0ZUhlYWRsaW5lSXRlbShcIiNcIiwgYXJ0aWNsZS50aXRsZSwgYXJ0aWNsZS5kZXNjcmlwdGlvbiwgYXJ0aWNsZV9kdGltZSk7XG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKCRoZWFkbGluZSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGluaXRUb2dnbGVCdXR0b24oKXtcbiAgICBsZXQgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gICAgbGV0ICRzaWRlYmFyID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBsZXQgJHRhZ3MgPSAkc2lkZWJhci5maW5kKFwiLnRhZ3NcIik7XG4gICAgbGV0ICRidXR0b24gPSAkKFwiI3NpZGViYXItdG9nZ2xlLWJ1dHRvblwiKTtcbiAgICBcbiAgICBjb25zdCBjbG9zZVNpZGViYXIgPSAoZSkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZyBpZiBvdXRzaWRlIG9mIHNpZGViYXIgaGFzIGJlZW4gY2xpY2tlZC5cbiAgICAgIC8vIEhvd2V2ZXIsIGlmIHNjcmVlbiBzaXplIGlzIGZvciBtb2JpbGUsIGNsb3NlIHNpZGViYXIgd2hlcmV2ZXIgaXMgY2xpY2tlZC5cbiAgICAgIGlmKCF3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc5OXB4KVwiKS5tYXRjaGVzICYmXG4gICAgICAgICRzaWRlYmFyLmlzKGUudGFyZ2V0KSB8fCAkc2lkZWJhci5oYXMoZS50YXJnZXQpLmxlbmd0aCA+IDApe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gIFxuICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgIH07XG4gICAgXG4gICAgY29uc3Qgb25Ub2dnbGVCdXR0b25DbGlja2VkID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBcbiAgICAgIGlmKCRzaWRlYmFyLmhhc0NsYXNzKFwidmlzaWJsZVwiKSl7XG4gICAgICAgICRzaWRlYmFyLnJlbW92ZUNsYXNzKFwidmlzaWJsZVwiKTtcbiAgICAgICAgJGRvY3VtZW50Lm9mZihcImNsaWNrLmNsb3NlU2lkZWJhclwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgICRzaWRlYmFyLmFkZENsYXNzKFwidmlzaWJsZVwiKTtcbiAgICAgICAgJGRvY3VtZW50Lm9uKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIsIGNsb3NlU2lkZWJhcik7XG4gICAgICB9XG4gICAgfTtcbiAgXG4gICAgJGJ1dHRvbi5vbihcImNsaWNrXCIsIG9uVG9nZ2xlQnV0dG9uQ2xpY2tlZCk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBQcmV2ZW50aW5nIGVtYWlsIHNwYW1cbiAgICovXG4gIGJ1aWxkRW1haWxBZGRyZXNzKCl7XG4gICAgbGV0IHBhZ2VPcGVuZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBsZXQgaXNBbHJlYWR5QnVpbHQgPSBmYWxzZTtcbiAgICBsZXQgJGVtYWlsID0gJChcIi5wcm9maWxlIC5zb2NpYWwgLmVtYWlsXCIpO1xuICAgIFxuICAgIGNvbnN0IGFkZHIgPSBbODA1OSwgNjA4OCwgNzE2MywgNTA2MywgNzM4NCwgLTI4MjEsIDU4NzksIDYwODgsIDcxNjMsIDQ0NzIsIDgyODgsIDUyNjQsIC0zMDg4LCA1NjcyLCA2MDg4LCA4NTE5LCA1ODc5LCA4NzUyLCA0NjY3LCA3NjA3LCA0NDcyLCA1NjcyLCA1MjY0LCA4Mjg4LCAtODQxLCA1NjcyLCA2OTQ0LCA0NDcyLCA2MDg4LCA2NzI3LCAtMjgyMSwgNDg2NCwgNzM4NCwgNjk0NF07XG4gICAgXG4gICAgY29uc3QgbWFrZUFkZHJlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYoaXNBbHJlYWR5QnVpbHQgJiYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gcGFnZU9wZW5lZCkgPiAxNTAwKSByZXR1cm47XG4gICAgICBcbiAgICAgICRlbWFpbC5hdHRyKFwiaHJlZlwiLCBcIm1haWx0bzpcIiArIGFkZHIubWFwKGZ1bmN0aW9uKHYpe1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShNYXRoLnNxcnQodis0OTM3KSlcbiAgICAgIH0pLmpvaW4oXCJcIikpO1xuICAgIH07XG4gICAgXG4gICAgJGVtYWlsLm9uKFwibW91c2VvdmVyIHRvdWNoc3RhcnRcIiwgbWFrZUFkZHJlc3MpO1xuICB9XG4gIFxuICBidWlsZEJhbGxvb24oKXtcbiAgICAkKHRoaXMuc2VsZWN0b3IgKyBcIiBbZGF0YS1iYWxsb29uXVwiKS5iYWxsb29uKHtcbiAgICAgIHBsYWNlbWVudDogXCJsZWZ0XCIsXG4gICAgICBjb2xvcjogXCJibGFja1wiLFxuICAgICAgbWFyZ2luVG9wOiAkKFwiLnByb2ZpbGUtYXR0cmlidXRlXCIpLmhlaWdodCgpIC8gMlxuICAgIH0pO1xuICB9XG5cbiAgc2V0dXBMYW5nQnV0dG9uKCl7XG4gICAgY29uc3QgJGFua2VyID0gJChcIi5sYW5ndWFnZS5wcm9maWxlLWF0dHJpYnV0ZSBhW2RhdGEtbGFuZ11cIik7XG4gICAgY29uc3QgY3VycmVudF9sYW5nID0gJChcImh0bWxcIikuYXR0cihcImxhbmdcIik7XG4gICAgY29uc3QgYXJ0aWNsZV9pZCA9ICQoXCJoZWFkID4gbWV0YVtuYW1lPSdhcnRpY2xlSUQnXVtjb250ZW50XVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCB0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpzZWN0aW9uJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3Qgc3VidG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6dGFnJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgbGV0IGFydGljbGUgPSAkJGFydGljbGVfbGlzdCgpW2N1cnJlbnRfbGFuZ11bdG9waWNdW3N1YnRvcGljXVthcnRpY2xlX2lkXTtcbiAgICBsZXQgYmFzZWRpciA9IC9eKC4rKVsvXShbXi9dKikkLy5leGVjKGFydGljbGUucGF0aClbMV07XG5cbiAgICAkYW5rZXIuZWFjaChmdW5jdGlvbigpe1xuICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgdGFyZ2V0X2xhbmcgPSAkdGhpcy5kYXRhKFwibGFuZ1wiKTtcblxuICAgICAgdHJ5e1xuICAgICAgICAkdGhpcy5hdHRyKFwiaHJlZlwiLCBgLyR7YmFzZWRpcn0vJHthcnRpY2xlX2lkfV8ke3RhcmdldF9sYW5nfS5odG1sYCk7XG4gICAgICB9XG4gICAgICBjYXRjaChlKXtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBtYWluID4gYXJ0aWNsZVwiO1xuXG4gICAgdGhpcy5idWlsZEFydGljbGVIZWFkZXIoKTtcbiAgfVxuXG4gIGJ1aWxkQXJ0aWNsZUhlYWRlcigpe1xuICAgIGNvbnN0ICRhcnRpY2xlID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBjb25zdCAkaGVhZGVyID0gJGFydGljbGUuZmluZChcIi5hcnRpY2xlLWhlYWRlclwiKTtcbiAgICBjb25zdCBsYW5nID0gJChcImh0bWxcIikuYXR0cihcImxhbmdcIikgfHwgXCJqYVwiO1xuICAgIGNvbnN0IHRpdGxlID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdvZzp0aXRsZSddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnNlY3Rpb24nXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCBzdWJ0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTp0YWcnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBsZXQgcHVibGlzaGVkX3RpbWUgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6cHVibGlzaGVkX3RpbWUnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcblxuICAgIHB1Ymxpc2hlZF90aW1lID0gKG5ldyBEYXRlKERhdGUucGFyc2UocHVibGlzaGVkX3RpbWUpKSlcbiAgICAgIC50b0xvY2FsZURhdGVTdHJpbmcobGFuZywge1xuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgbW9udGg6IFwibG9uZ1wiLFxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiXG4gICAgICB9KTtcblxuICAgIGxldCBoZWFkZXJfc3RyaW5nID0gYFxuICAgICAgPGRpdiBjbGFzcz0ndGFncyc+XG4gICAgICAgIDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dG9waWN9PC9zcGFuPlxuICAgICAgICA8YT48c3BhbiBjbGFzcz0ndGFnJz4ke3N1YnRvcGljfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGgxIGNsYXNzPSdhcnRpY2xlLXRpdGxlJz4ke3RpdGxlfTwvaDE+XG4gICAgICA8ZGl2IGNsYXNzPSdhcnRpY2xlLWRhdGUnPlxuICAgICAgPGkgY2xhc3M9J2ZhIGZhLWNsb2NrLW8nPjwvaT4gJHtwdWJsaXNoZWRfdGltZX08L2Rpdj5cbiAgICBgO1xuXG4gICAgJGhlYWRlci5odG1sKGhlYWRlcl9zdHJpbmcpO1xuICB9XG59XG4iLCJpbXBvcnQgXCIuL2Fzc2V0XCI7XG5pbXBvcnQgSGVhZGVyIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZGVyXCI7XG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9jb21wb25lbnRzL3NpZGViYXJcIjtcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRzXCI7XG5cbmNvbnN0IG1haW4gPSBmdW5jdGlvbigpe1xuICBjb25zdCBoZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gIGNvbnN0IHNpZGViYXIgPSBuZXcgU2lkZWJhcigpO1xuICBjb25zdCBjb250ZW50ID0gbmV3IENvbnRlbnQoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
