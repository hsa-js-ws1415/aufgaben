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

            callback(note);
        }, 60);
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
     *
     * @param {string} serverURI
     * @param {function(Error|null)?} callback (optional)
     * @returns {Q.defer}
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
                connections[this.__id] = true;
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
    }

    Client.prototype.create = function (note, callback) {
        var response = Q.defer();
        var self = this;

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
        });

        return response.promise;
    };

    Client.prototype.read = function () {
        var response = Q.defer();

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