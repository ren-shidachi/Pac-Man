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
