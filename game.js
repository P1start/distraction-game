var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    return setTimeout(callback, 1000 / 60);
};

var randomColour = function () {
    return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
};

function randomX() {
    return Math.round(Math.random() * cvs.width);
}

function randomY() {
    return Math.round(Math.random() * cvs.height);
}

String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
}

var creepy = 0;

var randomText = function(length) {
    var r = "";
    if (Math.random() < 0.95 && !creepy) {
        for (var i = 0; i < length; i++) {
            var R = "";
            while (R.match(/^[\u0021-\u007e\u00a1-\u00ac\u00ae-\u01c3]$/) === null) {
                R = String.fromCharCode(Math.round(Math.random() * 418) + 33);
            }
            r += R;
        }
    } else {
        creepy = creepy || 4;
        creepy--;
        var w = creepywords[Math.round(Math.random() * (creepywords.length - 1))];
        var left = " ".repeat(Math.floor((length - w.length) / 2));
        var right = " ".repeat(Math.ceil((length - w.length) / 2));
        r = left + w + right;
    }
    return r;
}

var getHighScores = function() {
    return JSON.parse(localStorage.getItem("highscores"));
}

var setHighScores = function(hs) {
    localStorage.setItem("highscores", JSON.stringify(hs));
}

var keys = {};

if (localStorage.getItem("highscores") == null) {
    setHighScores([0, 0, 0, 0, 0])
}

var getKey = function(key) {
    return keys[key] || false;
};

var shapes = [];

var words = [];

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;

var FLASH_LENGTH = 6;

var count = -1;
var dead = 0;

var space = true;

var timer = 0;

var lifeforce = Math.round(Math.random() * 338474395 + 834749128);

var creepywords = [
    "!!!KILL!!!",
    "!!!BLOOD!!",
    "!!CTHULHU!",
    "!!!SATAN!!",
    "!!!DEATH!!",
    "!!!HELL!!!"
];

var rwords = [
    "hello",
    "this",
    "game",
    "is",
    "awesome",
    "not",
    "smiley face",
    "look over there!",
    "wow",
    "‮backwards!",
    "<score>",
    "‮<score>",
    ":)",
    "I hope I'm not distracting you...",
    "green",
    "what's <random> + <random2>?",
    "helpimstuckinacomputergame",
    "kill your parents",
    "SPACEBAR",
    "press P to pause",
    "the next green flash doesn't count",
    "don't think about pink elephants",
    "don't think about blinking",
    "press H to see high scores",
    "press SPACEBAR to slow everything down",
    "press ~ to open the cheats console",
    "you can also press ENTER",
    "you can also use the left mouse button",
    "you have <lifeforce> seconds left to live",
    "press SPACEBAR to double your points!",
    "press F when I hit the bottom of the screen to get extra points",
    "click on me",
    "unicode snowman says hi ☃",
    "look over here!",
    "don't listen to the voices",
    "');DROP TABLE messages;--",
    "(͡° ͜ʖ ͡°)",
    "❄",
    "❅",
    "❆",
    "<garbled>"
];

var dogewords = [
    "wow",
    "amaze",
    "very game",
    "much distraction",
    "so words",
    "many phrases",
    "plz flashes",
    "very spacebar",
    "so points",
    "many colour",
    "much obscure",
    "so javascript",
    "much programming",
    "very excite",
    "wow",
    "so doge",
    "very keys",
    "such confusing",
    "plz high score",
];

var first = true;

var hkey = true;
var hscores = 0;
var KEY_H = 72;

var red = null;

var inverse = false;
var textflash = false;

var frame = 0;

