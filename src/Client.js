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
     * @param {Note} note
     * @param {function(Error|null, Note?)} callback
     */
    Server.prototype.update = function (id, note, callback) {
        setTimeout(function () {
            var notes = JSON.parse(localStorage.getItem('notes'));

            if (!notes[id]) {
                callback(new Error('(Storage Error) Can\t find note for id ' + id + ' .'));
                return;
            }

            notes[id] = note.text;

            localStorage.setItem('notes', JSON.stringify(notes));

            callback(null, notes);
        }, 75);
    }

    /**
     *
     * @param {number} id
     * @param {function(Error|null)} callback
     */
    Server.prototype.delete = function (id, callback) {
        setTimeout(function () {
            var notes = localStorage.getItem('notes');

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
     * @param {?function(Error|null)} callback (optional)
     */
    Client.prototype.connect = function (serverURI, callback) {
        var err = null;
        var serverDelay = 50; //ms
        var self = this;

        if (serverURI !== server.uri) {
            err = new Error('(Connection Error) Unable to resolve uri: ' + serverURI + '.');
        }

        setTimeout(function () {
            if (callback) {
                callback(err);
            }

            if (err) {
                self.emit('error', err, self);
                return;
            }

            self.emit('connected', self);
        }, serverDelay);
    };

    /**
     *
     * @param {Note} note
     * @param {function(Error|null, Note?)?} callback (optional)
     * @returns {promise}
     */
    Client.prototype.create = function (note, callback) {
        var response = Q.defer();

        server.create(note, function (err, note) {
            if (err) {
                response.reject(err);
                if (callback) {
                    callback(err);
                }
                return;
            }

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

        /**
         * @param {Error|null, ?Note|?[Note]} err
         * @param {Note|[Note]?} result
         */
        function handleResponse(err, result) {
            if (err) {
                response.reject(err);
                if (callback) {
                    callback(err);
                }
                return;
            }

            response.resolve(result);
        }

        if (typeof id === 'function') {
            server.read(handleResponse);
        } else {
            server.read(id, handleResponse);
        }

        return response.promise;
    };

    /**
     *
     * @param {number} id
     * @param {Note} note
     * @param {function(Error|null, Note?)} callback
     * @returns {promise}
     */
    Client.prototype.update = function (id, note, callback) {
        var response = Q.defer();

        server.update(id, note, function (err, note) {
            if (err) {
                response.reject(err);
                if (callback) {
                    callback(err);
                }
                return;
            }

            response.resolve(note);
            if (callback) {
                callback(null, note);
            }
        });

        return response.promise;
    };

    /**
     *
     * @param {number} id
     * @param {function (Error|null, id?)} callback
     * @returns {promise}
     */
    Client.prototype.delete = function (id, callback) {
        var response = Q.defer();

        server.delete(id, function (err) {
           if (err) {
               response.reject(err);
               if (err) {
                   callback(err);
               }
               return;
           }

            response.resolve(id);
            if (callback) {
                callback(null, id)
            }
        });

        return response.promise;
    };



    /**
     *
     * @type {Client}
     */
    win.Client = Client;

})(window);