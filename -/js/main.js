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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb250ZW50cy9pbmRleC5qcyIsInNzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7OztBQ0FBOzs7O0FBSUMsV0FBUyxDQUFULEVBQVc7QUFDVixJQUFFLEVBQUYsQ0FBSyxPQUFMLEdBQWUsVUFBUyxJQUFULEVBQWM7QUFDM0IsUUFBTSxVQUFVLEVBQUUsTUFBRixDQUFTO0FBQ3ZCLG1CQUFhLE1BRFU7QUFFdkIsZUFBUyxTQUZjO0FBR3ZCLG1CQUFhLENBSFU7QUFJdkIsb0JBQWM7QUFKUyxLQUFULEVBS2IsSUFMYSxDQUFoQjs7QUFPQSxRQUFHLENBQUMsQ0FBQyxRQUFELEVBQVUsT0FBVixFQUFrQixNQUFsQixFQUEwQixRQUExQixDQUFtQyxRQUFRLFNBQTNDLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7QUFDRCxRQUFHLENBQUMsQ0FBQyxTQUFELEVBQVcsT0FBWCxFQUFtQixTQUFuQixFQUE4QixRQUE5QixDQUF1QyxRQUFRLEtBQS9DLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBTSxzQkFBc0I7QUFDMUIsa0JBQVksT0FEYztBQUUxQixpQkFBVyxDQUZlO0FBRzFCLGlCQUFXLENBQUMsQ0FIYztBQUkxQixvQkFBYztBQUpZLEtBQTVCOztBQU9BLFFBQUksWUFBWSxFQUFFLFFBQUYsQ0FBaEI7O0FBRUEsU0FBSyxJQUFMLENBQVUsWUFB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LElBQVQsQ0FBYyxpQkFBZCxDQUFoQjtBQUNBLFVBQU0sT0FBTyxFQUFFLE1BQUYsRUFBVSxJQUFWLENBQWUsTUFBZixLQUEwQixJQUF2QztBQUNBLFVBQU0sUUFBUSxFQUFFLGtDQUFGLEVBQXNDLElBQXRDLENBQTJDLFNBQTNDLENBQWQ7QUFDQSxVQUFNLFFBQVEsRUFBRSx5Q0FBRixFQUE2QyxJQUE3QyxDQUFrRCxTQUFsRCxDQUFkO0FBQ0EsVUFBTSxXQUFXLEVBQUUscUNBQUYsRUFBeUMsSUFBekMsQ0FBOEMsU0FBOUMsQ0FBakI7QUFDQSxVQUFJLGlCQUFpQixFQUFFLGdEQUFGLEVBQW9ELElBQXBELENBQXlELFNBQXpELENBQXJCOztBQUVBLHVCQUFrQixJQUFJLElBQUosQ0FBUyxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQVQsQ0FBRCxDQUNkLGtCQURjLENBQ0ssSUFETCxFQUNXO0FBQ3hCLGNBQU0sU0FEa0I7QUFFeEIsZUFBTyxNQUZpQjtBQUd4QixhQUFLO0FBSG1CLE9BRFgsQ0FBakI7O0FBT0EsVUFBSSw4RUFFdUIsS0FGdkIsOENBR3VCLFFBSHZCLCtEQUswQixLQUwxQixxRkFPOEIsY0FQOUIsaUJBQUo7O0FBVUEsY0FBUSxJQUFSLENBQWEsYUFBYjtBQUNEOzs7Ozs7a0JBbENrQixPOzs7OztBQ0FyQjs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU8sR0FBVTtBQUNyQixNQUFNLFNBQVMsc0JBQWY7QUFDQSxNQUFNLFVBQVUsdUJBQWhCO0FBQ0EsTUFBTSxVQUFVLHdCQUFoQjtBQUNELENBSkQ7O0FBTUEsRUFBRSxJQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9zdGFuZGFyZCc7XG4iLCIvKipcbiAqIEF1dG8gZGlzcGxheSBiYWxsb29uIGZvciBlbGVtZW50c1xuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG4oZnVuY3Rpb24oJCl7XG4gICQuZm4uYmFsbG9vbiA9IGZ1bmN0aW9uKG9wdHMpe1xuICAgIGNvbnN0IHNldHRpbmcgPSAkLmV4dGVuZCh7XG4gICAgICBcInBsYWNlbWVudFwiOiBcImxlZnRcIixcbiAgICAgIFwiY29sb3JcIjogdW5kZWZpbmVkLFxuICAgICAgXCJtYXJnaW5Ub3BcIjogMCxcbiAgICAgIFwibWFyZ2luTGVmdFwiOiAwXG4gICAgfSwgb3B0cyk7XG4gICAgXG4gICAgaWYoIVtcImJvdHRvbVwiLFwicmlnaHRcIixcImxlZnRcIl0uaW5jbHVkZXMoc2V0dGluZy5wbGFjZW1lbnQpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGxhY2VtZW50LlwiKTtcbiAgICB9XG4gICAgaWYoIVtcImRlZmF1bHRcIixcImJsYWNrXCIsdW5kZWZpbmVkXS5pbmNsdWRlcyhzZXR0aW5nLmNvbG9yKSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yLlwiKTtcbiAgICB9XG4gIFxuICAgIGNvbnN0IHdyYXBwZXJJbml0aWFsU3R5bGUgPSB7XG4gICAgICBcInBvc2l0aW9uXCI6IFwiZml4ZWRcIixcbiAgICAgIFwib3BhY2l0eVwiOiAwLFxuICAgICAgXCJ6LWluZGV4XCI6IC0xLFxuICAgICAgXCJ0cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBlYXNlIC4zc1wiXG4gICAgfTtcbiAgICBcbiAgICBsZXQgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gIFxuICAgIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgbGV0ICR0ID0gJCh0aGlzKTtcbiAgICAgIGxldCAkY29udGVudHMgPSAkdC5maW5kKFwiLmJhbGxvb24tY29udGVudHNcIik7XG4gICAgICBcbiAgICAgIGlmKCEkY29udGVudHMgfHwgJGNvbnRlbnRzLmxlbmd0aCA8IDEpe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgXG4gICAgICBjb25zdCAkYmFsbG9vbiA9ICQoXCI8ZGl2PlwiKVxuICAgICAgICAuYWRkQ2xhc3MoXCJiYWxsb29uXCIpXG4gICAgICAgIC5hZGRDbGFzcyhzZXR0aW5nLnBsYWNlbWVudClcbiAgICAgICAgLmh0bWwoJGNvbnRlbnRzLmh0bWwoKSk7XG4gICAgICBcbiAgICAgIGlmKHNldHRpbmcuY29sb3Ipe1xuICAgICAgICAkYmFsbG9vbi5hZGRDbGFzcyhzZXR0aW5nLmNvbG9yKTtcbiAgICAgIH1cbiAgICBcbiAgICAgIGNvbnN0ICR3cmFwcGVyID0gJChcIjxkaXY+XCIpLmNzcyh3cmFwcGVySW5pdGlhbFN0eWxlKTtcbiAgICBcbiAgICAgICR3cmFwcGVyLmFwcGVuZCgkYmFsbG9vbik7XG4gICAgICAkdC5hcHBlbmQoJHdyYXBwZXIpO1xuICAgICAgJGNvbnRlbnRzLnJlbW92ZSgpO1xuICBcbiAgICAgIGxldCBwb3BVcFN0YXR1cyA9IDA7IC8vIDA6IGhpZGRlbiwgMTogdmlzaWJsZVxuICAgICAgY29uc3QgYXJyb3dNYXJnaW4gPSAyNzsgLy8gU2VlIGFzc2V0LnN0eWwuICRiYWxsb29uLXRyaWFuZ2xlLXNpemUgPSAxMXB4LCAkYmFsbG9vbi10cmlhbmdsZS1sZWZ0ID0gMTZweFxuICBcbiAgICAgICR0Lm9uKFwibW91c2VlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgICBsZXQgc2VsZiA9ICR0O1xuICAgICAgICBsZXQgekluZGV4ID0gOTk5OTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGNhbGNQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGV0IHRvcCxsZWZ0O1xuICBcbiAgICAgICAgICBzd2l0Y2goc2V0dGluZy5wbGFjZW1lbnQpe1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSArIHNlbGYuaGVpZ2h0KCkgKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAkd3JhcHBlci5jc3Moe3RvcDogMCwgbGVmdDogMH0pOyAvLyBQcmV2ZW50IGNvbnRlbnRzIHdyYXBwaW5nIGJlZm9yZSBjYWxjdWxhdGluZyAkd3JhcHBlci53aWR0aCgpXG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLSAkd3JhcHBlci53aWR0aCgpIC0gc2V0dGluZy5tYXJnaW5MZWZ0O1xuICBcbiAgICAgICAgICAgICAgbGV0IHdyYXBwZXJfaGVpZ2h0ID0gJHdyYXBwZXIuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbWFpbiA9ICh0b3AgKyB3cmFwcGVyX2hlaWdodCkgLSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgIGlmKHJlbWFpbiA+IDApe1xuICAgICAgICAgICAgICAgIHRvcCA9IHRvcCAtIHdyYXBwZXJfaGVpZ2h0ICsgYXJyb3dNYXJnaW4gKiAyO1xuICAgICAgICAgICAgICAgICRiYWxsb29uLmFkZENsYXNzKFwidXBwZXJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkYmFsbG9vbi5yZW1vdmVDbGFzcyhcInVwcGVyXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICR3cmFwcGVyLmNzcyh7dG9wOiAwLCByaWdodDogMH0pOyAvLyBQcmV2ZW50IGNvbnRlbnRzIHdyYXBwaW5nIGJlZm9yZSBjYWxjdWxhdGluZyAkd3JhcHBlci53aWR0aCgpXG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgKyBzZWxmLndpZHRoKCkgLSBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgcmV0dXJuIHt0b3AsIGxlZnR9O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgIFxuICAgICAgICAkd3JhcHBlclxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgXCJ0b3BcIjogcG9zaXRpb24udG9wLFxuICAgICAgICAgICAgXCJsZWZ0XCI6IHBvc2l0aW9uLmxlZnQsXG4gICAgICAgICAgICBcInotaW5kZXhcIjogekluZGV4LFxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHBvcFVwU3RhdHVzID0gMTtcbiAgXG4gICAgICAgICQod2luZG93KS5vbihcInNjcm9sbC5iYWxsb29uXCIsIChlKSA9PiB7XG4gICAgICAgICAgbGV0IHBvc2l0aW9uID0gY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgICAgJHdyYXBwZXIuY3NzKHtcbiAgICAgICAgICAgIHRvcDogcG9zaXRpb24udG9wLFxuICAgICAgICAgICAgbGVmdDogcG9zaXRpb24ubGVmdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICBcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAkdC5vbihcIm1vdXNlbGVhdmVcIiwgKGUpID0+IHtcbiAgICAgICAgJHdyYXBwZXIuY3NzKHtcbiAgICAgICAgICBcIm9wYWNpdHlcIjogMFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHBvcFVwU3RhdHVzID0gMDtcbiAgICAgICAgXG4gICAgICAgICQod2luZG93KS5vZmYoXCJzY3JvbGwuYmFsbG9vblwiKTtcbiAgICAgIH0pO1xuICBcbiAgICAgICR0Lm9uKFwidHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kXCIsIChlKSA9PiB7XG4gICAgICAgIGlmKHBvcFVwU3RhdHVzID09PSAwKXtcbiAgICAgICAgICAkd3JhcHBlci5jc3MoXCJ6LWluZGV4XCIsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KGpRdWVyeSkpO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gaGVhZGVyXCI7XG4gICAgXG4gICAgdGhpcy5zdGlja3koKTtcbiAgfVxuICBcbiAgc3RpY2t5KCl7XG4gICAgbGV0IHNjcm9sbERvd25UaHJlc2hvbGQgPSAyMDA7XG4gICAgbGV0IHNjcm9sbFVwVGhyZXNob2xkID0gMTAwO1xuICAgIGxldCBtZWRpYVF1ZXJ5U3RyaW5nID0gXCIobWluLXdpZHRoOiAxMjAwcHgpLCAobWluLXdpZHRoOiA4MDBweCkgYW5kIChtYXgtd2lkdGg6IDExOTlweClcIjtcbiAgICBcbiAgICBsZXQgJHdpbmRvdyA9ICQod2luZG93KTtcbiAgICBsZXQgaGVhZGVyID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBsZXQgcmVzaXppbmcgPSBmYWxzZTtcbiAgXG4gICAgY29uc3Qgb25UcmFuc2l0aW9uRW5kID0gKGUpID0+IHtcbiAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcImRpc2FibGUtaGVpZ2h0LWFuaW1hdGlvblwiKTtcbiAgICAgIHJlc2l6aW5nID0gZmFsc2U7XG4gICAgfTtcbiAgXG4gICAgaGVhZGVyLm9uKFwidHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kXCIsIG9uVHJhbnNpdGlvbkVuZCk7XG4gIFxuICAgICR3aW5kb3cub24oXCJzY3JvbGxcIiwgKGUpID0+IHtcbiAgICAgIGlmKCF3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5U3RyaW5nKS5tYXRjaGVzIHx8IHJlc2l6aW5nKSByZXR1cm47XG4gICAgXG4gICAgICBjb25zdCBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgIFxuICAgICAgaWYoc2Nyb2xsVXBUaHJlc2hvbGQgPCBzY3JvbGxUb3AgJiYgc2Nyb2xsVG9wIDwgc2Nyb2xsRG93blRocmVzaG9sZCl7XG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwic2Nyb2xsLW1hcmdpblwiKSkgaGVhZGVyLmFkZENsYXNzKFwic2Nyb2xsLW1hcmdpblwiKTtcbiAgICAgIFxuICAgICAgICBsZXQgaGVhZGVyX2hlaWdodCA9IDMwMCArIDIwIC0gc2Nyb2xsVG9wO1xuICAgICAgICBoZWFkZXIuY3NzKHtcbiAgICAgICAgICBoZWlnaHQ6IGhlYWRlcl9oZWlnaHQsXG4gICAgICAgICAgYm90dG9tOiBgY2FsYygxMDAlIC0gJHtoZWFkZXJfaGVpZ2h0fXB4KWBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgXG4gICAgICBpZihzY3JvbGxUb3AgPj0gc2Nyb2xsRG93blRocmVzaG9sZCl7XG4gICAgICAgIGlmKGhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIHJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgaGVhZGVyLmFkZENsYXNzKFwiZml4ZWQtaGVhZGVyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihzY3JvbGxUb3AgPD0gc2Nyb2xsVXBUaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaGVhZGVyLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcbiAgICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwic2Nyb2xsLW1hcmdpblwiKTtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImRpc2FibGUtaGVpZ2h0LWFuaW1hdGlvblwiKTtcbiAgICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwiZml4ZWQtaGVhZGVyXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBtYWluID4gbmF2XCI7XG4gICAgXG4gICAgdGhpcy5pbml0VG9nZ2xlQnV0dG9uKCk7XG4gICAgdGhpcy5idWlsZEVtYWlsQWRkcmVzcygpO1xuICAgIHRoaXMuYnVpbGRCYWxsb29uKCk7XG4gICAgdGhpcy5zZXRIZWFkbGluZSgpO1xuICAgIHRoaXMud3JhcEhlYWRsaW5lKCk7XG4gICAgdGhpcy5zZXR1cExhbmdCdXR0b24oKTtcbiAgfVxuICBcbiAgd3JhcEhlYWRsaW5lKCl7XG4gICAgbGV0IGhlYWRsaW5lVGl0bGUgPSAkKHRoaXMuc2VsZWN0b3IpLmZpbmQoXCIuaGVhZGxpbmUgLmhlYWRsaW5lLXRpdGxlXCIpO1xuICAgIGhlYWRsaW5lVGl0bGUuZG90ZG90ZG90KHtcbiAgICAgIHRydW5jYXRlOiBcImxldHRlclwiLFxuICAgICAgd2F0Y2g6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRsaW5lSXRlbSh1cmwsIHRpdGxlLCBkZXNjcmlwdGlvbiwgcHVibGlzaGVkX3RpbWUpe1xuICAgIGxldCAkY29udGFpbmVyID0gJChcIjxkaXYgY2xhc3M9J2hlYWRsaW5lLWl0ZW0nPlwiKTtcbiAgICAkY29udGFpbmVyXG4gICAgICAuYXBwZW5kKFxuICAgICAgICAkKFwiPGRpdiBjbGFzcz0naGVhZGxpbmUtdGl0bGUnPlwiKS5hcHBlbmQoXG4gICAgICAgICAgYDxhIGhyZWY9XCIke3VybH1cIiAke2Rlc2NyaXB0aW9uID8gJ3RpdGxlPScrZGVzY3JpcHRpb246Jyd9XCI+JHt0aXRsZX08L2E+YFxuICAgICAgICApXG4gICAgICApXG4gICAgICAuYXBwZW5kKGA8ZGl2IGNsYXNzPSdoZWFkbGluZS1tZXRhJz4ke3B1Ymxpc2hlZF90aW1lfTwvZGl2PmApXG4gICAgO1xuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH1cblxuICBzZXRIZWFkbGluZSgpe1xuICAgIGNvbnN0IGFydGljbGVzID0gJCRhcnRpY2xlX2xpc3QoKTsgLy8gQ29tZXMgZnJvbSBleHRlcm5hbCA8c2NyaXB0PiB0YWcuXG4gICAgaWYoIWFydGljbGVzKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYW5nID0gJChcImh0bWxcIikuYXR0cihcImxhbmdcIikgfHwgXCJqYVwiO1xuICAgIGNvbnN0IGFydGljbGVfdHJlZSA9IGFydGljbGVzW2xhbmddO1xuXG4gICAgY29uc3QgYWN0aXZlX3RvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnNlY3Rpb24nXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCBhY3RpdmVfc3VidG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6dGFnJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG5cbiAgICBjb25zdCAkdG9waWNfY29udGFpbmVyID0gJChcIiN0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcblxuICAgIE9iamVjdC5rZXlzKGFydGljbGVfdHJlZSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0ICR0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG5cbiAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3RvcGljIHx8ICghYWN0aXZlX3RvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICR0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cblxuICAgICAgJHRvcGljX2NvbnRhaW5lci5hcHBlbmQoJHRvcGljKTtcbiAgICB9KTtcblxuICAgIGlmKCFhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgJHN1YnRvcGljX2NvbnRhaW5lciA9ICQoXCIjc3VidG9waWMtbGlzdFwiKS5maW5kKFwiLnRhZ3NcIik7XG5cbiAgICBPYmplY3Qua2V5cyhhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0ICRzdWJ0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG5cbiAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3N1YnRvcGljIHx8ICghYWN0aXZlX3N1YnRvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICRzdWJ0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cblxuICAgICAgJHN1YnRvcGljX2NvbnRhaW5lci5hcHBlbmQoJHN1YnRvcGljKTtcbiAgICB9KTtcblxuICAgIGlmKCFhcnRpY2xlX3RyZWVbYWN0aXZlX3RvcGljXVthY3RpdmVfc3VidG9waWNdKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCAkYXJ0aWNsZV9jb250YWluZXIgPSAkKFwiI2FydGljbGUtbGlzdFwiKS5maW5kKFwiLmhlYWRsaW5lXCIpO1xuXG4gICAgT2JqZWN0LmtleXMoYXJ0aWNsZV90cmVlW2FjdGl2ZV90b3BpY11bYWN0aXZlX3N1YnRvcGljXSkuZm9yRWFjaCgodiwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBhcnRpY2xlID0gYXJ0aWNsZV90cmVlW2FjdGl2ZV90b3BpY11bYWN0aXZlX3N1YnRvcGljXVt2XTtcbiAgICAgIGxldCBhcnRpY2xlX2R0aW1lID0gKG5ldyBEYXRlKGFydGljbGUucHVibGlzaGVkX3RpbWUpKVxuICAgICAgICAudG9Mb2NhbGVEYXRlU3RyaW5nKGxhbmcsIHt5ZWFyOiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wifSk7XG5cbiAgICAgIGxldCAkaGVhZGxpbmUgPSB0aGlzLmNyZWF0ZUhlYWRsaW5lSXRlbShcIiNcIiwgYXJ0aWNsZS50aXRsZSwgYXJ0aWNsZS5kZXNjcmlwdGlvbiwgYXJ0aWNsZV9kdGltZSk7XG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKCRoZWFkbGluZSk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGluaXRUb2dnbGVCdXR0b24oKXtcbiAgICBsZXQgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gICAgbGV0ICRzaWRlYmFyID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBsZXQgJHRhZ3MgPSAkc2lkZWJhci5maW5kKFwiLnRhZ3NcIik7XG4gICAgbGV0ICRidXR0b24gPSAkKFwiI3NpZGViYXItdG9nZ2xlLWJ1dHRvblwiKTtcbiAgICBcbiAgICBjb25zdCBjbG9zZVNpZGViYXIgPSAoZSkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZyBpZiBvdXRzaWRlIG9mIHNpZGViYXIgaGFzIGJlZW4gY2xpY2tlZC5cbiAgICAgIC8vIEhvd2V2ZXIsIGlmIHNjcmVlbiBzaXplIGlzIGZvciBtb2JpbGUsIGNsb3NlIHNpZGViYXIgd2hlcmV2ZXIgaXMgY2xpY2tlZC5cbiAgICAgIGlmKCF3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc5OXB4KVwiKS5tYXRjaGVzICYmXG4gICAgICAgICRzaWRlYmFyLmlzKGUudGFyZ2V0KSB8fCAkc2lkZWJhci5oYXMoZS50YXJnZXQpLmxlbmd0aCA+IDApe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gIFxuICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgIH07XG4gICAgXG4gICAgY29uc3Qgb25Ub2dnbGVCdXR0b25DbGlja2VkID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBcbiAgICAgIGlmKCRzaWRlYmFyLmhhc0NsYXNzKFwidmlzaWJsZVwiKSl7XG4gICAgICAgICRzaWRlYmFyLnJlbW92ZUNsYXNzKFwidmlzaWJsZVwiKTtcbiAgICAgICAgJGRvY3VtZW50Lm9mZihcImNsaWNrLmNsb3NlU2lkZWJhclwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgICRzaWRlYmFyLmFkZENsYXNzKFwidmlzaWJsZVwiKTtcbiAgICAgICAgJGRvY3VtZW50Lm9uKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIsIGNsb3NlU2lkZWJhcik7XG4gICAgICB9XG4gICAgfTtcbiAgXG4gICAgJGJ1dHRvbi5vbihcImNsaWNrXCIsIG9uVG9nZ2xlQnV0dG9uQ2xpY2tlZCk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBQcmV2ZW50aW5nIGVtYWlsIHNwYW1cbiAgICovXG4gIGJ1aWxkRW1haWxBZGRyZXNzKCl7XG4gICAgbGV0IHBhZ2VPcGVuZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBsZXQgaXNBbHJlYWR5QnVpbHQgPSBmYWxzZTtcbiAgICBsZXQgJGVtYWlsID0gJChcIi5wcm9maWxlIC5zb2NpYWwgLmVtYWlsXCIpO1xuICAgIFxuICAgIGNvbnN0IGFkZHIgPSBbODA1OSwgNjA4OCwgNzE2MywgNTA2MywgNzM4NCwgLTI4MjEsIDU4NzksIDYwODgsIDcxNjMsIDQ0NzIsIDgyODgsIDUyNjQsIC0zMDg4LCA1NjcyLCA2MDg4LCA4NTE5LCA1ODc5LCA4NzUyLCA0NjY3LCA3NjA3LCA0NDcyLCA1NjcyLCA1MjY0LCA4Mjg4LCAtODQxLCA1NjcyLCA2OTQ0LCA0NDcyLCA2MDg4LCA2NzI3LCAtMjgyMSwgNDg2NCwgNzM4NCwgNjk0NF07XG4gICAgXG4gICAgY29uc3QgbWFrZUFkZHJlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYoaXNBbHJlYWR5QnVpbHQgJiYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gcGFnZU9wZW5lZCkgPiAxNTAwKSByZXR1cm47XG4gICAgICBcbiAgICAgICRlbWFpbC5hdHRyKFwiaHJlZlwiLCBcIm1haWx0bzpcIiArIGFkZHIubWFwKGZ1bmN0aW9uKHYpe1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShNYXRoLnNxcnQodis0OTM3KSlcbiAgICAgIH0pLmpvaW4oXCJcIikpO1xuICAgIH07XG4gICAgXG4gICAgJGVtYWlsLm9uKFwibW91c2VvdmVyIHRvdWNoc3RhcnRcIiwgbWFrZUFkZHJlc3MpO1xuICB9XG4gIFxuICBidWlsZEJhbGxvb24oKXtcbiAgICAkKHRoaXMuc2VsZWN0b3IgKyBcIiBbZGF0YS1iYWxsb29uXVwiKS5iYWxsb29uKHtcbiAgICAgIHBsYWNlbWVudDogXCJsZWZ0XCIsXG4gICAgICBjb2xvcjogXCJibGFja1wiLFxuICAgICAgbWFyZ2luVG9wOiAkKFwiLnByb2ZpbGUtYXR0cmlidXRlXCIpLmhlaWdodCgpIC8gMlxuICAgIH0pO1xuICB9XG5cbiAgc2V0dXBMYW5nQnV0dG9uKCl7XG4gICAgY29uc3QgJGFua2VyID0gJChcIi5sYW5ndWFnZS5wcm9maWxlLWF0dHJpYnV0ZSBhW2RhdGEtbGFuZ11cIik7XG4gICAgY29uc3QgY3VycmVudF9sYW5nID0gJChcImh0bWxcIikuYXR0cihcImxhbmdcIik7XG4gICAgY29uc3QgYXJ0aWNsZV9pZCA9ICQoXCJoZWFkID4gbWV0YVtuYW1lPSdhcnRpY2xlSUQnXVtjb250ZW50XVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCB0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpzZWN0aW9uJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3Qgc3VidG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6dGFnJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgbGV0IGFydGljbGUgPSAkJGFydGljbGVfbGlzdCgpW2N1cnJlbnRfbGFuZ11bdG9waWNdW3N1YnRvcGljXVthcnRpY2xlX2lkXTtcbiAgICBsZXQgYmFzZWRpciA9IC9eKC4rKVsvXShbXi9dKikkLy5leGVjKGFydGljbGUucGF0aClbMV07XG5cbiAgICAkYW5rZXIuZWFjaChmdW5jdGlvbigpe1xuICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgdGFyZ2V0X2xhbmcgPSAkdGhpcy5kYXRhKFwibGFuZ1wiKTtcblxuICAgICAgdHJ5e1xuICAgICAgICAkdGhpcy5hdHRyKFwiaHJlZlwiLCBgLyR7YmFzZWRpcn0vJHthcnRpY2xlX2lkfV8ke3RhcmdldF9sYW5nfS5odG1sYCk7XG4gICAgICB9XG4gICAgICBjYXRjaChlKXtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBtYWluID4gYXJ0aWNsZVwiO1xuXG4gICAgdGhpcy5idWlsZEFydGljbGVIZWFkZXIoKTtcbiAgfVxuXG4gIGJ1aWxkQXJ0aWNsZUhlYWRlcigpe1xuICAgIGNvbnN0ICRhcnRpY2xlID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBjb25zdCAkaGVhZGVyID0gJGFydGljbGUuZmluZChcIi5hcnRpY2xlLWhlYWRlclwiKTtcbiAgICBjb25zdCBsYW5nID0gJChcImh0bWxcIikuYXR0cihcImxhbmdcIikgfHwgXCJqYVwiO1xuICAgIGNvbnN0IHRpdGxlID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdvZzp0aXRsZSddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnNlY3Rpb24nXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCBzdWJ0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTp0YWcnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBsZXQgcHVibGlzaGVkX3RpbWUgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6cHVibGlzaGVkX3RpbWUnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcblxuICAgIHB1Ymxpc2hlZF90aW1lID0gKG5ldyBEYXRlKERhdGUucGFyc2UocHVibGlzaGVkX3RpbWUpKSlcbiAgICAgIC50b0xvY2FsZURhdGVTdHJpbmcobGFuZywge1xuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgbW9udGg6IFwibG9uZ1wiLFxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiXG4gICAgICB9KTtcblxuICAgIGxldCBoZWFkZXJfc3RyaW5nID0gYFxuICAgICAgPGRpdiBjbGFzcz0ndGFncyc+XG4gICAgICAgIDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dG9waWN9PC9zcGFuPlxuICAgICAgICA8YT48c3BhbiBjbGFzcz0ndGFnJz4ke3N1YnRvcGljfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGgxIGNsYXNzPSdhcnRpY2xlLXRpdGxlJz4ke3RpdGxlfTwvaDE+XG4gICAgICA8ZGl2IGNsYXNzPSdhcnRpY2xlLWRhdGUnPlxuICAgICAgPGkgY2xhc3M9J2ZhIGZhLWNsb2NrLW8nPjwvaT4gJHtwdWJsaXNoZWRfdGltZX08L2Rpdj5cbiAgICBgO1xuXG4gICAgJGhlYWRlci5odG1sKGhlYWRlcl9zdHJpbmcpO1xuICB9XG59XG4iLCJpbXBvcnQgXCIuL2Fzc2V0XCI7XG5pbXBvcnQgSGVhZGVyIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZGVyXCI7XG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9jb21wb25lbnRzL3NpZGViYXJcIjtcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRzXCI7XG5cbmNvbnN0IG1haW4gPSBmdW5jdGlvbigpe1xuICBjb25zdCBoZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gIGNvbnN0IHNpZGViYXIgPSBuZXcgU2lkZWJhcigpO1xuICBjb25zdCBjb250ZW50ID0gbmV3IENvbnRlbnQoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
