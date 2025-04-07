
let canvas = document.getElementById('canvas');     //element mit id=canvas aus dem HTML Code wird auch hier zur variable "canvas"
let ctx = canvas.getContext('2d');        //2D context vom canvas, wodurch man möglichkeiten bekommt auf diesen zu malen/schreiben
let rows = 20;            //reihen(auf dem canvas) = 10 (ist erstmal nur eine variable mit einem hinterlegten wert!)
let cols = 20;            //spalten = 10
let snake = [
  {x:19, y:3}        //Array welches die teile der snake beinhaltet
];
let food;
let cellWidth = canvas.width / cols;        //cellWidth = die breite des canvas geteilt durch den wert in "cols", wodurch der canvas indirekt in die          gewünschte anzahl von spalten eingeteilt wird

let cellHeight = canvas.height / rows;
let direction = 'LEFT';                     //variable direction, standart mäsig auf left, kann per funktion(keyDown) geändert werden
let foodCollected = false;               //variable für das essen von food, wird beim einsammeln auf true gesetzt
let snakeCounter = 0;                 //Variable um zu zählen wie lang die schlange ist


placeFood();          //food wird direkt bei program start plaziert

let intervalId = setInterval(gameLoop, 300);               //funktion gameLoop wird alle 300 millisekunden durchgeführt

document.addEventListener('keydown', keyDown);      //wenn eine taste gedrückt wird, wird die funktion "keyDown" aufgerufen

draw();       //die unten definierte funktion wird ausgeführt, sobald das script startet

function draw(){
  ctx.fillStyle = 'black';      //bestimmt die farbe des contents der gezeichnet wird
  ctx.fillRect(0, 0, canvas.width, canvas.height);        //schwarzes viereck, dass genau den canvas ausfüllt

  ctx.fillStyle = 'white';      //ab jetzt wird weiß gezeichnet

  snake.forEach(part => add(part.x, part.y));     //funktion "add" wird für jeden teil der snake durchgeführt

  ctx.font = "20px Arial";        //größe und stil des textes
  ctx.fillText(snakeCounter + "/20", canvas.width / 2, canvas.height / 2);    //ich lasse die länge der schlange in der mitte vom canvas anzeigen
 

  ctx.fillStyle = 'yellow';     //ab hier wir gelb gezeichnet
  add(food.x, food.y);          //funktion "add" wird mit den koordinaten von "food" durchgeführt

  requestAnimationFrame(draw);        //die funktion wird sofort wieder geplant und im nächsten frame ausgeführt
}

function testGameFinished(){
  if(snake[20]){              //sobald das Teil snake[20] existiert ist dieses if erfüllt

    console.log("gewonnen");

    clearInterval(intervalId);          //der interval "intervalId" bzw die gameloop wird gestoppt

    const video = document.createElement('video');      //neues video element wird erstellt

    video.src = 'vid/trallalero.mp4';         //quelle des videos
    video.autoplay= true;                     //wird automatisch abgespielt
    video.controls = false;                   //nutzer kann das video nicht stoppen, leiser machen etc.   
    video.volume = 1.0;                       //volle laustärke
    video.muted = false;                      //Ton an
    video.width = 480;
    video.height = 480;
    canvas.remove();                          //hier entferne ich den canvas um an seiner stelle das video abzuspielen

    document.body.appendChild(video);         //video zum body hinzufügen
  }
}

function testGameOver(){

  let firstPart = snake[0];           //firstPart = 0te teil von snake
  let otherParts = snake.slice(1);      //otherParts = ein Array aber ohne das erste teil
  let dublicatePart = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y);    //prüft on snake[0] ein anderes teil berührt

  if(snake[0].x < 0 ||              //wenn snake gegen eine der 4 wände läuft ist dieses if erfüllt
    snake[0].x > cols - 1 ||
    snake[0].y < 0 ||
    snake[0].y > rows - 1 ||
    dublicatePart                   //wenn dublicatePart vorhanden ist, ist das if auch erfüllt
    ){

      placeFood();                 //food wird neu plaziert
      snake = [
        {x:19, y:3}];               //snake wird zurückgesetzt auf den anfangswert

        direction = 'LEFT';         //richtung wird wieder auf LEFT gesetzt
    }
}

function placeFood(){
  let randomX = Math.floor(Math.random() * cols);       //math.random = random zahl zwischen 0 und 1, durch * cols wird es eine Zahl zwischen 0 und 20
  let randomY = Math.floor(Math.random() * rows);       //durch math.floor wird die zahl gerundet ohne nachkomma stellen

  food = {
    x: randomX,               //x und y von food bekommen jetzt den random wert zugeordnet
    y: randomY
  };
}

function add(x, y){                 //funktion um nur noch die variablen x und y für neue quadrate eingeben zu müssen
  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth -1, cellHeight -1);           
}

function shiftSnake(){
  for (let i = snake.length - 1; i > 0; i--) {    //schleife  beginnt beim letzten teil von snake und geht nach unten durch die teile durch solange i > 0
    const part = snake[i];              //part = der aktuelle part der Schleife
    const lastPart = snake[i - 1];      //lastPart = der part 1 niedriger als der aktuelle (zb: part = 3 / lastPart = 2)
    part.x = lastPart.x;                //part übernimmt den x wert von last part
    part.y = lastPart.y;                //part übernimmt den y wert von last part
    
  }
}

function gameLoop(){

  

  if(foodCollected){        //wenn foodCollected = true
    snake = [{
      x: snake[0].x,        //snake bekommt einen neuen teil an den koordinaten von snake[0]
      y: snake[0].y
    }, ...snake];

    snakeCounter ++;         //der Wert von snakeCounter wird um 1 erhöht

    foodCollected = false;    //foodCollected wird wieder auf false gesetzt, damit nicht unendlich viele teile hinzugefügt werden
  }

  shiftSnake();

  if(direction == 'LEFT') {         //je nach dem welchen wert die variable direction akuell hat, bewegt sich der 0te teil der snake
  snake[0].x--;
  }
  if(direction == 'RIGHT') {
    snake[0].x++;
  }
  if(direction == 'UP') {
    snake[0].y--;
  }
  if(direction == 'DOWN') {
    snake[0].y++;
  }

  if(snake[0].x == food.x         //wenn x und y von snake und food identisch sind, wird der code ausgeführt
  && snake[0].y == food.y) {
    foodCollected = true;         // setzt den wert der variable auf true

    placeFood();                //futter wird neu plaziert, bzw x und y neu berechnet
    
  }
  testGameOver();
  testGameFinished();
}

function keyDown(e) {         //funktion, die checkt ob bestimmte tasten gedrückt sind und eine variable entsprechend ändert
  if (e.keyCode == 37) {      //linke pfeiltaste hat die nummer 37 auf der tastatur 
      direction = 'LEFT';
  }
  if (e.keyCode == 38) {      //pfeiltaste hoch = 38
    direction = 'UP';
}
if (e.keyCode == 39) {        //rechts = 39
  direction = 'RIGHT';
}
if (e.keyCode == 40) {         //runter = 40 + die variable direction bekommt den entsprechenden wert 
  direction = 'DOWN';
}
}