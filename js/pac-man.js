/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function(){
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
    this.draw = function(map) {
        this.context.fillStyle = 'black';
        this.context.fillRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
        for (n=0; n<map.length; n++){
            for (i=0; i<map[n].length; i++){
                console.log(i);
            }
        }
    };
}
Background.prototype = new Drawable();

/**
 * This is the game object that takes care of all the objects 
 * runned in side the game
 */
function Game(){
    this.init = function () {
        this.bgCanvas = $('#background')[0];
        if (this.bgCanvas.getContext) { 
            this.bgContext = this.bgCanvas.getContext('2d');
            // Initialize objects, adding context and canvas information
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            // Initialize background
            this.background = new Background();
            this.background.init(0,0);
            var map = [
                [1,0,0],
                [0,0,0],
                [0,1,1]
            ];
            this.background.draw(map);
        }
    };
}

$(function () {
    $("#game-start").click(function () {
        var game = new Game();
        console.log('Started');
        game.init();
    });
});
