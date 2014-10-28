(function (win) {
    'use strict';

    var server;
    var client = 0;
    var connections = {};

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
     * @param {?number, function(Error|null, ?Note|[Note])} id (optional)
     * @param {?function(Error|null, ?Note|[Note])} callback
     */
    Server.prototype.read = function (id, callback) {
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
    };

    server = new Server();



    /**
     *
     * @constructor
     */
    function Client() {
        this.__id = ++client;
        EventEmitter2.call(this);
    }

    /**
     * @type {string}
     * @private
     */
    Client.prototype.__id = null;

    /**
     *
     * @type {EventEmitter2}
     */
    Client.prototype = Object.create(EventEmitter2.prototype);

    /**
     * @private
     */
    Client.prototype.__checkConnection = function () {
        if (!connections[this.__id]) {
            throw new Error('(Fatal Error) Connection was not established.');
        }
    };

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
            if (!err) {
                connections[self.__id] = true;
            }

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
        var self = this;

        this.__checkConnection();

        server.create(note, function (err, note) {
            if (err) {
                response.reject(err);
                if (callback) {
                    callback(err);
                }
                return;
            }

            self.emit('created', note);
            response.resolve(note);

            if (callback) {
                callback(err, note);
            }
        });

        return response.promise;
    };

    /**
     *
     * @param {?number|function(Error|null, ?Note|[Note])} id (optional)
     * @param {function(Error|null, ?Note|[Note])} callback
     * @returns {promise}
     */
    Client.prototype.read = function (id, callback) {
        var response = Q.defer();

        this.__checkConnection();

        if (typeof id === 'function') {
            server.read(function (err, notes) {
                if (err) {
                    response.reject(err);
                    if (callback) {
                        callback(null);
                    }
                    return;
                }

                response.resolve(notes);
            });
        } else {
            server.read(id, function (err, note) {
                if (err) {
                    response.reject(err);
                    if (callback) {
                        callback(null);
                    }
                    return;
                }

                response.resolve(note);
            });
        }

        return response.promise;
    };

    Client.prototype.update = function () {
        var response = Q.defer();

        return response.promise;
    };

    Client.prototype.delete = function () {
        var response = Q.defer();

        return response.promise;
    };

    win.Client = Client;

})(window);