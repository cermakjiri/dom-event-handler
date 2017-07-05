export default class DomEventHandler {
    constructor() {
        this.id = 0;
        this.listeners = new Map();
        this.callbacks = new Map();
    }

    _createCallback(id, fn, onetime) {
        if (onetime) {
            this.callbacks.set(id, event => {
                this.detach(id);

                fn(event);
            });
        } else {
            this.callbacks.set(id, fn);
        }
    }

    /*
        @param {HTMLElement} element
        @param {String} event
        @param {Function} fn
        @param {Boolean} capture
        @param {Boolean} onetime
        @return {Number} id
    */
    _attach(element, eventName, callback, onetime, capture) {
        const id = this.id;

        this._createCallback(id, callback, onetime);

        // save data
        this.listeners.set(id, { element, eventName, onetime, capture });

        // add event listener
        element.addEventListener(eventName, this.callbacks.get(id), capture);

        return this.id++;
    }

    /**
     * attach new event handler
     * @param  {HTMLElement or NodeList}   element   [description]
     * @param  {String}   eventName [description]
     * @param  {Function} callback  [description]
     * @param  {Boolean}   onetime   should auto. detach after execution
     * @param  {Boolean}   capture   [description]
     * @return {Number}             event handler id or array of ids
     */
    attach(element, eventName, callback, onetime, capture) {
        if (!element.length) {
            return this._attach(element, eventName, callback, onetime, capture);
        }

        const elements = [...element];
        const id = [];

        for (let el of elements) {
            id.push(this._attach(el, eventName, callback, onetime, capture));
        }

        return id.length === 1 ? id[0] : id;
    }

    /*
        @param {Number} id
        @return {Boolean}
    */
    _detach(key, value) {
        const data = value ? value : this.listeners.get(key);

        if (data === undefined) return false;

        const callback = this.callbacks.get(key);

        this.callbacks.delete(key);

        data.element.removeEventListener(
            data.eventName,
            callback,
            data.capture
        );

        return this.listeners.delete(key);
    }

    detach(id) {
        if (typeof id !== "number" && !Array.isArray(id)) {
            throw "Argument must be number or array of numbers. An id/s of event listener/s returned by the attach method.";
        }

        const results = [];

        if (!id.length) id = [id];

        for (let num of id) {
            results.push(this._detach(num));
        }

        return results.length === 1 ? results[0] : results;
    }

    destroy() {
        this.listeners.forEach((data, id) => {
            this._detach(id, data);
        });

        this.listeners.clear();

        this.callbacks.clear();

        this.id = 0;
    }
}
