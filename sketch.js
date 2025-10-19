let table;
function preload() {
  table = loadTable("asset/dataset.csv", "csv", "header");
}
function setup() {
  console.log(table);
  let padding = 60;
  createCanvas(windowWidth, windowHeight);
  background(10, 10, 90);
  
  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) { //per ogni riga del dataset esegue il corpo del ciclo
    let data = table.getRow(rowNumber).obj; //prende i dati della riga corrente come oggetto e li salva nella varabile data
    
    // COLONNA 0: dimensione
    let sizeValue = data["column0"]; //prendo il valore nella colonna 0 della riga corrente
    let allSizeValues = table.getColumn("column0"); //prendo tutti i valori della colonna 0
    let minSize = min(allSizeValues); //definisco minimo e massimo dei valori della colonna 0
    let maxSize = max(allSizeValues);
    let lineLength = map(sizeValue, minSize, maxSize, 8, 45); //mappo il valore della colonna 0 della riga corrente in un intervallo di lunghezze delle linee
    
    // COLONNA 1: colore
    let colorValue = data["column1"];
    let allColorValues = table.getColumn("column1");
    let minColor = min(allColorValues);
    let maxColor = max(allColorValues);
    let colorNorm = map(colorValue, minColor, maxColor, 0, 1); //normalizzo il valore della colonna 1 tra 0 e 1
    let c1 = color(255, 0, 0); // rosso saturo
    let c2 = color(255, 255, 255); // bianco
    let mappedColor = lerpColor(c1, c2, colorNorm); //interpolazione tra i due colori in base al valore normalizzato prima tra 0 e 1
    
    // COLONNA 2: numero linee
    let numValue = data["column2"];
    let allNumValues = table.getColumn("column2");
    let minNum = min(allNumValues);
    let maxNum = max(allNumValues);
    let numLines = round(map(numValue, minNum, maxNum, 5, 20)); //mappo il valore della colonna 2 in un intervallo di numero di linee e arrotondo al numero intero più vicino
    
    // COLONNA 3: spessore linee
    let strokeValue = data["column3"];
    let allStrokeValues = table.getColumn("column3");
    let minStroke = min(allStrokeValues);
    let maxStroke = max(allStrokeValues);
    let weight = map(strokeValue, minStroke, maxStroke, 1, 5); //mappo il valore della colonna 3 in un intervallo di spessori delle linee
    
    // COLONNA 4: posizione X
    let posXValue = data["column4"];
    let allPosXValues = table.getColumn("column4");
    let minPosX = min(allPosXValues);
    let maxPosX = max(allPosXValues);
    let xPosition = map(posXValue, minPosX, maxPosX, padding, windowWidth - padding); //mappo il valore della colonna 4 in un intervallo di posizioni X
    
    // Posizione Y: una riga dopo l'altra
    let yPosition = padding + (rowNumber / table.getRowCount()) * (windowHeight - padding * 2); 
    
    // disegno il glifo
    drawGlyph(xPosition, yPosition, numLines, lineLength, weight, mappedColor);
  }
}

function drawGlyph(centerX, centerY, numLines, lineLength, weight, glyphColor) {
  stroke(glyphColor);
  strokeWeight(weight);
  strokeCap(ROUND);
  
  // disegno le linee del glifo
  for (let i = 0; i < numLines; i++) {
    let angle = (i / numLines) * TWO_PI;
    let x2 = centerX + cos(angle) * lineLength;
    let y2 = centerY + sin(angle) * lineLength;
    line(centerX, centerY, x2, y2);
  }
}

function draw() {
  //non disegno qui perchè non ci sono animazioni e non c'è bisogno che il codice sia eseguito più volte
}