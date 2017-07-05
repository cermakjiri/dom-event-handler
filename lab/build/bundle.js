(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.domEventHandler = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _src = require("../../src/");

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const h1 = new _src2.default();
const h2 = new _src2.default();

const s1 = h1.attach(window, "click", () => {
    console.log("s1 - click");
});

const s2 = h1.attach(window, "mousemove", () => {
    console.log("s1 - mousemove");
});

h2.attach(window, "mousemove", () => {
    console.log("s2 - mousemove");
});

window.DomEventHandler = _src2.default;
window.h1 = h1;
window.h2 = h2;

},{"../../src/":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const listeners = new Map();
const symbols = new Map();

/**
 * @param  {Symbol} sym
 * @return {Boolean}
 */
function detach(sym) {
    const data = listeners.get(sym);

    if (data === undefined) return false;

    const { target, name, handler, capture } = data;

    target.removeEventListener(name, handler, capture);

    return listeners.delete(sym);
}

/**
 * detach all event listeners
 * @return {void}
 */
function destroy(symbols) {
    for (const sym of symbols) {
        detach(sym);
    }

    symbols.clear();
}

class DomEventHandler {
    constructor() {
        symbols.set(this, new Set());
    }

    /**
     * attach new event handler
     * @param  {HTMLElement} target event target
     * @param  {String}   name event name
     * @param  {Function} handler event handler
     * @param  {Boolean}   capture
     * @param  {Boolean}   onetime   should auto. detach after execution
     * @return {Symbol} event handler id or array of ids
     */
    attach(target, name, handler, capture = false, onetime = false) {
        const sym = Symbol();
        let eventHandler = handler;

        if (onetime) {
            eventHandler = event => {
                this.detach(sym);

                handler(event);
            };
        }

        // set event listener
        target.addEventListener(name, eventHandler, capture);

        // save data
        listeners.set(sym, {
            handler: eventHandler,
            target,
            name,
            capture
        });

        symbols.get(this).add(sym);

        return sym;
    }

    /**
     * detach event listener
     * @param  {Symbol} sym
     * @return {Boolean}
     */
    detach(sym) {
        if (typeof sym !== "symbol") {
            throw new TypeError(`First argument must be a symbol, not ${typeof sym}.`);
        }

        symbols.get(this).delete(sym);

        return detach(sym);
    }

    destroy() {
        destroy(symbols.get(this));
    }

    static destroy() {
        for (const [key, value] of symbols.entries()) {
            destroy(value);
        }
    }
}
exports.default = DomEventHandler;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsYWIvc3JjL2luZGV4LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsTUFBTSxLQUFLLG1CQUFYO0FBQ0EsTUFBTSxLQUFLLG1CQUFYOztBQUVBLE1BQU0sS0FBSyxHQUFHLE1BQUgsQ0FBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCLE1BQU07QUFDeEMsWUFBUSxHQUFSLENBQVksWUFBWjtBQUNILENBRlUsQ0FBWDs7QUFJQSxNQUFNLEtBQUssR0FBRyxNQUFILENBQVUsTUFBVixFQUFrQixXQUFsQixFQUErQixNQUFNO0FBQzVDLFlBQVEsR0FBUixDQUFZLGdCQUFaO0FBQ0gsQ0FGVSxDQUFYOztBQUlBLEdBQUcsTUFBSCxDQUFVLE1BQVYsRUFBa0IsV0FBbEIsRUFBK0IsTUFBTTtBQUNqQyxZQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNILENBRkQ7O0FBSUEsT0FBTyxlQUFQO0FBQ0EsT0FBTyxFQUFQLEdBQVksRUFBWjtBQUNBLE9BQU8sRUFBUCxHQUFZLEVBQVo7Ozs7Ozs7O0FDbkJBLE1BQU0sWUFBWSxJQUFJLEdBQUosRUFBbEI7QUFDQSxNQUFNLFVBQVUsSUFBSSxHQUFKLEVBQWhCOztBQUVBOzs7O0FBSUEsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCO0FBQ2pCLFVBQU0sT0FBTyxVQUFVLEdBQVYsQ0FBYyxHQUFkLENBQWI7O0FBRUEsUUFBSSxTQUFTLFNBQWIsRUFBd0IsT0FBTyxLQUFQOztBQUV4QixVQUFNLEVBQUUsTUFBRixFQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFBeUIsT0FBekIsS0FBcUMsSUFBM0M7O0FBRUEsV0FBTyxtQkFBUCxDQUEyQixJQUEzQixFQUFpQyxPQUFqQyxFQUEwQyxPQUExQzs7QUFFQSxXQUFPLFVBQVUsTUFBVixDQUFpQixHQUFqQixDQUFQO0FBQ0g7O0FBRUQ7Ozs7QUFJQSxTQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEI7QUFDdEIsU0FBSyxNQUFNLEdBQVgsSUFBa0IsT0FBbEIsRUFBMkI7QUFDdkIsZUFBTyxHQUFQO0FBQ0g7O0FBRUQsWUFBUSxLQUFSO0FBQ0g7O0FBRWMsTUFBTSxlQUFOLENBQXNCO0FBQ2pDLGtCQUFjO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLElBQVosRUFBa0IsSUFBSSxHQUFKLEVBQWxCO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBLFdBQU8sTUFBUCxFQUFlLElBQWYsRUFBcUIsT0FBckIsRUFBOEIsVUFBVSxLQUF4QyxFQUErQyxVQUFVLEtBQXpELEVBQWdFO0FBQzVELGNBQU0sTUFBTSxRQUFaO0FBQ0EsWUFBSSxlQUFlLE9BQW5COztBQUVBLFlBQUksT0FBSixFQUFhO0FBQ1QsMkJBQWUsU0FBUztBQUNwQixxQkFBSyxNQUFMLENBQVksR0FBWjs7QUFFQSx3QkFBUSxLQUFSO0FBQ0gsYUFKRDtBQUtIOztBQUVEO0FBQ0EsZUFBTyxnQkFBUCxDQUF3QixJQUF4QixFQUE4QixZQUE5QixFQUE0QyxPQUE1Qzs7QUFFQTtBQUNBLGtCQUFVLEdBQVYsQ0FBYyxHQUFkLEVBQW1CO0FBQ2YscUJBQVMsWUFETTtBQUVmLGtCQUZlO0FBR2YsZ0JBSGU7QUFJZjtBQUplLFNBQW5COztBQU9BLGdCQUFRLEdBQVIsQ0FBWSxJQUFaLEVBQWtCLEdBQWxCLENBQXNCLEdBQXRCOztBQUVBLGVBQU8sR0FBUDtBQUNIOztBQUVEOzs7OztBQUtBLFdBQU8sR0FBUCxFQUFZO0FBQ1IsWUFBSSxPQUFPLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUN6QixrQkFBTSxJQUFJLFNBQUosQ0FDRCx3Q0FBdUMsT0FBTyxHQUFJLEdBRGpELENBQU47QUFHSDs7QUFFRCxnQkFBUSxHQUFSLENBQVksSUFBWixFQUFrQixNQUFsQixDQUF5QixHQUF6Qjs7QUFFQSxlQUFPLE9BQU8sR0FBUCxDQUFQO0FBQ0g7O0FBRUQsY0FBVTtBQUNOLGdCQUFRLFFBQVEsR0FBUixDQUFZLElBQVosQ0FBUjtBQUNIOztBQUVELFdBQU8sT0FBUCxHQUFpQjtBQUNiLGFBQUssTUFBTSxDQUFDLEdBQUQsRUFBTSxLQUFOLENBQVgsSUFBMkIsUUFBUSxPQUFSLEVBQTNCLEVBQThDO0FBQzFDLG9CQUFRLEtBQVI7QUFDSDtBQUNKO0FBbkVnQztrQkFBaEIsZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgRG9tRXZlbnRIYW5kbGVyIGZyb20gXCIuLi8uLi9zcmMvXCI7XG5cbmNvbnN0IGgxID0gbmV3IERvbUV2ZW50SGFuZGxlcigpO1xuY29uc3QgaDIgPSBuZXcgRG9tRXZlbnRIYW5kbGVyKCk7XG5cbmNvbnN0IHMxID0gaDEuYXR0YWNoKHdpbmRvdywgXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJzMSAtIGNsaWNrXCIpO1xufSk7XG5cbmNvbnN0IHMyID0gaDEuYXR0YWNoKHdpbmRvdywgXCJtb3VzZW1vdmVcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiczEgLSBtb3VzZW1vdmVcIik7XG59KTtcblxuaDIuYXR0YWNoKHdpbmRvdywgXCJtb3VzZW1vdmVcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiczIgLSBtb3VzZW1vdmVcIik7XG59KTtcblxud2luZG93LkRvbUV2ZW50SGFuZGxlciA9IERvbUV2ZW50SGFuZGxlcjtcbndpbmRvdy5oMSA9IGgxO1xud2luZG93LmgyID0gaDI7XG4iLCJjb25zdCBsaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5jb25zdCBzeW1ib2xzID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIEBwYXJhbSAge1N5bWJvbH0gc3ltXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBkZXRhY2goc3ltKSB7XG4gICAgY29uc3QgZGF0YSA9IGxpc3RlbmVycy5nZXQoc3ltKTtcblxuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IHsgdGFyZ2V0LCBuYW1lLCBoYW5kbGVyLCBjYXB0dXJlIH0gPSBkYXRhO1xuXG4gICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlciwgY2FwdHVyZSk7XG5cbiAgICByZXR1cm4gbGlzdGVuZXJzLmRlbGV0ZShzeW0pO1xufVxuXG4vKipcbiAqIGRldGFjaCBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5mdW5jdGlvbiBkZXN0cm95KHN5bWJvbHMpIHtcbiAgICBmb3IgKGNvbnN0IHN5bSBvZiBzeW1ib2xzKSB7XG4gICAgICAgIGRldGFjaChzeW0pO1xuICAgIH1cblxuICAgIHN5bWJvbHMuY2xlYXIoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9tRXZlbnRIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3ltYm9scy5zZXQodGhpcywgbmV3IFNldCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggbmV3IGV2ZW50IGhhbmRsZXJcbiAgICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gdGFyZ2V0IGV2ZW50IHRhcmdldFxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICBuYW1lIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gaGFuZGxlciBldmVudCBoYW5kbGVyXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gICBjYXB0dXJlXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gICBvbmV0aW1lICAgc2hvdWxkIGF1dG8uIGRldGFjaCBhZnRlciBleGVjdXRpb25cbiAgICAgKiBAcmV0dXJuIHtTeW1ib2x9IGV2ZW50IGhhbmRsZXIgaWQgb3IgYXJyYXkgb2YgaWRzXG4gICAgICovXG4gICAgYXR0YWNoKHRhcmdldCwgbmFtZSwgaGFuZGxlciwgY2FwdHVyZSA9IGZhbHNlLCBvbmV0aW1lID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3Qgc3ltID0gU3ltYm9sKCk7XG4gICAgICAgIGxldCBldmVudEhhbmRsZXIgPSBoYW5kbGVyO1xuXG4gICAgICAgIGlmIChvbmV0aW1lKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goc3ltKTtcblxuICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBldmVudCBsaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudEhhbmRsZXIsIGNhcHR1cmUpO1xuXG4gICAgICAgIC8vIHNhdmUgZGF0YVxuICAgICAgICBsaXN0ZW5lcnMuc2V0KHN5bSwge1xuICAgICAgICAgICAgaGFuZGxlcjogZXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGNhcHR1cmVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3ltYm9scy5nZXQodGhpcykuYWRkKHN5bSk7XG5cbiAgICAgICAgcmV0dXJuIHN5bTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkZXRhY2ggZXZlbnQgbGlzdGVuZXJcbiAgICAgKiBAcGFyYW0gIHtTeW1ib2x9IHN5bVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZGV0YWNoKHN5bSkge1xuICAgICAgICBpZiAodHlwZW9mIHN5bSAhPT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICBgRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN5bWJvbCwgbm90ICR7dHlwZW9mIHN5bX0uYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN5bWJvbHMuZ2V0KHRoaXMpLmRlbGV0ZShzeW0pO1xuXG4gICAgICAgIHJldHVybiBkZXRhY2goc3ltKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBkZXN0cm95KHN5bWJvbHMuZ2V0KHRoaXMpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVzdHJveSgpIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2Ygc3ltYm9scy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGRlc3Ryb3kodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19

//# sourceMappingURL=bundle.js.map
