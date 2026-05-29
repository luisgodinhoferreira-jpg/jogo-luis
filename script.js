const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- 1. CONFIGURAÇÕES DE ESPAÇO E CAMPO ---
// Ampliamos o canvas via JavaScript para garantir o novo tamanho do campo
canvas.width = 1200;
canvas.height = 700;

const playerWidth = 15;
const playerHeight = 50; // Jogadores um pouco menores para caberem no campo
const playerSpeed = 6;

// --- 2. FORMAÇÃO TÁTICA (X proporcional ao campo, Y inicial) ---
// Define as posições iniciais dos 11 jogadores baseadas em linhas táticas
const formacaoTime1 = [
    { linha: "goleiro", x: 60,  y: 0.5 },
    { linha: "defesa",  x: 200, y: 0.2 }, { linha: "defesa",  x: 200, y: 0.4 }, { linha: "defesa",  x: 200, y: 0.6 }, { linha: "defesa",  x: 200, y: 0.8 },
    { linha: "meio",    x: 400, y: 0.2 }, { linha: "meio",    x: 400, y: 0.4 }, { linha: "meio",    x: 400, y: 0.6 }, { linha: "meio",    x: 400, y: 0.8 },
    { linha: "ataque",  x: 550, y: 0.35 }, { linha: "ataque", x: 550, y: 0.65 }
];

const formacaoTime2 = [
    { linha: "goleiro", x: canvas.width - 60 - playerWidth,  y: 0.5 },
    { linha: "defesa",  x: canvas.width - 200 - playerWidth, y: 0.2 }, { linha: "defesa",  x: canvas.width - 200 - playerWidth, y: 0.4 }, { linha: "defesa",  x: canvas.width - 200 - playerWidth, y: 0.6 }, { linha: "defesa",  x: canvas.width - 200 - playerWidth, y: 0.8 },
    { linha: "meio",    x: canvas.width - 400 - playerWidth, y: 0.2 }, { linha: "meio",    x: canvas.width - 400 - playerWidth, y: 0.4 }, { linha: "meio",    x: canvas.width - 400 - playerWidth, y: 0.6 }, { linha: "meio",    x: canvas.width - 400 - playerWidth, y: 0.8 },
    { linha: "ataque",  x: canvas.width - 550 - playerWidth, y: 0.35 }, { linha: "ataque", x: canvas.width - 550 - playerWidth, y: 0.65 }
];

// Criando os arrays de jogadores com suas coordenadas reais em pixels
let timeVermelho = formacaoTime1.map(p => ({ x: p.x, y: (canvas.height * p.y) - (playerHeight / 2) }));
let timeAzul = formacaoTime2.map(p => ({ x: p.x, y: (canvas.height * p.y) - (playerHeight / 2) }));

// --- 3. CONFIGURAÇÕES DA BOLA ---
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 12;
let ballSpeedX = 6;
let ballSpeedY = 6;

let score1 = 0;
let score2 = 0;

// --- 4. CONTROLES DO TECLADO ---
const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 6 : -6);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// --- 5. LÓGICA DO JOGO ---
function update() {
    // Move todos os jogadores do Time Vermelho juntos (W / S)
    if (keys["w"] || keys["W"]) {
        timeVermelho.forEach(p => { if (p.y > 0) p.y -= playerSpeed; });
    }
    if (keys["s"] || keys["S"]) {
        timeVermelho.forEach(p => { if (p.y < canvas.height - playerHeight) p.y += playerSpeed; });
    }

    // Move todos os jogadores do Time Azul juntos (Setas)
    if (keys["ArrowUp"]) {
        timeAzul.forEach(p => { if (p.y > 0) p.y -= playerSpeed; });
    }
    if (keys["ArrowDown"]) {
        timeAzul.forEach(p => { if (p.y < canvas.height - playerHeight) p.y += playerSpeed; });
    }

    // Movimentação da Bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisão com teto e chão
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Verificação de colisão com os 11 jogadores do Time Vermelho
    timeVermelho.forEach(p => {
        if (ballX - ballRadius < p.x + playerWidth && ballX + ballRadius > p.x &&
            ballY > p.y && ballY < p.y + playerHeight) {
            ballSpeedX = Math.abs(ballSpeedX); // Rebate para a direita
        }
    });

    // Verificação de colisão com os 11 jogadores do Time Azul
    timeAzul.forEach(p => {
        if (ballX + ballRadius > p.x && ballX - ballRadius < p.x + playerWidth &&
            ballY > p.y && ballY < p.y + playerHeight) {
            ballSpeedX = -Math.abs(ballSpeedX); // Rebate para a esquerda
        }
    });

    // Sistema de Gols
    if (ballX < 0) {
        score2++;
        resetBall();
    } else if (ballX > canvas.width) {
        score1++;
        resetBall();
    }
}

// --- 6. PARTE VISUAL (DESENHO) ---
function draw() {
    // Limpa o campo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linhas do Campo (Estilo Estádio)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 4;
    
    // Linha de Meio de Campo
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Círculo Central
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Grandes Áreas
    ctx.strokeRect(0, canvas.height / 2 - 150, 150, 300);
    ctx.strokeRect(canvas.width - 150, canvas.height / 2 - 150, 150, 300);

    // Desenha as duas equipes de 11 jogadores
    ctx.fillStyle = "#e53935"; // Vermelho
    timeVermelho.forEach(p => ctx.fillRect(p.x, p.y, playerWidth, playerHeight));

    ctx.fillStyle = "#1e88e5"; // Azul
    timeAzul.forEach(p => ctx.fillRect(p.x, p.y, playerWidth, playerHeight));

    // Desenha a Bola
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Placar
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(score1, canvas.width / 4, 60);
    ctx.fillText(score2, (canvas.width / 4) * 3, 60);
}

// Loop do Jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
