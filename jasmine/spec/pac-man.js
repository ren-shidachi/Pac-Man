describe("Background", function() {
    var background = 0;

    beforeAll(function () {
        $("body").append('<canvas id="background" width="48" height="48"></canvas>');
        background = new Background();
    });

    afterAll(function () {
        delete background;
    });

    it("Game initialization", function() {
    });
});
