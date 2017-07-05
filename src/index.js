const listeners = new Map();

function createHandler(sym, handler, onetime, detach) {
    if (onetime) {
        event => {
            detach(sym);
            handler(event);
        };
    }

    return handler;
}

export default class DomEventHandler {
    constructor() {
        this.detach = this.detach.bind(this);
    }

    /**
	    @param {HTMLElement} element
	    @param {String} eventName event name
	    @param {Function} handler event handler
	    @param {Boolean} capture
	    @param {Boolean} onetime
	    @return {Symbol}
	*/
    _attach({ target, name, handler, capture = false }, onetime = false) {
        const sym = Symbol();

        const eventData = {
            handler: createHandler(sym, handler, onetime, this.detach),
            target: target,
            name: name,
            capture
        };

        // save data
        listeners.set(sym, {
            event: eventData,
            onetime
        });

        // set event listener
        target.addEventListener(name, eventData.handler, capture);

        return sym;
    }

    /**
	 * attach new event handler
	 * @param  {HTMLElement or NodeList}   eventTarget
	 * @param  {String}   eventName
	 * @param  {Function} eventHandler
	 * @param  {Boolean}   capture
	 * @param  {Boolean}   onetime   should auto. detach after execution
	 * @return {Symbol or Array of Symbols} event handler id or array of ids
	 */
    attach(
        eventTarget,
        eventName,
        eventHandler,
        capture = false,
        onetime = false
    ) {
        if (!eventTarget.length) {
            return this._attach(
                eventTarget,
                eventName,
                eventHandler,
                capture,
                onetime
            );
        }

        const targets = Array.from(eventTarget); // create array from NodeList
        const symbols = [];

        for (const target of targets) {
            symbols.push(
                this._attach(target, eventName, eventHandler, capture, onetime)
            );
        }

        return symbols;
    }

    /*
	    @param {Number} id
	    @return {Boolean}
	*/
    // _detach(key, value) {
    //     const data = value ? value : this.listeners.get(key);
    //
    //     if (data === undefined) return false;
    //
    //     const callback = this.callbacks.get(key);
    //
    //     this.callbacks.delete(key);
    //
    //     data.element.removeEventListener(
    //         data.eventName,
    //         callback,
    //         data.capture
    //     );
    //
    //     return this.listeners.delete(key);
    // }

    detach(symbol) {}

    // detach(id) {
    //     if (typeof id !== "number" && !Array.isArray(id)) {
    //         throw "Argument must be number or array of numbers. An id/s of event listener/s returned by the attach method.";
    //     }
    //
    //     const results = [];
    //
    //     if (!id.length) id = [id];
    //
    //     for (let num of id) {
    //         results.push(this._detach(num));
    //     }
    //
    //     return results.length === 1 ? results[0] : results;
    // }
    //
    // destroy() {
    //     this.listeners.forEach((data, id) => {
    //         this._detach(id, data);
    //     });
    //
    //     this.listeners.clear();
    //
    //     this.callbacks.clear();
    //
    //     this.id = 0;
    // }
}
