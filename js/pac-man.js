/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function(){
    // Define images
    this.parts = new Image();

    // Set images src
    this.parts.src = "img/common.png";
}

/**
 * Create the Drawable object which will be the base clas for
 * all drawable objects in the game. Sets up default variables
 * that all child object will inherit, as well as the default
 * functions.
 */
function Drawable(){
    this.init = function(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isColliding = false;
    };
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = "";
    this.type = "";

    // Define abstract functioin to be implemented in child objects
    this.draw = function() {
    };
    this.move = function() {
    };
    this.isCollidableWith = function() {
        return (this.collidableWith === object.type);
    };
}

// The keycode sthat wil lbe mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
}

// Creates te array to hod the KEY_CODES  and sets all their values
// to false. Checking true/false is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES){
    KEY_STATUS[KEY_CODES[code]] = false;

}
/**
 * Sets up the document to listen to onekeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed
 * it sets the appropriate direction to ture to let us know shich
 * key it was.
 */
document.onkeydown = function(e) {
    // Firefox and oper ause charCode instead of keyCode to
    // return which key was pressed.
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
}
/**
 * Sets up the document to listen to ownkeyup events (fried when
 * any key on the keyboared is released). When a key is released.
 * it sets the appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
}

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and crates a black image.
 */
function Background() {
    this.draw = function(map, z) {
        this.context.fillStyle = 'black';
        this.context.fillRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
        for (n=0; n<map.length; n++){
            for (i=0; i<map[n].length; i++){
                if(map[n][i] > 1){
                    x = map[n][i];
                    this.context.drawImage(imageRepository.parts, 8*(x-1), 0, 8, 8, 8*i*z, 8*n*z, 8*z, 8*z);
                }
            }
        }
    };
}
Background.prototype = new Drawable();

function PacMan() {
    this.init = function(x, y){
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.isColliding = false;
    };
    this.draw = function (z){
        this.context.drawImage(imageRepository.parts, 0, 8, 13, 13, (8*(this.x)-6)*z, (8*this.y-3)*z, 13*z,13*z);
    };
}
PacMan.prototype = new Drawable();

/**
 * This is the game object that takes care of all the objects 
 * runned in side the game
 */
function Game(){
    this.init = function () {
        this.bgCanvas = $("#background")[0];
        this.mainCanvas = $("#main")[0];
        if (this.bgCanvas.getContext) { 
            this.bgContext = this.bgCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');
            // Initialize objects, adding context and canvas information
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            PacMan.prototype.context = this.mainContext;
            PacMan.prototype.canvasWidth = this.mainCanvas.width;
            PacMan.prototype.canvasHeight = this.mainCanvas.height;
            // Initialize background
            this.background = new Background();
            this.background.init(0,0);
            // Initialize pacman
            this.pacman = new PacMan();
            this.pacman.init(3,6);

            return true;
        }
    };
    this.start = function (zoomFactor) {
        var map = [
            [6,9,9,9,9,3],
            [10,0,0,0,0,8],
            [10,0,6,3,0,8],
            [10,0,2,2,0,8],
            [10,0,2,2,0,8],
            [10,0,5,4,0,8],
            [10,0,0,0,0,8],
            [5,7,7,7,7,4],
        ];
        this.background.draw(map, zoomFactor);
        this.pacman.draw(zoomFactor);
    }
}


/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwize defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000/ 60);
        };
})();


// main
$(function () {
    // Resize game area
    var zoomFactor = 4;
    var width = $("#main-area").width() * zoomFactor;
    var height = $("#main-area").height() * zoomFactor;
    $("#main-area").width(width).height(height);
    $("#main-area canvas").each(function () {
        this.width = width;
        this.height = height;
    });
    $("#game-start").click(function () {
        var game = new Game();
        if (game.init()) {
            game.start(zoomFactor);
        }
    });
});
