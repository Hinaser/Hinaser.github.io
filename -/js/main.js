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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function Header() {
  var _this = this;

  _classCallCheck(this, Header);

  this.selector = "body > header";
  this.element = $(this.selector);

  var $window = $(window);
  var resizing = false;

  $window.on("scroll", function (e) {
    if ($window.scrollTop() > 100 && window.matchMedia("(min-width: 1200px)").matches) {
      resizing = true;
      _this.element.addClass("fixed-header");
      _this.element.one("transitionend webkitTransitionEnd oTransitionEnd", function () {
        resizing = false;
        console.log(resizing);
      });
    } else if (!resizing) {
      _this.element.removeClass("fixed-header");
    }
  });
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Nzc2cvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9zc3NnL2pzL21haW4uanMiLCJzcmMvc3NzZy9qcy9zdGFuZGFyZC9hc3NldC5qcyIsInNyYy9zc3NnL2pzL3N0YW5kYXJkL2NvbXBvbmVudHMvaGVhZGVyLmpzIiwic3JjL3Nzc2cvanMvc3RhbmRhcmQvY29tcG9uZW50cy9zaWRlYmFyLmpzIiwic3JjL3Nzc2cvanMvc3RhbmRhcmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7QUNBQTtBQUNBOzs7Ozs7Ozs7O0lDRHFCLE0sR0FDbkIsa0JBQWE7QUFBQTs7QUFBQTs7QUFDWCxPQUFLLFFBQUwsR0FBZ0IsZUFBaEI7QUFDQSxPQUFLLE9BQUwsR0FBZSxFQUFFLEtBQUssUUFBUCxDQUFmOztBQUVBLE1BQUksVUFBVSxFQUFFLE1BQUYsQ0FBZDtBQUNBLE1BQUksV0FBVyxLQUFmOztBQUVBLFVBQVEsRUFBUixDQUFXLFFBQVgsRUFBcUIsVUFBQyxDQUFELEVBQU87QUFDMUIsUUFBRyxRQUFRLFNBQVIsS0FBc0IsR0FBdEIsSUFBNkIsT0FBTyxVQUFQLENBQWtCLHFCQUFsQixFQUF5QyxPQUF6RSxFQUFpRjtBQUMvRSxpQkFBVyxJQUFYO0FBQ0EsWUFBSyxPQUFMLENBQWEsUUFBYixDQUFzQixjQUF0QjtBQUNBLFlBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsa0RBQWpCLEVBQXFFLFlBQUk7QUFDdkUsbUJBQVcsS0FBWDtBQUNBLGdCQUFRLEdBQVIsQ0FBWSxRQUFaO0FBQ0QsT0FIRDtBQUlELEtBUEQsTUFRSyxJQUFHLENBQUMsUUFBSixFQUFhO0FBQ2hCLFlBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsY0FBekI7QUFDRDtBQUNGLEdBWkQ7QUFhRCxDOztrQkFyQmtCLE07Ozs7Ozs7Ozs7O0lDQUEsTyxHQUNuQixtQkFBYTtBQUFBOztBQUNYLE9BQUssUUFBTCxHQUFnQixtQkFBaEI7QUFDRCxDOztrQkFIa0IsTzs7Ozs7QUNBckI7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxHQUFVO0FBQ3JCLE1BQU0sU0FBUyxzQkFBZjtBQUNBLE1BQU0sVUFBVSx1QkFBaEI7QUFDRCxDQUhEOztBQUtBLEVBQUUsSUFBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vc3RhbmRhcmQnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmhjM05sZEM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnNlbGVjdG9yID0gXCJib2R5ID4gaGVhZGVyXCI7XG4gICAgdGhpcy5lbGVtZW50ID0gJCh0aGlzLnNlbGVjdG9yKTtcbiAgICBcbiAgICBsZXQgJHdpbmRvdyA9ICQod2luZG93KTtcbiAgICBsZXQgcmVzaXppbmcgPSBmYWxzZTtcbiAgICBcbiAgICAkd2luZG93Lm9uKFwic2Nyb2xsXCIsIChlKSA9PiB7XG4gICAgICBpZigkd2luZG93LnNjcm9sbFRvcCgpID4gMTAwICYmIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogMTIwMHB4KVwiKS5tYXRjaGVzKXtcbiAgICAgICAgcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJmaXhlZC1oZWFkZXJcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5vbmUoXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmRcIiwgKCk9PntcbiAgICAgICAgICByZXNpemluZyA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc2l6aW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCFyZXNpemluZyl7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyhcImZpeGVkLWhlYWRlclwiKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc2VsZWN0b3IgPSBcImJvZHkgPiBtYWluID4gbmF2XCI7XG4gIH1cbn1cbiIsImltcG9ydCBcIi4vYXNzZXRcIjtcbmltcG9ydCBIZWFkZXIgZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkZXJcIjtcbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL2NvbXBvbmVudHMvc2lkZWJhclwiO1xuXG5jb25zdCBtYWluID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgaGVhZGVyID0gbmV3IEhlYWRlcigpO1xuICBjb25zdCBzaWRlYmFyID0gbmV3IFNpZGViYXIoKTtcbn07XG5cbiQobWFpbik7XG4iXX0=
