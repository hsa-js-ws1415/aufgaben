# Aufgabe 1 - Simple Notepad

## Beschreibung

In dieser Aufgabe soll ein einfaches Notepad implementiert werden. Um die Aufgabe zu lösen sind keinerlei HTML- oder CSS-Kenntnisse notwendig. Alles soll nur in JavaScript programmiert werden.
Für die Umsetzung steht bereits ein kleines Grundgerüst zur Verfügung:

- ``js/NotePad.js``: der Notizblock
- ``js/Note.js``: die einzelne Notiz
- ``js/Input.js``: die Eingabemaske
- ``js/main-[3.1-3.4].js``: Hier kommt die Logik rein
- ``index.html``: Darstellung des Notepads
- der Rest: unwichtig für diese Aufgabe, aber notwendig für die Darstellung


## Aufgaben:

### 1. NotePad.prototype.add

- Implementiere die ``NotePad.prototype.add` - Methode.
    - Ein neues ``Note`` soll in der Instanzvariable ``notes`` des ``NotePad`` gespeichert werden.
    - Führe die Methode ``NotePad.prototype.render`` aus, um die aktuellen ``Notes`` darzustellen.
    - Nice to have: Die Methode soll beliebig viele Argumente vom Typ ``Note`` entgegennehmen können.
        - Tipp: Benutze das ``arguments`` - Objekt.
        - Very very nice to have: Löse das "Nice to have" ohne ``for`` -Schleife 
            - @see: [Function.prototype.apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
            - @see: [Array.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
    * Optional: Die Methode soll einen aussagekräftigen Fehler werfen, wenn ein Argument übergeben wird, das nicht vom Typ ``Note`` ist.
  
  
### 2. NotePad.prototype.remove

- Implementiere die ``NotePad.prototype.remove`` - Methode.
  - Die Methode erhält als Argument die Instanz einer ``Note``, die gelöscht werden soll.
      - Lösche die Instanz aus der Instanzvariable ``notes`` des ``NotePad``.
          - Tipp 1: Finde die richtige Referenz in ``notes`.
          - Tipp 2: Verwende die [Array.prototype.splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)-Methode.
  - Führe die Methode ``NotePad.prototype.render`` aus, um die aktuellen ``Notes`` darzustellen.
  
### 3. main.js  
  
#### 3.1 main-1.js 

- In der ``main.js`` stehen dir die "Klassen" ``NotePad``, ``Note`` und ``Input`` zur Verfügung: 
    - Erzeuge eine Instanz von ``NotePad`` und weise diese einer Variablen zu.
    - Öffne die ``index.html`` im Browser, um zu sehen was passiert ist.
  
### 3.2 main-2.js

- Füge neue ``Notes`` (min. 2) zum ``NotePad`` hinzu und stelle diese dar.
- Tipp: @see [Array.prototype.push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push).
- Öffne die ``index.html`` im Browser, um zu überprüfen, dass die ``Notes`` dargestellt werden.
- Tipp:
    
```javascript
// Eine neue Notiz erstellen
var note1 = new Note('blah');
var note2 = new Note('FC Bayern!');
```

## 3.3 main-3.js 

- Verwende den Code aus 3.2 wieder, aber
- lösche diesmal mit Hilfe ``NotePad.prototype.remove`` - Methode ein beliebiges ``Note``.
- Öffne die ``index.html`` im Browser, um zu überprüfen, dass nicht mehr alle ``Notes`` angezeigt werden.

### 3.4 main-4.js 

- Erzeuge eine Instanz von ``Input`` und weise diese einer Variable zu.
- Das ``Input``-Objekt ist ein sogenannter "EventEmitter". D.h. man kann an das ``Input``-Objekt bei bestimmten Ereignissen eine Funktion bzw. einen Callback übergeben.
    - Momentan unterstützt ``Input`` das Ereignis ``new``. Bei diesem Ereignis wird die Methode ``Input.prototype.onNew`` mit der/dem Notiz/Text als Argument(string) aufgerufen.
        - **entweder**  überschreibe ([monkey_patching](http://en.wikipedia.org/wiki/Monkey_patch)) die ``onNew`` und füge dabei zum ``NotePad`` eine neues ``Note`` hinzu.
        - **oder** hänge dich mit einem Callback mit Hilfe der [.on](https://github.com/asyncly/EventEmitter2#emitteronevent-listener)-Methode an ``Input`` und füge dabei ein neues ``Note`` hinzu.
- Öffne die ``index.html`` im Browser und füge über die Eingabemaske ein neues ``Note`` hinzu.
       
### 3.5 main-pro.js

- Nicht nur ``Input``, sondern auch ``Note`` ist ein "EventEmitter". 
- Dir ist bestimmt schon aufgefallen, dass neben jedem ``Note`` ein Löschen-Button angezeigt wird. Bei einem Klick auf diesen Button wird das Ereignis ``delete`` gesendet bzw. die ``onDelte``-Methode aufgerufen.
- Lösche mit Hilfe der ``NotePad.prototype.remove`` - Methode beim Event ``delete`` das als Argument übergebene ``Note``
- Tipp: Das ``Note``, das gelöscht werden soll, wird dem Callback als Argument übergeben.



