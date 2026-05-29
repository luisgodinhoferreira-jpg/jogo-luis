const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configurações dos Jogadores (Goleiros/Linha)
const playerWidth = 15;
const playerHeight = 90;

let p1Y = canvas.height / 2 - playerHeight / 2;
let p2Y = canvas.height / 2 - playerHeight / 2;
const playerSpeed = 6;

// Configurações da Bola
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Placar
let score1 = 0;
let score2 = 0;

// Captura de Teclado
const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Função para resetar a bola após um gol
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Muda a direção de quem saca
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Atualiza a lógica do jogo
function update() {
    // Movimentação do Jogador 1 (W e S)
    if (keys["w"] && p1Y > 0) p1Y -= playerSpeed;
    if (keys["s"] && p1Y < canvas.height - playerHeight) p1Y += playerSpeed;

    // Movimentação do Jogador 2 (Setas Cima e Baixo)
    if (keys["ArrowUp"] && p2Y > 0) p2Y -= playerSpeed;
    if (keys["ArrowDown"] && p2Y < canvas.height - playerHeight) p2Y += playerSpeed;

    // Movimentação da Bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisão da bola com teto e chão
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Colisão com o Jogador 1 (Esquerda)
    if (ballX - ballRadius < 30 + playerWidth && ballY > p1Y && ballY < p1Y + playerHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Colisão com o Jogador 2 (Direita)
    if (ballX + ballRadius > canvas.width - 30 - playerWidth && ballY > p2Y && ballY < p2Y + playerHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Sistema de Gols (Se passar das linhas laterais)
    if (ballX < 0) {
        score2++;
        resetBall();
    } else if (ballX > canvas.width) {
        score1++;
        resetBall();
    }
}

// Desenha os elementos na tela
function draw() {
    // Limpa o campo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linha de meio de campo e círculo central
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Desenha Jogador 1 (Vermelho)
    ctx.fillStyle = "#e53935";
    ctx.fillRect(30, p1Y, playerWidth, playerHeight);

    // Desenha Jogador 2 (Azul)
    ctx.fillStyle = "#1e88e5";
    ctx.fillRect(canvas.width - 30 - playerWidth, p2Y, playerWidth, playerHeight);

    // Desenha a Bola (Branca com detalhes pretos simulados)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Desenha o Placar
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(score1, canvas.width / 4, 50);
    ctx.fillText(score2, (canvas.width / 4) * 3, 50);
}

// Loop Principal do Jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();
