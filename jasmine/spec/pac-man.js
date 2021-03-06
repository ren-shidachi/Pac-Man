describe("Drawable", function () {
    it("Drawable basic behaviour", function () {
        var d = new Drawable(0, 0, 4, 4);
        expect(d.x).toBe(0);
        expect(d.y).toBe(0);
        expect(d.width).toBe(4);
        expect(d.height).toBe(4);
    });
});

describe("PacMan test", function() {
    var pacMan = false;

    beforeAll(function () {
        pacMan = new PacMan();
    });

    afterAll(function () {
        delete pacMan;
    });

    it("PacMan initialization", function() {
        expect(pacMan.x).toBeUndefined();
        expect(pacMan.y).toBeUndefined();
        expect(pacMan.width).toBeUndefined();
        expect(pacMan.height).toBeUndefined();
        expect(pacMan.xSpeed).toBeUndefined();
        expect(pacMan.ySpeed).toBeUndefined();

        expect(pacMan.init(0,0)).toBe(pacMan);
        expect(pacMan.x).toBe(0);
        expect(pacMan.y).toBe(0);
        expect(pacMan.width).toBe(13);
        expect(pacMan.height).toBe(13);
        expect(pacMan.xSpeed).toBe(0);
        expect(pacMan.ySpeed).toBe(0);
    });

    it("Changing PacMan's direction", function() {
        pacMan.init(2,2);

        expect(pacMan.changeDirection('left')).toBe(pacMan);
        expect(pacMan.xSpeed).toBe(-1);
        expect(pacMan.ySpeed).toBe(0);
        expect(pacMan.changeDirection('right')).toBe(pacMan);
        expect(pacMan.xSpeed).toBe(1);
        expect(pacMan.ySpeed).toBe(0);
        expect(pacMan.changeDirection('up')).toBe(pacMan);
        expect(pacMan.xSpeed).toBe(0);
        expect(pacMan.ySpeed).toBe(-1);
        expect(pacMan.changeDirection('down')).toBe(pacMan);
        expect(pacMan.xSpeed).toBe(0);
        expect(pacMan.ySpeed).toBe(1);
        expect(pacMan.changeDirection('nodefined')).toBe(false);
        //expect(pacMan.move()).toBe(pacMan);
        //expect(pacMan.x).toBe(1);
        //expect(pacMan.y).toBe(0);
    });

    it("Moving PacMan", function () {
        pacMan.init(0,0);
        pacMan.changeDirection('right');
        expect(pacMan.move()).toBe(pacMan);
        expect(pacMan.x).toBe(1);
        expect(pacMan.y).toBe(0);
        expect(pacMan.move().x).toBe(2);
        pacMan.changeDirection('left');
        expect(pacMan.move().x).toBe(1);
        expect(pacMan.y).toBe(0);
        expect(pacMan.move().x).toBe(0);
        pacMan.changeDirection('down');
        expect(pacMan.move().y).toBe(1);
        expect(pacMan.x).toBe(0);
        expect(pacMan.move().y).toBe(2);
        pacMan.changeDirection('up');
        expect(pacMan.move().y).toBe(1);
        expect(pacMan.x).toBe(0);
        expect(pacMan.move().y).toBe(0);
    });
});

describe("Ghost", function() {
    var ghost = false;

    beforeAll(function () {
        ghost = new Ghost();
    });

    afterAll(function () {
        delete ghost;
    });

    it("Initializes", function () {
        expect(ghost.x).toBeUndefined();
        expect(ghost.y).toBeUndefined();

        expect(ghost.init(0,0)).toBe(ghost);
        expect(ghost.x).toBe(0);
        expect(ghost.y).toBe(0);
    });
});

