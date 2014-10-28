(function (win, doc) {
    'use strict';

    /**
     * @param {string} text
     * @constructor
     */
    function Note(text) {
        EventEmitter2.call(this);

        this._init(text);
    }

    /**
     * @type {EventEmitter2}
     */
    Note.prototype = Object.create(EventEmitter2.prototype);

    /**
     * @param {string} text
     * @protected
     */
    Note.prototype._init = function (text) {
        this.text = text;

        this._container = doc.createElement('li');
        this._container.className = 'note';

        this._button = doc.createElement('button');
        this._button.appendChild(doc.createTextNode(' X '));
        this._button.addEventListener('click', this._clickHandler.bind(this), false);

        this._text = doc.createTextNode(text);

        this._container.appendChild(this._text);
        this._container.appendChild(this._button);
    };

    /**
     * @type {Node}
     * @protected
     */
    Note.prototype._container = null;

    /**
     * @type {Node}
     * @protected
     */
    Note.prototype._button = null;

    /**
     * @type {Node}
     * @protected
     */
    Note.prototype._text = null;

    /**
     * @protected
     */
    Note.prototype._clickHandler = function () {
        this.emit('delete', this);
        this.onDelete(this);
    };

    /**
     * Will be set by server after Note was successfully stored.
     *
     * @type {null|number}
     */
    Note.prototype.id = null;

    /**
     * @type {string}
     */
    Note.prototype.text = null;

    /**
     * @param text
     * @returns {Note}
     */
    Note.prototype.setText = function (text) {
        this._container.removeChild(this._text);
        this._text = doc.createTextNode(text);
        this._container.prependChild(text);
        this.text = text;

        return this;
    };

    /**
     * @param {Note} self
     * @TODO
     */
    Note.prototype.onDelete = function (self) {};

    /**
     * @type {Note}
     */
    win.Note = Note;

})(window, document);