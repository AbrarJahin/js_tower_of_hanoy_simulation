
$(window).load(function(){
var stage = new createjs.Stage('stage');
TweenLite.ticker.addEventListener("tick", stage.update, stage);
var hanoi = new createjs.Container();
stage.addChild(hanoi);
hanoi.x = 50;
hanoi.y = 200;
var base = new createjs.Shape();
base.graphics.beginFill("#000000").drawRect(0, 0, 300, 10);
hanoi.addChild(base);
var pegs = [];
for (var i = 0; i < 3; ++i) {
    pegs[i] = makePeg();
    hanoi.addChild(pegs[i]);
    pegs[i].x = 43 + i * 100;
    pegs[i].y = -120;
}

var discs = [];
var colors = ["#0B61A4", "#00CC00", "#C9F601", "#FFD201", "#FF7201", "E20149"];
for (i = 0; i < 6; ++i) {
    discs[i] = new createjs.Shape();
    discs[i].graphics.beginFill(colors[i]).drawRect(0, 0, 100 - i * 14, 10);
    discs[i].x = 48;
    discs[i].y = i * -10;
    discs[i].regX = 50 - i * 7;
    discs[i].regY = 10;
    hanoi.addChild(discs[i]);
}

function makePeg() {
    var peg = new createjs.Shape();
    peg.graphics.beginFill("#000000").drawRect(0, 0, 10, 120);
    return peg;
}

var pegStack = [
    [0, 1, 2],
    [],
    []
];
var delay = -2.0;

function hanoiSolve(n, a, b, c) {
    if (n > 0) {
        hanoiSolve(n - 1, a, c, b);
        var disc = pegStack[a].pop();
        var cx = 48 + a * 100;
        var xx = 48 + c * 100;
        var yy = pegStack[c].length * -10;
        var mx = (cx + xx) / 2;
        var tl = new TimelineLite({
            delay: delay += 2.0
        });
        tl.append(TweenLite.to(discs[disc], 0.5, {
            y: -130,
            onStart: function () {
                $("#step").html(++step);
            }
        }));
        tl.append(TweenLite.to(discs[disc], 1, {

            bezier: [{
                x: mx,
                y: -160
            }, {
                x: xx,
                y: -130
            }]
        }));
        tl.append(TweenLite.to(discs[disc], 0.5, {
            y: yy,
        }));
        pegStack[c].push(disc);
        hanoiSolve(n - 1, b, a, c);
    }
}

var debug = new createjs.Container();
hanoi.addChild(debug);

function drawPos(x, y, cx, xx) {
    debug.removeAllChildren();
    var p = new createjs.Shape();
    p.x = x;
    p.y = y;
    p.graphics.beginFill("#000000").drawCircle(0, 0, 2);
    debug.addChild(p);
}

var step = 0;

function restart() {
    delay = -2.0;
    var num = parseInt($("#numsel").val());
    pegStack = [
        [],
        [],
        []
    ];
    for (var i = 0; i < 6; ++i) {
        TweenLite.killTweensOf(discs[i]);
        discs[i].visible = i < num;
        if (i < num) {
            pegStack[0].push(i);
        }
        discs[i].x = 48;
        discs[i].y = i * -10;
    }
    step = 0;
    $("#step").html(step);
     $("#start").val("start");
        $("#start").html("Start");
}

$("#numsel").change(function () {
    restart();
});

$("#start").click(function () {
    if ($("#start").val() == "start") {
        var num = parseInt($("#numsel").val());
        hanoiSolve(num, 0, 1, 2);
        $("#start").val("reset");
        $("#start").html("Reset");
    } else {
        $("#start").val("start");
        $("#start").html("Start");
        restart();
    }
});

restart();
});