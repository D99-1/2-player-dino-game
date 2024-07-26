const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dino = {
    x: 50,
    y: 500,
    width: 100,
    height: 100,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: true
};

const pterodactyls = [];

let isGameOver = false;
let score = 0;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
    }
    if (event.key === ' ' && !isGameOver) {
        launchPterodactyl();
    }
});

function launchPterodactyl() {
    const pterodactyl = {
        x: cannon.x,
        y: cannon.y + 50,
        width: 60,
        height: 20,
        dx: -5
    };
    pterodactyls.push(pterodactyl);
}

function update() {
    if (isGameOver) return;

    dino.dy += dino.gravity;
    dino.y += dino.dy;
    if (dino.y >= 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
    }

    pterodactyls.forEach((p, index) => {
        p.x += p.dx;
        if (p.x + p.width < 0) {
            pterodactyls.splice(index, 1);
        }
    });

    pterodactyls.forEach((p) => {
        if (isColliding(dino, p)) {
            isGameOver = true;
            alert("Game Over!");
        }
    });

    score++;

    render();
    requestAnimationFrame(update);
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

const ground = {
    x: 0,
    y: canvas.height -20,
    width: canvas.width,
    height: 20,
    speed: 5
};

const CANNON_STATE = {
    NORMAL: 'normal',
    SHOOTING: 'shooting',
    RELOADING: 'reloading'
};

let cannonState = CANNON_STATE.NORMAL;
const cannon = {
    x: 600,
    y: canvas.height - 100,
    width: 175,
    height: 100
};

const normalCannonImage = new Image();
normalCannonImage.src = './img/cannon.png';

const shootingCannonImage = new Image();
shootingCannonImage.src = './img/cannon.gif';

const reloadingCannonImage = new Image();
reloadingCannonImage.src = './img/loading-cannon.png';

function shootCannon() {
    if (cannonState === CANNON_STATE.NORMAL) {
        cannonState = CANNON_STATE.SHOOTING;
        setTimeout(() => {
            cannonState = CANNON_STATE.RELOADING;
            setTimeout(() => {
                cannonState = CANNON_STATE.NORMAL;
            }, 5000);
        }, 1000);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const groundImage = new Image();
    groundImage.src = './img/track.png';
    ctx.drawImage(groundImage, ground.x, ground.y, ground.width, ground.height);
    ctx.drawImage(groundImage, ground.x + ground.width, ground.y, ground.width, ground.height);

    ground.x -= ground.speed;
    if (ground.x <= -ground.width) {
        ground.x = 0;
    }

    let cannonImage;
    switch (cannonState) {
        case CANNON_STATE.SHOOTING:
            cannonImage = shootingCannonImage;
            break;
        case CANNON_STATE.RELOADING:
            cannonImage = reloadingCannonImage;
            break;
        default:
            cannonImage = normalCannonImage;
            break;
    }
    ctx.drawImage(cannonImage, cannon.x, cannon.y, cannon.width, cannon.height);

    const dinoImage = new Image();
    dinoImage.src = './img/dino.png';
    ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

    const pterodactylImage = new Image();
    pterodactylImage.src = './img/bird1.png';
    
    pterodactyls.forEach((p) => {
        ctx.drawImage(pterodactylImage, p.x, p.y, p.width, p.height);
    });
}

canvas.addEventListener('click', shootCannon);

render();
requestAnimationFrame(update);
