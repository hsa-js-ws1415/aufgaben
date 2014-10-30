(function (win) {
    'use strict';

    var server;

    /**
     *
     * @constructor
     */
    function Server() {
        if(!localStorage.getItem('id')) {
            localStorage.setItem('id', 0);
        }
        if(!localStorage.getItem('notes')) {
            localStorage.setItem('notes', JSON.stringify({})    );
        }
    }

    /**
     *
     * @type {string}
     */
    Server.prototype.uri = 'https://secure/note/server';

    /**
     *
     * @type {number}
     */
    Server.prototype.__getId = function () {
        var id = localStorage.getItem('id');

        localStorage.setItem('id', ++id);

        return id;
    };

    /**
     *
     * @param {Note} note
     * @param {function(Error|null, Note?)} callback
     */
    Server.prototype.create = function (note, callback) {
        var self = this;

        setTimeout(function () {
            var notes;

            if (!note || !note.text) {
                callback(new Error('(Storage Error) Can\'t store note. No text is given.'));
                return;
            }

            note.id = self.__getId();

            notes = JSON.parse(localStorage.getItem('notes'));
            notes[note.id] = note.text;

            localStorage.setItem('notes', JSON.stringify(notes));

            callback(null, note);
        }, 60);
    };

    /**
     * @param {number, function(Error|null, Note?|[Note]?)} id (optional)
     * @param {function(Error|null, Note?|[Note]?)?} callback
     */
    Server.prototype.read = function (id, callback) {
        setTimeout(function () {
            var isId = typeof id !== 'function';
            var notes = JSON.parse(localStorage.getItem('notes'));
            var noteId;
            var note;
            var result;

            callback = isId ? callback : id;

            if (isId) {
                if (!notes[id]) {
                    callback(new Error('(Storage Error) Can\t find note for id ' + id + ' .' ));
                    return;
                }

                note = new Note(notes[id]);
                note.id = id;

                callback(null, note);
            }

            if (!isId) {
                result = [];
                for (noteId in notes) {
                    if (notes.hasOwnProperty(noteId)) {
                        note = new Note(notes[noteId]);
                        note.id = noteId;
                        result.push(note);
                    }
                }
                callback(null, result);
            }
        }, 30);
    };

    /**
     *
     * @param {number} id
     * @param {string} text
     * @param {function(Error|null, Note?)} callback
     */
    Server.prototype.update = function (id, text, callback) {
        setTimeout(function () {
            var notes = JSON.parse(localStorage.getItem('notes'));

            if (!notes[id]) {
                callback(new Error('(Storage Error) Can\t find note for id ' + id + ' .'));
                return;
            }

            notes[id] = text;

            localStorage.setItem('notes', JSON.stringify(notes));

            callback(null, notes);
        }, 75);
    }

    /**
     *
     * @param {number} note
     * @param {function(Error|null)} callback
     */
    Server.prototype.destroy = function (id, callback) {
        setTimeout(function () {
            var notes = JSON.parse(localStorage.getItem('notes'));

            if (!notes[id]) {
                callback(new Error('(Storage Error) Can\t find note for id ' + id + ' .'));
                return;
            }

            delete notes[id];

            localStorage.setItem('notes', JSON.stringify(notes));

            callback(null);
        }, 10);
    };

    server = new Server();



    /**
     *
     * @constructor
     */
    function Client() {
        EventEmitter2.call(this);
    }

    /**
     *
     * @type {EventEmitter2}
     */
    Client.prototype = Object.create(EventEmitter2.prototype);

    /**
     *
     * @param {string} serverURI
     * @param {function(Error|null)?} callback (optional)
     */
    Client.prototype.connect = function (serverURI, callback) {
        var self = this;

        setTimeout(function () {
            var err = null;

            if (serverURI !== server.uri) {
                err = new Error('(Connection Error) Unable to resolve uri: ' + serverURI + '.');
            }

            if (callback) {
                callback(err);
            }

            if (err) {
                self.emit('error', err, self);
                return;
            }

            self.emit('connected', self);
        }, 50);
    };

    /**
     *
     * @param {Note} note
     * @param {function(Error|null, Note?)?} callback (optional)
     * @returns {promise}
     */
    Client.prototype.create = function (note, callback) {
        var response = Q.defer();
        var self = this;

        this.emit('create:create', note);
        server.create(note, function (err, note) {
            if (err) {
                self.emit('create:error', err);
                response.reject(err);
                if (callback) {
                    callback(err);
                }

                return;
            }

            self.emit('create:success', note);
            response.resolve(note);

            if (callback) {
                callback(err, note);
            }
        });

        return response.promise;
    };

    /**
     *
     * @param {number|function(Error|null, Note?|[Note]?)} id (optional)
     * @param {function(Error|null, Note?|[Note]?)} callback
     * @returns {promise}
     */
    Client.prototype.read = function (id, callback) {
        var response = Q.defer();
        var self = this;

        /**
         * @param {Error|null, ?Note|?[Note]} err
         * @param {Note|[Note]?} result
         */
        function handleResponse(err, result) {
            if (err) {
                self.emit('read:error', err, id);
                response.reject(err);
                if (callback) {
                    callback(err);
                }
                return;
            }

            self.emit('read:success', result);
            response.resolve(result);
            if (callback) {
                callback(null, result);
            }
        }

        if (id) {
            server.read(id, handleResponse);
        }

        if (!id) {
            server.read(handleResponse);
        }

        this.emit('read:read', id);

        return response.promise;
    };

    /**
     *
     * @param {Note} note
     * @param {function(Error|null, Note?)} callback
     * @returns {promise}
     */
    Client.prototype.update = function (note, callback) {
        var response = Q.defer();
        var self = this;

        server.update(note.id, note.text, function (err, note) {
            if (err) {
                self.emit('update:error', err);
                response.reject(err);
                if (callback) {
                    callback(err);
                }
                return;
            }

            self.emit('update:success', note);
            response.resolve(note);
            if (callback) {
                callback(null, note);
            }
        });

        this.emit('update:update', note);

        return response.promise;
    };

    /**
     *
     * @param {Note} note
     * @param {function (Error|null, id?)} callback
     * @returns {promise}
     */
    Client.prototype.destroy = function (note, callback) {
        var response = Q.defer();
        var self = this;
        var id = note.id;

        server.destroy(note.id, function (err) {
           if (err) {
               self.emit('destroy:error', err, id);
               response.reject(err);
               if (err) {
                   callback(err);
               }
               return;
           }

            delete note.id;
            self.emit('destroy:success', id);
            response.resolve(note);
            if (callback) {
                callback(null, note);
            }
        });

        this.emit('destroy:destroy', note);

        return response.promise;
    };



    /**
     *
     * @type {Client}
     */
    win.Client = Client;

})(window);