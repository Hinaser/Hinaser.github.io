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
      "marginLeft": 0,
      "opacity": 1
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
      var $this = $(this);
      var $contents = $this.find(".balloon-contents");
      var content = void 0;

      if (!$contents || $contents.length < 1) {
        if (!(content = $this.data('balloon'))) return;
      } else {
        content = $contents.html();
      }

      var $balloon = $("<div>").addClass("balloon").addClass(setting.placement).html(content);

      if (setting.color) {
        $balloon.addClass(setting.color);
      }

      var $wrapper = $("<div>").css(wrapperInitialStyle);

      $wrapper.append($balloon);
      $this.append($wrapper);
      $contents.remove();

      var popUpStatus = 0; // 0: hidden, 1: visible
      var arrowMargin = 27; // See asset.styl. $balloon-triangle-size = 11px, $balloon-triangle-left = 16px

      $this.on("mouseenter", function (e) {
        var self = $this;
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
              left = self.offset().left - $document.scrollLeft() + self.width() + setting.marginLeft;
              break;
          }

          return { top: top, left: left };
        };

        var position = calcPosition();

        $wrapper.css({
          "top": position.top,
          "left": position.left,
          "z-index": zIndex,
          "opacity": setting.opacity
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

      $this.on("mouseleave", function (e) {
        $wrapper.css({
          "opacity": 0
        });

        popUpStatus = 0;

        $(window).off("scroll.balloon");
      });

      $this.on("transitionend webkitTransitionEnd oTransitionEnd", function (e) {
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
       * Get jQuery elements list of topics
       *
       * @param {Object} list - This should be $$article_list()[lang]
       * @param {string} active_topic - Text of the topic
       * @returns {*}
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
       * Get jQuery elements list of subtopics
       *
       * @param {Object} list - This should be $$article_list()[lang]
       * @param {string} topic - Text of the topic
       * @param {string} active_subtopic - Text of the subtopic
       * @returns {*}
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
       * Get jQuery elements list of headline
       *
       * @param {Object} list - This should be $$article_list()[lang]
       * @param {string} topic - Text of the topic
       * @param {string} subtopic - Text of the subtopic
       * @returns {*}
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

      /**
       * When subtopic is clicked, headlines associated with the subtopic will be
       * shown on headline area.
       *
       * @param {Event} e
       */
      var onClickSubtopic = function onClickSubtopic(e) {
        e.preventDefault();
        var $this = $(this);
        var topic = $topic_container.find("a.active").text();
        var subtopic = $this.find("span.tag").text();

        $subtopic_container.find("a.active").removeClass("active");
        $this.addClass("active");

        $article_container.empty();
        $article_container.append(headlines(article_tree, topic, subtopic));
      };

      /**
       * When topic is clicked, subtopics associated with the topic will be
       * shown on headline area.
       *
       * @param {Event} e
       */
      var onClickTopic = function onClickTopic(e) {
        e.preventDefault();
        var $this = $(this);
        var topic = $this.find("span.tag").text();

        $topic_container.find("a.active").removeClass("active");
        $this.addClass("active");

        $subtopic_container.empty();
        $subtopic_container.append(subTopics(article_tree, topic));
        $subtopic_container.find("a").on("click", onClickSubtopic);

        var subtopic = $subtopic_container.find("a.active").text();

        $article_container.empty();
        $article_container.append(headlines(article_tree, topic, subtopic));
      };

      $topic_container.append(topics(article_tree, active_topic));
      $subtopic_container.append(subTopics(article_tree, active_topic, active_subtopic));
      $article_container.append(headlines(article_tree, active_topic, active_subtopic));

      $topic_container.find("a").on("click", onClickTopic);
      $subtopic_container.find("a").on("click", onClickSubtopic);
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
      var articles = $$article_list();

      $anchor.each(function () {
        var $this = $(this);
        var target_lang = $this.data("lang");
        try {
          return Object.keys(articles[target_lang]).some(function (topic) {
            return Object.keys(articles[target_lang][topic]).some(function (subtopic) {
              return Object.keys(articles[target_lang][topic][subtopic]).some(function (article) {
                if (article === article_id) {
                  $this.attr("href", articles[target_lang][topic][subtopic][article].path);
                  return true;
                }
              });
            });
          });
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
      var dtime = new Date(Date.parse(published_time));
      var time_relative = this.timeRelativeToNow(dtime);

      var time_absolute = dtime.toLocaleTimeString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      var header_string = "\n      <div class='tags'>\n        <a><span class='tag'>" + topic + "</span></a>\n        <a><span class='tag'>" + subtopic + "</span></a>\n      </div>\n      <h1 class='article-title'>" + title + "</h1>\n      <div class='article-date' data-balloon='" + time_absolute + "'>\n        <i class='fa fa-clock-o'></i> " + time_relative + "\n      </div>\n    ";

      $header.html(header_string);
      var $article_date = $header.find('.article-date');
      $article_date.balloon({
        placement: "bottom",
        color: "black",
        marginTop: $($article_date).height() / 2,
        marginLeft: 7,
        opacity: .85
      });
    }

    /**
     * Get "...days ago" text relative to current date time.
     *
     * @param {Date} dtime - Absolute datetime
     * @returns {string}
     */

  }, {
    key: "timeRelativeToNow",
    value: function timeRelativeToNow(dtime) {
      var seconds = (new Date().getTime() - dtime) / 1000;
      var timeAgo = "";

      if (seconds < 60) {
        var t = parseInt(seconds);
        timeAgo = t + " second" + (t !== 1 ? 's' : '') + " ago";
      } else if (seconds < 3600) {
        var _t = parseInt(seconds / 60);
        timeAgo = _t + " minute" + (_t !== 1 ? 's' : '') + " ago";
      } else if (seconds < 86400) {
        var _t2 = parseInt(seconds / 3600);
        timeAgo = _t2 + " hour" + (_t2 !== 1 ? 's' : '') + " ago";
      } else if (seconds < 86400 * 31) {
        var _t3 = parseInt(seconds / 86400);
        timeAgo = _t3 + " day" + (_t3 !== 1 ? 's' : '') + " ago";
      } else if (seconds < 86400 * 31 * 12) {
        var _t4 = parseInt(seconds / 86400 / 31);
        timeAgo = _t4 + " month" + (_t4 !== 1 ? 's' : '') + " ago";
      } else {
        var _t5 = parseInt(seconds / 86400 / 31 / 12);
        timeAgo = _t5 + " year" + (_t5 !== 1 ? 's' : '') + " ago";
      }

      return timeAgo;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb250ZW50cy9pbmRleC5qcyIsInNzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7OztBQ0FBOzs7O0FBSUMsV0FBUyxDQUFULEVBQVc7QUFDVixJQUFFLEVBQUYsQ0FBSyxPQUFMLEdBQWUsVUFBUyxJQUFULEVBQWM7QUFDM0IsUUFBTSxVQUFVLEVBQUUsTUFBRixDQUFTO0FBQ3ZCLG1CQUFhLE1BRFU7QUFFdkIsZUFBUyxTQUZjO0FBR3ZCLG1CQUFhLENBSFU7QUFJdkIsb0JBQWMsQ0FKUztBQUt2QixpQkFBVztBQUxZLEtBQVQsRUFNYixJQU5hLENBQWhCOztBQVFBLFFBQUcsQ0FBQyxDQUFDLFFBQUQsRUFBVSxPQUFWLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLENBQW1DLFFBQVEsU0FBM0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLG9CQUFWLENBQU47QUFDRDtBQUNELFFBQUcsQ0FBQyxDQUFDLFNBQUQsRUFBVyxPQUFYLEVBQW1CLFNBQW5CLEVBQThCLFFBQTlCLENBQXVDLFFBQVEsS0FBL0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLGdCQUFWLENBQU47QUFDRDs7QUFFRCxRQUFNLHNCQUFzQjtBQUMxQixrQkFBWSxPQURjO0FBRTFCLGlCQUFXLENBRmU7QUFHMUIsaUJBQVcsQ0FBQyxDQUhjO0FBSTFCLG9CQUFjO0FBSlksS0FBNUI7O0FBT0EsUUFBSSxZQUFZLEVBQUUsUUFBRixDQUFoQjs7QUFFQSxT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QSxrQkFBYSxHQUFiLGNBQXNCLFFBQUksQ0FBSixHQUFNLEdBQU4sR0FBVSxFQUFoQztBQUNEOztBQUVELGFBQU8sT0FBUDtBQUNEOzs7Ozs7a0JBbEZrQixPOzs7OztBQ0FyQjs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU8sR0FBVTtBQUNyQixNQUFNLFNBQVMsc0JBQWY7QUFDQSxNQUFNLFVBQVUsdUJBQWhCO0FBQ0EsTUFBTSxVQUFVLHdCQUFoQjtBQUNELENBSkQ7O0FBTUEsRUFBRSxJQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9zdGFuZGFyZCc7XG4iLCIvKipcbiAqIEF1dG8gZGlzcGxheSBiYWxsb29uIGZvciBlbGVtZW50c1xuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG4oZnVuY3Rpb24oJCl7XG4gICQuZm4uYmFsbG9vbiA9IGZ1bmN0aW9uKG9wdHMpe1xuICAgIGNvbnN0IHNldHRpbmcgPSAkLmV4dGVuZCh7XG4gICAgICBcInBsYWNlbWVudFwiOiBcImxlZnRcIixcbiAgICAgIFwiY29sb3JcIjogdW5kZWZpbmVkLFxuICAgICAgXCJtYXJnaW5Ub3BcIjogMCxcbiAgICAgIFwibWFyZ2luTGVmdFwiOiAwLFxuICAgICAgXCJvcGFjaXR5XCI6IDFcbiAgICB9LCBvcHRzKTtcbiAgICBcbiAgICBpZighW1wiYm90dG9tXCIsXCJyaWdodFwiLFwibGVmdFwiXS5pbmNsdWRlcyhzZXR0aW5nLnBsYWNlbWVudCkpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwbGFjZW1lbnQuXCIpO1xuICAgIH1cbiAgICBpZighW1wiZGVmYXVsdFwiLFwiYmxhY2tcIix1bmRlZmluZWRdLmluY2x1ZGVzKHNldHRpbmcuY29sb3IpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IuXCIpO1xuICAgIH1cbiAgXG4gICAgY29uc3Qgd3JhcHBlckluaXRpYWxTdHlsZSA9IHtcbiAgICAgIFwicG9zaXRpb25cIjogXCJmaXhlZFwiLFxuICAgICAgXCJvcGFjaXR5XCI6IDAsXG4gICAgICBcInotaW5kZXhcIjogLTEsXG4gICAgICBcInRyYW5zaXRpb25cIjogXCJvcGFjaXR5IGVhc2UgLjNzXCJcbiAgICB9O1xuICAgIFxuICAgIGxldCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbiAgXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgbGV0ICRjb250ZW50cyA9ICR0aGlzLmZpbmQoXCIuYmFsbG9vbi1jb250ZW50c1wiKTtcbiAgICAgIGxldCBjb250ZW50O1xuICAgICAgXG4gICAgICBpZighJGNvbnRlbnRzIHx8ICRjb250ZW50cy5sZW5ndGggPCAxKXtcbiAgICAgICAgaWYoIShjb250ZW50ID0gJHRoaXMuZGF0YSgnYmFsbG9vbicpKSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBjb250ZW50ID0gJGNvbnRlbnRzLmh0bWwoKTtcbiAgICAgIH1cbiAgICBcbiAgICAgIGNvbnN0ICRiYWxsb29uID0gJChcIjxkaXY+XCIpXG4gICAgICAgIC5hZGRDbGFzcyhcImJhbGxvb25cIilcbiAgICAgICAgLmFkZENsYXNzKHNldHRpbmcucGxhY2VtZW50KVxuICAgICAgICAuaHRtbChjb250ZW50KTtcbiAgICAgIFxuICAgICAgaWYoc2V0dGluZy5jb2xvcil7XG4gICAgICAgICRiYWxsb29uLmFkZENsYXNzKHNldHRpbmcuY29sb3IpO1xuICAgICAgfVxuICAgIFxuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdj5cIikuY3NzKHdyYXBwZXJJbml0aWFsU3R5bGUpO1xuICAgIFxuICAgICAgJHdyYXBwZXIuYXBwZW5kKCRiYWxsb29uKTtcbiAgICAgICR0aGlzLmFwcGVuZCgkd3JhcHBlcik7XG4gICAgICAkY29udGVudHMucmVtb3ZlKCk7XG4gIFxuICAgICAgbGV0IHBvcFVwU3RhdHVzID0gMDsgLy8gMDogaGlkZGVuLCAxOiB2aXNpYmxlXG4gICAgICBjb25zdCBhcnJvd01hcmdpbiA9IDI3OyAvLyBTZWUgYXNzZXQuc3R5bC4gJGJhbGxvb24tdHJpYW5nbGUtc2l6ZSA9IDExcHgsICRiYWxsb29uLXRyaWFuZ2xlLWxlZnQgPSAxNnB4XG4gIFxuICAgICAgJHRoaXMub24oXCJtb3VzZWVudGVyXCIsIChlKSA9PiB7XG4gICAgICAgIGxldCBzZWxmID0gJHRoaXM7XG4gICAgICAgIGxldCB6SW5kZXggPSA5OTk5O1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2FsY1Bvc2l0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICBsZXQgdG9wLGxlZnQ7XG4gIFxuICAgICAgICAgIHN3aXRjaChzZXR0aW5nLnBsYWNlbWVudCl7XG4gICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpICsgc2VsZi5oZWlnaHQoKSArIHNldHRpbmcubWFyZ2luVG9wO1xuICAgICAgICAgICAgICBsZWZ0ID0gc2VsZi5vZmZzZXQoKS5sZWZ0IC0gJGRvY3VtZW50LnNjcm9sbExlZnQoKSAtIGFycm93TWFyZ2luICsgc2V0dGluZy5tYXJnaW5MZWZ0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICR3cmFwcGVyLmNzcyh7dG9wOiAwLCBsZWZ0OiAwfSk7IC8vIFByZXZlbnQgY29udGVudHMgd3JhcHBpbmcgYmVmb3JlIGNhbGN1bGF0aW5nICR3cmFwcGVyLndpZHRoKClcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luVG9wO1xuICAgICAgICAgICAgICBsZWZ0ID0gc2VsZi5vZmZzZXQoKS5sZWZ0IC0gJGRvY3VtZW50LnNjcm9sbExlZnQoKSAtICR3cmFwcGVyLndpZHRoKCkgLSBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gIFxuICAgICAgICAgICAgICBsZXQgd3JhcHBlcl9oZWlnaHQgPSAkd3JhcHBlci5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgY29uc3QgcmVtYWluID0gKHRvcCArIHdyYXBwZXJfaGVpZ2h0KSAtIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgICAgaWYocmVtYWluID4gMCl7XG4gICAgICAgICAgICAgICAgdG9wID0gdG9wIC0gd3JhcHBlcl9oZWlnaHQgKyBhcnJvd01hcmdpbiAqIDI7XG4gICAgICAgICAgICAgICAgJGJhbGxvb24uYWRkQ2xhc3MoXCJ1cHBlclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICRiYWxsb29uLnJlbW92ZUNsYXNzKFwidXBwZXJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgJHdyYXBwZXIuY3NzKHt0b3A6IDAsIHJpZ2h0OiAwfSk7IC8vIFByZXZlbnQgY29udGVudHMgd3JhcHBpbmcgYmVmb3JlIGNhbGN1bGF0aW5nICR3cmFwcGVyLndpZHRoKClcbiAgICAgICAgICAgICAgdG9wID0gc2VsZi5vZmZzZXQoKS50b3AgLSAkZG9jdW1lbnQuc2Nyb2xsVG9wKCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luVG9wO1xuICAgICAgICAgICAgICBsZWZ0ID0gc2VsZi5vZmZzZXQoKS5sZWZ0IC0gJGRvY3VtZW50LnNjcm9sbExlZnQoKSArIHNlbGYud2lkdGgoKSArIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICByZXR1cm4ge3RvcCwgbGVmdH07XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBsZXQgcG9zaXRpb24gPSBjYWxjUG9zaXRpb24oKTtcbiAgICAgICAgXG4gICAgICAgICR3cmFwcGVyXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICBcInRvcFwiOiBwb3NpdGlvbi50b3AsXG4gICAgICAgICAgICBcImxlZnRcIjogcG9zaXRpb24ubGVmdCxcbiAgICAgICAgICAgIFwiei1pbmRleFwiOiB6SW5kZXgsXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogc2V0dGluZy5vcGFjaXR5XG4gICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDE7XG4gIFxuICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGwuYmFsbG9vblwiLCAoZSkgPT4ge1xuICAgICAgICAgIGxldCBwb3NpdGlvbiA9IGNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgJHRoaXMub24oXCJtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICAgICR3cmFwcGVyLmNzcyh7XG4gICAgICAgICAgXCJvcGFjaXR5XCI6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBwb3BVcFN0YXR1cyA9IDA7XG4gICAgICAgIFxuICAgICAgICAkKHdpbmRvdykub2ZmKFwic2Nyb2xsLmJhbGxvb25cIik7XG4gICAgICB9KTtcbiAgXG4gICAgICAkdGhpcy5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCAoZSkgPT4ge1xuICAgICAgICBpZihwb3BVcFN0YXR1cyA9PT0gMCl7XG4gICAgICAgICAgJHdyYXBwZXIuY3NzKFwiei1pbmRleFwiLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAkd3JhcHBlci5vbihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufShqUXVlcnkpKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IGhlYWRlclwiO1xuICAgIFxuICAgIHRoaXMuc3RpY2t5KCk7XG4gIH1cbiAgXG4gIHN0aWNreSgpe1xuICAgIGxldCBzY3JvbGxEb3duVGhyZXNob2xkID0gMjAwO1xuICAgIGxldCBzY3JvbGxVcFRocmVzaG9sZCA9IDEwMDtcbiAgICBsZXQgbWVkaWFRdWVyeVN0cmluZyA9IFwiKG1pbi13aWR0aDogMTIwMHB4KSwgKG1pbi13aWR0aDogODAwcHgpIGFuZCAobWF4LXdpZHRoOiAxMTk5cHgpXCI7XG4gICAgXG4gICAgbGV0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG4gICAgbGV0IGhlYWRlciA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgbGV0IHJlc2l6aW5nID0gZmFsc2U7XG4gIFxuICAgIGNvbnN0IG9uVHJhbnNpdGlvbkVuZCA9IChlKSA9PiB7XG4gICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICByZXNpemluZyA9IGZhbHNlO1xuICAgIH07XG4gIFxuICAgIGhlYWRlci5vbihcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZFwiLCBvblRyYW5zaXRpb25FbmQpO1xuICBcbiAgICAkd2luZG93Lm9uKFwic2Nyb2xsXCIsIChlKSA9PiB7XG4gICAgICBpZighd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeVN0cmluZykubWF0Y2hlcyB8fCByZXNpemluZykgcmV0dXJuO1xuICAgIFxuICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICBcbiAgICAgIGlmKHNjcm9sbFVwVGhyZXNob2xkIDwgc2Nyb2xsVG9wICYmIHNjcm9sbFRvcCA8IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcInNjcm9sbC1tYXJnaW5cIikpIGhlYWRlci5hZGRDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgbGV0IGhlYWRlcl9oZWlnaHQgPSAzMDAgKyAyMCAtIHNjcm9sbFRvcDtcbiAgICAgICAgaGVhZGVyLmNzcyh7XG4gICAgICAgICAgaGVpZ2h0OiBoZWFkZXJfaGVpZ2h0LFxuICAgICAgICAgIGJvdHRvbTogYGNhbGMoMTAwJSAtICR7aGVhZGVyX2hlaWdodH1weClgXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIFxuICAgICAgaWYoc2Nyb2xsVG9wID49IHNjcm9sbERvd25UaHJlc2hvbGQpe1xuICAgICAgICBpZihoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoc2Nyb2xsVG9wIDw9IHNjcm9sbFVwVGhyZXNob2xkKXtcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcInNjcm9sbC1tYXJnaW5cIik7XG4gICAgICBcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBoZWFkZXIuYWRkQ2xhc3MoXCJkaXNhYmxlLWhlaWdodC1hbmltYXRpb25cIik7XG4gICAgICAgIGhlYWRlci5yZW1vdmVDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gbWFpbiA+IG5hdlwiO1xuICAgIFxuICAgIHRoaXMuaW5pdFRvZ2dsZUJ1dHRvbigpO1xuICAgIHRoaXMuYnVpbGRFbWFpbEFkZHJlc3MoKTtcbiAgICB0aGlzLmJ1aWxkQmFsbG9vbigpO1xuICAgIHRoaXMuc2V0SGVhZGxpbmUoKTtcbiAgICB0aGlzLndyYXBIZWFkbGluZSgpO1xuICAgIHRoaXMuc2V0dXBMYW5nQnV0dG9uKCk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBXcmFwIGhlYWRsaW5lIHdpdGggbG9uZyB0ZXh0IGJ5IGpxdWVyeS5kb3Rkb3Rkb3RcbiAgICovXG4gIHdyYXBIZWFkbGluZSgpe1xuICAgIGxldCBoZWFkbGluZVRpdGxlID0gJCh0aGlzLnNlbGVjdG9yKS5maW5kKFwiLmhlYWRsaW5lIC5oZWFkbGluZS10aXRsZVwiKTtcbiAgICBoZWFkbGluZVRpdGxlLmRvdGRvdGRvdCh7XG4gICAgICB0cnVuY2F0ZTogXCJsZXR0ZXJcIixcbiAgICAgIHdhdGNoOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBDcmVhdGUgaHRtbCBlbGVtZW50cyByZXByZXNlbnRpbmcgaGVhZGxpbmUgaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVybCBvZiB0aGUgYXJ0aWNsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSBUaXRsZSBvZiB0aGUgYXJ0aWNsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gLSBEZXNjcmlwdGlvbiBvZiB0aGUgYXJ0aWNsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHVibGlzaGVkX3RpbWUgLSBTdHJpbmcgZm9yIHB1Ymxpc2hlZCBkYXRlIG9mIHRoZSBhcnRpY2xlLlxuICAgKiBAcmV0dXJucyB7alF1ZXJ5fVxuICAgKi9cbiAgY3JlYXRlSGVhZGxpbmVJdGVtKHVybCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBwdWJsaXNoZWRfdGltZSl7XG4gICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0naGVhZGxpbmUtaXRlbSc+XCIpO1xuICAgICRjb250YWluZXJcbiAgICAgIC5hcHBlbmQoXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdoZWFkbGluZS10aXRsZSc+XCIpLmFwcGVuZChcbiAgICAgICAgICBgPGEgaHJlZj1cIiR7dXJsfVwiPiR7dGl0bGV9PC9hPmBcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLmFwcGVuZChgPGRpdiBjbGFzcz0naGVhZGxpbmUtbWV0YSc+JHtwdWJsaXNoZWRfdGltZX08L2Rpdj5gKVxuICAgIDtcbiAgICBcbiAgICBpZihkZXNjcmlwdGlvbil7XG4gICAgICAkY29udGFpbmVyLmF0dHIoXCJ0aXRsZVwiLCBkZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIGF0dGFjaCBoZWFkbGluZSBsaXN0IHRvIHNpZGViYXIuXG4gICAqIEhlYWRsaW5lIGRhdGEgYXJlIGZldGNoZWQgZnJvbSBmdW5jdGlvbiBgJCRhcnRpY2xlX2xpc3QoKWAsIHdoaWNoIGNvbWVzIGZyb21cbiAgICogZXh0ZXJuYWwgPHNjcmlwdD4gdGFnLlxuICAgKiBCeSBwdXR0aW5nIHRoZSBsaXN0IG9mIGFydGljbGUgaW50byBzZXBhcmF0ZSBleHRlcm5hbCA8c2NyaXB0PiB0YWcsXG4gICAqIGRldmVsb3BlciBjYW4gZnJlZWx5IG1vZGlmeSBoZWFkbGluZSBsaXN0IHdpdGhvdXQgaGFyZC1jb2RpbmcgaXQgdG9cbiAgICogc2l0ZSBzY3JpcHQgZmlsZS5cbiAgICovXG4gIHNldEhlYWRsaW5lKCl7XG4gICAgY29uc3QgYXJ0aWNsZXMgPSAkJGFydGljbGVfbGlzdCgpOyAvLyBUaGlzIGNvbWVzIGZyb20gZXh0ZXJuYWwgPHNjcmlwdD4gdGFnLlxuICAgIGlmKCFhcnRpY2xlcyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFuZyA9ICQoXCJodG1sXCIpLmF0dHIoXCJsYW5nXCIpIHx8IFwiamFcIjtcbiAgICBjb25zdCBhcnRpY2xlX3RyZWUgPSBhcnRpY2xlc1tsYW5nXTtcblxuICAgIGNvbnN0IGFjdGl2ZV90b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpzZWN0aW9uJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3QgYWN0aXZlX3N1YnRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnRhZyddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICBcbiAgICBjb25zdCAkdG9waWNfY29udGFpbmVyID0gJChcIiN0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcbiAgICBjb25zdCAkc3VidG9waWNfY29udGFpbmVyID0gJChcIiNzdWJ0b3BpYy1saXN0XCIpLmZpbmQoXCIudGFnc1wiKTtcbiAgICBjb25zdCAkYXJ0aWNsZV9jb250YWluZXIgPSAkKFwiI2FydGljbGUtbGlzdFwiKS5maW5kKFwiLmhlYWRsaW5lXCIpO1xuICBcbiAgICAvKipcbiAgICAgKiBHZXQgalF1ZXJ5IGVsZW1lbnRzIGxpc3Qgb2YgdG9waWNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbGlzdCAtIFRoaXMgc2hvdWxkIGJlICQkYXJ0aWNsZV9saXN0KClbbGFuZ11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aXZlX3RvcGljIC0gVGV4dCBvZiB0aGUgdG9waWNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCB0b3BpY3MgPSAobGlzdCwgYWN0aXZlX3RvcGljKSA9PiB7XG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKTtcbiAgICAgIE9iamVjdC5rZXlzKGxpc3QpLmZvckVhY2goKHZhbCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0ICR0b3BpYyA9ICQoYDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dmFsfTwvc3Bhbj48L2E+YCk7XG4gICAgXG4gICAgICAgIGlmKHZhbCA9PT0gYWN0aXZlX3RvcGljIHx8ICghYWN0aXZlX3RvcGljICYmIGluZGV4ID09PSAwKSl7XG4gICAgICAgICAgJHRvcGljLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICB9XG4gIFxuICAgICAgICAkd3JhcHBlci5hcHBlbmQoJHRvcGljKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gJHdyYXBwZXIuY2hpbGRyZW4oKTtcbiAgICB9O1xuICBcbiAgICAvKipcbiAgICAgKiBHZXQgalF1ZXJ5IGVsZW1lbnRzIGxpc3Qgb2Ygc3VidG9waWNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbGlzdCAtIFRoaXMgc2hvdWxkIGJlICQkYXJ0aWNsZV9saXN0KClbbGFuZ11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUZXh0IG9mIHRoZSB0b3BpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhY3RpdmVfc3VidG9waWMgLSBUZXh0IG9mIHRoZSBzdWJ0b3BpY1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGNvbnN0IHN1YlRvcGljcyA9IChsaXN0LCB0b3BpYywgYWN0aXZlX3N1YnRvcGljKSA9PiB7XG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKTtcbiAgICAgIE9iamVjdC5rZXlzKGxpc3RbdG9waWNdKS5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCAkc3VidG9waWMgPSAkKGA8YT48c3BhbiBjbGFzcz0ndGFnJz4ke3ZhbH08L3NwYW4+PC9hPmApO1xuICAgIFxuICAgICAgICBpZih2YWwgPT09IGFjdGl2ZV9zdWJ0b3BpYyB8fCAoIWFjdGl2ZV9zdWJ0b3BpYyAmJiBpbmRleCA9PT0gMCkpe1xuICAgICAgICAgICRzdWJ0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAkd3JhcHBlci5hcHBlbmQoJHN1YnRvcGljKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gJHdyYXBwZXIuY2hpbGRyZW4oKTtcbiAgICB9O1xuICBcbiAgICAvKipcbiAgICAgKiBHZXQgalF1ZXJ5IGVsZW1lbnRzIGxpc3Qgb2YgaGVhZGxpbmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0IC0gVGhpcyBzaG91bGQgYmUgJCRhcnRpY2xlX2xpc3QoKVtsYW5nXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRleHQgb2YgdGhlIHRvcGljXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN1YnRvcGljIC0gVGV4dCBvZiB0aGUgc3VidG9waWNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCBoZWFkbGluZXMgPSAobGlzdCwgdG9waWMsIHN1YnRvcGljKSA9PiB7XG4gICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2PlwiKTtcbiAgICAgIE9iamVjdC5rZXlzKGxpc3RbdG9waWNdW3N1YnRvcGljXSkuZm9yRWFjaCgodiwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGFydGljbGUgPSBsaXN0W3RvcGljXVtzdWJ0b3BpY11bdl07XG4gICAgICAgIGxldCBhcnRpY2xlX2R0aW1lID0gKG5ldyBEYXRlKGFydGljbGUucHVibGlzaGVkX3RpbWUpKVxuICAgICAgICAgIC50b0xvY2FsZURhdGVTdHJpbmcobGFuZywge3llYXI6IFwibnVtZXJpY1wiLCBtb250aDogXCJsb25nXCIsIGRheTogXCJudW1lcmljXCJ9KTtcbiAgICBcbiAgICAgICAgbGV0ICRoZWFkbGluZSA9IHRoaXMuY3JlYXRlSGVhZGxpbmVJdGVtKGFydGljbGUucGF0aCwgYXJ0aWNsZS50aXRsZSwgYXJ0aWNsZS5kZXNjcmlwdGlvbiwgYXJ0aWNsZV9kdGltZSk7XG4gICAgICAgICR3cmFwcGVyLmFwcGVuZCgkaGVhZGxpbmUpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHJldHVybiAkd3JhcHBlci5jaGlsZHJlbigpO1xuICAgIH07XG4gIFxuICAgIC8qKlxuICAgICAqIFdoZW4gc3VidG9waWMgaXMgY2xpY2tlZCwgaGVhZGxpbmVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3VidG9waWMgd2lsbCBiZVxuICAgICAqIHNob3duIG9uIGhlYWRsaW5lIGFyZWEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICovXG4gICAgY29uc3Qgb25DbGlja1N1YnRvcGljID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBjb25zdCB0b3BpYyA9ICR0b3BpY19jb250YWluZXIuZmluZChcImEuYWN0aXZlXCIpLnRleHQoKTtcbiAgICAgIGNvbnN0IHN1YnRvcGljID0gJHRoaXMuZmluZChcInNwYW4udGFnXCIpLnRleHQoKTtcbiAgICBcbiAgICAgICRzdWJ0b3BpY19jb250YWluZXIuZmluZChcImEuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgJHRoaXMuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgXG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuZW1wdHkoKTtcbiAgICAgICRhcnRpY2xlX2NvbnRhaW5lci5hcHBlbmQoaGVhZGxpbmVzKGFydGljbGVfdHJlZSwgdG9waWMsIHN1YnRvcGljKSk7XG4gICAgfTtcbiAgXG4gICAgLyoqXG4gICAgICogV2hlbiB0b3BpYyBpcyBjbGlja2VkLCBzdWJ0b3BpY3MgYXNzb2NpYXRlZCB3aXRoIHRoZSB0b3BpYyB3aWxsIGJlXG4gICAgICogc2hvd24gb24gaGVhZGxpbmUgYXJlYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKi9cbiAgICBjb25zdCBvbkNsaWNrVG9waWMgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGNvbnN0IHRvcGljID0gJHRoaXMuZmluZChcInNwYW4udGFnXCIpLnRleHQoKTtcbiAgXG4gICAgICAkdG9waWNfY29udGFpbmVyLmZpbmQoXCJhLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICR0aGlzLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICBcbiAgICAgICRzdWJ0b3BpY19jb250YWluZXIuZW1wdHkoKTtcbiAgICAgICRzdWJ0b3BpY19jb250YWluZXIuYXBwZW5kKHN1YlRvcGljcyhhcnRpY2xlX3RyZWUsIHRvcGljKSk7XG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmZpbmQoXCJhXCIpLm9uKFwiY2xpY2tcIiwgb25DbGlja1N1YnRvcGljKTtcbiAgXG4gICAgICBjb25zdCBzdWJ0b3BpYyA9ICRzdWJ0b3BpY19jb250YWluZXIuZmluZChcImEuYWN0aXZlXCIpLnRleHQoKTtcbiAgXG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuZW1wdHkoKTtcbiAgICAgICRhcnRpY2xlX2NvbnRhaW5lci5hcHBlbmQoaGVhZGxpbmVzKGFydGljbGVfdHJlZSwgdG9waWMsIHN1YnRvcGljKSk7XG4gICAgfTtcbiAgICBcbiAgICAkdG9waWNfY29udGFpbmVyLmFwcGVuZCh0b3BpY3MoYXJ0aWNsZV90cmVlLCBhY3RpdmVfdG9waWMpKTtcbiAgICAkc3VidG9waWNfY29udGFpbmVyLmFwcGVuZChzdWJUb3BpY3MoYXJ0aWNsZV90cmVlLCBhY3RpdmVfdG9waWMsIGFjdGl2ZV9zdWJ0b3BpYykpO1xuICAgICRhcnRpY2xlX2NvbnRhaW5lci5hcHBlbmQoaGVhZGxpbmVzKGFydGljbGVfdHJlZSwgYWN0aXZlX3RvcGljLCBhY3RpdmVfc3VidG9waWMpKTtcbiAgICBcbiAgICAkdG9waWNfY29udGFpbmVyLmZpbmQoXCJhXCIpLm9uKFwiY2xpY2tcIiwgb25DbGlja1RvcGljKTtcbiAgICAkc3VidG9waWNfY29udGFpbmVyLmZpbmQoXCJhXCIpLm9uKFwiY2xpY2tcIiwgb25DbGlja1N1YnRvcGljKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIERlZmluZXMgdG9nZ2xlIGJ1dHRvbiBvcGVuL2Nsb3NlIGJlaGF2aW91clxuICAgKi9cbiAgaW5pdFRvZ2dsZUJ1dHRvbigpe1xuICAgIGxldCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbiAgICBsZXQgJHNpZGViYXIgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGxldCAkdGFncyA9ICRzaWRlYmFyLmZpbmQoXCIudGFnc1wiKTtcbiAgICBsZXQgJGJ1dHRvbiA9ICQoXCIjc2lkZWJhci10b2dnbGUtYnV0dG9uXCIpO1xuICAgIFxuICAgIGNvbnN0IGNsb3NlU2lkZWJhciA9IChlKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nIGlmIG91dHNpZGUgb2Ygc2lkZWJhciBoYXMgYmVlbiBjbGlja2VkLlxuICAgICAgLy8gSG93ZXZlciwgaWYgc2NyZWVuIHNpemUgaXMgZm9yIG1vYmlsZSwgY2xvc2Ugc2lkZWJhciB3aGVyZXZlciBpcyBjbGlja2VkLlxuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzk5cHgpXCIpLm1hdGNoZXMgJiZcbiAgICAgICAgJHNpZGViYXIuaXMoZS50YXJnZXQpIHx8ICRzaWRlYmFyLmhhcyhlLnRhcmdldCkubGVuZ3RoID4gMCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgXG4gICAgICAkc2lkZWJhci5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XG4gICAgfTtcbiAgICBcbiAgICBjb25zdCBvblRvZ2dsZUJ1dHRvbkNsaWNrZWQgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIFxuICAgICAgaWYoJHNpZGViYXIuaGFzQ2xhc3MoXCJ2aXNpYmxlXCIpKXtcbiAgICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub2ZmKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgJHNpZGViYXIuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub24oXCJjbGljay5jbG9zZVNpZGViYXJcIiwgY2xvc2VTaWRlYmFyKTtcbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICAkYnV0dG9uLm9uKFwiY2xpY2tcIiwgb25Ub2dnbGVCdXR0b25DbGlja2VkKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFNhbml0aXplIGVtYWlsIGFkZHJlc3MgdGV4dC5cbiAgICogRW1haWwgYWRkcmVzcyB3aWxsIGJlIGRpc3BsYXllZCBpbiBwcm9maWxlIHNlY3Rpb24sXG4gICAqIGJ1dCBvbmx5IGh1bWFuIGNhbiBzZWUgdGhlIHRleHQuXG4gICAqL1xuICBidWlsZEVtYWlsQWRkcmVzcygpe1xuICAgIGxldCBwYWdlT3BlbmVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgbGV0IGlzQWxyZWFkeUJ1aWx0ID0gZmFsc2U7XG4gICAgbGV0ICRlbWFpbCA9ICQoXCIucHJvZmlsZSAuc29jaWFsIC5lbWFpbFwiKTtcbiAgICBcbiAgICBjb25zdCBhZGRyID0gWzgwNTksIDYwODgsIDcxNjMsIDUwNjMsIDczODQsIC0yODIxLCA1ODc5LCA2MDg4LCA3MTYzLCA0NDcyLCA4Mjg4LCA1MjY0LCAtMzA4OCwgNTY3MiwgNjA4OCwgODUxOSwgNTg3OSwgODc1MiwgNDY2NywgNzYwNywgNDQ3MiwgNTY3MiwgNTI2NCwgODI4OCwgLTg0MSwgNTY3MiwgNjk0NCwgNDQ3MiwgNjA4OCwgNjcyNywgLTI4MjEsIDQ4NjQsIDczODQsIDY5NDRdO1xuICAgIFxuICAgIGNvbnN0IG1ha2VBZGRyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmKGlzQWxyZWFkeUJ1aWx0ICYmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHBhZ2VPcGVuZWQpID4gMTUwMCkgcmV0dXJuO1xuICAgICAgXG4gICAgICAkZW1haWwuYXR0cihcImhyZWZcIiwgXCJtYWlsdG86XCIgKyBhZGRyLm1hcChmdW5jdGlvbih2KXtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoTWF0aC5zcXJ0KHYrNDkzNykpXG4gICAgICB9KS5qb2luKFwiXCIpKTtcbiAgICB9O1xuICAgIFxuICAgICRlbWFpbC5vbihcIm1vdXNlb3ZlciB0b3VjaHN0YXJ0XCIsIG1ha2VBZGRyZXNzKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIEJhbGxvb24gZm9yIGRldGFpbCBwcm9maWxlLlxuICAgKi9cbiAgYnVpbGRCYWxsb29uKCl7XG4gICAgJCh0aGlzLnNlbGVjdG9yICsgXCIgW2RhdGEtYmFsbG9vbl1cIikuYmFsbG9vbih7XG4gICAgICBwbGFjZW1lbnQ6IFwibGVmdFwiLFxuICAgICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICAgIG1hcmdpblRvcDogJChcIi5wcm9maWxlLWF0dHJpYnV0ZVwiKS5oZWlnaHQoKSAvIDJcbiAgICB9KTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFNldCB1cmwgdG8gY29ycmVzcG9uZGluZyBwYWdlIHdyaXR0ZW4gaW4gYW5vdGhlciBsYW5ndWFnZVxuICAgKiB0byBsYW5ndWFnZSBidXR0b24oYW5jaG9yKS5cbiAgICovXG4gIHNldHVwTGFuZ0J1dHRvbigpe1xuICAgIGNvbnN0ICRhbmNob3IgPSAkKFwiLmxhbmd1YWdlLnByb2ZpbGUtYXR0cmlidXRlIGFbZGF0YS1sYW5nXVwiKTtcbiAgICBjb25zdCBjdXJyZW50X2xhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKTtcbiAgICBjb25zdCBhcnRpY2xlX2lkID0gJChcImhlYWQgPiBtZXRhW25hbWU9J2FydGljbGVJRCddW2NvbnRlbnRdXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IGFydGljbGVzID0gJCRhcnRpY2xlX2xpc3QoKTtcblxuICAgICRhbmNob3IuZWFjaChmdW5jdGlvbigpe1xuICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgdGFyZ2V0X2xhbmcgPSAkdGhpcy5kYXRhKFwibGFuZ1wiKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhcnRpY2xlc1t0YXJnZXRfbGFuZ10pLnNvbWUoKHRvcGljKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFydGljbGVzW3RhcmdldF9sYW5nXVt0b3BpY10pLnNvbWUoKHN1YnRvcGljKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXJ0aWNsZXNbdGFyZ2V0X2xhbmddW3RvcGljXVtzdWJ0b3BpY10pLnNvbWUoKGFydGljbGUpID0+IHtcbiAgICAgICAgICAgICAgaWYoYXJ0aWNsZSA9PT0gYXJ0aWNsZV9pZCl7XG4gICAgICAgICAgICAgICAgJHRoaXMuYXR0cihcImhyZWZcIiwgYXJ0aWNsZXNbdGFyZ2V0X2xhbmddW3RvcGljXVtzdWJ0b3BpY11bYXJ0aWNsZV0ucGF0aCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGUpe1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IG1haW4gPiBhcnRpY2xlXCI7XG5cbiAgICB0aGlzLmJ1aWxkQXJ0aWNsZUhlYWRlcigpO1xuICB9XG5cbiAgYnVpbGRBcnRpY2xlSGVhZGVyKCl7XG4gICAgY29uc3QgJGFydGljbGUgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGNvbnN0ICRoZWFkZXIgPSAkYXJ0aWNsZS5maW5kKFwiLmFydGljbGUtaGVhZGVyXCIpO1xuICAgIGNvbnN0IGxhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKSB8fCBcImphXCI7XG4gICAgY29uc3QgdGl0bGUgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J29nOnRpdGxlJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3QgdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHN1YnRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnRhZyddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGxldCBwdWJsaXNoZWRfdGltZSA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpwdWJsaXNoZWRfdGltZSddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGxldCBkdGltZSA9IG5ldyBEYXRlKERhdGUucGFyc2UocHVibGlzaGVkX3RpbWUpKTtcbiAgICBsZXQgdGltZV9yZWxhdGl2ZSA9IHRoaXMudGltZVJlbGF0aXZlVG9Ob3coZHRpbWUpO1xuICBcbiAgICBsZXQgdGltZV9hYnNvbHV0ZSA9IGR0aW1lLnRvTG9jYWxlVGltZVN0cmluZyhsYW5nLCB7XG4gICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgIGRheTogXCJudW1lcmljXCJcbiAgICB9KTtcblxuICAgIGxldCBoZWFkZXJfc3RyaW5nID0gYFxuICAgICAgPGRpdiBjbGFzcz0ndGFncyc+XG4gICAgICAgIDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dG9waWN9PC9zcGFuPjwvYT5cbiAgICAgICAgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHtzdWJ0b3BpY308L3NwYW4+PC9hPlxuICAgICAgPC9kaXY+XG4gICAgICA8aDEgY2xhc3M9J2FydGljbGUtdGl0bGUnPiR7dGl0bGV9PC9oMT5cbiAgICAgIDxkaXYgY2xhc3M9J2FydGljbGUtZGF0ZScgZGF0YS1iYWxsb29uPScke3RpbWVfYWJzb2x1dGV9Jz5cbiAgICAgICAgPGkgY2xhc3M9J2ZhIGZhLWNsb2NrLW8nPjwvaT4gJHt0aW1lX3JlbGF0aXZlfVxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgICRoZWFkZXIuaHRtbChoZWFkZXJfc3RyaW5nKTtcbiAgICBjb25zdCAkYXJ0aWNsZV9kYXRlID0gJGhlYWRlci5maW5kKCcuYXJ0aWNsZS1kYXRlJyk7XG4gICAgJGFydGljbGVfZGF0ZS5iYWxsb29uKHtcbiAgICAgIHBsYWNlbWVudDogXCJib3R0b21cIixcbiAgICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgICBtYXJnaW5Ub3A6ICQoJGFydGljbGVfZGF0ZSkuaGVpZ2h0KCkvMixcbiAgICAgIG1hcmdpbkxlZnQ6IDcsXG4gICAgICBvcGFjaXR5OiAuODVcbiAgICB9KTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIEdldCBcIi4uLmRheXMgYWdvXCIgdGV4dCByZWxhdGl2ZSB0byBjdXJyZW50IGRhdGUgdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBkdGltZSAtIEFic29sdXRlIGRhdGV0aW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICB0aW1lUmVsYXRpdmVUb05vdyhkdGltZSl7XG4gICAgbGV0IHNlY29uZHMgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBkdGltZSkgLyAxMDAwO1xuICAgIGxldCB0aW1lQWdvID0gXCJcIjtcbiAgXG4gICAgaWYoc2Vjb25kcyA8IDYwKXtcbiAgICAgIGNvbnN0IHQgPSBwYXJzZUludChzZWNvbmRzKTtcbiAgICAgIHRpbWVBZ28gPSBgJHt0fSBzZWNvbmQke3QhPT0xPydzJzonJ30gYWdvYDtcbiAgICB9XG4gICAgZWxzZSBpZihzZWNvbmRzIDwgMzYwMCl7XG4gICAgICBjb25zdCB0ID0gcGFyc2VJbnQoc2Vjb25kcy82MCk7XG4gICAgICB0aW1lQWdvID0gYCR7dH0gbWludXRlJHt0IT09MT8ncyc6Jyd9IGFnb2A7XG4gICAgfVxuICAgIGVsc2UgaWYoc2Vjb25kcyA8IDg2NDAwKXtcbiAgICAgIGNvbnN0IHQgPSBwYXJzZUludChzZWNvbmRzLzM2MDApO1xuICAgICAgdGltZUFnbyA9IGAke3R9IGhvdXIke3QhPT0xPydzJzonJ30gYWdvYDtcbiAgICB9XG4gICAgZWxzZSBpZihzZWNvbmRzIDwgODY0MDAqMzEpe1xuICAgICAgY29uc3QgdCA9IHBhcnNlSW50KHNlY29uZHMvODY0MDApO1xuICAgICAgdGltZUFnbyA9IGAke3R9IGRheSR7dCE9PTE/J3MnOicnfSBhZ29gO1xuICAgIH1cbiAgICBlbHNlIGlmKHNlY29uZHMgPCA4NjQwMCozMSoxMil7XG4gICAgICBjb25zdCB0ID0gcGFyc2VJbnQoc2Vjb25kcy84NjQwMC8zMSk7XG4gICAgICB0aW1lQWdvID0gYCR7dH0gbW9udGgke3QhPT0xPydzJzonJ30gYWdvYDtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNvbnN0IHQgPSBwYXJzZUludChzZWNvbmRzLzg2NDAwLzMxLzEyKTtcbiAgICAgIHRpbWVBZ28gPSBgJHt0fSB5ZWFyJHt0IT09MT8ncyc6Jyd9IGFnb2A7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aW1lQWdvO1xuICB9XG59XG4iLCJpbXBvcnQgXCIuL2Fzc2V0XCI7XG5pbXBvcnQgSGVhZGVyIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZGVyXCI7XG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9jb21wb25lbnRzL3NpZGViYXJcIjtcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRzXCI7XG5cbmNvbnN0IG1haW4gPSBmdW5jdGlvbigpe1xuICBjb25zdCBoZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gIGNvbnN0IHNpZGViYXIgPSBuZXcgU2lkZWJhcigpO1xuICBjb25zdCBjb250ZW50ID0gbmV3IENvbnRlbnQoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
