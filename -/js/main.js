(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./standard');

},{"./standard":5}],2:[function(require,module,exports){
"use strict";

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
    this.element = $(this.selector);

    this.sticky();
  }

  _createClass(Header, [{
    key: "sticky",
    value: function sticky() {
      var $window = $(window);
      var header = this.element;
      var resizing = false;
      var scrollDownThreshold = 200;
      var scrollUpThreshold = 100;

      var onTransitionEnd = function onTransitionEnd(e) {
        header.removeClass("disable-height-animation");
        resizing = false;
      };

      header.on("transitionend webkitTransitionEnd oTransitionEnd", onTransitionEnd);

      $window.on("scroll", function (e) {
        if (!window.matchMedia("(min-width: 1200px)").matches || resizing) return;

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sidebar = function Sidebar() {
  _classCallCheck(this, Sidebar);

  this.selector = "body > main > nav";
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Nzc2cvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zc3NnL2pzL21haW4uanMiLCJzcmMvc3NzZy9qcy9zdGFuZGFyZC9hc3NldC5qcyIsInNyYy9zc3NnL2pzL3N0YW5kYXJkL2NvbXBvbmVudHMvaGVhZGVyLmpzIiwic3JjL3Nzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3JjL3Nzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7QUNBQTtBQUNBOzs7Ozs7Ozs7Ozs7SUNEcUIsTTtBQUNuQixvQkFBYTtBQUFBOztBQUNYLFNBQUssUUFBTCxHQUFnQixlQUFoQjtBQUNBLFNBQUssT0FBTCxHQUFlLEVBQUUsS0FBSyxRQUFQLENBQWY7O0FBRUEsU0FBSyxNQUFMO0FBQ0Q7Ozs7NkJBRU87QUFDTixVQUFJLFVBQVUsRUFBRSxNQUFGLENBQWQ7QUFDQSxVQUFJLFNBQVMsS0FBSyxPQUFsQjtBQUNBLFVBQUksV0FBVyxLQUFmO0FBQ0EsVUFBSSxzQkFBc0IsR0FBMUI7QUFDQSxVQUFJLG9CQUFvQixHQUF4Qjs7QUFFQSxVQUFNLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLENBQUQsRUFBTztBQUM3QixlQUFPLFdBQVAsQ0FBbUIsMEJBQW5CO0FBQ0EsbUJBQVcsS0FBWDtBQUNELE9BSEQ7O0FBS0EsYUFBTyxFQUFQLENBQVUsa0RBQVYsRUFBOEQsZUFBOUQ7O0FBRUEsY0FBUSxFQUFSLENBQVcsUUFBWCxFQUFxQixVQUFDLENBQUQsRUFBTztBQUMxQixZQUFHLENBQUMsT0FBTyxVQUFQLENBQWtCLHFCQUFsQixFQUF5QyxPQUExQyxJQUFxRCxRQUF4RCxFQUFrRTs7QUFFbEUsWUFBTSxZQUFZLFFBQVEsU0FBUixFQUFsQjs7QUFFQSxZQUFHLG9CQUFvQixTQUFwQixJQUFpQyxZQUFZLG1CQUFoRCxFQUFvRTtBQUNsRSxjQUFHLENBQUMsT0FBTyxRQUFQLENBQWdCLGNBQWhCLENBQUosRUFBcUM7O0FBRXJDLGNBQUcsQ0FBQyxPQUFPLFFBQVAsQ0FBZ0IsZUFBaEIsQ0FBSixFQUFzQyxPQUFPLFFBQVAsQ0FBZ0IsZUFBaEI7O0FBRXRDLGNBQUksZ0JBQWdCLE1BQU0sRUFBTixHQUFXLFNBQS9CO0FBQ0EsaUJBQU8sR0FBUCxDQUFXO0FBQ1Qsb0JBQVEsYUFEQztBQUVULHFDQUF1QixhQUF2QjtBQUZTLFdBQVg7O0FBS0E7QUFDRDs7QUFFRCxZQUFHLGFBQWEsbUJBQWhCLEVBQW9DO0FBQ2xDLGNBQUcsT0FBTyxRQUFQLENBQWdCLGNBQWhCLENBQUgsRUFBb0M7O0FBRXBDLHFCQUFXLElBQVg7QUFDQSxpQkFBTyxRQUFQLENBQWdCLGNBQWhCO0FBQ0QsU0FMRCxNQU1LLElBQUcsYUFBYSxpQkFBaEIsRUFBa0M7QUFDckMsY0FBRyxDQUFDLE9BQU8sUUFBUCxDQUFnQixjQUFoQixDQUFKLEVBQXFDOztBQUVyQyxpQkFBTyxVQUFQLENBQWtCLE9BQWxCO0FBQ0EsaUJBQU8sV0FBUCxDQUFtQixlQUFuQjs7QUFFQSxxQkFBVyxJQUFYO0FBQ0EsaUJBQU8sUUFBUCxDQUFnQiwwQkFBaEI7QUFDQSxpQkFBTyxXQUFQLENBQW1CLGNBQW5CO0FBQ0Q7QUFDRixPQW5DRDtBQW9DRDs7Ozs7O2tCQTFEa0IsTTs7Ozs7Ozs7Ozs7SUNBQSxPLEdBQ25CLG1CQUFhO0FBQUE7O0FBQ1gsT0FBSyxRQUFMLEdBQWdCLG1CQUFoQjtBQUNELEM7O2tCQUhrQixPOzs7OztBQ0FyQjs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLEdBQVU7QUFDckIsTUFBTSxTQUFTLHNCQUFmO0FBQ0EsTUFBTSxVQUFVLHVCQUFoQjtBQUNELENBSEQ7O0FBS0EsRUFBRSxJQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9zdGFuZGFyZCc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKaGMzTmxkQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBoZWFkZXJcIjtcbiAgICB0aGlzLmVsZW1lbnQgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgIFxuICAgIHRoaXMuc3RpY2t5KCk7XG4gIH1cbiAgXG4gIHN0aWNreSgpe1xuICAgIGxldCAkd2luZG93ID0gJCh3aW5kb3cpO1xuICAgIGxldCBoZWFkZXIgPSB0aGlzLmVsZW1lbnQ7XG4gICAgbGV0IHJlc2l6aW5nID0gZmFsc2U7XG4gICAgbGV0IHNjcm9sbERvd25UaHJlc2hvbGQgPSAyMDA7XG4gICAgbGV0IHNjcm9sbFVwVGhyZXNob2xkID0gMTAwO1xuICBcbiAgICBjb25zdCBvblRyYW5zaXRpb25FbmQgPSAoZSkgPT4ge1xuICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwiZGlzYWJsZS1oZWlnaHQtYW5pbWF0aW9uXCIpO1xuICAgICAgcmVzaXppbmcgPSBmYWxzZTtcbiAgICB9O1xuICBcbiAgICBoZWFkZXIub24oXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmRcIiwgb25UcmFuc2l0aW9uRW5kKTtcbiAgXG4gICAgJHdpbmRvdy5vbihcInNjcm9sbFwiLCAoZSkgPT4ge1xuICAgICAgaWYoIXdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogMTIwMHB4KVwiKS5tYXRjaGVzIHx8IHJlc2l6aW5nKSByZXR1cm47XG4gICAgXG4gICAgICBjb25zdCBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgIFxuICAgICAgaWYoc2Nyb2xsVXBUaHJlc2hvbGQgPCBzY3JvbGxUb3AgJiYgc2Nyb2xsVG9wIDwgc2Nyb2xsRG93blRocmVzaG9sZCl7XG4gICAgICAgIGlmKCFoZWFkZXIuaGFzQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIikpIHJldHVybjtcbiAgICAgIFxuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwic2Nyb2xsLW1hcmdpblwiKSkgaGVhZGVyLmFkZENsYXNzKFwic2Nyb2xsLW1hcmdpblwiKTtcbiAgICAgIFxuICAgICAgICBsZXQgaGVhZGVyX2hlaWdodCA9IDMwMCArIDIwIC0gc2Nyb2xsVG9wO1xuICAgICAgICBoZWFkZXIuY3NzKHtcbiAgICAgICAgICBoZWlnaHQ6IGhlYWRlcl9oZWlnaHQsXG4gICAgICAgICAgYm90dG9tOiBgY2FsYygxMDAlIC0gJHtoZWFkZXJfaGVpZ2h0fXB4KWBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgXG4gICAgICBpZihzY3JvbGxUb3AgPj0gc2Nyb2xsRG93blRocmVzaG9sZCl7XG4gICAgICAgIGlmKGhlYWRlci5oYXNDbGFzcyhcImZpeGVkLWhlYWRlclwiKSkgcmV0dXJuO1xuICAgICAgXG4gICAgICAgIHJlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgaGVhZGVyLmFkZENsYXNzKFwiZml4ZWQtaGVhZGVyXCIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihzY3JvbGxUb3AgPD0gc2Nyb2xsVXBUaHJlc2hvbGQpe1xuICAgICAgICBpZighaGVhZGVyLmhhc0NsYXNzKFwiZml4ZWQtaGVhZGVyXCIpKSByZXR1cm47XG4gICAgICBcbiAgICAgICAgaGVhZGVyLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcbiAgICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwic2Nyb2xsLW1hcmdpblwiKTtcbiAgICAgIFxuICAgICAgICByZXNpemluZyA9IHRydWU7XG4gICAgICAgIGhlYWRlci5hZGRDbGFzcyhcImRpc2FibGUtaGVpZ2h0LWFuaW1hdGlvblwiKTtcbiAgICAgICAgaGVhZGVyLnJlbW92ZUNsYXNzKFwiZml4ZWQtaGVhZGVyXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBtYWluID4gbmF2XCI7XG4gIH1cbn1cbiIsImltcG9ydCBcIi4vYXNzZXRcIjtcbmltcG9ydCBIZWFkZXIgZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkZXJcIjtcbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL2NvbXBvbmVudHMvc2lkZWJhclwiO1xuXG5jb25zdCBtYWluID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgaGVhZGVyID0gbmV3IEhlYWRlcigpO1xuICBjb25zdCBzaWRlYmFyID0gbmV3IFNpZGViYXIoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
