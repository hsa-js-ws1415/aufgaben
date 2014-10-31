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
- [async.js](https://github.com/caolan/async): Flow-Library für asynchrone Operationen

Eine kleine Erklärung zum Server:

Der "Server" ist kein echter "Server", der über das Netzwerk erreicht wird. Es handelt sich hierbei, um einen Wrapper des [localStorage](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage#Summary) des Browsers. Um den `localStorage` zu bereinigen, kann man in der Konsole einfach die Methode ``localStorage.clear()`` ausführen. Alternativ kann man auch über das *Resources*-Tab der Konsole den `localStorage` löschen.

## Aufgaben

### main-0.js - Logging (optional | empfohlen)

Als erstes soll ein einfaches Logging implementiert werden. Die Ausgabe erfolgt in der Konsole ([Chrome](https://developer.chrome.com/devtools/docs/console), [Firefox](https://developer.mozilla.org/de/docs/Tools/Web_Konsole)). Das Logging kann bei den folgenden Aufgaben hilfreich beim Debugging sein.

- `Client` ist ein [EventEmitter](https://github.com/asyncly/EventEmitter2)
  - Es werden beim Aufruf der folgenden Methoden "Events" bzw. "Ereignisse" gemeldet:
     - `Client.prototype.create`: `create:create`, `create:error`, `create:success`
     - `Client.prototype.read`: `read:read`, `read:error`, `read:success`
     - `Client.prototype.update`: `update:update`, `update:error`, `update:success`
     - `Client.prototype.destroy`: `destroy:destroy`, `destroy:error`, `delete:success`
     - `Client.prototype.connect`: `connected`, `error`
- Die Aufgabe besteht nun darin ein einfaches Logging in die Konsole des Browser zu implementieren.
  1. Erzeuge eine Instanz des `Client`s.
  2. Höre auf die "Events" `error` und `connected`.
  3. Versuche nun zuerst über die Methode `Client.prototype.connect` eine Verbindung mit einer falschen URL zum "Server" aufzubauen. Z.B.: `client.connect('https://wrong.uri')`. Gib die Fehlermeldung in der Konsole aus.
  4. Verbinde dich über die Methode `Client.prototype.connect` mit dem "Server". Verwende diesmal die richtige URL: *https://secure/note/server*. Gib in der Konsole eine beliebige Erfolgsmeldung aus.
  5. Höre auf beliebige "Events" der Methoden `Client.prototype.create`, `Client.prototype.destroy`, usw.. **Hinweis**: Erst im Verlauf der Aufgabe wirst du Ausgaben in deiner Konsole sehen können.
- Tipp 1 - Auf diese Weisen kann man auf die "Ereignisse" hören:  

```javascript
client.on('connected', function () {
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

### main-1.js - Callbacks VS Promises (VS async.js)

Als Nächstes geht es um den Vergleich von Promises und Callbacks. Wer möchte kann `async.js` in den Vergleich mitaufnehmen.

- Erstelle zuerst neun `Notes` und verwende dabei sprechende Namen und Texte, damit du diese leicht wiedererkennen kannst. Zum Beispiel so:

```javascript
var note1 = new Note('Note 1');
```

- Speichere nun die ersten drei `Notes` **hintereinander** mit Hilfe des `Client`s auf dem "Server" ab. Verwende hierzu die *Callback*-API des `Client`s:

```javascript
client.create(note1, function callback(err, note) {
	// note2
		// note3
})
```

- Stelle die `Note`s in einem `NotePad` dar nachdem alle drei abgepseichert wurden.
- Speichere nun die `Note`s vier bis sechs **hintereinander** mit Hilfe der *Promise*-API:

```javascript
client
	.create(note4)
	.then(function () {
	   // note5
	})
	// ... usw.
```
- Stelle die mit der *Promise*-API gepeicherten `Note`s im letzte Schritt im selben `NotePad` dar.

- **Optional**
- Speichere als letztes die `Notes`s sieben bis neun mit Hilfe `asnyc.js` ab.
- Stelle im *finalen* Callback die `Note`s wiederum selben `NotePad` dar.
- Tipp: 
  - Fasse die `Notes` zuerst in einem Array zusammen: ```var notes = [note7, note8, note9] ```
  - Verwende die Methode `async.each(arr, iterator, final)`
  - Der `iterator`-Callback erhält als erstes Argument jeweils ein `Note`. Als zweites Argument erhält der `iterator` einen callback, der aufgerufen werden soll wenn die asynchrone Operation bzw. das Speichern auf dem "Server" fertig ist.
  - Als drittes Argument erhält die `async.each` - Methode einen finalen Callback, der dazu dient einen Fehler zu behandeln bzw. eine finale Aktion auszuführen.

```javascript
async.each(
	notes, 
	function iterator(note, done) {
		// note speichern und done() aufrufen wenn das Speichern abgeschlossen ist
	},
	function final(err) {
	   // Fehler behandeln und wenn alles gut gegangen ist die Notes im NotePad anzeigen
	}
);	
```

### main-2.js Create, Read, Update and Delete

Nun geht es darum den Workflow "Speichern", "Lesen", "Aktualisieren" und "Löschen" zu implementieren.
Alle Methoden des `Client`s unterstützen sowohl die *Promise*- als auch die *Callback*-API. Du kannst selbst entscheiden welche API dir besser gefällt.

1. Erzeuge ein Neues `Note` mit einem eindeutigem Text.
2. `Client.prototype.create`: Speichere das `Note` ab.
3. `Client.prototype.read`: Lese das `Note` vom Server und zeige es im `NotePad` an.
4. `Client.prototype.update`: Aktualisiere den Text des `Note`s auf dem "Server" und stelle das aktualisierte `Note` im `NotePad` dar.
5. `Client.prototype.delete`: Lösche das `Note` auf dem "Server" und zeige den aktuellen Stand im `NotePad` an.

Tipps: 
- Kommentiere die Aufgabe main-1.js aus, damit du dich voll auf main.2.js konzentrieren kannst.
- Gehe Schritt für Schritt vor und schaue dir an was das `NotePad` anzeigt.
- Denke an das Bereinigen vom Server: `localStorage.clear()`.

### main-pro.js Client + NotePad

In dieser Aufgabe soll das NotePad mit dem Client kombiniert werden. Nun soll also bspw. ein neues `Note` auch auf dem "Server" gespeichert werden.

1. Höre auf das *new*-Event der `Input`-Instanz und stelle diesmal nicht nur das neue `Note` im `NotePad` dar, sondern speichere es auch auf dem "Server".
2. Höre auf das *delete*-Event eines `Note`s und lass es nicht nur aus dem `NotePad` verschwinden, sondern lösche es auch vom "Server".
3. Lese inital alle `Note`s vom "Server" und zeige sie im `NotePad` an.
4. Die aus 3. vom "Server" gelesenen `Note`s sollen auch gelöscht werden können.

Tipps: Siehe Aufgabe main-2.js 

