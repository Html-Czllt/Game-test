const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajusta o canvas para ocupar toda a tela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 50,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false,
    isOnGround: true // Adiciona uma nova propriedade para verificar se o jogador está no chão
};

const platforms = [
    { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
    { x: 150, y: canvas.height - 150, width: 150, height: 20 },
    { x: 400, y: canvas.height - 250, width: 150, height: 20 },
    { x: 600, y: canvas.height - 350, width: 150, height: 20 }
];

const obstacles = [
    { x: 300, y: canvas.height - 40, width: 30, height: 30 } // Agora será um espinho
];

const enemies = [
    { x: 500, y: canvas.height - 60, width: 40, height: 40, dx: 2 }
];

const star = { x: 700, y: canvas.height - 80, width: 30, height: 30 };

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawObstacles() {
    ctx.fillStyle = 'gray';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'blue';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawStar() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(star.x, star.y, star.width, star.height);
}

function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Aplicar gravidade se o jogador não estiver no chão
    if (!player.isOnGround) {
        player.dy += player.gravity;
    } else {
        player.dy = 0;
    }

    // Atualiza o estado de pulo
    if (player.y + player.height >= canvas.height) {
        player.isOnGround = true;
        player.y = canvas.height - player.height;
    } else {
        player.isOnGround = false;
    }

    // Verifica colisões com plataformas
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height &&
            player.dy >= 0
        ) {
            player.y = platform.y - player.height;
            player.isOnGround = true;
        }
    });

    // Verifica colisões com obstáculos
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            // Reseta o jogo se o jogador colidir com um obstáculo
            player.x = 50;
            player.y = canvas.height - 60;
            player.dx = 0;
            player.dy = 0;
        }
    });

    // Atualiza inimigos
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;

        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.dx *= -1;
        }

        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            // Reseta o jogo se o jogador colidir com um inimigo
            player.x = 50;
            player.y = canvas.height - 60;
            player.dx = 0;
            player.dy = 0;
        }
    });

    // Verifica colisão com a estrela
    if (
        player.x < star.x + star.width &&
        player.x + player.width > star.x &&
        player.y < star.y + star.height &&
        player.y + player.height > star.y
    ) {
        alert('Você pegou a estrela!');
        // Reseta o jogo
        player.x = 50;
        player.y = canvas.height - 60;
        player.dx = 0;
        player.dy = 0;
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clear();
    drawPlatforms();
    drawObstacles();
    drawEnemies();
    drawStar();
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Manter o estado das teclas
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'd') { // Move para a direita
        player.dx = 5;
    } else if (e.key === 'a') { // Move para a esquerda
        player.dx = -5;
    } else if (e.key === 'w' && player.isOnGround) { // Pular
        player.dy = player.jumpPower;
        player.isOnGround = false;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === 'd' || e.key === 'a') {
        player.dx = 0;
    }
});

// Ajusta o canvas ao redimensionar a janela
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height - 60;
    platforms[0].y = canvas.height - 20;
    obstacles[0].y = canvas.height - 40;
    enemies[0].y = canvas.height - 60;
    star.y = canvas.height - 80;
});

gameLoop();
