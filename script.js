const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');

// Set canvas size dynamically
canvas.width = document.querySelector('.game-container').clientWidth;
canvas.height = document.querySelector('.game-container').clientHeight;

let score = 0;
let gameSpeed = 5;
let gameOver = false;

// Player
const player = {
    x: 100,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5
};

// Obstacles and Collectibles
let obstacles = [];
let collectibles = [];
const obstacleTypes = ['tree', 'bear', 'deer', 'car'];
const collectibleTypes = ['burger', 'drink'];

function spawnObject() {
    if (Math.random() < 0.02) {
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 40,
            width: 40,
            height: 40,
            type: type
        });
    }
    if (Math.random() < 0.01) {
        const type = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
        collectibles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 100) + 50,
            width: 20,
            height: 20,
            type: type
        });
    }
}

// Desktop controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
});

// Mobile touch controls
let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
    if (gameOver) return;
    touchStartX = e.touches[0].clientX;
});
canvas.addEventListener('touchmove', (e) => {
    if (gameOver) return;
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;
    if (deltaX > 20 && player.x < canvas.width - player.width) player.x += player.speed;
    if (deltaX < -20 && player.x > 0) player.x -= player.speed;
    touchStartX = touchX;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player (red rectangle)
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    obstacles.forEach((obj) => {
        ctx.fillStyle = obj.type === 'tree' ? 'green' : obj.type === 'bear' ? 'brown' : obj.type === 'deer' ? 'tan' : 'gray';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });

    // Draw collectibles
    collectibles.forEach((item) => {
        ctx.fillStyle = item.type === 'burger' ? 'orange' : 'blue';
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function update() {
    if (gameOver) return;

    spawnObject();

    // Move objects
    obstacles.forEach((obj, index) => {
        obj.x -= gameSpeed;
        if (obj.x + obj.width < 0) obstacles.splice(index, 1);
    });
    collectibles.forEach((item, index) => {
        item.x -= gameSpeed;
        if (item.x + item.width < 0) collectibles.splice(index, 1);
    });

    draw();

    // Check collisions
    for (let obj of obstacles) {
        if (checkCollision(player, obj)) {
            gameOver = true;
            gameOverScreen.style.display = 'block';
            finalScoreDisplay.textContent = score;
            return;
        }
    }
    collectibles.forEach((item, index) => {
        if (checkCollision(player, item)) {
            score += item.type === 'burger' ? 5 : 1;
            collectibles.splice(index, 1);
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });

    requestAnimationFrame(update);
}

function restartGame() {
    score = 0;
    gameSpeed = 5;
    gameOver = false;
    obstacles = [];
    collectibles = [];
    player.x = 100;
    scoreDisplay.textContent = 'Score: 0';
    gameOverScreen.style.display = 'none';
    update();
}

// Start the game
update();
