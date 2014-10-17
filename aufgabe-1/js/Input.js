(function (win, doc) {

  /**
   * @constructor
   */
  function Input() {
    EventEmitter2.call(this);

    this._init();
  }

  /**
   * @type {EventEmitter2}
   */
  Input.prototype = Object.create(EventEmitter2.prototype);

  /**
   * @protected
   */
  Input.prototype._init = function () {
      this._container = doc.createElement('div');
      this._container.className = 'input_container';

      this._input = doc.createElement('textarea');
      this._input.setAttribute('placeholder', 'Enter a new note here ...');
      this._input.className = 'input';

      this._button = doc.createElement('button');
      this._button.appendChild(doc.createTextNode('Save'));
      this._button.addEventListener('click', this._clickHandler.bind(this), false);
      this._button.className = 'input_button';

      this._container.appendChild(this._input);
      this._container.appendChild(this._button);

      doc.body.appendChild(this._container);
  };

  /**
   * @protected
   */
  Input.prototype._clickHandler = function () {
    this.emit('new', this._input.value);
    this.onNew(this._input.value);

    this._input.value = '';
  };

  /**
   * @type {Node}
   * @protected
   */
  Input.prototype._container = null;

  /**
   * @type {Node}
   * @protected
   */
  Input.prototype._input = null;

  /**
   * @type {Node}
   * @protected
   */
  Input.prototype._button = null;

  /**
   * @TODO
   * @param {string} text
   */
  Input.prototype.onNew = function (text) {};

  /**
   * @type {Input}
   */
  win.Input = Input;

})(window, document);