var game = {
    state: 0,
    startSeq: function() {
        if (Math.round(introText.x * 100) < 0) introText.x += (-0.1*introText.x);
        else {
            if (Math.round(introText.x * 100) == 0) introText.x = 0.01;
            introText.x += (0.1*introText.x);
        }
        ctx.font = "12px Arial";
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "#000";
        ctx.fillText("Bad Game Productions presents", introText.x*100 + cvs.width/2 - 100, introText.y);
    },
    titleSeq: function() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "#000";
        if (Math.round(titleText.y * 100) < 0) {
            titleText.y += (-0.1*titleText.y);
        } else if (getKey(13)) {
            game.state = 2;
        } else {
            ctx.font = "10px Arial";
            ctx.fillText("press enter to start", cvs.width/2 - 60, titleText.y * 100 + cvs.height/2 + 20);
        }
        ctx.font = "12px Arial";
        ctx.fillText("[insert bad game here]", titleText.x, titleText.y * 100 + cvs.height/2);
    },
    main: function() {
        cvs.height = window.innerHeight;
        cvs.width = window.innerWidth;
        for (var i = 0; i < 1; i++) {
        if (introText.x < 100) {
            game.startSeq();
        } else {
            game.state = game.state || 1;
            if (game.state == 1) {
                game.titleSeq();
            } else {
                if (dead > 0) {
                    first = false;
                    ctx.fillStyle = "#000";
                    ctx.fillRect(0, 0, cvs.width, cvs.height);
                    dead--;
                    hscores = 0;
                    if (dead == 0) {
                        shapes = [];
                        words = [];
                        var hs = getHighScores();
                        if (timer > Math.min.apply(this, hs)) {
                            hs.push(timer);
                            hs.sort(function(a, b) {return -(a - b);});
                            hs.pop();
                            setHighScores(hs);
                        }

                        timer = 0;
                    }
                    continue;
                }

                inverse = false;
                if (timer >= 6000) {
                    inverse = true;
                }

                textflash = false;
                if (timer >= 9300) {
                    textflash = true;
                }

                ctx.clearRect(0, 0, cvs.width, cvs.height);
                if (inverse) {
                    ctx.fillStyle = "#000";
                    ctx.fillRect(0, 0, cvs.width, cvs.height);
                }

                if (Math.random() > 0.99 && !(timer < 350 && first) && !frame) {
                    frame = FLASH_LENGTH;
                }

                var textflashcol;

                if (frame) {
                    if (frame == FLASH_LENGTH) {
                        if (Math.random() < 0.5) {
                            red = false;
                            count = 60;
                        } else {
                            red = true;
                        }
                    }
                    var col = Math.round(255 * ((FLASH_LENGTH - frame) / FLASH_LENGTH));
                    var col2 = 255;
                    if (inverse) {
                        col = 0;
                        col2 = Math.round(255 * ((FLASH_LENGTH - frame) / FLASH_LENGTH));
                    }
                    ctx.fillStyle = red ? "rgb(" + col2 + "," + col + "," + col + ")" : "rgb(" + col + "," + col2 + "," + col + ")";
                    if (textflash) textflashcol = ctx.fillStyle;
                    else ctx.fillRect(0, 0, cvs.width, cvs.height);
                    frame--;
                    if (!frame) red = null;
                }

                // Draw score
                ctx.font = "20px Arial";
                ctx.fillStyle = "#333";
                if (inverse) {
                    ctx.fillStyle = "#ccc";
                }
                ctx.fillText(timer, 10, 25);

                if (count > 0) count -= 1;
                if (getKey(SPACE) && space) {
                    if (count > 0) {
                        count = -1;
                    } else {
                        ctx.fillStyle = "#000";
                        ctx.fillRect(0, 0, cvs.width, cvs.height);
                        dead = 60;
                    }
                    space = false;
                } else if (!getKey(SPACE)) {
                    space = true;
                }

                if (getKey(KEY_H) && hkey && !hscores) {
                    hscores = 81;
                    hkey = false;
                } else if (!getKey(KEY_H)) {
                    hkey = true;
                }

                if (count == 0) {
                    count = -1;
                    ctx.fillStyle = "#000";
                    ctx.fillRect(0, 0, cvs.width, cvs.height);
                    dead = 60;
                }

                // Random shapes
                /*
                if (Math.random() > 0.93) {
                    shapes.push({x: randomX(), y: randomY()});
                }

                for (var idx = 0; idx < shapes.length; idx++) {
                    shape = shapes[idx];
                    var width = Math.random() * 100;
                    var height = Math.random() * 100;
                    ctx.fillStyle = randomColour();
                    if (red) ctx.fillStyle = "#0f0";
                    if (red == false) ctx.fillStyle = "#f00";
                    ctx.fillRect(shape.x - width/2, shape.y - height/2, width, height);
                    ctx.strokeStyle = randomColour();
                    if (red) ctx.strokeStyle = "#0f0";
                    if (red == false) ctx.strokeStyle = "#f00";
                    ctx.strokeWidth = Math.round(Math.random() * 10);
                    ctx.strokeRect(shape.x - width/2 - 2.5, shape.y - height/2 - 2.5, width + 5, height + 5);
                    shape.x += Math.round(Math.random() * 10 - 5);
                    shape.y += Math.round(Math.random() * 10 - 5);
                }
                */

                // Random words
                var yy = inverse ? cvs.height + 30 : 0;
                if (hscores) {
                    var hs = getHighScores();
                    hscores--;
                    if (hscores == 80) words.push({x: randomX(), y: yy, size: 30, text: "1: " + hs[0]});
                    if (hscores == 60) words.push({x: randomX(), y: yy, size: 25, text: "2: " + hs[1]});
                    if (hscores == 40) words.push({x: randomX(), y: yy, size: 20, text: "3: " + hs[2]});
                    if (hscores == 20) words.push({x: randomX(), y: yy, size: 15, text: "4: " + hs[3]});
                    if (hscores == 00) words.push({x: randomX(), y: yy, size: 10, text: "5: " + hs[4]});
                }
                if (timer < 300 && first) {
                    if (timer == 0) words.push({x: cvs.width / 2, y: yy, size: 20, text: "press SPACEBAR after each green flash"});
                    else if (timer == 100) words.push({x: cvs.width / 2, y: yy, size: 25, text: "ignore all red flashes"});
                    else if (timer == 200) words.push({x: cvs.width / 2, y: yy, size: 15, text: "don't get distracted!"});
                } else if (timer > 8900 && timer < 9400) {
                    if (timer == 9000) words.push({x: cvs.width / 2, y: yy, size: 20, text: "your score…"});
                    else if (timer == 9100) words.push({x: cvs.width / 2, y: yy, size: 20, text: "…it's over 9000!"});
                    else if (timer == 9200) words.push({x: cvs.width / 2, y: yy, size: 25, text: "let's make things a little harder…"});
                    else if (timer == 9300) words.push({x: cvs.width / 2, y: yy, size: 15, text: "now the words flash!"});
                } else if (Math.random() > 0.93 || (timer > 4300 && timer < 4600 && Math.random() > 0.5)) {
                    var doge = false;
                    if (timer > 2250 && timer < 2750) {
                        var theword = "look behind you";
                    } else if (timer > 4300 && timer < 4600) {
                        var theword = "Wheeeeeeeee!";
                    } else if (timer > 7300 && timer < 7600) {
                        var theword = dogewords[Math.round(Math.random() * (dogewords.length - 1))];
                        doge = true;
                    } else {
                        var theword = rwords[Math.round(Math.random() * (rwords.length - 1))].replace(/<random>/g, Math.round(Math.random() * 100)).replace(/<random2>/g, Math.round(Math.random() * 100));
                    }
                    if (Math.random() < 0.995) {
                        words.push({x: randomX(), y: yy, size: Math.round(Math.random() * 20 + 10), text: theword, doge: doge});
                    } else {
                        var hipdir = Math.round(Math.random());
                        words.push({x: hipdir ? -40 : cvs.width, y: randomY(), size: Math.round(Math.random() * 20 + 10), text: "hipster", hipster: hipdir + 1});
                    }
                }

                for (var idx = 0; idx < words.length; idx++) {
                    word = words[idx];
                    if (!word) continue;
                    if (!inverse && word.y > cvs.height + 20 || word.x > cvs.width + 90 || word.x < -90) {
                        delete words[idx];
                        continue;
                    } else if (inverse && word.y < -20 || word.x > cvs.width + 90 || word.x < -90) {
                        delete words[idx];
                        continue;
                    }
                    ctx.save();
                    ctx.font = word.size + "px Arial";
                    if (word.text.indexOf("<garbled>") >= 0) {
                        ctx.font = word.size + "px monospace";
                    } else if (word.doge) {
                        ctx.font = word.size + "px Comic Sans MS";
                    }
                    if (word.text == "green") {
                        ctx.fillStyle = "#0f0";
                    } else if (inverse && !textflash) {
                        ctx.fillStyle = "#fff";
                    } else if (textflash) {
                        ctx.fillStyle = textflashcol;
                    } else {
                        ctx.fillStyle = "#000";
                    }
                    ctx.textAlign = "center";
                    ctx.fillText(word.text.replace(/<score>/g, timer).replace(/<dynrandom>/g, Math.round(Math.random() * 1000)).replace(/<lifeforce>/g, parseInt(lifeforce)).replace(/<garbled>/g, word.text.indexOf("<garbled>") >= 0 ? randomText(10) : ""), word.x, word.y);
                    ctx.restore();
                    if (word.hipster) {
                        word.x += word.hipster == 1 ? -(word.size / 10) : (word.size / 10);
                    } else if (inverse) {
                        word.y -= word.size / 10;
                    } else {
                        word.y += word.size / 10;
                    }
                }

                timer++;
            }
        }
        }
        lifeforce -= 1/60;

        reqAnimFrame(game.main);
    },
    start: function () {
        window.cvs = document.getElementById("game");
        window.ctx = cvs.getContext("2d");
        cvs.height = window.innerHeight;
        cvs.width = window.innerWidth;
        
        window.introText = {
            x: -100,
            y: cvs.height/2
        }

        window.titleText = {
            x: cvs.width/2 - 75,
            y: -10
        }

        document.body.onkeydown = function(e) {
            keys[e.keyCode] = true;
        };
        document.body.onkeyup = function(e) {
            keys[e.keyCode] = false;
        };
        reqAnimFrame(game.main);
    }
}
