(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.domEventHandler = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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