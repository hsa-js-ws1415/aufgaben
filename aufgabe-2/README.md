# Aufgabe 2 - Simple Notepad + "Remote" Server

## Beschreibung

Diese Aufgabe baut auf der "Aufgabe 1 - Simple Notepad" auf. D.h. es wird vorausgesetzt, dass das `NotePad` bzw. die Methoden `add` und `remove` fertig implementiert sind.

Dieses Mal wird über einen `Client[.js]` mit einem "Server" kommuniziert. Auf dem "Server" werden `Note`s verwaltet. D.h. es sollen `Note`s gespeichert, gelesen, bearbeitet und gelöscht werden.

Es steht das folgende Gründgerüst zur Verfügung:

- wie in Aufgabe 1 +
- `Note.js` wurde um die folgenden Attribute und Methoden modifiziert:
  - `{string} id`: Wird vom "Server" gesetzt und zum identifizieren des jeweiligen Notes verwenden
  - `{string} text`: Der `Note`-Text
  - `setText({string} text)`: Ein neuer `Note`-Text kann gesetzt werden  
- `Client.js`: 
  - **C**reate(): speichert ein `Note` auf dem Server
  - **R**ead(): liest ein oder mehrere `Notes` vom Server
  - **U**pdate(): aktualisiert ein `Note` auf dem Server
  - **D**estroy(): löscht ein `Note` auf dem Server

## Aufgaben

### main-0.js - Logging (optional | empfohlen)

Als erstes soll ein einfaches Logging implementiert werden. Die Ausgabe erfolgt in der Konsole ([Chrome](https://developer.chrome.com/devtools/docs/console), [Firefox](https://developer.mozilla.org/de/docs/Tools/Web_Konsole)). Das Logging kann bei den folgenden Aufgaben hilfreich beim Debugging sein.

- `Client` ist ein [EventEmitter](https://github.com/asyncly/EventEmitter2)
  - Es werden beim Aufruf der folgenden Methoden "Events" bzw. "Ereignisse" gemeldet:
     - `Client.prototype.create`: `create:create`, `create:error`, `create:success`
     - `Client.prototype.read`: `read:read`, `read:error`, `read:success`
     - `Client.prototype.update`: `update:update`, `update:error`, `update:success`
     - `Client.prototype.destroy`: `delete:delete`, `delete:error`, `delete:success`
     - `Client.prototype.connect`: `connected`, `error`
- Die Aufgabe besteht nun darin ein einfaches Logging in die Konsole des Browser zu implementieren.
  1. Erzeuge eine Instanz des `Client`s.
  2. Höre auf die "Events" `error` und `connected`.
  3. Versuche nun zuerst über die Methode `Client.prototype.connect` eine Verbindung mit einer falschen URL zum "Server" aufzubauen. Z.B.: `client.connect('https://wrong.uri')`. Gib die Fehlermeldung in der Konsole aus.
  4. Verbinde dich über die Methode `Client.prototype.connect` mit dem "Server". Verwende diesmal die richtige URL: *https://secure/note/server*. Gib in der Konsole eine beliebige Erfolgsmeldung aus.
  5. Höre auf beliebige "Events" der Methoden `Client.prototype.create`, `Client.prototype.destroy`, usw.. **Hinweis**: Erst im Verlauf der Aufgabe wirst du Ausgaben in deiner Konsole sehen können.
- Tipp 1 - Auf diese Weisen kann man auf die "Ereignisse" hören:  

```javascript
client.on('connect', function () {
	console.log('Connection successfully established!')
;});

// Bevor die Anfrage an den Server gestellt wird
client.on('create:create', function createListener(note) {
	console.info('Creating new note with text: ' + note.text);
});

// Wenn bei der Anfrage an den Server etwas schief gegangen ist
client.on('read:error', function readErrorListener(err, noteId) {
	if (noteId) {
	   console.error('Couldn\'t read note with id ' + noteId + ' from server. Probably it does not exist!');
	} else {
		console.error('Error:' + err);
	}
	
});

// Wenn die Anfrage erfolgreich war
client.on('delete:success', function destroySuccessListener(id) {
   console.info('Note with id ' + id + ' was successfully deleted.');
});

```
- Tipp 2: Die Argumente die den "Callbacks" bzw. "Listenern" übergeben werden kannst du je Methode im "Modul" Client.js nachlesen. Suche dabei nach dem Methodennamen, z.B. `Client.prototype.create` und nach dem Aufruf von `this.emit('xyz', arg1, arg2, argN)` bzw. `self.emit('abc', arg1, arg2, argN)`

## main-1