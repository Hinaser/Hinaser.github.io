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

      /**
       * Close sidebar when entire window except for sidebar has been clicked.
       * @param {Event} e
       */
      var closeSidebar = function closeSidebar(e) {
        // On mobile screen, there are few spaces outside sidebar.
        // So on the screen size, clicking even sidebar should close it.
        if (window.matchMedia("(max-width: 799px)").matches) {
          // When buttons have been clicked, don't close sidebar
          var $sidebar_buttons = $sidebar.find("a, button");
          if ($sidebar_buttons.is(e.target) || $sidebar_buttons.has(e.target).length > 0) {
            return;
          }
        } else if ($sidebar.is(e.target) || $sidebar.has(e.target).length > 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzc3NnL2pzL21haW4uanMiLCJzc3NnL2pzL3N0YW5kYXJkL2Fzc2V0LmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb21wb25lbnRzL2hlYWRlci5qcyIsInNzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3NzZy9qcy9zdGFuZGFyZC9jb250ZW50cy9pbmRleC5qcyIsInNzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7OztBQ0FBOzs7O0FBSUMsV0FBUyxDQUFULEVBQVc7QUFDVixJQUFFLEVBQUYsQ0FBSyxPQUFMLEdBQWUsVUFBUyxJQUFULEVBQWM7QUFDM0IsUUFBTSxVQUFVLEVBQUUsTUFBRixDQUFTO0FBQ3ZCLG1CQUFhLE1BRFU7QUFFdkIsZUFBUyxTQUZjO0FBR3ZCLG1CQUFhLENBSFU7QUFJdkIsb0JBQWMsQ0FKUztBQUt2QixpQkFBVztBQUxZLEtBQVQsRUFNYixJQU5hLENBQWhCOztBQVFBLFFBQUcsQ0FBQyxDQUFDLFFBQUQsRUFBVSxPQUFWLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLENBQW1DLFFBQVEsU0FBM0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLG9CQUFWLENBQU47QUFDRDtBQUNELFFBQUcsQ0FBQyxDQUFDLFNBQUQsRUFBVyxPQUFYLEVBQW1CLFNBQW5CLEVBQThCLFFBQTlCLENBQXVDLFFBQVEsS0FBL0MsQ0FBSixFQUEwRDtBQUN4RCxZQUFNLElBQUksS0FBSixDQUFVLGdCQUFWLENBQU47QUFDRDs7QUFFRCxRQUFNLHNCQUFzQjtBQUMxQixrQkFBWSxPQURjO0FBRTFCLGlCQUFXLENBRmU7QUFHMUIsaUJBQVcsQ0FBQyxDQUhjO0FBSTFCLG9CQUFjO0FBSlksS0FBNUI7O0FBT0EsUUFBSSxZQUFZLEVBQUUsUUFBRixDQUFoQjs7QUFFQSxT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RUFBdEIsRUFBeUI7QUFDNUIsWUFBTSxNQUFJLFNBQVMsVUFBUSxLQUFSLEdBQWMsRUFBdkIsQ0FBVjtBQUNBLGtCQUFhLEdBQWIsZUFBdUIsUUFBSSxDQUFKLEdBQU0sR0FBTixHQUFVLEVBQWpDO0FBQ0QsT0FISSxNQUlEO0FBQ0YsWUFBTSxNQUFJLFNBQVMsVUFBUSxLQUFSLEdBQWMsRUFBZCxHQUFpQixFQUExQixDQUFWO0FBQ0Esa0JBQWEsR0FBYixjQUFzQixRQUFJLENBQUosR0FBTSxHQUFOLEdBQVUsRUFBaEM7QUFDRDs7QUFFRCxhQUFPLE9BQVA7QUFDRDs7Ozs7O2tCQWxGa0IsTzs7Ozs7QUNBckI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLEdBQVU7QUFDckIsTUFBTSxTQUFTLHNCQUFmO0FBQ0EsTUFBTSxVQUFVLHVCQUFoQjtBQUNBLE1BQU0sVUFBVSx3QkFBaEI7QUFDRCxDQUpEOztBQU1BLEVBQUUsSUFBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vc3RhbmRhcmQnO1xuIiwiLyoqXG4gKiBBdXRvIGRpc3BsYXkgYmFsbG9vbiBmb3IgZWxlbWVudHNcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xuKGZ1bmN0aW9uKCQpe1xuICAkLmZuLmJhbGxvb24gPSBmdW5jdGlvbihvcHRzKXtcbiAgICBjb25zdCBzZXR0aW5nID0gJC5leHRlbmQoe1xuICAgICAgXCJwbGFjZW1lbnRcIjogXCJsZWZ0XCIsXG4gICAgICBcImNvbG9yXCI6IHVuZGVmaW5lZCxcbiAgICAgIFwibWFyZ2luVG9wXCI6IDAsXG4gICAgICBcIm1hcmdpbkxlZnRcIjogMCxcbiAgICAgIFwib3BhY2l0eVwiOiAxXG4gICAgfSwgb3B0cyk7XG4gICAgXG4gICAgaWYoIVtcImJvdHRvbVwiLFwicmlnaHRcIixcImxlZnRcIl0uaW5jbHVkZXMoc2V0dGluZy5wbGFjZW1lbnQpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGxhY2VtZW50LlwiKTtcbiAgICB9XG4gICAgaWYoIVtcImRlZmF1bHRcIixcImJsYWNrXCIsdW5kZWZpbmVkXS5pbmNsdWRlcyhzZXR0aW5nLmNvbG9yKSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yLlwiKTtcbiAgICB9XG4gIFxuICAgIGNvbnN0IHdyYXBwZXJJbml0aWFsU3R5bGUgPSB7XG4gICAgICBcInBvc2l0aW9uXCI6IFwiZml4ZWRcIixcbiAgICAgIFwib3BhY2l0eVwiOiAwLFxuICAgICAgXCJ6LWluZGV4XCI6IC0xLFxuICAgICAgXCJ0cmFuc2l0aW9uXCI6IFwib3BhY2l0eSBlYXNlIC4zc1wiXG4gICAgfTtcbiAgICBcbiAgICBsZXQgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gIFxuICAgIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGxldCAkY29udGVudHMgPSAkdGhpcy5maW5kKFwiLmJhbGxvb24tY29udGVudHNcIik7XG4gICAgICBsZXQgY29udGVudDtcbiAgICAgIFxuICAgICAgaWYoISRjb250ZW50cyB8fCAkY29udGVudHMubGVuZ3RoIDwgMSl7XG4gICAgICAgIGlmKCEoY29udGVudCA9ICR0aGlzLmRhdGEoJ2JhbGxvb24nKSkpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgY29udGVudCA9ICRjb250ZW50cy5odG1sKCk7XG4gICAgICB9XG4gICAgXG4gICAgICBjb25zdCAkYmFsbG9vbiA9ICQoXCI8ZGl2PlwiKVxuICAgICAgICAuYWRkQ2xhc3MoXCJiYWxsb29uXCIpXG4gICAgICAgIC5hZGRDbGFzcyhzZXR0aW5nLnBsYWNlbWVudClcbiAgICAgICAgLmh0bWwoY29udGVudCk7XG4gICAgICBcbiAgICAgIGlmKHNldHRpbmcuY29sb3Ipe1xuICAgICAgICAkYmFsbG9vbi5hZGRDbGFzcyhzZXR0aW5nLmNvbG9yKTtcbiAgICAgIH1cbiAgICBcbiAgICAgIGNvbnN0ICR3cmFwcGVyID0gJChcIjxkaXY+XCIpLmNzcyh3cmFwcGVySW5pdGlhbFN0eWxlKTtcbiAgICBcbiAgICAgICR3cmFwcGVyLmFwcGVuZCgkYmFsbG9vbik7XG4gICAgICAkdGhpcy5hcHBlbmQoJHdyYXBwZXIpO1xuICAgICAgJGNvbnRlbnRzLnJlbW92ZSgpO1xuICBcbiAgICAgIGxldCBwb3BVcFN0YXR1cyA9IDA7IC8vIDA6IGhpZGRlbiwgMTogdmlzaWJsZVxuICAgICAgY29uc3QgYXJyb3dNYXJnaW4gPSAyNzsgLy8gU2VlIGFzc2V0LnN0eWwuICRiYWxsb29uLXRyaWFuZ2xlLXNpemUgPSAxMXB4LCAkYmFsbG9vbi10cmlhbmdsZS1sZWZ0ID0gMTZweFxuICBcbiAgICAgICR0aGlzLm9uKFwibW91c2VlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgICBsZXQgc2VsZiA9ICR0aGlzO1xuICAgICAgICBsZXQgekluZGV4ID0gOTk5OTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGNhbGNQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGV0IHRvcCxsZWZ0O1xuICBcbiAgICAgICAgICBzd2l0Y2goc2V0dGluZy5wbGFjZW1lbnQpe1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICB0b3AgPSBzZWxmLm9mZnNldCgpLnRvcCAtICRkb2N1bWVudC5zY3JvbGxUb3AoKSArIHNlbGYuaGVpZ2h0KCkgKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLSBhcnJvd01hcmdpbiArIHNldHRpbmcubWFyZ2luTGVmdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAkd3JhcHBlci5jc3Moe3RvcDogMCwgbGVmdDogMH0pOyAvLyBQcmV2ZW50IGNvbnRlbnRzIHdyYXBwaW5nIGJlZm9yZSBjYWxjdWxhdGluZyAkd3JhcHBlci53aWR0aCgpXG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgLSAkd3JhcHBlci53aWR0aCgpIC0gc2V0dGluZy5tYXJnaW5MZWZ0O1xuICBcbiAgICAgICAgICAgICAgbGV0IHdyYXBwZXJfaGVpZ2h0ID0gJHdyYXBwZXIuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHJlbWFpbiA9ICh0b3AgKyB3cmFwcGVyX2hlaWdodCkgLSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgIGlmKHJlbWFpbiA+IDApe1xuICAgICAgICAgICAgICAgIHRvcCA9IHRvcCAtIHdyYXBwZXJfaGVpZ2h0ICsgYXJyb3dNYXJnaW4gKiAyO1xuICAgICAgICAgICAgICAgICRiYWxsb29uLmFkZENsYXNzKFwidXBwZXJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkYmFsbG9vbi5yZW1vdmVDbGFzcyhcInVwcGVyXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICR3cmFwcGVyLmNzcyh7dG9wOiAwLCByaWdodDogMH0pOyAvLyBQcmV2ZW50IGNvbnRlbnRzIHdyYXBwaW5nIGJlZm9yZSBjYWxjdWxhdGluZyAkd3JhcHBlci53aWR0aCgpXG4gICAgICAgICAgICAgIHRvcCA9IHNlbGYub2Zmc2V0KCkudG9wIC0gJGRvY3VtZW50LnNjcm9sbFRvcCgpIC0gYXJyb3dNYXJnaW4gKyBzZXR0aW5nLm1hcmdpblRvcDtcbiAgICAgICAgICAgICAgbGVmdCA9IHNlbGYub2Zmc2V0KCkubGVmdCAtICRkb2N1bWVudC5zY3JvbGxMZWZ0KCkgKyBzZWxmLndpZHRoKCkgKyBzZXR0aW5nLm1hcmdpbkxlZnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgcmV0dXJuIHt0b3AsIGxlZnR9O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgIFxuICAgICAgICAkd3JhcHBlclxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgXCJ0b3BcIjogcG9zaXRpb24udG9wLFxuICAgICAgICAgICAgXCJsZWZ0XCI6IHBvc2l0aW9uLmxlZnQsXG4gICAgICAgICAgICBcInotaW5kZXhcIjogekluZGV4LFxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IHNldHRpbmcub3BhY2l0eVxuICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcG9wVXBTdGF0dXMgPSAxO1xuICBcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwic2Nyb2xsLmJhbGxvb25cIiwgKGUpID0+IHtcbiAgICAgICAgICBsZXQgcG9zaXRpb24gPSBjYWxjUG9zaXRpb24oKTtcbiAgICAgICAgICAkd3JhcHBlci5jc3Moe1xuICAgICAgICAgICAgdG9wOiBwb3NpdGlvbi50b3AsXG4gICAgICAgICAgICBsZWZ0OiBwb3NpdGlvbi5sZWZ0XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gIFxuICAgICAgfSk7XG4gICAgICBcbiAgICAgICR0aGlzLm9uKFwibW91c2VsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgICAkd3JhcHBlci5jc3Moe1xuICAgICAgICAgIFwib3BhY2l0eVwiOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcG9wVXBTdGF0dXMgPSAwO1xuICAgICAgICBcbiAgICAgICAgJCh3aW5kb3cpLm9mZihcInNjcm9sbC5iYWxsb29uXCIpO1xuICAgICAgfSk7XG4gIFxuICAgICAgJHRoaXMub24oXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmRcIiwgKGUpID0+IHtcbiAgICAgICAgaWYocG9wVXBTdGF0dXMgPT09IDApe1xuICAgICAgICAgICR3cmFwcGVyLmNzcyhcInotaW5kZXhcIiwgLTEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgJHdyYXBwZXIub24oXCJtb3VzZWVudGVyXCIsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0oalF1ZXJ5KSk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBoZWFkZXJcIjtcbiAgICBcbiAgICB0aGlzLnN0aWNreSgpO1xuICB9XG4gIFxuICBzdGlja3koKXtcbiAgICBsZXQgc2Nyb2xsRG93blRocmVzaG9sZCA9IDIwMDtcbiAgICBsZXQgc2Nyb2xsVXBUaHJlc2hvbGQgPSAxMDA7XG4gICAgbGV0IG1lZGlhUXVlcnlTdHJpbmcgPSBcIihtaW4td2lkdGg6IDEyMDBweCksIChtaW4td2lkdGg6IDgwMHB4KSBhbmQgKG1heC13aWR0aDogMTE5OXB4KVwiO1xuICAgIFxuICAgIGxldCAkd2luZG93ID0gJCh3aW5kb3cpO1xuICAgIGxldCBoZWFkZXIgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGxldCByZXNpemluZyA9IGZhbHNlO1xuICBcbiAgICBjb25zdCBvblRyYW5zaXRpb25FbmQgPSAoZSkgPT4ge1xuICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwiZGlzYWJsZS1oZWlnaHQtYW5pbWF0aW9uXCIpO1xuICAgICAgcmVzaXppbmcgPSBmYWxzZTtcbiAgICB9O1xuICBcbiAgICBoZWFkZXIub24oXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmRcIiwgb25UcmFuc2l0aW9uRW5kKTtcbiAgXG4gICAgJHdpbmRvdy5vbihcInNjcm9sbFwiLCAoZSkgPT4ge1xuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnlTdHJpbmcpLm1hdGNoZXMgfHwgcmVzaXppbmcpIHJldHVybjtcbiAgICBcbiAgICAgIGNvbnN0IHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgXG4gICAgICBpZihzY3JvbGxVcFRocmVzaG9sZCA8IHNjcm9sbFRvcCAmJiBzY3JvbGxUb3AgPCBzY3JvbGxEb3duVGhyZXNob2xkKXtcbiAgICAgICAgaWYoIWhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJzY3JvbGwtbWFyZ2luXCIpKSBoZWFkZXIuYWRkQ2xhc3MoXCJzY3JvbGwtbWFyZ2luXCIpO1xuICAgICAgXG4gICAgICAgIGxldCBoZWFkZXJfaGVpZ2h0ID0gMzAwICsgMjAgLSBzY3JvbGxUb3A7XG4gICAgICAgIGhlYWRlci5jc3Moe1xuICAgICAgICAgIGhlaWdodDogaGVhZGVyX2hlaWdodCxcbiAgICAgICAgICBib3R0b206IGBjYWxjKDEwMCUgLSAke2hlYWRlcl9oZWlnaHR9cHgpYFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICBcbiAgICAgIGlmKHNjcm9sbFRvcCA+PSBzY3JvbGxEb3duVGhyZXNob2xkKXtcbiAgICAgICAgaWYoaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBoZWFkZXIuYWRkQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHNjcm9sbFRvcCA8PSBzY3JvbGxVcFRocmVzaG9sZCl7XG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xuICAgICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJzY3JvbGwtbWFyZ2luXCIpO1xuICAgICAgXG4gICAgICAgIHJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgaGVhZGVyLmFkZENsYXNzKFwiZGlzYWJsZS1oZWlnaHQtYW5pbWF0aW9uXCIpO1xuICAgICAgICBoZWFkZXIucmVtb3ZlQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZWJhciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IG1haW4gPiBuYXZcIjtcbiAgICBcbiAgICB0aGlzLmluaXRUb2dnbGVCdXR0b24oKTtcbiAgICB0aGlzLmJ1aWxkRW1haWxBZGRyZXNzKCk7XG4gICAgdGhpcy5idWlsZEJhbGxvb24oKTtcbiAgICB0aGlzLnNldEhlYWRsaW5lKCk7XG4gICAgdGhpcy53cmFwSGVhZGxpbmUoKTtcbiAgICB0aGlzLnNldHVwTGFuZ0J1dHRvbigpO1xuICB9XG4gIFxuICAvKipcbiAgICogV3JhcCBoZWFkbGluZSB3aXRoIGxvbmcgdGV4dCBieSBqcXVlcnkuZG90ZG90ZG90XG4gICAqL1xuICB3cmFwSGVhZGxpbmUoKXtcbiAgICBsZXQgaGVhZGxpbmVUaXRsZSA9ICQodGhpcy5zZWxlY3RvcikuZmluZChcIi5oZWFkbGluZSAuaGVhZGxpbmUtdGl0bGVcIik7XG4gICAgaGVhZGxpbmVUaXRsZS5kb3Rkb3Rkb3Qoe1xuICAgICAgdHJ1bmNhdGU6IFwibGV0dGVyXCIsXG4gICAgICB3YXRjaDogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIFxuICAvKipcbiAgICogQ3JlYXRlIGh0bWwgZWxlbWVudHMgcmVwcmVzZW50aW5nIGhlYWRsaW5lIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVcmwgb2YgdGhlIGFydGljbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIC0gVGl0bGUgb2YgdGhlIGFydGljbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIC0gRGVzY3JpcHRpb24gb2YgdGhlIGFydGljbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHB1Ymxpc2hlZF90aW1lIC0gU3RyaW5nIGZvciBwdWJsaXNoZWQgZGF0ZSBvZiB0aGUgYXJ0aWNsZS5cbiAgICogQHJldHVybnMge2pRdWVyeX1cbiAgICovXG4gIGNyZWF0ZUhlYWRsaW5lSXRlbSh1cmwsIHRpdGxlLCBkZXNjcmlwdGlvbiwgcHVibGlzaGVkX3RpbWUpe1xuICAgIGxldCAkY29udGFpbmVyID0gJChcIjxkaXYgY2xhc3M9J2hlYWRsaW5lLWl0ZW0nPlwiKTtcbiAgICAkY29udGFpbmVyXG4gICAgICAuYXBwZW5kKFxuICAgICAgICAkKFwiPGRpdiBjbGFzcz0naGVhZGxpbmUtdGl0bGUnPlwiKS5hcHBlbmQoXG4gICAgICAgICAgYDxhIGhyZWY9XCIke3VybH1cIj4ke3RpdGxlfTwvYT5gXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5hcHBlbmQoYDxkaXYgY2xhc3M9J2hlYWRsaW5lLW1ldGEnPiR7cHVibGlzaGVkX3RpbWV9PC9kaXY+YClcbiAgICA7XG4gICAgXG4gICAgaWYoZGVzY3JpcHRpb24pe1xuICAgICAgJGNvbnRhaW5lci5hdHRyKFwidGl0bGVcIiwgZGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9XG4gIFxuICAvKipcbiAgICogQ3JlYXRlIGFuZCBhdHRhY2ggaGVhZGxpbmUgbGlzdCB0byBzaWRlYmFyLlxuICAgKiBIZWFkbGluZSBkYXRhIGFyZSBmZXRjaGVkIGZyb20gZnVuY3Rpb24gYCQkYXJ0aWNsZV9saXN0KClgLCB3aGljaCBjb21lcyBmcm9tXG4gICAqIGV4dGVybmFsIDxzY3JpcHQ+IHRhZy5cbiAgICogQnkgcHV0dGluZyB0aGUgbGlzdCBvZiBhcnRpY2xlIGludG8gc2VwYXJhdGUgZXh0ZXJuYWwgPHNjcmlwdD4gdGFnLFxuICAgKiBkZXZlbG9wZXIgY2FuIGZyZWVseSBtb2RpZnkgaGVhZGxpbmUgbGlzdCB3aXRob3V0IGhhcmQtY29kaW5nIGl0IHRvXG4gICAqIHNpdGUgc2NyaXB0IGZpbGUuXG4gICAqL1xuICBzZXRIZWFkbGluZSgpe1xuICAgIGNvbnN0IGFydGljbGVzID0gJCRhcnRpY2xlX2xpc3QoKTsgLy8gVGhpcyBjb21lcyBmcm9tIGV4dGVybmFsIDxzY3JpcHQ+IHRhZy5cbiAgICBpZighYXJ0aWNsZXMpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKSB8fCBcImphXCI7XG4gICAgY29uc3QgYXJ0aWNsZV90cmVlID0gYXJ0aWNsZXNbbGFuZ107XG5cbiAgICBjb25zdCBhY3RpdmVfdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IGFjdGl2ZV9zdWJ0b3BpYyA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTp0YWcnXVwiKS5hdHRyKFwiY29udGVudFwiKTtcbiAgXG4gICAgY29uc3QgJHRvcGljX2NvbnRhaW5lciA9ICQoXCIjdG9waWMtbGlzdFwiKS5maW5kKFwiLnRhZ3NcIik7XG4gICAgY29uc3QgJHN1YnRvcGljX2NvbnRhaW5lciA9ICQoXCIjc3VidG9waWMtbGlzdFwiKS5maW5kKFwiLnRhZ3NcIik7XG4gICAgY29uc3QgJGFydGljbGVfY29udGFpbmVyID0gJChcIiNhcnRpY2xlLWxpc3RcIikuZmluZChcIi5oZWFkbGluZVwiKTtcbiAgXG4gICAgLyoqXG4gICAgICogR2V0IGpRdWVyeSBlbGVtZW50cyBsaXN0IG9mIHRvcGljc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGxpc3QgLSBUaGlzIHNob3VsZCBiZSAkJGFydGljbGVfbGlzdCgpW2xhbmddXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGl2ZV90b3BpYyAtIFRleHQgb2YgdGhlIHRvcGljXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29uc3QgdG9waWNzID0gKGxpc3QsIGFjdGl2ZV90b3BpYykgPT4ge1xuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdj5cIik7XG4gICAgICBPYmplY3Qua2V5cyhsaXN0KS5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCAkdG9waWMgPSAkKGA8YT48c3BhbiBjbGFzcz0ndGFnJz4ke3ZhbH08L3NwYW4+PC9hPmApO1xuICAgIFxuICAgICAgICBpZih2YWwgPT09IGFjdGl2ZV90b3BpYyB8fCAoIWFjdGl2ZV90b3BpYyAmJiBpbmRleCA9PT0gMCkpe1xuICAgICAgICAgICR0b3BpYy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgJHdyYXBwZXIuYXBwZW5kKCR0b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgcmV0dXJuICR3cmFwcGVyLmNoaWxkcmVuKCk7XG4gICAgfTtcbiAgXG4gICAgLyoqXG4gICAgICogR2V0IGpRdWVyeSBlbGVtZW50cyBsaXN0IG9mIHN1YnRvcGljc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGxpc3QgLSBUaGlzIHNob3VsZCBiZSAkJGFydGljbGVfbGlzdCgpW2xhbmddXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVGV4dCBvZiB0aGUgdG9waWNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aXZlX3N1YnRvcGljIC0gVGV4dCBvZiB0aGUgc3VidG9waWNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCBzdWJUb3BpY3MgPSAobGlzdCwgdG9waWMsIGFjdGl2ZV9zdWJ0b3BpYykgPT4ge1xuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdj5cIik7XG4gICAgICBPYmplY3Qua2V5cyhsaXN0W3RvcGljXSkuZm9yRWFjaCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgJHN1YnRvcGljID0gJChgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHt2YWx9PC9zcGFuPjwvYT5gKTtcbiAgICBcbiAgICAgICAgaWYodmFsID09PSBhY3RpdmVfc3VidG9waWMgfHwgKCFhY3RpdmVfc3VidG9waWMgJiYgaW5kZXggPT09IDApKXtcbiAgICAgICAgICAkc3VidG9waWMuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgJHdyYXBwZXIuYXBwZW5kKCRzdWJ0b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgcmV0dXJuICR3cmFwcGVyLmNoaWxkcmVuKCk7XG4gICAgfTtcbiAgXG4gICAgLyoqXG4gICAgICogR2V0IGpRdWVyeSBlbGVtZW50cyBsaXN0IG9mIGhlYWRsaW5lXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbGlzdCAtIFRoaXMgc2hvdWxkIGJlICQkYXJ0aWNsZV9saXN0KClbbGFuZ11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUZXh0IG9mIHRoZSB0b3BpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdWJ0b3BpYyAtIFRleHQgb2YgdGhlIHN1YnRvcGljXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29uc3QgaGVhZGxpbmVzID0gKGxpc3QsIHRvcGljLCBzdWJ0b3BpYykgPT4ge1xuICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdj5cIik7XG4gICAgICBPYmplY3Qua2V5cyhsaXN0W3RvcGljXVtzdWJ0b3BpY10pLmZvckVhY2goKHYsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBhcnRpY2xlID0gbGlzdFt0b3BpY11bc3VidG9waWNdW3ZdO1xuICAgICAgICBsZXQgYXJ0aWNsZV9kdGltZSA9IChuZXcgRGF0ZShhcnRpY2xlLnB1Ymxpc2hlZF90aW1lKSlcbiAgICAgICAgICAudG9Mb2NhbGVEYXRlU3RyaW5nKGxhbmcsIHt5ZWFyOiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLCBkYXk6IFwibnVtZXJpY1wifSk7XG4gICAgXG4gICAgICAgIGxldCAkaGVhZGxpbmUgPSB0aGlzLmNyZWF0ZUhlYWRsaW5lSXRlbShhcnRpY2xlLnBhdGgsIGFydGljbGUudGl0bGUsIGFydGljbGUuZGVzY3JpcHRpb24sIGFydGljbGVfZHRpbWUpO1xuICAgICAgICAkd3JhcHBlci5hcHBlbmQoJGhlYWRsaW5lKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gJHdyYXBwZXIuY2hpbGRyZW4oKTtcbiAgICB9O1xuICBcbiAgICAvKipcbiAgICAgKiBXaGVuIHN1YnRvcGljIGlzIGNsaWNrZWQsIGhlYWRsaW5lcyBhc3NvY2lhdGVkIHdpdGggdGhlIHN1YnRvcGljIHdpbGwgYmVcbiAgICAgKiBzaG93biBvbiBoZWFkbGluZSBhcmVhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqL1xuICAgIGNvbnN0IG9uQ2xpY2tTdWJ0b3BpYyA9IGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgdG9waWMgPSAkdG9waWNfY29udGFpbmVyLmZpbmQoXCJhLmFjdGl2ZVwiKS50ZXh0KCk7XG4gICAgICBjb25zdCBzdWJ0b3BpYyA9ICR0aGlzLmZpbmQoXCJzcGFuLnRhZ1wiKS50ZXh0KCk7XG4gICAgXG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmZpbmQoXCJhLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICR0aGlzLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIFxuICAgICAgJGFydGljbGVfY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKGhlYWRsaW5lcyhhcnRpY2xlX3RyZWUsIHRvcGljLCBzdWJ0b3BpYykpO1xuICAgIH07XG4gIFxuICAgIC8qKlxuICAgICAqIFdoZW4gdG9waWMgaXMgY2xpY2tlZCwgc3VidG9waWNzIGFzc29jaWF0ZWQgd2l0aCB0aGUgdG9waWMgd2lsbCBiZVxuICAgICAqIHNob3duIG9uIGhlYWRsaW5lIGFyZWEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICovXG4gICAgY29uc3Qgb25DbGlja1RvcGljID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBjb25zdCB0b3BpYyA9ICR0aGlzLmZpbmQoXCJzcGFuLnRhZ1wiKS50ZXh0KCk7XG4gIFxuICAgICAgJHRvcGljX2NvbnRhaW5lci5maW5kKFwiYS5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAkdGhpcy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgXG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAkc3VidG9waWNfY29udGFpbmVyLmFwcGVuZChzdWJUb3BpY3MoYXJ0aWNsZV90cmVlLCB0b3BpYykpO1xuICAgICAgJHN1YnRvcGljX2NvbnRhaW5lci5maW5kKFwiYVwiKS5vbihcImNsaWNrXCIsIG9uQ2xpY2tTdWJ0b3BpYyk7XG4gIFxuICAgICAgY29uc3Qgc3VidG9waWMgPSAkc3VidG9waWNfY29udGFpbmVyLmZpbmQoXCJhLmFjdGl2ZVwiKS50ZXh0KCk7XG4gIFxuICAgICAgJGFydGljbGVfY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKGhlYWRsaW5lcyhhcnRpY2xlX3RyZWUsIHRvcGljLCBzdWJ0b3BpYykpO1xuICAgIH07XG4gICAgXG4gICAgJHRvcGljX2NvbnRhaW5lci5hcHBlbmQodG9waWNzKGFydGljbGVfdHJlZSwgYWN0aXZlX3RvcGljKSk7XG4gICAgJHN1YnRvcGljX2NvbnRhaW5lci5hcHBlbmQoc3ViVG9waWNzKGFydGljbGVfdHJlZSwgYWN0aXZlX3RvcGljLCBhY3RpdmVfc3VidG9waWMpKTtcbiAgICAkYXJ0aWNsZV9jb250YWluZXIuYXBwZW5kKGhlYWRsaW5lcyhhcnRpY2xlX3RyZWUsIGFjdGl2ZV90b3BpYywgYWN0aXZlX3N1YnRvcGljKSk7XG4gICAgXG4gICAgJHRvcGljX2NvbnRhaW5lci5maW5kKFwiYVwiKS5vbihcImNsaWNrXCIsIG9uQ2xpY2tUb3BpYyk7XG4gICAgJHN1YnRvcGljX2NvbnRhaW5lci5maW5kKFwiYVwiKS5vbihcImNsaWNrXCIsIG9uQ2xpY2tTdWJ0b3BpYyk7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRvZ2dsZSBidXR0b24gb3Blbi9jbG9zZSBiZWhhdmlvdXJcbiAgICovXG4gIGluaXRUb2dnbGVCdXR0b24oKXtcbiAgICBsZXQgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gICAgbGV0ICRzaWRlYmFyID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBsZXQgJHRhZ3MgPSAkc2lkZWJhci5maW5kKFwiLnRhZ3NcIik7XG4gICAgbGV0ICRidXR0b24gPSAkKFwiI3NpZGViYXItdG9nZ2xlLWJ1dHRvblwiKTtcbiAgXG4gICAgLyoqXG4gICAgICogQ2xvc2Ugc2lkZWJhciB3aGVuIGVudGlyZSB3aW5kb3cgZXhjZXB0IGZvciBzaWRlYmFyIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqL1xuICAgIGNvbnN0IGNsb3NlU2lkZWJhciA9IChlKSA9PiB7XG4gICAgICAvLyBPbiBtb2JpbGUgc2NyZWVuLCB0aGVyZSBhcmUgZmV3IHNwYWNlcyBvdXRzaWRlIHNpZGViYXIuXG4gICAgICAvLyBTbyBvbiB0aGUgc2NyZWVuIHNpemUsIGNsaWNraW5nIGV2ZW4gc2lkZWJhciBzaG91bGQgY2xvc2UgaXQuXG4gICAgICBpZih3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc5OXB4KVwiKS5tYXRjaGVzKXtcbiAgICAgICAgLy8gV2hlbiBidXR0b25zIGhhdmUgYmVlbiBjbGlja2VkLCBkb24ndCBjbG9zZSBzaWRlYmFyXG4gICAgICAgIGNvbnN0ICRzaWRlYmFyX2J1dHRvbnMgPSAkc2lkZWJhci5maW5kKFwiYSwgYnV0dG9uXCIpO1xuICAgICAgICBpZigkc2lkZWJhcl9idXR0b25zLmlzKGUudGFyZ2V0KSB8fCAkc2lkZWJhcl9idXR0b25zLmhhcyhlLnRhcmdldCkubGVuZ3RoID4gMCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCRzaWRlYmFyLmlzKGUudGFyZ2V0KSB8fCAkc2lkZWJhci5oYXMoZS50YXJnZXQpLmxlbmd0aCA+IDApe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgXG4gICAgICAkc2lkZWJhci5yZW1vdmVDbGFzcyhcInZpc2libGVcIik7XG4gICAgfTtcbiAgICBcbiAgICBjb25zdCBvblRvZ2dsZUJ1dHRvbkNsaWNrZWQgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIFxuICAgICAgaWYoJHNpZGViYXIuaGFzQ2xhc3MoXCJ2aXNpYmxlXCIpKXtcbiAgICAgICAgJHNpZGViYXIucmVtb3ZlQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub2ZmKFwiY2xpY2suY2xvc2VTaWRlYmFyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgJHNpZGViYXIuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAkZG9jdW1lbnQub24oXCJjbGljay5jbG9zZVNpZGViYXJcIiwgY2xvc2VTaWRlYmFyKTtcbiAgICAgIH1cbiAgICB9O1xuICBcbiAgICAkYnV0dG9uLm9uKFwiY2xpY2tcIiwgb25Ub2dnbGVCdXR0b25DbGlja2VkKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFNhbml0aXplIGVtYWlsIGFkZHJlc3MgdGV4dC5cbiAgICogRW1haWwgYWRkcmVzcyB3aWxsIGJlIGRpc3BsYXllZCBpbiBwcm9maWxlIHNlY3Rpb24sXG4gICAqIGJ1dCBvbmx5IGh1bWFuIGNhbiBzZWUgdGhlIHRleHQuXG4gICAqL1xuICBidWlsZEVtYWlsQWRkcmVzcygpe1xuICAgIGxldCBwYWdlT3BlbmVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgbGV0IGlzQWxyZWFkeUJ1aWx0ID0gZmFsc2U7XG4gICAgbGV0ICRlbWFpbCA9ICQoXCIucHJvZmlsZSAuc29jaWFsIC5lbWFpbFwiKTtcbiAgICBcbiAgICBjb25zdCBhZGRyID0gWzgwNTksIDYwODgsIDcxNjMsIDUwNjMsIDczODQsIC0yODIxLCA1ODc5LCA2MDg4LCA3MTYzLCA0NDcyLCA4Mjg4LCA1MjY0LCAtMzA4OCwgNTY3MiwgNjA4OCwgODUxOSwgNTg3OSwgODc1MiwgNDY2NywgNzYwNywgNDQ3MiwgNTY3MiwgNTI2NCwgODI4OCwgLTg0MSwgNTY3MiwgNjk0NCwgNDQ3MiwgNjA4OCwgNjcyNywgLTI4MjEsIDQ4NjQsIDczODQsIDY5NDRdO1xuICAgIFxuICAgIGNvbnN0IG1ha2VBZGRyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmKGlzQWxyZWFkeUJ1aWx0ICYmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHBhZ2VPcGVuZWQpID4gMTUwMCkgcmV0dXJuO1xuICAgICAgXG4gICAgICAkZW1haWwuYXR0cihcImhyZWZcIiwgXCJtYWlsdG86XCIgKyBhZGRyLm1hcChmdW5jdGlvbih2KXtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoTWF0aC5zcXJ0KHYrNDkzNykpXG4gICAgICB9KS5qb2luKFwiXCIpKTtcbiAgICB9O1xuICAgIFxuICAgICRlbWFpbC5vbihcIm1vdXNlb3ZlciB0b3VjaHN0YXJ0XCIsIG1ha2VBZGRyZXNzKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIEJhbGxvb24gZm9yIGRldGFpbCBwcm9maWxlLlxuICAgKi9cbiAgYnVpbGRCYWxsb29uKCl7XG4gICAgJCh0aGlzLnNlbGVjdG9yICsgXCIgW2RhdGEtYmFsbG9vbl1cIikuYmFsbG9vbih7XG4gICAgICBwbGFjZW1lbnQ6IFwibGVmdFwiLFxuICAgICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICAgIG1hcmdpblRvcDogJChcIi5wcm9maWxlLWF0dHJpYnV0ZVwiKS5oZWlnaHQoKSAvIDJcbiAgICB9KTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFNldCB1cmwgdG8gY29ycmVzcG9uZGluZyBwYWdlIHdyaXR0ZW4gaW4gYW5vdGhlciBsYW5ndWFnZVxuICAgKiB0byBsYW5ndWFnZSBidXR0b24oYW5jaG9yKS5cbiAgICovXG4gIHNldHVwTGFuZ0J1dHRvbigpe1xuICAgIGNvbnN0ICRhbmNob3IgPSAkKFwiLmxhbmd1YWdlLnByb2ZpbGUtYXR0cmlidXRlIGFbZGF0YS1sYW5nXVwiKTtcbiAgICBjb25zdCBjdXJyZW50X2xhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKTtcbiAgICBjb25zdCBhcnRpY2xlX2lkID0gJChcImhlYWQgPiBtZXRhW25hbWU9J2FydGljbGVJRCddW2NvbnRlbnRdXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IGFydGljbGVzID0gJCRhcnRpY2xlX2xpc3QoKTtcblxuICAgICRhbmNob3IuZWFjaChmdW5jdGlvbigpe1xuICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgdGFyZ2V0X2xhbmcgPSAkdGhpcy5kYXRhKFwibGFuZ1wiKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhcnRpY2xlc1t0YXJnZXRfbGFuZ10pLnNvbWUoKHRvcGljKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFydGljbGVzW3RhcmdldF9sYW5nXVt0b3BpY10pLnNvbWUoKHN1YnRvcGljKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXJ0aWNsZXNbdGFyZ2V0X2xhbmddW3RvcGljXVtzdWJ0b3BpY10pLnNvbWUoKGFydGljbGUpID0+IHtcbiAgICAgICAgICAgICAgaWYoYXJ0aWNsZSA9PT0gYXJ0aWNsZV9pZCl7XG4gICAgICAgICAgICAgICAgJHRoaXMuYXR0cihcImhyZWZcIiwgYXJ0aWNsZXNbdGFyZ2V0X2xhbmddW3RvcGljXVtzdWJ0b3BpY11bYXJ0aWNsZV0ucGF0aCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGUpe1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiYm9keSA+IG1haW4gPiBhcnRpY2xlXCI7XG5cbiAgICB0aGlzLmJ1aWxkQXJ0aWNsZUhlYWRlcigpO1xuICB9XG5cbiAgYnVpbGRBcnRpY2xlSGVhZGVyKCl7XG4gICAgY29uc3QgJGFydGljbGUgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIGNvbnN0ICRoZWFkZXIgPSAkYXJ0aWNsZS5maW5kKFwiLmFydGljbGUtaGVhZGVyXCIpO1xuICAgIGNvbnN0IGxhbmcgPSAkKFwiaHRtbFwiKS5hdHRyKFwibGFuZ1wiKSB8fCBcImphXCI7XG4gICAgY29uc3QgdGl0bGUgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J29nOnRpdGxlJ11cIikuYXR0cihcImNvbnRlbnRcIik7XG4gICAgY29uc3QgdG9waWMgPSAkKFwiaGVhZCA+IG1ldGFbcHJvcGVydHk9J2FydGljbGU6c2VjdGlvbiddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGNvbnN0IHN1YnRvcGljID0gJChcImhlYWQgPiBtZXRhW3Byb3BlcnR5PSdhcnRpY2xlOnRhZyddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGxldCBwdWJsaXNoZWRfdGltZSA9ICQoXCJoZWFkID4gbWV0YVtwcm9wZXJ0eT0nYXJ0aWNsZTpwdWJsaXNoZWRfdGltZSddXCIpLmF0dHIoXCJjb250ZW50XCIpO1xuICAgIGxldCBkdGltZSA9IG5ldyBEYXRlKERhdGUucGFyc2UocHVibGlzaGVkX3RpbWUpKTtcbiAgICBsZXQgdGltZV9yZWxhdGl2ZSA9IHRoaXMudGltZVJlbGF0aXZlVG9Ob3coZHRpbWUpO1xuICBcbiAgICBsZXQgdGltZV9hYnNvbHV0ZSA9IGR0aW1lLnRvTG9jYWxlVGltZVN0cmluZyhsYW5nLCB7XG4gICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgIGRheTogXCJudW1lcmljXCJcbiAgICB9KTtcblxuICAgIGxldCBoZWFkZXJfc3RyaW5nID0gYFxuICAgICAgPGRpdiBjbGFzcz0ndGFncyc+XG4gICAgICAgIDxhPjxzcGFuIGNsYXNzPSd0YWcnPiR7dG9waWN9PC9zcGFuPjwvYT5cbiAgICAgICAgPGE+PHNwYW4gY2xhc3M9J3RhZyc+JHtzdWJ0b3BpY308L3NwYW4+PC9hPlxuICAgICAgPC9kaXY+XG4gICAgICA8aDEgY2xhc3M9J2FydGljbGUtdGl0bGUnPiR7dGl0bGV9PC9oMT5cbiAgICAgIDxkaXYgY2xhc3M9J2FydGljbGUtZGF0ZScgZGF0YS1iYWxsb29uPScke3RpbWVfYWJzb2x1dGV9Jz5cbiAgICAgICAgPGkgY2xhc3M9J2ZhIGZhLWNsb2NrLW8nPjwvaT4gJHt0aW1lX3JlbGF0aXZlfVxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgICRoZWFkZXIuaHRtbChoZWFkZXJfc3RyaW5nKTtcbiAgICBjb25zdCAkYXJ0aWNsZV9kYXRlID0gJGhlYWRlci5maW5kKCcuYXJ0aWNsZS1kYXRlJyk7XG4gICAgJGFydGljbGVfZGF0ZS5iYWxsb29uKHtcbiAgICAgIHBsYWNlbWVudDogXCJib3R0b21cIixcbiAgICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgICBtYXJnaW5Ub3A6ICQoJGFydGljbGVfZGF0ZSkuaGVpZ2h0KCkvMixcbiAgICAgIG1hcmdpbkxlZnQ6IDcsXG4gICAgICBvcGFjaXR5OiAuODVcbiAgICB9KTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIEdldCBcIi4uLmRheXMgYWdvXCIgdGV4dCByZWxhdGl2ZSB0byBjdXJyZW50IGRhdGUgdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtEYXRlfSBkdGltZSAtIEFic29sdXRlIGRhdGV0aW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICB0aW1lUmVsYXRpdmVUb05vdyhkdGltZSl7XG4gICAgbGV0IHNlY29uZHMgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBkdGltZSkgLyAxMDAwO1xuICAgIGxldCB0aW1lQWdvID0gXCJcIjtcbiAgXG4gICAgaWYoc2Vjb25kcyA8IDYwKXtcbiAgICAgIGNvbnN0IHQgPSBwYXJzZUludChzZWNvbmRzKTtcbiAgICAgIHRpbWVBZ28gPSBgJHt0fSBzZWNvbmQke3QhPT0xPydzJzonJ30gYWdvYDtcbiAgICB9XG4gICAgZWxzZSBpZihzZWNvbmRzIDwgMzYwMCl7XG4gICAgICBjb25zdCB0ID0gcGFyc2VJbnQoc2Vjb25kcy82MCk7XG4gICAgICB0aW1lQWdvID0gYCR7dH0gbWludXRlJHt0IT09MT8ncyc6Jyd9IGFnb2A7XG4gICAgfVxuICAgIGVsc2UgaWYoc2Vjb25kcyA8IDg2NDAwKXtcbiAgICAgIGNvbnN0IHQgPSBwYXJzZUludChzZWNvbmRzLzM2MDApO1xuICAgICAgdGltZUFnbyA9IGAke3R9IGhvdXIke3QhPT0xPydzJzonJ30gYWdvYDtcbiAgICB9XG4gICAgZWxzZSBpZihzZWNvbmRzIDwgODY0MDAqMzEpe1xuICAgICAgY29uc3QgdCA9IHBhcnNlSW50KHNlY29uZHMvODY0MDApO1xuICAgICAgdGltZUFnbyA9IGAke3R9IGRheSR7dCE9PTE/J3MnOicnfSBhZ29gO1xuICAgIH1cbiAgICBlbHNlIGlmKHNlY29uZHMgPCA4NjQwMCozMSoxMil7XG4gICAgICBjb25zdCB0ID0gcGFyc2VJbnQoc2Vjb25kcy84NjQwMC8zMSk7XG4gICAgICB0aW1lQWdvID0gYCR7dH0gbW9udGgke3QhPT0xPydzJzonJ30gYWdvYDtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNvbnN0IHQgPSBwYXJzZUludChzZWNvbmRzLzg2NDAwLzMxLzEyKTtcbiAgICAgIHRpbWVBZ28gPSBgJHt0fSB5ZWFyJHt0IT09MT8ncyc6Jyd9IGFnb2A7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aW1lQWdvO1xuICB9XG59XG4iLCJpbXBvcnQgXCIuL2Fzc2V0XCI7XG5pbXBvcnQgSGVhZGVyIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZGVyXCI7XG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9jb21wb25lbnRzL3NpZGViYXJcIjtcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRzXCI7XG5cbmNvbnN0IG1haW4gPSBmdW5jdGlvbigpe1xuICBjb25zdCBoZWFkZXIgPSBuZXcgSGVhZGVyKCk7XG4gIGNvbnN0IHNpZGViYXIgPSBuZXcgU2lkZWJhcigpO1xuICBjb25zdCBjb250ZW50ID0gbmV3IENvbnRlbnQoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
