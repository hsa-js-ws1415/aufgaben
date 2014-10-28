(function (win, doc) {
  'use strict';

  /**
   * @constructor
   */
  function NotePad() {

    // Calling explicitly "Super"-constructor
    EventEmitter2.call(this);

    this._init();

    this.notes = [];
  }

  /**
   * Inherit form EventEmitter2
   *
   * @type {EventEmitter2}
   */
  NotePad.prototype = Object.create(EventEmitter2.prototype);

  /**
   * @protected
   */
  NotePad.prototype._init = function () {
      this._container = doc.createElement('div');
      this._container.className = 'note_pad_container';

      this._list = doc.createElement('ul');
      this._list.className = 'note_pad';

      this._container.appendChild(this._list);

      doc.body.appendChild(this._container);
  };

  /**
   * @type {Node}
   * @protected
   */
  NotePad.prototype._container = null;

  /**
   * @type {Node}
   * @protected
   */
  NotePad.prototype._list = null;

  /**
   * @type {[Note]}
   */
  NotePad.prototype.notes = null;

  /**
   * @param {Note, Note, Note, ...} note
   */
  NotePad.prototype.add = function (note) {
      //@TODO
  };

  /**
   * @param {Note} note
   * @returns {Note}
   */
  NotePad.prototype.remove = function (note) {
    //@TODO
  };

  NotePad.prototype.render = function () {
    var i;

    while(this._list.firstChild) {
      this._list.removeChild(this._list.firstChild);
    }

    for (i = 0; this.notes.length > i; i++) {
      this._list.appendChild(this.notes[i]._container);
    }
  };

  /**
   *
   * @type {NotePad}
   */
  win.NotePad = NotePad;

})(window, document);