describe ("Quadtree", function () {
    var quadTree = false;
    beforeAll(function (){
        // x, y, width, height, level
        quadTree = new QuadTree(0, 0, 64, 64, 0);
    });

    it("constructor", function () {
        expect(quadTree.x).toBe(0);
        expect(quadTree.y).toBe(0);
        expect(quadTree.width).toBe(64);
        expect(quadTree.height).toBe(64);
        expect(quadTree.level).toBe(0);
        expect(quadTree.maxObjects).toBe(10);
        expect(quadTree.objects).toEqual([]);
        expect(quadTree.nodes).toEqual([]);
    });

    it("construciton error", function () {
        var zeroWidth = function () {
            return new QuadTree(0, 0, 0, 0, 0);
        };
        var floatX = function () {
            return new QuadTree(0.1, 0.1, 1.5, 1.5, 0);
        }
        expect(zeroWidth).toThrowError(RangeError);
        expect(floatX).toThrowError(TypeError);
    });

    it("split nodes", function() { 
        expect(quadTree.split()).toBe(true);
        expect(quadTree.nodes.length).toBe(4);
        expect(quadTree.nodes[0]).toEqual(new QuadTree(0,0,32,32,1));
        expect(quadTree.nodes[1]).toEqual(new QuadTree(32,0,32,32,1));
        expect(quadTree.nodes[2]).toEqual(new QuadTree(32,32,32,32,1));
        expect(quadTree.nodes[3]).toEqual(new QuadTree(0,32,32,32,1));
    });

    it("split nodes (with uneven number width and height)", function () {
        var x = new QuadTree(0, 0, 17, 23, 0);
        expect(x.split()).toBe(true);
        expect(x.nodes.length).toBe(4);
        expect(x.nodes[0]).toEqual(new QuadTree(0,0,8,11,1));
        expect(x.nodes[1]).toEqual(new QuadTree(8,0,9,11,1));
        expect(x.nodes[2]).toEqual(new QuadTree(8,11,9,12,1));
        expect(x.nodes[3]).toEqual(new QuadTree(0,11,8,12,1));
    });

    it("Clear objects", function () {
        // Test insert first
        expect(quadTree.clear()).toBe(true);
        expect(quadTree.objects).toEqual([]);
        expect(quadTree.nodes).toEqual([]);
    });

    it("getIndex function", function () {
        var x = new QuadTree(0, 0, 64, 64, 0);
        expect(x.getIndex(new Drawable(0, 0, 4, 4))).toBe(0);
        expect(x.getIndex(new Drawable(32, 0, 4, 4))).toBe(1);
        expect(x.getIndex(new Drawable(32, 32, 4, 4))).toBe(2);
        expect(x.getIndex(new Drawable(0, 32, 4, 4))).toBe(3);
        expect(x.getIndex(new Drawable(0, 30, 4, 4))).toBe(-1);
    });

    it("Inserting objects", function () {
        var x = new Drawable(0,0,4,4);
        var y = new Drawable(32,32,4,4);
        var xy = [x, y, x, y, x, y, x, y];
        var z = new Drawable(31, 31, 4, 4);
        expect(quadTree.insert(x)).toBe(true);
        expect(quadTree.objects).toEqual([x]);
        quadTree.insert(y);
        expect(quadTree.objects).toEqual([x,y]);
        expect(quadTree.insert(xy)).toBe(true);
        expect(quadTree.objects).toEqual([x,y,x,y,x,y,x,y,x,y]);
        expect(quadTree.objects.length).toBe(10);
        // x should all go to north west node, 
        // y should all go to south east node,
        // z should stay in this node.
        quadTree.insert(z);
        expect(quadTree.objects.length).toBe(1);
        expect(quadTree.objects).toEqual([z]);
        expect(quadTree.nodes[0].objects).toEqual([x,x,x,x,x]);
        expect(quadTree.nodes[2].objects).toEqual([y,y,y,y,y]);
    });

    it("findObjects", function () {
        quadTree.clear();
        var x = new Drawable(0,0,4,4);
        var y = new Drawable(32,32,4,4);
        var z = new Drawable(31, 31, 4, 4);
        quadTree.insert([x,x,x,x,x,y,y,y,y,y,z]);
        expect(quadTree.findObjects(x)).toEqual([x,x,x,x,x,z]);
        expect(quadTree.findObjects(z)).toEqual([x,x,x,x,x,y,y,y,y,y,z]);
    });
});
