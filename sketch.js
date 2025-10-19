
let table;
let glyphData = []; // array per salvare i dati dei glifi
// Numero fisso di raggi per ogni glifo
const RAYS = 8;

function preload() {
  table = loadTable("asset/dataset.csv", "csv", "header");
}

function setup() {
  let padding = 60; // spazio laterale usato nella mappatura delle posizioni
  createCanvas(windowWidth, windowHeight); // canvas a tutta larghezza/altezza della finestra
  background(10, 10, 90); // sfondo scuro blu

  // Precalcolo i dati di tutti i glifi una sola volta.
  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    // table.getRow(rowNumber).obj ritorna un oggetto con chiavi corrispondenti alle intestazioni del CSV
    let data = table.getRow(rowNumber).obj;

    //COLONNA 0:lunghezza delle linee
    // Prendo il valore raw dalla cella e poi usiamo min()/max() su tutta la colonna per normalizzare e mappare su un intervallo utile.
    let sizeValue = data["column0"];
    let allSizeValues = table.getColumn("column0");
    let minSize = min(allSizeValues);
    let maxSize = max(allSizeValues);
    // map() mappa i valori originali nell'intervallo visivo desiderato (8..45 px)
    let lineLength = map(sizeValue, minSize, maxSize, 8, 45);

    //COLONNA 1: colore 
    let colorValue = data["column1"];
    let allColorValues = table.getColumn("column1");
    let minColor = min(allColorValues);
    let maxColor = max(allColorValues);
    
    // normalizzo a 0..1 per usare lerpColor()
    let colorNorm = map(colorValue, minColor, maxColor, 0, 1);
    let c1 = color(255, 0, 0); // rosso saturo
    let c2 = color(255, 255, 255); // bianco
    
    // mappedColor è il colore effettivo usato per lo stroke del glifo
    let mappedColor = lerpColor(c1, c2, colorNorm);

    //COLONNA 2: velocità di rotazione
    // Usiamo la colonna 2 per definire la velocità di rotazione del glifo, prima normalizzo la colonna; poi mappo su un intervallo angolare
    let rotValue = data["column2"];
    let allRotValues = table.getColumn("column2");
    let minRot = min(allRotValues);
    let maxRot = max(allRotValues);
    let rotationSpeed = map(rotValue, minRot, maxRot, -360, 360); // gradi riferiti a un periodo di riferimento

    //COLONNA 3: spessore delle linee
    let strokeValue = data["column3"];
    let allStrokeValues = table.getColumn("column3");
    let minStroke = min(allStrokeValues);
    let maxStroke = max(allStrokeValues);
    let weight = map(strokeValue, minStroke, maxStroke, 1, 5);

    //COLONNA 4: posizione X
    // mappo il valore su un intervallo orizzontale utile (da 60 px a windowWidth-60 px)così i glifi non vengono disegnati sui bordi estremi.
    let posXValue = data["column4"];
    let allPosXValues = table.getColumn("column4");
    let minPosX = min(allPosXValues);
    let maxPosX = max(allPosXValues);
    let xPosition = map(posXValue, minPosX, maxPosX, 60, windowWidth - 60);

    // Posizione Y: distribuiamo i glifi verticalmente in una colonna scalando in base all'indice di riga. L'offset 60 lascia margine.
    let yPosition = 60 + (rowNumber / table.getRowCount()) * (windowHeight - 120);

    // Salvo i dati preprocessati per questo glifo nell'array globale.
    // In draw() useremo questi valori per disegnare/animare senza ricalcolare.
    glyphData.push({
      x: xPosition,
      y: yPosition,
      lineLength: lineLength,
      weight: weight,
      color: mappedColor,
      rotationSpeed: rotationSpeed // gradi per periodo di riferimento
    });
  }
  
}

function draw() {
  background(10, 10, 90);

  // ciclo sui dati preprocessati che disegna ogni glifo con la trasformazione giusta
  for (let glyph of glyphData) {
    push(); // salva lo stato di trasformazione e stile

    // traslo il sistema di coordinate in modo che il glifo venga disegnato intorno a (0,0) ma posizionato visivamente in (glyph.x, glyph.y).
    translate(glyph.x, glyph.y);

    // Calcolo dell'angolo di rotazione: usiamo frameCount come tempo.

    // Qui trasformo i gradi in radianti e moltiplico per frameCount
    //radians() converte gradi in radianti.
    let angle = radians((glyph.rotationSpeed / 80) * frameCount);
    rotate(angle); // rotationSpeed è espresso in gradi

    // disegno il glifo al centro locale (0,0)
    drawGlyph(0, 0, glyph.lineLength, glyph.weight, glyph.color);

    pop(); // ripristina stato di trasformazione e stile precedente
  }
}

function drawGlyph(centerX, centerY, lineLength, weight, glyphColor) {
  // Impostazioni di stile per il disegno del glifo
  stroke(glyphColor); // colore della linea
  strokeWeight(weight); // spessore della linea
  strokeCap(ROUND); // estremità arrotondate delle linee

  //disegno raggi del glifo
  for (let i = 0; i < RAYS; i++) {
    // calcolo dell'angolo in radianti
    let angle = (i / RAYS) * TWO_PI;
    // coordinate del punto terminale del raggio
    let x2 = centerX + cos(angle) * lineLength;
    let y2 = centerY + sin(angle) * lineLength;
    // disegno la linea dal centro al punto calcolato
    line(centerX, centerY, x2, y2);
  }
}