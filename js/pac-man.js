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
 * Create the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child object will inherit, as well as the default
 * functions.
 */
class Drawable {
    constructor (){
        this.speed = 0;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.collidableWith = "";
        this.type = "";
    }
    init (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isColliding = false;
    }

    // Define abstract functioin to be implemented in child objects
    draw () {
    }
    move () {
    }
    isCollidableWith () {
        return (this.collidableWith === object.type);
    }
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
$(document).keydown(function(e) {
    var keyCode = e.which;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
});
/**
 * Sets up the document to listen to ownkeyup events (fried when
 * any key on the keyboared is released). When a key is released.
 * it sets the appropriate direction to false to let us know which
 * key it was.
 */
$(document).keyup(function(e) {
    var keyCode = e.which;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
})

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
        this.width = 13;
        this.height = 13;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.isColliding = false;
        return this;
    };

    this.draw = function (z){
        this.context.drawImage(imageRepository.parts, 0, 8, 13, 13, (8*(this.x)-6)*z, (8*this.y-3)*z, 13*z,13*z);
    };

    this.move = function (z) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        //this.context.clearRect((8*(this.x)-6)*z, (8*this.y-3)*z, 13*z,13*z);
        return this;
    }

    this.changeDirection = function (d){
        if (d == 'left') {
            this.xSpeed = -1;
            this.ySpeed = 0;
        }else if (d == 'right') {
            this.xSpeed = 1;
            this.ySpeed = 0;
        }else if (d == 'up') {
            this.xSpeed = 0;
            this.ySpeed = -1;
        }else if (d == 'down') {
            this.xSpeed = 0;
            this.ySpeed = 1;
        } else {
            return false;
        }
        return this;
    }

}
PacMan.prototype = new Drawable();

class Ghost extends Drawable {
    init (x, y) {
        this.x = x;
        this.y = y;

        return this;
    }
}

/**
 * The quadtree to store pac-man ghosts and other collidable objects
 * The quadrant indecis are numbers below
 * 1 | 0
 * -----
 * 3 | 2
 */
class QuadTree {
    constructor (x, y, width, height, level) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.level = level;
        this.maxObjects = 10;
    }
}

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
            [18,7,7,7,7,15],
            [8,0,0,0,0,10],
            [8,0,6,3,0,10],
            [8,0,2,2,0,10],
            [8,0,2,2,0,10],
            [8,0,5,4,0,10],
            [8,0,0,0,0,10],
            [17,9,9,9,9,16],
        ];
        this.background.draw(map, zoomFactor);
        this.pacman.draw(zoomFactor);
        requestAnimationFrame(frame);
    }
}

/**
 * The process for each "frame" of the game.
 */
var startTime = -1;
function frame (timeStamp) {
    var progress = 0;

    if (startTime < 0) {
        startTime = timeStamp;
    } else {
        progress = timeStamp - startTime;
    }

    game.pacman.move(zoomFactor);

    requestAnimationFrame(frame);
}


/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwize defaults to setTimeout().
 */
var requestAnimationFrame = (function(){
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
var game = new Game();
var zoomFactor = 4;
$(function () {
    // Resize game area
    var width = $("#main-area").width() * zoomFactor;
    var height = $("#main-area").height() * zoomFactor;
    $("#main-area").width(width).height(height);
    $("#main-area canvas").each(function () {
        this.width = width;
        this.height = height;
    });
    $("#game-start").click(function () {
        if (game.init()) {
            game.start(zoomFactor);
        }
    });
});
