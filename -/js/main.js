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

      $wrapper.on("mouseenter", function (e) {
        e.stopPropagation();
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

  /**
   * Wrap headline with long text by jquery.dotdotdot
   */


  _createClass(Sidebar, [{
    key: "wrapHeadline",
    value: function wrapHeadline() {
      var headlineTitle = $(this.selector).find(".headline .headline-title");
      headlineTitle.dotdotdot({
        truncate: "letter",
        watch: true
      });
    }

    /**
     * Create html elements representing headline item.
     *
     * @param {string} url - Url of the article
     * @param {string} title - Title of the article
     * @param {string} description - Description of the article
     * @param {string} published_time - String for published date of the article.
     * @returns {jQuery}
     */

  }, {
    key: "createHeadlineItem",
    value: function createHeadlineItem(url, title, description, published_time) {
      var $container = $("<div class='headline-item'>");
      $container.append($("<div class='headline-title'>").append("<a href=\"" + url + "\">" + title + "</a>")).append("<div class='headline-meta'>" + published_time + "</div>");

      if (description) {
        $container.attr("title", description);
      }

      return $container;
    }

    /**
     * Create and attach headline list to sidebar.
     * Headline data are fetched from function `$$article_list()`, which comes from
     * external <script> tag.
     * By putting the list of article into separate external <script> tag,
     * developer can freely modify headline list without hard-coding it to
     * site script file.
     */

  }, {
    key: "setHeadline",
    value: function setHeadline() {
      var _this = this;

      var articles = $$article_list(); // This comes from external <script> tag.
      if (!articles) {
        return;
      }

      var lang = $("html").attr("lang") || "ja";
      var article_tree = articles[lang];

      var active_topic = $("head > meta[property='article:section']").attr("content");
      var active_subtopic = $("head > meta[property='article:tag']").attr("content");

      var $topic_container = $("#topic-list").find(".tags");
      var $subtopic_container = $("#subtopic-list").find(".tags");
      var $article_container = $("#article-list").find(".headline");

      /**
       * Setup topic section
       */
      var topics = function topics(list, active_topic) {
        var $wrapper = $("<div>");
        Object.keys(list).forEach(function (val, index) {
          var $topic = $("<a><span class='tag'>" + val + "</span></a>");

          if (val === active_topic || !active_topic && index === 0) {
            $topic.addClass("active");
          }

          $wrapper.append($topic);
        });

        return $wrapper.children();
      };

      /**
       * Setup sub topic section
       */
      var subTopics = function subTopics(list, topic, active_subtopic) {
        var $wrapper = $("<div>");
        Object.keys(list[topic]).forEach(function (val, index) {
          var $subtopic = $("<a><span class='tag'>" + val + "</span></a>");

          if (val === active_subtopic || !active_subtopic && index === 0) {
            $subtopic.addClass("active");
          }

          $wrapper.append($subtopic);
        });

        return $wrapper.children();
      };

      /**
       * Setup headline area
       */
      var headlines = function headlines(list, topic, subtopic) {
        var $wrapper = $("<div>");
        Object.keys(list[topic][subtopic]).forEach(function (v, index) {
          var article = list[topic][subtopic][v];
          var article_dtime = new Date(article.published_time).toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" });

          var $headline = _this.createHeadlineItem(article.path, article.title, article.description, article_dtime);
          $wrapper.append($headline);
        });

        return $wrapper.children();
      };

      $topic_container.append(topics(article_tree, active_topic));
      $subtopic_container.append(subTopics(article_tree, active_topic, active_subtopic));
      $article_container.append(headlines(article_tree, active_topic, active_subtopic));

      $topic_container.find("a").on("click", function (e) {
        e.preventDefault();
        var $this = $(this);
        var topic = $this.find("span.tag").text();

        $topic_container.find("a.active").removeClass("active");
        $this.addClass("active");

        $subtopic_container.empty();
        $subtopic_container.append(subTopics(article_tree, topic));

        var subtopic = $subtopic_container.find("a.active").text();

        $article_container.empty();
        $article_container.append(headlines(article_tree, topic, subtopic));
      });

      $subtopic_container.find("a").on("click", function (e) {
        e.preventDefault();
        var $this = $(this);
        var topic = $topic_container.find("a.active").text();
        var subtopic = $this.find("span.tag").text();

        $subtopic_container.find("a.active").removeClass("active");
        $this.addClass("active");

        $article_container.empty();
        $article_container.append(headlines(article_tree, topic, subtopic));
      });
    }

    /**
     * Defines toggle button open/close behaviour
     */

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
     * Sanitize email address text.
     * Email address will be displayed in profile section,
     * but only human can see the text.
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

    /**
     * Balloon for detail profile.
     */

  }, {
    key: "buildBalloon",
    value: function buildBalloon() {
      $(this.selector + " [data-balloon]").balloon({
        placement: "left",
        color: "black",
        marginTop: $(".profile-attribute").height() / 2
      });
    }

    /**
     * Set url to corresponding page written in another language
     * to language button(anchor).
     */

  }, {
    key: "setupLangButton",
    value: function setupLangButton() {
      var $anchor = $(".language.profile-attribute a[data-lang]");
      var current_lang = $("html").attr("lang");
      var article_id = $("head > meta[name='articleID'][content]").attr("content");
      var topic = $("head > meta[property='article:section']").attr("content");
      var subtopic = $("head > meta[property='article:tag']").attr("content");

      $anchor.each(function () {
        var $this = $(this);
        var target_lang = $this.data("lang");
        try {
          var article = $$article_list()[target_lang][topic][subtopic][article_id];
          $this.attr("href", article.path);
        } catch (e) {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb250ZW50cy9pbmRleC5qcyIsInNzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7OztBQ0FBOzs7O0FBSUMsV0FBUyxDQUFULEVBQVc7QUFDVixJQUFFLEVBQUYsQ0FBSyxPQUFMLEdBQWUsVUFBUyxJQUFULEVBQWM7QUFDM0IsUUFBTSxVQUFVLEVBQUUsTUFBRixDQUFTO0FBQ3ZCLG1CQUFhLE1BRFU7QUFFdkIsZUFBUyxTQUZjO0FBR3ZCLG1CQUFhLENBSFU7QUFJdkIsb0JBQWM7QUFKUyxLQUFULEVBS2IsSUFMYSxDQUFoQjs7QUFPQSxRQUFHLENBQUMsQ0FBQyxRQUFELEVBQVUsT0FBVixFQUFrQixNQUFsQixFQUEwQixRQUExQixDQUFtQyxRQUFRLFNBQTNDLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7QUFDRCxRQUFHLENBQUMsQ0FBQyxTQUFELEVBQVcsT0FBWCxFQUFtQixTQUFuQixFQUE4QixRQUE5QixDQUF1QyxRQUFRLEtBQS9DLENBQUosRUFBMEQ7QUFDeEQsWUFBTSxJQUFJLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBTSxzQkFBc0I7QUFDMUIsa0JBQVksT0FEYztBQUUxQixpQkFBVyxDQUZlO0FBRzFCLGlCQUFXLENBQUMsQ0FIYztBQUkxQixvQkFBYztBQUpZLEtBQTVCOztBQU9BLFFBQUksWUFBWSxFQUFFLFFBQUYsQ0FBaEI7O0FBRUEsU0FBSyxJQUFMLENBQVUsWUFBVTtBQUNsQixVQUFJLEtBQUssRUFBRSxJQUFGLENBQVQ7QUFDQSxVQUFJLFlBQVksR0FBRyxJQUFILENBQVEsbUJBQVIsQ0FBaEI7O0FBRUEsVUFBRyxDQUFDLFNBQUQsSUFBYyxVQUFVLE1BQVYsR0FBbUIsQ0FBcEMsRUFBc0M7QUFDcEM7QUFDRDs7QUFFRCxVQUFNLFdBQVcsRUFBRSxPQUFGLEVBQ2QsUUFEYyxDQUNMLFNBREssRUFFZCxRQUZjLENBRUwsUUFBUSxTQUZILEVBR2QsSUFIYyxDQUdULFVBQVUsSUFBVixFQUhTLENBQWpCOztBQUtBLFVBQUcsUUFBUSxLQUFYLEVBQWlCO0FBQ2YsaUJBQVMsUUFBVCxDQUFrQixRQUFRLEtBQTFCO0FBQ0Q7O0FBRUQsVUFBTSxXQUFXLEVBQUUsT0FBRixFQUFXLEdBQVgsQ0FBZSxtQkFBZixDQUFqQjs7QUFFQSxlQUFTLE1BQVQsQ0FBZ0IsUUFBaEI7QUFDQSxTQUFHLE1BQUgsQ0FBVSxRQUFWO0FBQ0EsZ0JBQVUsTUFBVjs7QUFFQSxVQUFJLGNBQWMsQ0FBbEIsQ0F2QmtCLENBdUJHO0FBQ3JCLFVBQU0sY0FBYyxFQUFwQixDQXhCa0IsQ0F3Qk07O0FBRXhCLFNBQUcsRUFBSCxDQUFNLFlBQU4sRUFBb0IsVUFBQyxDQUFELEVBQU87QUFDekIsWUFBSSxPQUFPLEVBQVg7QUFDQSxZQUFJLFNBQVMsSUFBYjs7QUFFQSxZQUFNLGVBQWUsU0FBZixZQUFlLEdBQVU7QUFDN0IsY0FBSSxZQUFKO0FBQUEsY0FBUSxhQUFSOztBQUVBLGtCQUFPLFFBQVEsU0FBZjtBQUNFLGlCQUFLLFFBQUw7QUFDRSxvQkFBTSxLQUFLLE1BQUwsR0FBYyxHQUFkLEdBQW9CLFVBQVUsU0FBVixFQUFwQixHQUE0QyxLQUFLLE1BQUwsRUFBNUMsR0FBNEQsUUFBUSxTQUExRTtBQUNBLHFCQUFPLEtBQUssTUFBTCxHQUFjLElBQWQsR0FBcUIsVUFBVSxVQUFWLEVBQXJCLEdBQThDLFdBQTlDLEdBQTRELFFBQVEsVUFBM0U7QUFDQTtBQUNGLGlCQUFLLE1BQUw7QUFDRSx1QkFBUyxHQUFULENBQWEsRUFBQyxLQUFLLENBQU4sRUFBUyxNQUFNLENBQWYsRUFBYixFQURGLENBQ21DO0FBQ2pDLG9CQUFNLEtBQUssTUFBTCxHQUFjLEdBQWQsR0FBb0IsVUFBVSxTQUFWLEVBQXBCLEdBQTRDLFdBQTVDLEdBQTBELFFBQVEsU0FBeEU7QUFDQSxxQkFBTyxLQUFLLE1BQUwsR0FBYyxJQUFkLEdBQXFCLFVBQVUsVUFBVixFQUFyQixHQUE4QyxTQUFTLEtBQVQsRUFBOUMsR0FBaUUsUUFBUSxVQUFoRjs7QUFFQSxrQkFBSSxpQkFBaUIsU0FBUyxNQUFULEVBQXJCO0FBQ0Esa0JBQU0sU0FBVSxNQUFNLGNBQVAsR0FBeUIsT0FBTyxXQUEvQztBQUNBLGtCQUFHLFNBQVMsQ0FBWixFQUFjO0FBQ1osc0JBQU0sTUFBTSxjQUFOLEdBQXVCLGNBQWMsQ0FBM0M7QUFDQSx5QkFBUyxRQUFULENBQWtCLE9BQWxCO0FBQ0QsZUFIRCxNQUlJO0FBQ0YseUJBQVMsV0FBVCxDQUFxQixPQUFyQjtBQUNEO0FBQ0Q7QUFDRixpQkFBSyxPQUFMO0FBQ0UsdUJBQVMsR0FBVCxDQUFhLEVBQUMsS0FBSyxDQUFOLEVBQVMsT0FBTyxDQUFoQixFQUFiLEVBREYsQ0FDb0M7QUFDbEMsb0JBQU0sS0FBSyxNQUFMLEdBQWMsR0FBZCxHQUFvQixVQUFVLFNBQVYsRUFBcEIsR0FBNEMsV0FBNUMsR0FBMEQsUUFBUSxTQUF4RTtBQUNBLHFCQUFPLEtBQUssTUFBTCxHQUFjLElBQWQsR0FBcUIsVUFBVSxVQUFWLEVBQXJCLEdBQThDLEtBQUssS0FBTCxFQUE5QyxHQUE2RCxRQUFRLFVBQTVFO0FBQ0E7QUF4Qko7O0FBMkJBLGlCQUFPLEVBQUMsUUFBRCxFQUFNLFVBQU4sRUFBUDtBQUNELFNBL0JEOztBQWlDQSxZQUFJLFdBQVcsY0FBZjs7QUFFQSxpQkFDRyxHQURILENBQ087QUFDSCxpQkFBTyxTQUFTLEdBRGI7QUFFSCxrQkFBUSxTQUFTLElBRmQ7QUFHSCxxQkFBVyxNQUhSO0FBSUgscUJBQVc7QUFKUixTQURQOztBQVFBLHNCQUFjLENBQWQ7O0FBRUEsVUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLGdCQUFiLEVBQStCLFVBQUMsQ0FBRCxFQUFPO0FBQ3BDLGNBQUksV0FBVyxjQUFmO0FBQ0EsbUJBQVMsR0FBVCxDQUFhO0FBQ1gsaUJBQUssU0FBUyxHQURIO0FBRVgsa0JBQU0sU0FBUztBQUZKLFdBQWI7QUFJRCxTQU5EO0FBUUQsT0F6REQ7O0FBMkRBLFNBQUcsRUFBSCxDQUFNLFlBQU4sRUFBb0IsVUFBQyxDQUFELEVBQU87QUFDekIsaUJBQVMsR0FBVCxDQUFhO0FBQ1gscUJBQVc7QUFEQSxTQUFiOztBQUlBLHNCQUFjLENBQWQ7O0FBRUEsVUFBRSxNQUFGLEVBQVUsR0FBVixDQUFjLGdCQUFkO0FBQ0QsT0FSRDs7QUFVQSxTQUFHLEVBQUgsQ0FBTSxrREFBTixFQUEwRCxVQUFDLENBQUQsRUFBTztBQUMvRCxZQUFHLGdCQUFnQixDQUFuQixFQUFxQjtBQUNuQixtQkFBUyxHQUFULENBQWEsU0FBYixFQUF3QixDQUFDLENBQXpCO0FBQ0Q7QUFDRixPQUpEOztBQU1BLGVBQVMsRUFBVCxDQUFZLFlBQVosRUFBMEIsVUFBQyxDQUFELEVBQU87QUFDL0IsVUFBRSxlQUFGO0FBQ0QsT0FGRDtBQUdELEtBeEdEOztBQTBHQSxXQUFPLElBQVA7QUFDRCxHQW5JRDtBQW9JRCxDQXJJQSxFQXFJQyxNQXJJRCxDQUFEOzs7Ozs7Ozs7Ozs7O0lDSnFCLE07QUFDbkIsb0JBQWE7QUFBQTs7QUFDWCxTQUFLLFFBQUwsR0FBZ0IsZUFBaEI7O0FBRUEsU0FBSyxNQUFMO0FBQ0Q7Ozs7NkJBRU87QUFDTixVQUFJLHNCQUFzQixHQUExQjtBQUNBLFVBQUksb0JBQW9CLEdBQXhCO0FBQ0EsVUFBSSxtQkFBbUIsaUVBQXZCOztBQUVBLFVBQUksVUFBVSxFQUFFLE1BQUYsQ0FBZDtBQUNBLFVBQUksU0FBUyxFQUFFLEtBQUssUUFBUCxDQUFiO0FBQ0EsVUFBSSxXQUFXLEtBQWY7O0FBRUEsVUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxDQUFELEVBQU87QUFDN0IsZUFBTyxXQUFQLENBQW1CLDBCQUFuQjtBQUNBLG1CQUFXLEtBQVg7QUFDRCxPQUhEOztBQUtBLGFBQU8sRUFBUCxDQUFVLGtEQUFWLEVBQThELGVBQTlEOztBQUVBLGNBQVEsRUFBUixDQUFXLFFBQVgsRUFBcUIsVUFBQyxDQUFELEVBQU87QUFDMUIsWUFBRyxDQUFDLE9BQU8sVUFBUCxDQUFrQixnQkFBbEIsRUFBb0MsT0FBckMsSUFBZ0QsUUFBbkQsRUFBNkQ7O0FBRTdELFlBQU0sWUFBWSxRQUFRLFNBQVIsRUFBbEI7O0FBRUEsWUFBRyxvQkFBb0IsU0FBcEIsSUFBaUMsWUFBWSxtQkFBaEQsRUFBb0U7QUFDbEUsY0FBRyxDQUFDLE9BQU8sUUFBUCxDQUFnQixjQUFoQixDQUFKLEVBQXFDOztBQUVyQyxjQUFHLENBQUMsT0FBTyxRQUFQLENBQWdCLGVBQWhCLENBQUosRUFBc0MsT0FBTyxRQUFQLENBQWdCLGVBQWhCOztBQUV0QyxjQUFJLGdCQUFnQixNQUFNLEVBQU4sR0FBVyxTQUEvQjtBQUNBLGlCQUFPLEdBQVAsQ0FBVztBQUNULG9CQUFRLGFBREM7QUFFVCxxQ0FBdUIsYUFBdkI7QUFGUyxXQUFYOztBQUtBO0FBQ0Q7O0FBRUQsWUFBRyxhQUFhLG1CQUFoQixFQUFvQztBQUNsQyxjQUFHLE9BQU8sUUFBUCxDQUFnQixjQUFoQixDQUFILEVBQW9DOztBQUVwQyxxQkFBVyxJQUFYO0FBQ0EsaUJBQU8sUUFBUCxDQUFnQixjQUFoQjtBQUNELFNBTEQsTUFNSyxJQUFHLGFBQWEsaUJBQWhCLEVBQWtDO0FBQ3JDLGNBQUcsQ0FBQyxPQUFPLFFBQVAsQ0FBZ0IsY0FBaEIsQ0FBSixFQUFxQzs7QUFFckMsaUJBQU8sVUFBUCxDQUFrQixPQUFsQjtBQUNBLGlCQUFPLFdBQVAsQ0FBbUIsZUFBbkI7O0FBRUEscUJBQVcsSUFBWDtBQUNBLGlCQUFPLFFBQVAsQ0FBZ0IsMEJBQWhCO0FBQ0EsaUJBQU8sV0FBUCxDQUFtQixjQUFuQjtBQUNEO0FBQ0YsT0FuQ0Q7QUFvQ0Q7Ozs7OztrQkEzRGtCLE07Ozs7Ozs7Ozs7Ozs7SUNBQSxPO0FBQ25CLHFCQUFhO0FBQUE7O0FBQ1gsU0FBSyxRQUFMLEdBQWdCLG1CQUFoQjs7QUFFQSxTQUFLLGdCQUFMO0FBQ0EsU0FBSyxpQkFBTDtBQUNBLFNBQUssWUFBTDtBQUNBLFNBQUssV0FBTDtBQUNBLFNBQUssWUFBTDtBQUNBLFNBQUssZUFBTDtBQUNEOztBQUVEOzs7Ozs7O21DQUdjO0FBQ1osVUFBSSxnQkFBZ0IsRUFBRSxLQUFLLFFBQVAsRUFBaUIsSUFBakIsQ0FBc0IsMkJBQXRCLENBQXBCO0FBQ0Esb0JBQWMsU0FBZCxDQUF3QjtBQUN0QixrQkFBVSxRQURZO0FBRXRCLGVBQU87QUFGZSxPQUF4QjtBQUlEOztBQUVEOzs7Ozs7Ozs7Ozs7dUNBU21CLEcsRUFBSyxLLEVBQU8sVyxFQUFhLGMsRUFBZTtBQUN6RCxVQUFJLGFBQWEsRUFBRSw2QkFBRixDQUFqQjtBQUNBLGlCQUNHLE1BREgsQ0FFSSxFQUFFLDhCQUFGLEVBQWtDLE1BQWxDLGdCQUNjLEdBRGQsV0FDc0IsS0FEdEIsVUFGSixFQU1HLE1BTkgsaUNBTXdDLGNBTnhDOztBQVNBLFVBQUcsV0FBSCxFQUFlO0FBQ2IsbUJBQVcsSUFBWCxDQUFnQixPQUFoQixFQUF5QixXQUF6QjtBQUNEOztBQUVELGFBQU8sVUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztrQ0FRYTtBQUFBOztBQUNYLFVBQU0sV0FBVyxnQkFBakIsQ0FEVyxDQUN3QjtBQUNuQyxVQUFHLENBQUMsUUFBSixFQUFhO0FBQ1g7QUFDRDs7QUFFRCxVQUFNLE9BQU8sRUFBRSxNQUFGLEVBQVUsSUFBVixDQUFlLE1BQWYsS0FBMEIsSUFBdkM7QUFDQSxVQUFNLGVBQWUsU0FBUyxJQUFULENBQXJCOztBQUVBLFVBQU0sZUFBZSxFQUFFLHlDQUFGLEVBQTZDLElBQTdDLENBQWtELFNBQWxELENBQXJCO0FBQ0EsVUFBTSxrQkFBa0IsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUF4Qjs7QUFFQSxVQUFNLG1CQUFtQixFQUFFLGFBQUYsRUFBaUIsSUFBakIsQ0FBc0IsT0FBdEIsQ0FBekI7QUFDQSxVQUFNLHNCQUFzQixFQUFFLGdCQUFGLEVBQW9CLElBQXBCLENBQXlCLE9BQXpCLENBQTVCO0FBQ0EsVUFBTSxxQkFBcUIsRUFBRSxlQUFGLEVBQW1CLElBQW5CLENBQXdCLFdBQXhCLENBQTNCOztBQUVBOzs7QUFHQSxVQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsSUFBRCxFQUFPLFlBQVAsRUFBd0I7QUFDckMsWUFBTSxXQUFXLEVBQUUsT0FBRixDQUFqQjtBQUNBLGVBQU8sSUFBUCxDQUFZLElBQVosRUFBa0IsT0FBbEIsQ0FBMEIsVUFBQyxHQUFELEVBQU0sS0FBTixFQUFnQjtBQUN4QyxjQUFJLFNBQVMsNEJBQTBCLEdBQTFCLGlCQUFiOztBQUVBLGNBQUcsUUFBUSxZQUFSLElBQXlCLENBQUMsWUFBRCxJQUFpQixVQUFVLENBQXZELEVBQTBEO0FBQ3hELG1CQUFPLFFBQVAsQ0FBZ0IsUUFBaEI7QUFDRDs7QUFFRCxtQkFBUyxNQUFULENBQWdCLE1BQWhCO0FBQ0QsU0FSRDs7QUFVQSxlQUFPLFNBQVMsUUFBVCxFQUFQO0FBQ0QsT0FiRDs7QUFlQTs7O0FBR0EsVUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsZUFBZCxFQUFrQztBQUNsRCxZQUFNLFdBQVcsRUFBRSxPQUFGLENBQWpCO0FBQ0EsZUFBTyxJQUFQLENBQVksS0FBSyxLQUFMLENBQVosRUFBeUIsT0FBekIsQ0FBaUMsVUFBQyxHQUFELEVBQU0sS0FBTixFQUFnQjtBQUMvQyxjQUFJLFlBQVksNEJBQTBCLEdBQTFCLGlCQUFoQjs7QUFFQSxjQUFHLFFBQVEsZUFBUixJQUE0QixDQUFDLGVBQUQsSUFBb0IsVUFBVSxDQUE3RCxFQUFnRTtBQUM5RCxzQkFBVSxRQUFWLENBQW1CLFFBQW5CO0FBQ0Q7O0FBRUQsbUJBQVMsTUFBVCxDQUFnQixTQUFoQjtBQUNELFNBUkQ7O0FBVUEsZUFBTyxTQUFTLFFBQVQsRUFBUDtBQUNELE9BYkQ7O0FBZUE7OztBQUdBLFVBQU0sWUFBWSxTQUFaLFNBQVksQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLFFBQWQsRUFBMkI7QUFDM0MsWUFBTSxXQUFXLEVBQUUsT0FBRixDQUFqQjtBQUNBLGVBQU8sSUFBUCxDQUFZLEtBQUssS0FBTCxFQUFZLFFBQVosQ0FBWixFQUFtQyxPQUFuQyxDQUEyQyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQWM7QUFDdkQsY0FBSSxVQUFVLEtBQUssS0FBTCxFQUFZLFFBQVosRUFBc0IsQ0FBdEIsQ0FBZDtBQUNBLGNBQUksZ0JBQWlCLElBQUksSUFBSixDQUFTLFFBQVEsY0FBakIsQ0FBRCxDQUNqQixrQkFEaUIsQ0FDRSxJQURGLEVBQ1EsRUFBQyxNQUFNLFNBQVAsRUFBa0IsT0FBTyxNQUF6QixFQUFpQyxLQUFLLFNBQXRDLEVBRFIsQ0FBcEI7O0FBR0EsY0FBSSxZQUFZLE1BQUssa0JBQUwsQ0FBd0IsUUFBUSxJQUFoQyxFQUFzQyxRQUFRLEtBQTlDLEVBQXFELFFBQVEsV0FBN0QsRUFBMEUsYUFBMUUsQ0FBaEI7QUFDQSxtQkFBUyxNQUFULENBQWdCLFNBQWhCO0FBQ0QsU0FQRDs7QUFTQSxlQUFPLFNBQVMsUUFBVCxFQUFQO0FBQ0QsT0FaRDs7QUFjQSx1QkFBaUIsTUFBakIsQ0FBd0IsT0FBTyxZQUFQLEVBQXFCLFlBQXJCLENBQXhCO0FBQ0EsMEJBQW9CLE1BQXBCLENBQTJCLFVBQVUsWUFBVixFQUF3QixZQUF4QixFQUFzQyxlQUF0QyxDQUEzQjtBQUNBLHlCQUFtQixNQUFuQixDQUEwQixVQUFVLFlBQVYsRUFBd0IsWUFBeEIsRUFBc0MsZUFBdEMsQ0FBMUI7O0FBRUEsdUJBQWlCLElBQWpCLENBQXNCLEdBQXRCLEVBQTJCLEVBQTNCLENBQThCLE9BQTlCLEVBQXVDLFVBQVMsQ0FBVCxFQUFXO0FBQ2hELFVBQUUsY0FBRjtBQUNBLFlBQU0sUUFBUSxFQUFFLElBQUYsQ0FBZDtBQUNBLFlBQU0sUUFBUSxNQUFNLElBQU4sQ0FBVyxVQUFYLEVBQXVCLElBQXZCLEVBQWQ7O0FBRUEseUJBQWlCLElBQWpCLENBQXNCLFVBQXRCLEVBQWtDLFdBQWxDLENBQThDLFFBQTlDO0FBQ0EsY0FBTSxRQUFOLENBQWUsUUFBZjs7QUFFQSw0QkFBb0IsS0FBcEI7QUFDQSw0QkFBb0IsTUFBcEIsQ0FBMkIsVUFBVSxZQUFWLEVBQXdCLEtBQXhCLENBQTNCOztBQUVBLFlBQU0sV0FBVyxvQkFBb0IsSUFBcEIsQ0FBeUIsVUFBekIsRUFBcUMsSUFBckMsRUFBakI7O0FBRUEsMkJBQW1CLEtBQW5CO0FBQ0EsMkJBQW1CLE1BQW5CLENBQTBCLFVBQVUsWUFBVixFQUF3QixLQUF4QixFQUErQixRQUEvQixDQUExQjtBQUNELE9BZkQ7O0FBaUJBLDBCQUFvQixJQUFwQixDQUF5QixHQUF6QixFQUE4QixFQUE5QixDQUFpQyxPQUFqQyxFQUEwQyxVQUFTLENBQVQsRUFBVztBQUNuRCxVQUFFLGNBQUY7QUFDQSxZQUFNLFFBQVEsRUFBRSxJQUFGLENBQWQ7QUFDQSxZQUFNLFFBQVEsaUJBQWlCLElBQWpCLENBQXNCLFVBQXRCLEVBQWtDLElBQWxDLEVBQWQ7QUFDQSxZQUFNLFdBQVcsTUFBTSxJQUFOLENBQVcsVUFBWCxFQUF1QixJQUF2QixFQUFqQjs7QUFFQSw0QkFBb0IsSUFBcEIsQ0FBeUIsVUFBekIsRUFBcUMsV0FBckMsQ0FBaUQsUUFBakQ7QUFDQSxjQUFNLFFBQU4sQ0FBZSxRQUFmOztBQUVBLDJCQUFtQixLQUFuQjtBQUNBLDJCQUFtQixNQUFuQixDQUEwQixVQUFVLFlBQVYsRUFBd0IsS0FBeEIsRUFBK0IsUUFBL0IsQ0FBMUI7QUFDRCxPQVhEO0FBWUQ7O0FBRUQ7Ozs7Ozt1Q0FHa0I7QUFDaEIsVUFBSSxZQUFZLEVBQUUsUUFBRixDQUFoQjtBQUNBLFVBQUksV0FBVyxFQUFFLEtBQUssUUFBUCxDQUFmO0FBQ0EsVUFBSSxRQUFRLFNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBWjtBQUNBLFVBQUksVUFBVSxFQUFFLHdCQUFGLENBQWQ7O0FBRUEsVUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFDLENBQUQsRUFBTztBQUMxQjtBQUNBO0FBQ0EsWUFBRyxDQUFDLE9BQU8sVUFBUCxDQUFrQixvQkFBbEIsRUFBd0MsT0FBekMsSUFDRCxTQUFTLEVBQVQsQ0FBWSxFQUFFLE1BQWQsQ0FEQyxJQUN3QixTQUFTLEdBQVQsQ0FBYSxFQUFFLE1BQWYsRUFBdUIsTUFBdkIsR0FBZ0MsQ0FEM0QsRUFDNkQ7QUFDM0Q7QUFDRDs7QUFFRCxpQkFBUyxXQUFULENBQXFCLFNBQXJCO0FBQ0QsT0FURDs7QUFXQSxVQUFNLHdCQUF3QixTQUF4QixxQkFBd0IsQ0FBQyxDQUFELEVBQU87QUFDbkMsVUFBRSxjQUFGO0FBQ0EsVUFBRSxlQUFGOztBQUVBLFlBQUcsU0FBUyxRQUFULENBQWtCLFNBQWxCLENBQUgsRUFBZ0M7QUFDOUIsbUJBQVMsV0FBVCxDQUFxQixTQUFyQjtBQUNBLG9CQUFVLEdBQVYsQ0FBYyxvQkFBZDtBQUNELFNBSEQsTUFJSTtBQUNGLG1CQUFTLFFBQVQsQ0FBa0IsU0FBbEI7QUFDQSxvQkFBVSxFQUFWLENBQWEsb0JBQWIsRUFBbUMsWUFBbkM7QUFDRDtBQUNGLE9BWkQ7O0FBY0EsY0FBUSxFQUFSLENBQVcsT0FBWCxFQUFvQixxQkFBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0NBS21CO0FBQ2pCLFVBQUksYUFBYSxJQUFJLElBQUosR0FBVyxPQUFYLEVBQWpCO0FBQ0EsVUFBSSxpQkFBaUIsS0FBckI7QUFDQSxVQUFJLFNBQVMsRUFBRSx5QkFBRixDQUFiOztBQUVBLFVBQU0sT0FBTyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixDQUFDLElBQWhDLEVBQXNDLElBQXRDLEVBQTRDLElBQTVDLEVBQWtELElBQWxELEVBQXdELElBQXhELEVBQThELElBQTlELEVBQW9FLElBQXBFLEVBQTBFLENBQUMsSUFBM0UsRUFBaUYsSUFBakYsRUFBdUYsSUFBdkYsRUFBNkYsSUFBN0YsRUFBbUcsSUFBbkcsRUFBeUcsSUFBekcsRUFBK0csSUFBL0csRUFBcUgsSUFBckgsRUFBMkgsSUFBM0gsRUFBaUksSUFBakksRUFBdUksSUFBdkksRUFBNkksSUFBN0ksRUFBbUosQ0FBQyxHQUFwSixFQUF5SixJQUF6SixFQUErSixJQUEvSixFQUFxSyxJQUFySyxFQUEySyxJQUEzSyxFQUFpTCxJQUFqTCxFQUF1TCxDQUFDLElBQXhMLEVBQThMLElBQTlMLEVBQW9NLElBQXBNLEVBQTBNLElBQTFNLENBQWI7O0FBRUEsVUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLENBQUQsRUFBTztBQUN6QixZQUFHLGtCQUFtQixJQUFJLElBQUosR0FBVyxPQUFYLEtBQXVCLFVBQXhCLEdBQXNDLElBQTNELEVBQWlFOztBQUVqRSxlQUFPLElBQVAsQ0FBWSxNQUFaLEVBQW9CLFlBQVksS0FBSyxHQUFMLENBQVMsVUFBUyxDQUFULEVBQVc7QUFDbEQsaUJBQU8sT0FBTyxZQUFQLENBQW9CLEtBQUssSUFBTCxDQUFVLElBQUUsSUFBWixDQUFwQixDQUFQO0FBQ0QsU0FGK0IsRUFFN0IsSUFGNkIsQ0FFeEIsRUFGd0IsQ0FBaEM7QUFHRCxPQU5EOztBQVFBLGFBQU8sRUFBUCxDQUFVLHNCQUFWLEVBQWtDLFdBQWxDO0FBQ0Q7O0FBRUQ7Ozs7OzttQ0FHYztBQUNaLFFBQUUsS0FBSyxRQUFMLEdBQWdCLGlCQUFsQixFQUFxQyxPQUFyQyxDQUE2QztBQUMzQyxtQkFBVyxNQURnQztBQUUzQyxlQUFPLE9BRm9DO0FBRzNDLG1CQUFXLEVBQUUsb0JBQUYsRUFBd0IsTUFBeEIsS0FBbUM7QUFISCxPQUE3QztBQUtEOztBQUVEOzs7Ozs7O3NDQUlpQjtBQUNmLFVBQU0sVUFBVSxFQUFFLDBDQUFGLENBQWhCO0FBQ0EsVUFBTSxlQUFlLEVBQUUsTUFBRixFQUFVLElBQVYsQ0FBZSxNQUFmLENBQXJCO0FBQ0EsVUFBTSxhQUFhLEVBQUUsd0NBQUYsRUFBNEMsSUFBNUMsQ0FBaUQsU0FBakQsQ0FBbkI7QUFDQSxVQUFNLFFBQVEsRUFBRSx5Q0FBRixFQUE2QyxJQUE3QyxDQUFrRCxTQUFsRCxDQUFkO0FBQ0EsVUFBTSxXQUFXLEVBQUUscUNBQUYsRUFBeUMsSUFBekMsQ0FBOEMsU0FBOUMsQ0FBakI7O0FBRUEsY0FBUSxJQUFSLENBQWEsWUFBVTtBQUNyQixZQUFNLFFBQVEsRUFBRSxJQUFGLENBQWQ7QUFDQSxZQUFNLGNBQWMsTUFBTSxJQUFOLENBQVcsTUFBWCxDQUFwQjtBQUNBLFlBQUk7QUFDRixjQUFNLFVBQVUsaUJBQWlCLFdBQWpCLEVBQThCLEtBQTlCLEVBQXFDLFFBQXJDLEVBQStDLFVBQS9DLENBQWhCO0FBQ0EsZ0JBQU0sSUFBTixDQUFXLE1BQVgsRUFBbUIsUUFBUSxJQUEzQjtBQUNELFNBSEQsQ0FJQSxPQUFNLENBQU4sRUFBUSxDQUFFO0FBQ1gsT0FSRDtBQVNEOzs7Ozs7a0JBN1BrQixPOzs7Ozs7Ozs7Ozs7O0lDQUEsTztBQUNuQixxQkFBYztBQUFBOztBQUNaLFNBQUssUUFBTCxHQUFnQix1QkFBaEI7O0FBRUEsU0FBSyxrQkFBTDtBQUNEOzs7O3lDQUVtQjtBQUNsQixVQUFNLFdBQVcsRUFBRSxLQUFLLFFBQVAsQ0FBakI7QUFDQSxVQUFNLFVBQVUsU0FBUyxJQUFULENBQWMsaUJBQWQsQ0FBaEI7QUFDQSxVQUFNLE9BQU8sRUFBRSxNQUFGLEVBQVUsSUFBVixDQUFlLE1BQWYsS0FBMEIsSUFBdkM7QUFDQSxVQUFNLFFBQVEsRUFBRSxrQ0FBRixFQUFzQyxJQUF0QyxDQUEyQyxTQUEzQyxDQUFkO0FBQ0EsVUFBTSxRQUFRLEVBQUUseUNBQUYsRUFBNkMsSUFBN0MsQ0FBa0QsU0FBbEQsQ0FBZDtBQUNBLFVBQU0sV0FBVyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWpCO0FBQ0EsVUFBSSxpQkFBaUIsRUFBRSxnREFBRixFQUFvRCxJQUFwRCxDQUF5RCxTQUF6RCxDQUFyQjs7QUFFQSx1QkFBa0IsSUFBSSxJQUFKLENBQVMsS0FBSyxLQUFMLENBQVcsY0FBWCxDQUFULENBQUQsQ0FDZCxrQkFEYyxDQUNLLElBREwsRUFDVztBQUN4QixjQUFNLFNBRGtCO0FBRXhCLGVBQU8sTUFGaUI7QUFHeEIsYUFBSztBQUhtQixPQURYLENBQWpCOztBQU9BLFVBQUksOEVBRXVCLEtBRnZCLDhDQUd1QixRQUh2QiwrREFLMEIsS0FMMUIscUZBTzhCLGNBUDlCLGlCQUFKOztBQVVBLGNBQVEsSUFBUixDQUFhLGFBQWI7QUFDRDs7Ozs7O2tCQWxDa0IsTzs7Ozs7QUNBckI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLEdBQVU7QUFDckIsTUFBTSxTQUFTLHNCQUFmO0FBQ0EsTUFBTSxVQUFVLHVCQUFoQjtBQUNBLE1BQU0sVUFBVSx3QkFBaEI7QUFDRCxDQUpEOztBQU1BLEVBQUUsSUFBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vc3RhbmRhcmQnO1xuIiwiLyoqXG4gKiBBdXRvIGRpc3BsYXkgYmFsbG9vbiBmb3IgZWxlbWVudHNcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xuKGZ1bmN0aW9uKCQpe1xuICAkLmZuLmJhbGxvb24gPSBmdW5jdGlvbihvcHRzKXtcbiAgICBjb25zdCBzZXR0aW5nID0gJC5leHRlbmQoe1xuICAgICAgXCJwbGFjZW1lbnRcIjogXCJsZWZ0XCIsXG4gICAgICBcImNvbG9yXCI6IHVuZGVmaW5lZCxcbiAgICAgIFwibWFyZ2luVG9wXCI6IDAsXG4gICAgICBcIm1hcmdpbkxlZnRcIjogMFxuICAgIH0sIG9wdHMpO1xuICAgIFxuICAgIGlmKCFbXCJib3R0b21cIixcInJpZ2h0XCIsXCJsZWZ0XCJdLmluY2x1ZGVzKHNldHRpbmcucGxhY2VtZW50KSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYWNlbWVudC5cIik7XG4gICAgfVxuICAgIGlmKCFbXCJkZWZhdWx0XCIsXCJibGFja1wiLHVuZGVmaW5lZF0uaW5jbHVkZXMoc2V0dGluZy5jb2xvcikpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvci5cIik7XG4gICAgfVxuICBcbiAgICBjb25zdCB3cmFwcGVySW5pdGlhbFN0eWxlID0ge1xuICAgICAgXCJwb3NpdGlvblwiOiBcImZpeGVkXCIsXG4gICAgICBcIm9wYWNpdHlcIjogMCxcbiAgICAgIFwiei1pbmRleFwiOiAtMSxcbiAgICAgIFwidHJhbnNpdGlvblwiOiBcIm9wYWNpdHkgZWFzZSAuM3NcIlxuICAgIH07XG4gICAgXG4gICAgbGV0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuICBcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIGxldCAkdCA9ICQodGhpcyk7XG4gICAgICBsZXQgJGNvbnRlbnRzID0gJHQuZmluZChcIi5iYWxsb29uLWNvbnRlbnRzXCIpO1xuICAgICAgXG4gICAgICBpZighJGNvbnRlbnRzIHx8ICRjb250ZW50cy5sZW5ndGggPCAxKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgY29uc3QgJGJhbGxvb24gPSAkKFwiPGRpdj5cIilcbiAgICAgICAgLmFkZENsYXNzKFwiYmFsbG9vblwiKVxuICAgICAgICAuYWRkQ2xhc3Moc2V0dGluZy5wbGFjZW1lbnQpXG4gICAgICAgIC5odG1sKCRjb250ZW50cy5odG1sKCkpO1xuICAgICAgXG4gICAgICBpZihzZXR0aW5nLmNvbG9yKXtcbiAgICAgICAgJGJhbGxvb24uYWRkQ2xhc3Moc2V0dGluZy5jb2xvcik7XG4gICAgICB9XG4gICAgXG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKS5jc3Mod3JhcHBlckluaXRpYWxTdHlsZSk7XG4gICAgXG4gICAgICAkd3JhcHBlci5hcHBlbmQoJGJhbGxvb24pO1xuICAgICAgJHQuYXBwZW5kKCR3cmFwcGVyKTtcbiAgICAgICRjb250ZW50cy5yZW1vdmUoKTtcbiAgXG4gICAgICBsZXQgcG9wVXBTdGF0dXMgPSAwOyAvLyAwOiBoaWRkZW4sIDE6IHZpc2libGVcbiAgICAgIGNvbnN0IGFycm93TWFyZ2luID0gMjc7IC8vIFNlZSBhc3NldC5zdHlsLiAkYmFsbG9vbi10cmlhbmdsZS1zaXplID0gMTFweCwgJGJhbGxvb24tdHJpYW5nbGUtbGVmdCA9IDE2cHhcbiAgXG4gICAgICAkdC5vbihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICAgICAgbGV0IHNlbGYgPSAkdDtcbiAgICAgICAgbGV0IHpJbmRleCA9IDk5OTk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjYWxjUG9zaXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgIGxldCB0b3AsbGVmdDtcbiAgXG4gICAgICAgICAgc3dpdGNoKHNldHRpbmcucGxhY2VtZW50KXtcbiAgICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgKyBzZWxmLmhlaWdodCgpICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHt0b3A6IDAsIGxlZnQ6IDB9KTsgLy8gUHJldmVudCBjb250ZW50cyB3cmFwcGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgJHdyYXBwZXIud2lkdGgoKVxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpIC0gJHdyYXBwZXIud2lkdGgoKSAtIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgXG4gICAgICAgICAgICAgIGxldCB3cmFwcGVyX2hlaWdodCA9ICR3cmFwcGVyLmhlaWdodCgpO1xuICAgICAgICAgICAgICBjb25zdCByZW1haW4gPSAodG9wICsgd3JhcHBlcl9oZWlnaHQpIC0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICBpZihyZW1haW4gPiAwKXtcbiAgICAgICAgICAgICAgICB0b3AgPSB0b3AgLSB3cmFwcGVyX2hlaWdodCArIGFycm93TWFyZ2luICogMjtcbiAgICAgICAgICAgICAgICAkYmFsbG9vbi5hZGRDbGFzcyhcInVwcGVyXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJGJhbGxvb24ucmVtb3ZlQ2xhc3MoXCJ1cHBlclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAkd3JhcHBlci5jc3Moe3RvcDogMCwgcmlnaHQ6IDB9KTsgLy8gUHJldmVudCBjb250ZW50cyB3cmFwcGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgJHdyYXBwZXIud2lkdGgoKVxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICAgIGxlZnQgPSBzZWxmLm9mZnNldCgpLmxlZnQgLSAkZG9jdW1lbnQuc2Nyb2xsTGVmdCgpICsgc2VsZi53aWR0aCgpIC0gc2V0dGluZy5tYXJnaW5MZWZ0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIHJldHVybiB7dG9wLCBsZWZ0fTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICBcbiAgICAgICAgJHdyYXBwZXJcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgIFwidG9wXCI6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIFwibGVmdFwiOiBwb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgXCJ6LWluZGV4XCI6IHpJbmRleCxcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDE7XG4gIFxuICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGwuYmFsbG9vblwiLCAoZSkgPT4ge1xuICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgJHQub24oXCJtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgXCJvcGFjaXR5XCI6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDA7XG4gICAgICAgIFxuICAgICAgICAkKHdpbmRvdykub2ZmKFwic2Nyb2xsLmJhbGxvb25cIik7XG4gICAgICB9KTtcbiAgXG4gICAgICAkdC5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCAoZSkgPT4ge1xuICAgICAgICBpZihwb3BVcFN0YXR1cyA9PT0gMCl7XG4gICAgICAgICAgJHdyYXBwZXIuY3NzKFwiei1pbmRleFwiLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAkd3JhcHBlci5vbihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufShqUXVlcnkpKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IGhlYWRlclwiO1xuICAgIFxuICAgIHRoaXMuc3RpY2t5KCk7XG4gIH1cbiAgXG4gIHN0aWNreSgpe1xuICAgIGxldCBzY3JvbGxEb3duVGhyZXNob2xkID0gMjAwO1xuICAgIGxldCBzY3JvbGxVcFRocmVzaG9sZCA9IDEwMDtcbiAgICBsZXQgbWVkaWFRdWVyeVN0cmluZyA9IFwiKG1pbi13aWR0aDogMTIwMHB4KSwgKG1pbi13aWR0aDogODAwcHgpIGFuZCAobWF4LXdpZHRoOiAxMTk5cHgpXCI7XG4gICAgXG4gICAgbGV0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG4gICAgbGV0IGhlYWRlciA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgbGV0IHJlc2l6aW5nID0gZmFsc2U7XG4gIFxuICAgIGNvbnN0IG9uVHJhbnNpdGlvbkVuZCA9IChlKSA9PiB7XG4gICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICByZXNpemluZyA9IGZhbHNlO1xuICAgIH07XG4gIFxuICAgIGhlYWRlci5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCBvblRyYW5zaXRpb25FbmQpO1xuICBcbiAgICAkd2luZG93Lm9uKFwic2Nyb2xsXCIsIChlKSA9PiB7XG4gICAgICBpZighd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeVN0cmluZykubWF0Y2hlcyB8fCByZXNpemluZykgcmV0dXJuO1xuICAgIFxuICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICBcbiAgICAgIGlmKHNjcm9sbFVwVGhyZXNob2xkIDwgc2Nyb2xsVG9wICYmIHNjcm9sbFRvcCA8IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcInNjcm9sbC1tYXJnaW5cIikpIGhlYWRlci5hZGRDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgbGV0IGhlYWRlcl9oZWlnaHQgPSAzMDAgKyAyMCAtIHNjcm9sbFRvcDtcbiAgICAgICAgaGVhZGVyLmNzcyh7XG4gICAgICAgICAgaGVpZ2h0OiBoZWFkZXJfaGVpZ2h0LFxuICAgICAgICAgIGJvdHRvbTogYGNhbGMoMTAwJSAtICR7aGVhZGVyX2hlaWdodH1weClgXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgaWYoc2Nyb2xsVG9wID49IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZihoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoc2Nyb2xsVG9wIDw9IHNjcm9sbFVwVGhyZXNob2xkKXtcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBoZWFkZXIuYWRkQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gbWFpbiA+IG5hdlwiO1xuICAgIFxuICAgIHRoaXMuaW5pdFRvZ2dsZUJ1dHRvbigpO1xuICAgIHRoaXMuYnVpbGRFbWFpbEFkZHJlc3MoKTtcbiAgICB0aGlzLmJ1aWxkQmFsbG9vbigpO1xuICAgIHRoaXMuc2V0SGVhZGxpbmUoKTtcbiAgICB0aGlzLndyYXBIZWFkbGluZSgpO1xuICAgIHRoaXMuc2V0dXBMYW5nQnV0dG9uKCk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBXcmFwIGhlYWRsaW5lIHdpdGggbG9uZyB0ZXh0IGJ5IGpxdWVyeS5kb3Rkb3Rkb3RcbiAgICovXG4gIHdyYXBIZWFkbGluZSgpe1xuICAgIGxldCBoZWFkbGluZVRpdGxlID0gJCh0aGlzLnNlbGVjdG9yKS5maW5kKFwiLmhlYWRsaW5lIC5oZWFkbGluZS10aXRsZVwiKTtcbiAgICBoZWFkbGluZVRpdGxlLmRvdGRvdGRvdCh7XG4gICAgICB0cnVuY2F0ZTogXCJsZXR0ZXJcIixcbiAgICAgIHdhdGNoOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBDcmVhdGUgaHRtbCBlbGVtZW50cyByZXByZXNlbnRpbmcgaGVhZGxpbmUgaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVybCBvZiB0aGUgYXJ0aWNsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSBUaXRsZSBvZiB0aGUgYXJ0aWNsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gLSBEZXNjcmlwdGlvbiBvZiB0aGUgYXJ0aWNsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHVibGlzaGVkX3RpbWUgLSBTdHJpbmcgZm9yIHB1Ymxpc2hlZCBkYXRlIG9mIHRoZSBhcnRpY2xlLlxuICAgKiBAcmV0dXJucyB7alF1ZXJ5fVxuICAgKi9cbiAgY3JlYXRlSGVhZGxpbmVJdGVtKHVybCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBwdWJsaXNoZWRfdGltZSl7XG4gICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0naGVhZGxpbmUtaXRlbSc+XCIpO1xuICAgICRjb250YWluZXJcbiAgICAgIC5hcHBlbmQoXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdoZWFkbGluZS10aXRsZSc+XCIpLmFwcGVuZChcbiAgICAgICAgICBgPGEgaHJlZj1cIiR7dXJsfVwiPiR7dGl0bGV9PC9hPmBcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLmFwcGVuZChgPGRpdiBjbGFzcz0naGVhZGxpbmUtbWV0YSc+JHtwdWJsaXNoZWRfdGltZX08L2Rpdj5gKVxuICAgIDtcbiAgICBcbiAgICBpZihkZXNjcmlwdGlvbil7XG4gICAgICAkY29udGFpbmVyLmF0dHIoXCJ0aXRsZVwiLCBkZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIGF0dGFjaCBoZWFkbGluZSBsaXN0IHRvIHNpZGViYXIuXG4gICAqIEhlYWRsaW5lIGRhdGEgYXJlIGZldGNoZWQgZnJvbSBmdW5jdGlvbiBgJCRhcnRpY2xlX2xpc3QoKWAsIHdoaWNoIGNvbWVzIGZyb21cbiAgICogZXh0ZXJuYWwgPHNjcmlwdD4gdGFnLlxuICAgKiBCeSBwdXR0aW5nIHRoZSBsaXN0IG9mIGFydGljbGUgaW50byBzZXBhcmF0ZSBleHRlcm5hbCA8c2NyaXB0PiB0YWcsXG4gICAqIGRldmVsb3BlciBjYW4gZnJlZWx5IG1vZGlmeSBoZWFkbGluZSBsaXN0IHdpdGhvdXQgaGFyZC1jb2RpbmcgaXQgdG9cbiAgICogc2l0ZSBzY3JpcHQgZmlsZS5cbiAgICovXG4gIHNldEhlYWRsaW5lKCl7XG4gICAgY29uc3QgYXJ0aWNsZXMgPSAkJGFydGljbGVfbGlzdCgpOyAvLyBUaGlzIGNvbWVzIGZyb20gZXh0ZXJuYWwgPHNjcmlwdD4gdGFnLlxuICAgIGlmKCFhcnRpY2xlcyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFuZyA9ICQoXCJodG1sXCIpLmF0dHIoXCJsYW5nXCIpIHx8IFwiamFcIjtcbiAgICBjb25zdCBhcnRpY2xlX3RyZWUgPSBhcnRpY2xlc1tsYW5nXTtcblxuICAgIGNvbnN0IGFjdGl2ZV90b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpzZWN0aW9uJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3QgYWN0aXZlX3N1YnRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnRhZyddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICBcbiAgICBjb25zdCAkdG9waWNfY29udGFpbmVyID0gJChcIiN0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcbiAgICBjb25zdCAkc3VidG9waWNfY29udGFpbmVyID0gJChcIiNzdWJ0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcbiAgICBjb25zdCAkYXJ0aWNsZV9jb250YWluZXIgPSAkKFwiI2FydGljbGUtbGlzdFwiKS5maW5kKFwiLmhlYWRsaW5lXCIpO1xuICAgIFxuICAgIC8qKlxuICAgICAqIFNldHVwIHRvcGljIHNlY3Rpb25cbiAgICAgKi9cbiAgICBjb25zdCB0b3BpY3MgPSAobGlzdCwgYWN0aXZlX3RvcGljKSA9PiB7XG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKTtcbiAgICAgIE9iamVjdC5rZXlzKGxpc3QpLmZvckVhY2goKHZhbCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0ICR0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG4gICAgXG4gICAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3RvcGljIHx8ICghYWN0aXZlX3RvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICAgJHRvcGljLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICAkd3JhcHBlci5hcHBlbmQoJHRvcGljKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gJHdyYXBwZXIuY2hpbGRyZW4oKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgc3ViIHRvcGljIHNlY3Rpb25cbiAgICAgKi9cbiAgICBjb25zdCBzdWJUb3BpY3MgPSAobGlzdCwgdG9waWMsIGFjdGl2ZV9zdWJ0b3BpYykgPT4ge1xuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdj5cIik7XG4gICAgICBPYmplY3Qua2V5cyhsaXN0W3RvcGljXSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgJHN1YnRvcGljID0gJChgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHt2YWx9PC9zcGFuPjwvYT5gKTtcbiAgICBcbiAgICAgICAgaWYodmFsID09PSBhY3RpdmVfc3VidG9waWMgfHwgKCFhY3RpdmVfc3VidG9waWMgJiYgaW5kZXggPT09IDApKXtcbiAgICAgICAgICAkc3VidG9waWMuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgJHdyYXBwZXIuYXBwZW5kKCRzdWJ0b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgcmV0dXJuICR3cmFwcGVyLmNoaWxkcmVuKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIGhlYWRsaW5lIGFyZWFcbiAgICAgKi9cbiAgICBjb25zdCBoZWFkbGluZXMgPSAobGlzdCwgdG9waWMsIHN1YnRvcGljKSA9PiB7XG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKTtcbiAgICAgIE9iamVjdC5rZXlzKGxpc3RbdG9waWNdW3N1YnRvcGljXSkuZm9yRWFjaCgodiwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGFydGljbGUgPSBsaXN0W3RvcGljXVtzdWJ0b3BpY11bdl07XG4gICAgICAgIGxldCBhcnRpY2xlX2R0aW1lID0gKG5ldyBEYXRlKGFydGljbGUucHVibGlzaGVkX3RpbWUpKVxuICAgICAgICAgIC50b0xvY2FsZURhdGVTdHJpbmcobGFuZywge3llYXI6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCJ9KTtcbiAgICBcbiAgICAgICAgbGV0ICRoZWFkbGluZSA9IHRoaXMuY3JlYXRlSGVhZGxpbmVJdGVtKGFydGljbGUucGF0aCwgYXJ0aWNsZS50aXRsZSwgYXJ0aWNsZS5kZXNjcmlwdGlvbiwgYXJ0aWNsZV9kdGltZSk7XG4gICAgICAgICR3cmFwcGVyLmFwcGVuZCgkaGVhZGxpbmUpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHJldHVybiAkd3JhcHBlci5jaGlsZHJlbigpO1xuICAgIH07XG4gIFxuICAgICR0b3BpY19jb250YWluZXIuYXBwZW5kKHRvcGljcyhhcnRpY2xlX3RyZWUsIGFjdGl2ZV90b3BpYykpO1xuICAgICRzdWJ0b3BpY19jb250YWluZXIuYXBwZW5kKHN1YlRvcGljcyhhcnRpY2xlX3RyZWUsIGFjdGl2ZV90b3BpYywgYWN0aXZlX3N1YnRvcGljKSk7XG4gICAgJGFydGljbGVfY29udGFpbmVyLmFwcGVuZChoZWFkbGluZXMoYXJ0aWNsZV90cmVlLCBhY3RpdmVfdG9waWMsIGFjdGl2ZV9zdWJ0b3BpYykpO1xuICAgIFxuICAgICR0b3BpY19jb250YWluZXIuZmluZChcImFcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGNvbnN0IHRvcGljID0gJHRoaXMuZmluZChcInNwYW4udGFnXCIpLnRleHQoKTtcbiAgXG4gICAgICAkdG9waWNfY29udGFpbmVyLmZpbmQoXCJhLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICR0aGlzLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgXG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmFwcGVuZChzdWJUb3BpY3MoYXJ0aWNsZV90cmVlLCB0b3BpYykpO1xuICAgICAgXG4gICAgICBjb25zdCBzdWJ0b3BpYyA9ICRzdWJ0b3BpY19jb250YWluZXIuZmluZChcImEuYWN0aXZlXCIpLnRleHQoKTtcbiAgICAgIFxuICAgICAgJGFydGljbGVfY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKGhlYWRsaW5lcyhhcnRpY2xlX3RyZWUsIHRvcGljLCBzdWJ0b3BpYykpO1xuICAgIH0pO1xuICBcbiAgICAkc3VidG9waWNfY29udGFpbmVyLmZpbmQoXCJhXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBjb25zdCB0b3BpYyA9ICR0b3BpY19jb250YWluZXIuZmluZChcImEuYWN0aXZlXCIpLnRleHQoKTtcbiAgICAgIGNvbnN0IHN1YnRvcGljID0gJHRoaXMuZmluZChcInNwYW4udGFnXCIpLnRleHQoKTtcbiAgXG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmZpbmQoXCJhLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICR0aGlzLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIFxuICAgICAgJGFydGljbGVfY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKGhlYWRsaW5lcyhhcnRpY2xlX3RyZWUsIHRvcGljLCBzdWJ0b3BpYykpO1xuICAgIH0pO1xuICB9XG4gIFxuICAvKipcbiAgICogRGVmaW5lcyB0b2dnbGUgYnV0dG9uIG9wZW4vY2xvc2UgYmVoYXZpb3VyXG4gICAqL1xuICBpbml0VG9nZ2xlQnV0dG9uKCl7XG4gICAgbGV0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuICAgIGxldCAkc2lkZWJhciA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgbGV0ICR0YWdzID0gJHNpZGViYXIuZmluZChcIi50YWdzXCIpO1xuICAgIGxldCAkYnV0dG9uID0gJChcIiNzaWRlYmFyLXRvZ2dsZS1idXR0b25cIik7XG4gICAgXG4gICAgY29uc3QgY2xvc2VTaWRlYmFyID0gKGUpID0+IHtcbiAgICAgIC8vIERvIG5vdGhpbmcgaWYgb3V0c2lkZSBvZiBzaWRlYmFyIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAgICAvLyBIb3dldmVyLCBpZiBzY3JlZW4gc2l6ZSBpcyBmb3IgbW9iaWxlLCBjbG9zZSBzaWRlYmFyIHdoZXJldmVyIGlzIGNsaWNrZWQuXG4gICAgICBpZighd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3OTlweClcIikubWF0Y2hlcyAmJlxuICAgICAgICAkc2lkZWJhci5pcyhlLnRhcmdldCkgfHwgJHNpZGViYXIuaGFzKGUudGFyZ2V0KS5sZW5ndGggPiAwKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICBcbiAgICAgICRzaWRlYmFyLnJlbW92ZUNsYXNzKFwidmlzaWJsZVwiKTtcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IG9uVG9nZ2xlQnV0dG9uQ2xpY2tlZCA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgXG4gICAgICBpZigkc2lkZWJhci5oYXNDbGFzcyhcInZpc2libGVcIikpe1xuICAgICAgICAkc2lkZWJhci5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XG4gICAgICAgICRkb2N1bWVudC5vZmYoXCJjbGljay5jbG9zZVNpZGViYXJcIik7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICAkc2lkZWJhci5hZGRDbGFzcyhcInZpc2libGVcIik7XG4gICAgICAgICRkb2N1bWVudC5vbihcImNsaWNrLmNsb3NlU2lkZWJhclwiLCBjbG9zZVNpZGViYXIpO1xuICAgICAgfVxuICAgIH07XG4gIFxuICAgICRidXR0b24ub24oXCJjbGlja1wiLCBvblRvZ2dsZUJ1dHRvbkNsaWNrZWQpO1xuICB9XG4gIFxuICAvKipcbiAgICogU2FuaXRpemUgZW1haWwgYWRkcmVzcyB0ZXh0LlxuICAgKiBFbWFpbCBhZGRyZXNzIHdpbGwgYmUgZGlzcGxheWVkIGluIHByb2ZpbGUgc2VjdGlvbixcbiAgICogYnV0IG9ubHkgaHVtYW4gY2FuIHNlZSB0aGUgdGV4dC5cbiAgICovXG4gIGJ1aWxkRW1haWxBZGRyZXNzKCl7XG4gICAgbGV0IHBhZ2VPcGVuZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBsZXQgaXNBbHJlYWR5QnVpbHQgPSBmYWxzZTtcbiAgICBsZXQgJGVtYWlsID0gJChcIi5wcm9maWxlIC5zb2NpYWwgLmVtYWlsXCIpO1xuICAgIFxuICAgIGNvbnN0IGFkZHIgPSBbODA1OSwgNjA4OCwgNzE2MywgNTA2MywgNzM4NCwgLTI4MjEsIDU4NzksIDYwODgsIDcxNjMsIDQ0NzIsIDgyODgsIDUyNjQsIC0zMDg4LCA1NjcyLCA2MDg4LCA4NTE5LCA1ODc5LCA4NzUyLCA0NjY3LCA3NjA3LCA0NDcyLCA1NjcyLCA1MjY0LCA4Mjg4LCAtODQxLCA1NjcyLCA2OTQ0LCA0NDcyLCA2MDg4LCA2NzI3LCAtMjgyMSwgNDg2NCwgNzM4NCwgNjk0NF07XG4gICAgXG4gICAgY29uc3QgbWFrZUFkZHJlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYoaXNBbHJlYWR5QnVpbHQgJiYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gcGFnZU9wZW5lZCkgPiAxNTAwKSByZXR1cm47XG4gICAgICBcbiAgICAgICRlbWFpbC5hdHRyKFwiaHJlZlwiLCBcIm1haWx0bzpcIiArIGFkZHIubWFwKGZ1bmN0aW9uKHYpe1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShNYXRoLnNxcnQodis0OTM3KSlcbiAgICAgIH0pLmpvaW4oXCJcIikpO1xuICAgIH07XG4gICAgXG4gICAgJGVtYWlsLm9uKFwibW91c2VvdmVyIHRvdWNoc3RhcnRcIiwgbWFrZUFkZHJlc3MpO1xuICB9XG4gIFxuICAvKipcbiAgICogQmFsbG9vbiBmb3IgZGV0YWlsIHByb2ZpbGUuXG4gICAqL1xuICBidWlsZEJhbGxvb24oKXtcbiAgICAkKHRoaXMuc2VsZWN0b3IgKyBcIiBbZGF0YS1iYWxsb29uXVwiKS5iYWxsb29uKHtcbiAgICAgIHBsYWNlbWVudDogXCJsZWZ0XCIsXG4gICAgICBjb2xvcjogXCJibGFja1wiLFxuICAgICAgbWFyZ2luVG9wOiAkKFwiLnByb2ZpbGUtYXR0cmlidXRlXCIpLmhlaWdodCgpIC8gMlxuICAgIH0pO1xuICB9XG4gIFxuICAvKipcbiAgICogU2V0IHVybCB0byBjb3JyZXNwb25kaW5nIHBhZ2Ugd3JpdHRlbiBpbiBhbm90aGVyIGxhbmd1YWdlXG4gICAqIHRvIGxhbmd1YWdlIGJ1dHRvbihhbmNob3IpLlxuICAgKi9cbiAgc2V0dXBMYW5nQnV0dG9uKCl7XG4gICAgY29uc3QgJGFuY2hvciA9ICQoXCIubGFuZ3VhZ2UucHJvZmlsZS1hdHRyaWJ1dGUgYVtkYXRhLWxhbmddXCIpO1xuICAgIGNvbnN0IGN1cnJlbnRfbGFuZyA9ICQoXCJodG1sXCIpLmF0dHIoXCJsYW5nXCIpO1xuICAgIGNvbnN0IGFydGljbGVfaWQgPSAkKFwiaGVhZCA+IG1ldGFbbmFtZT0nYXJ0aWNsZUlEJ11bY29udGVudF1cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3QgdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHN1YnRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnRhZyddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuXG4gICAgJGFuY2hvci5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBjb25zdCB0YXJnZXRfbGFuZyA9ICR0aGlzLmRhdGEoXCJsYW5nXCIpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYXJ0aWNsZSA9ICQkYXJ0aWNsZV9saXN0KClbdGFyZ2V0X2xhbmddW3RvcGljXVtzdWJ0b3BpY11bYXJ0aWNsZV9pZF07XG4gICAgICAgICR0aGlzLmF0dHIoXCJocmVmXCIsIGFydGljbGUucGF0aCk7XG4gICAgICB9XG4gICAgICBjYXRjaChlKXt9XG4gICAgfSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gbWFpbiA+IGFydGljbGVcIjtcblxuICAgIHRoaXMuYnVpbGRBcnRpY2xlSGVhZGVyKCk7XG4gIH1cblxuICBidWlsZEFydGljbGVIZWFkZXIoKXtcbiAgICBjb25zdCAkYXJ0aWNsZSA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgY29uc3QgJGhlYWRlciA9ICRhcnRpY2xlLmZpbmQoXCIuYXJ0aWNsZS1oZWFkZXJcIik7XG4gICAgY29uc3QgbGFuZyA9ICQoXCJodG1sXCIpLmF0dHIoXCJsYW5nXCIpIHx8IFwiamFcIjtcbiAgICBjb25zdCB0aXRsZSA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nb2c6dGl0bGUnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgICBjb25zdCB0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpzZWN0aW9uJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3Qgc3VidG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6dGFnJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgbGV0IHB1Ymxpc2hlZF90aW1lID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnB1Ymxpc2hlZF90aW1lJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG5cbiAgICBwdWJsaXNoZWRfdGltZSA9IChuZXcgRGF0ZShEYXRlLnBhcnNlKHB1Ymxpc2hlZF90aW1lKSkpXG4gICAgICAudG9Mb2NhbGVEYXRlU3RyaW5nKGxhbmcsIHtcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIlxuICAgICAgfSk7XG5cbiAgICBsZXQgaGVhZGVyX3N0cmluZyA9IGBcbiAgICAgIDxkaXYgY2xhc3M9J3RhZ3MnPlxuICAgICAgICA8YT48c3BhbiBjbGFzcz0ndGFnJz4ke3RvcGljfTwvc3Bhbj5cbiAgICAgICAgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHtzdWJ0b3BpY308L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxoMSBjbGFzcz0nYXJ0aWNsZS10aXRsZSc+JHt0aXRsZX08L2gxPlxuICAgICAgPGRpdiBjbGFzcz0nYXJ0aWNsZS1kYXRlJz5cbiAgICAgIDxpIGNsYXNzPSdmYSBmYS1jbG9jay1vJz48L2k+ICR7cHVibGlzaGVkX3RpbWV9PC9kaXY+XG4gICAgYDtcblxuICAgICRoZWFkZXIuaHRtbChoZWFkZXJfc3RyaW5nKTtcbiAgfVxufVxuIiwiaW1wb3J0IFwiLi9hc3NldFwiO1xuaW1wb3J0IEhlYWRlciBmcm9tIFwiLi9jb21wb25lbnRzL2hlYWRlclwiO1xuaW1wb3J0IFNpZGViYXIgZnJvbSBcIi4vY29tcG9uZW50cy9zaWRlYmFyXCI7XG5pbXBvcnQgQ29udGVudCBmcm9tIFwiLi9jb250ZW50c1wiO1xuXG5jb25zdCBtYWluID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgaGVhZGVyID0gbmV3IEhlYWRlcigpO1xuICBjb25zdCBzaWRlYmFyID0gbmV3IFNpZGViYXIoKTtcbiAgY29uc3QgY29udGVudCA9IG5ldyBDb250ZW50KCk7XG59O1xuXG4kKG1haW4pO1xuIl19
