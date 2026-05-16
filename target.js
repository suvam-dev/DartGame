let totalScore = 0;
let movesLeft = 10;
const targetScore = 150;

function gameplay() {
    console.log("game loaded");
    //making the dart board 
    var can = document.querySelector("#gameCanvas");
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    var ctx = can.getContext("2d");
    const image = document.querySelector(".dartboard");
    const size = Math.min(can.width, can.height) * 0.6;

    var gameState = "aimingX";
    // X coordinates
    const centerX = can.width / 2;
    const centerY = can.height / 2;
    const boardRadius = size / 2;
    var xPos = centerX;
    var direction = 1;
    var speed = 4;
    var leftLimit = centerX - boardRadius;
    var rightLimit = centerX + boardRadius;
    var isLockedX = false;

    //ycoordiunates 
    var yPos = centerY;
    var yDirection = 1;
    var ySpeed = 4;
    var topLimit = centerY - boardRadius;
    var bottomLimit = centerY + boardRadius;
    var isLockedY = false;

    // UI Elements
    const scoreValue = document.querySelector("#score-value");
    const movesDisplay = document.querySelector("#moves");
    const targetDisplay = document.querySelector(".target-score");

    // Initialize UI
    if (targetDisplay) targetDisplay.innerHTML = "Target-score: " + targetScore;
    if (movesDisplay) movesDisplay.innerHTML = "Moves: " + movesLeft;
    if (scoreValue) scoreValue.innerHTML = "Score: " + totalScore;

    function resetThrow() {
        xPos = centerX;
        yPos = centerY;
        isLockedX = false;
        isLockedY = false;
        gameState = "aimingX";
    }

    function update() {
        if (gameState === "gameOver" || gameState === "waiting") return;

        if (gameState === "aimingX") {
            if (!isLockedX) {
                xPos += direction * speed;

                if (xPos >= rightLimit) {
                    xPos = rightLimit;
                    direction = -1;
                }

                if (xPos <= leftLimit) {
                    xPos = leftLimit;
                    direction = 1;
                }
            }
            else {
                gameState = "aimingY";
            }
        }
        else if (gameState === "aimingY") {
            if (!isLockedY) {
                yPos += yDirection * ySpeed;

                if (yPos >= bottomLimit) {
                    yPos = bottomLimit;
                    yDirection = -1;
                }

                if (yPos <= topLimit) {
                    yPos = topLimit;
                    yDirection = 1;
                }
            }
            else {
                gameState = "shoot";
                const currentThrowScore = score(xPos, yPos);
                totalScore += currentThrowScore;
                movesLeft--;

                // Update UI
                if (scoreValue) scoreValue.innerHTML = "Score: " + totalScore;
                if (movesDisplay) movesDisplay.innerHTML = "Moves: " + movesLeft;

                gameState = "waiting";

                setTimeout(() => {
                    if (totalScore >= targetScore) {
                        if (targetDisplay) targetDisplay.innerHTML = "🏆 YOU WIN! 🏆";
                        alert("Winner! You reached " + totalScore + " points!");
                        gameState = "gameOver";
                    } else if (movesLeft <= 0) {
                        if (targetDisplay) targetDisplay.innerHTML = "❌ GAME OVER ❌";
                        alert("Game Over! You got " + totalScore + " points. Target was " + targetScore);
                        gameState = "gameOver";
                    } else {
                        resetThrow();
                    }
                }, 500);
            }
        }
    }


    function draw() {
        ctx.clearRect(0, 0, can.width, can.height);

        ctx.drawImage(
            image,
            centerX - size / 2,
            centerY - size / 2,
            size,
            size
        );

        ctx.fillStyle = "red";
        ctx.fillRect(xPos - 5, centerY + boardRadius + 20, 10, 20);
        ctx.fillRect(centerX + boardRadius + 20, yPos - 5, 20, 10);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(xPos, yPos);
        ctx.stroke();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();

    function score(dartx, darty) {
        const dx = dartx - centerX;
        const dy = darty - centerY;
        const scoreboard = [
            6, 13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10
        ];

        var distance = Math.sqrt(dx * dx + dy * dy);
        var r = distance / boardRadius;
        if (r > 1) {
            return 0;
        }
        if (r < 0.1) {
            return 50;
        }
        if (r < 0.2) {
            return 25;
        }
        var angle = Math.atan2(dy, dx);
        angle = angle * 180 / Math.PI * -1;
        if (angle < 0) {
            angle += 360;
        }
        let slice = Math.floor(angle / 18);
        let base = scoreboard[slice];

        // triple ring
        if (r > 0.45 && r < 0.5) {
            return base * 3;
        }

        // double ring
        if (r > 0.75 && r < 0.8) {
            return base * 2;
        }

        // normal
        return base;
    }

    window.addEventListener("click", () => {
        if (gameState === "aimingX") {
            isLockedX = true;
        }
        else if (gameState === "aimingY") {
            isLockedY = true;
        }
        else if (gameState === "gameOver") {
            location.reload();
        }
    });
}

gameplay();