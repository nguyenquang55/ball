const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player1 = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 100,
    speed: 50
};
let player2Type = "human"; // Default to playing with people
const botSpeed = 50; // Adjust bot speed as needed
let player2Y = canvas.height / 2;
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 3
};
let gameEnded = false;

// Function to start the game with the selected option
function startGame(player2) {
    player2Type = player2;
    document.getElementById('menu').style.display = 'none';
    gameLoop();
}

// Function to draw the menu
function drawMenu() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Choose Game Mode', canvas.width / 2, canvas.height / 2 - 50);
}

function drawPlayers() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player1.x - player1.width / 2, player1.y - player1.height / 2, player1.width, player1.height);
    ctx.fillStyle = 'green';
    if (player2Type === "human") {
        ctx.fillRect(canvas.width - 50 - 10, player2Y - 50, 20, 100); // Human opponent
    } else {
        ctx.fillRect(canvas.width - 50 - 10, player2Y - 50, 20, 100); // Bot
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (!gameEnded) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayers();
        drawBall();

        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // Ball collisions with walls
        if (ball.x - ball.radius < 0) {
            endGame("Player 2");
        } else if (ball.x + ball.radius > canvas.width) {
            endGame("Player 1");
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.speedY = -ball.speedY;
        }

        // Ball collisions with players
        if (ball.x - ball.radius < player1.x + player1.width / 2 &&
            ball.y > player1.y - player1.height / 2 &&
            ball.y < player1.y + player1.height / 2) {
            ball.speedX = -ball.speedX;
        }

        if (player2Type === "human") {
            if (ball.x + ball.radius > canvas.width - 50 &&
                ball.y > player2Y - 50 &&
                ball.y < player2Y + 50) { // Human opponent
                ball.speedX = -ball.speedX;
            }
        } else {
            if (ball.x + ball.radius > canvas.width - 50 &&
                ball.y > player2Y - 50 &&
                ball.y < player2Y + 50) { // Bot
                ball.speedX = -ball.speedX;
            }
        }

        // Update bot's position based on the ball's position
        if (player2Type === "computer") {
            if (ball.y > player2Y + 50) {
                player2Y += botSpeed;
            } else if (ball.y < player2Y - 50) {
                player2Y -= botSpeed;
            }
        }
    }
}

function endGame(losingSide) {
    gameEnded = true;
    alert("Game Over! " + losingSide + " loses.");
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
    if (player2Type === "human") {
        // If playing against a human, control Player 2
        if (event.key === 'w') {
            player1.y -= player1.speed;
        } else if (event.key === 's') {
            player1.y += player1.speed;
        }
        if (event.key === 'ArrowUp') {
            player2Y -= player1.speed;
        } else if (event.key === 'ArrowDown') {
            player2Y += player1.speed;
        }
    } else {
        // If playing against the computer or controlling Player 1, control Player 1
        if (event.key === 'w') {
            player1.y -= player1.speed;
        } else if (event.key === 's') {
            player1.y += player1.speed;
        }
    }
});



document.getElementById('playWithPeople').addEventListener('click', function() {
    startGame("human");
   
});

document.getElementById('playWithComputer').addEventListener('click', function() {
    startGame("computer");

});


drawMenu();
