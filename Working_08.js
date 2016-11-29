$(document).ready(function () {
    var canvas = $("#gameCanvas");
    var context = canvas.get(0).getContext("2d");

    var canvasW = canvas.width();
    var canvasH = canvas.height();

    var playGame;
    var lives;
    var score;
    var scoreTimeout;

    var ui = $("#gameUI");
    var uiIntro = $("#gameIntro");
    var uiStats = $("#gameStats");
    var uiComplete = $("#gameComplete");
    var uiPlay = $("#gamePlay");
    var uiReset = $(".gameReset");
    var uiLives = $("#gameLives");
    var uiScore = $(".gameScore");

    var soundBackground = $("#gameBackground").get(0);
    var soundFlap = $("#gameFlap").get(0);
    var soundDeath = $("#gameDeath").get(0);

    var image = new Image();
    var playerImage = new Image();
    image.src = "Images/background.png";
    playerImage.src = "Images/player_3.png";

    var pipeImage = new Image();
    pipeImage.src = "Images/pipe.png";

    var pipes;
    var pipeCount;

    var Pipe = function (x, y, width, height, vX) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.vX = -5;
    };

    var Player = function (x, y, width, height, vY, gravity, rotation) {
        this.x = 150;
        this.y = 200;
        this.width = 40;
        this.height = 40;

        this.vY = Math.random() * 6 - 2;
        this.gravity = 1;
        this.rotation = 0;
    };

    var player;

    function startGame() {
        score = 0;
        lives = 1;

        uiScore.html(score);
        uiLives.html(lives);
        uiStats.show();

        playGame = true;

        pipes = new Array();
        pipeCount = 5;

        player = new Player();

        for (var i = 0; i < pipeCount; i++) {
            var width = 50;
            var height = 150;
            var x = canvasW + 100;
            var y = canvasH - height;

            pipes.push(new Pipe(x, y, width, height));
        };

        soundBackground.currentTime = 0;
        soundBackground.play();

        timer();
        animate();
    };

    function init() {
        uiStats.hide();
        uiComplete.hide();

        uiPlay.click(function (e) {
            e.preventDefault();
            uiIntro.hide();
            startGame();
        });

        uiReset.click(function (e) {
            e.preventDefault();
            uiComplete.hide();
            startGame();
        });
    };

    function resetPlayer() {
        player.x = playerOriginalX;
        player.y = playerOriginalY;
        player.vY = 0;

        soundDeath.currentTime = 0;
        soundDeath.play();
    };

    function takeDamage() {
        lives -= 1;
        uiLives.html(lives);
        //resetPlayer();
        soundDeath.currentTime = 0;
        soundDeath.play();
    }

    function timer() {
        if (playGame) {
            scoreTimeout = setTimeout(function () {
                uiScore.html(++score);
                timer();
            }, 1000);
        };
    };

    function spawnPipes() {
        var pipesLength = pipes.length;
        for (var i = 0; i < 2; i++) {
            var tmpPipe = pipes[i];

            tmpPipe.x += tmpPipe.vX;

            if ((tmpPipe.x + tmpPipe.width) < 0) {
                tmpPipe.x = canvasW + Math.floor(Math.random() * 250) + 125;
                tmpPipe.height = Math.floor(Math.random()*275)+100;
                tmpPipe.y = canvasH - tmpPipe.height;
            };
            context.drawImage(pipeImage, tmpPipe.x, tmpPipe.y, tmpPipe.width, tmpPipe.height);
        };
    };

    function changeRot(gameObj) {
        if (gameObj.rotation < 3.0) {
            gameObj.rotation += 5;
        };
    };

    function drawPlayer() {
        context.save();
        context.translate(player.x, player.y);
        context.rotate(player.rotation * Math.PI / 180);
        context.drawImage(playerImage, -20, -20, player.width, player.height);
        context.restore();
    };

    function collisionDetection() {
        for (var i = 0; i < pipes.length; i++) {
            if ((player.x > pipes[i].x) && (player.x < pipes[i].x + pipes[i].width)){
                if ((player.y > pipes[i].y) && (player.y < pipes[i].y + pipes[i].height)) {
                    takeDamage();
                };
            };
        };
    };

    function animate() {
        context.clearRect(0, 0, canvasW, canvasH);
        context.drawImage(image, 0, 0, canvasW, canvasH);

        player.vY += player.gravity;
        player.rotation += 3.5;

        if (player.rotation >= 90) {
            player.rotation = 90;
        };

        if (player.vY < -8) {
            player.vY = -8;
            player.rotation -= 20;
        } else if (player.vY > 8) {
            player.vY = 8;
        };

        player.y += player.vY;

        if (player.y < -75) {
            player.vY += 8;
        } else if (player.y >= canvasH) {
            takeDamage();
        };

        $(document).click(function () {
            player.vY -= 0.8;

            player.rotation = -45;

            changeRot(player);

            soundFlap.currentTime = 0;
            soundFlap.play();
        });

        /*context.save();
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(player.x + (player.width / 5), player.y);
        context.lineTo(player.x - (player.width / 5), player.y - (player.height / 5));
        context.lineTo(player.x - (player.width / 5), player.y + (player.height / 5));
        context.closePath();
        context.fill();
        context.restore();*/

        if (lives <= 0) {
            playGame = false;

            uiStats.hide();
            uiComplete.show();
            soundBackground.pause();
        };

        if (playGame === true) {
            setTimeout(animate, 33);
        };

        spawnPipes();
        drawPlayer();
        collisionDetection();
    };

    init();
});
