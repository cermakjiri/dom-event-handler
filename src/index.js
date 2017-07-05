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

export default class DomEventHandler {
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
            throw new TypeError(
                `First argument must be a symbol, not ${typeof sym}.`
            );
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
