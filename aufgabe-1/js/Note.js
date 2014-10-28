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
      this._container = doc.createElement('li');
      this._container.className = 'note';

      this._button = doc.createElement('button');
      this._button.appendChild(doc.createTextNode(' X '));
      this._button.addEventListener('click', this._clickHandler.bind(this), false);

      this._container.appendChild(doc.createTextNode(text));
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
   * @protected
   */
  Note.prototype._clickHandler = function () {
    this.emit('delete', this);
    this.onDelete(this);
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