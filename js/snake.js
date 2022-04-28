import UI from "./UI.js";

const ROWSIZE = 10;
const canvas = {
    board: document.getElementById("board"),
    /**
     * @type {CanvasRenderingContext2D}
     */
    get ctx() {
        return this.board.getContext("2d");
    },
    get squareSize() {
        return canvas.size / ROWSIZE;
    },

    
    themes: {
        dark: {
            primaryColor: "#8c8c8c",
            secondaryColor: "#777777",
            primaryBackgroundColor: "#444444",
            secondaryBackgroundColor: "#3d3d3d",
        },
        light: {
            primaryColor: "#444444",
            secondaryColor: "#333333",
            primaryBackgroundColor: "#8c8c8c",
            secondaryBackgroundColor: "#777777",
        }
    },

    get themeName() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    },
    
    get theme() {
        return this.themes[this.themeName];
    }
};

var apple;
var appleScale = 0;
var head = Math.floor(ROWSIZE/2) * ROWSIZE + Math.floor(ROWSIZE/2);
var snake = [head];
var updateStep = 0;
var lastupdate = 0;
var direction = 1;
var running = true;
var keys = [];
var directionMap = {
    "left": -1,
    "right": 1,
    "up": -ROWSIZE,
    "down": ROWSIZE,
};

UI.init();
generateApple();
UI.onUpdate.push(() => {
    // h1.innerText = UI.deltaTime;
    setCanvasSize();
    update();
    draw();
});

function setCanvasSize() {
    var parent = canvas.board.parentNode;
    var styles = getComputedStyle(parent);
    var width = parseInt(styles.getPropertyValue("width"), 10);
    var height = parseInt(styles.getPropertyValue("height"), 10);
    canvas.size = Math.min(width, height);
    canvas.board.width = canvas.size;
    canvas.board.height = canvas.size;
}

function generateApple() {
    apple = Math.floor(Math.random() * Math.pow(ROWSIZE, 2));
    while (snake.includes(apple)) {
        apple = Math.floor(Math.random() * Math.pow(ROWSIZE, 2));
    }
}
function update() {
    if (running) {
        updateStep += UI.deltaTime;
        if (updateStep >= lastupdate + 250) {
            lastupdate = updateStep;
            newDirection();
            if (isDead(head)) {
                running = false;
                return;
            }
            head += direction;
            snake.push(head);
            if (head !== apple) {
                snake.shift();
            } else {
                if (snake.length === ROWSIZE * ROWSIZE) {
                    running = false;
                } else {
                    generateApple();
                }
            }
        }
    }
}

function newDirection() {
    if (keys.length > 0) {
        var key = keys.shift();
        while (directionMap[key] === direction || directionMap[key] === -direction) {
            if (keys.length > 0) {
                key = keys.shift();
            } else {
                return;
            }
        }
        direction = directionMap[key];
    }
}

function isDead(start) {
    if (start % ROWSIZE === 9 && direction === 1) {
        return true;
    }
    if (start % ROWSIZE === 0 && direction === -1) {
        return true;
    }
    if (start + direction < 0 || start + direction > (ROWSIZE * ROWSIZE) - 1) {
        return true;
    }
    return snake.includes(start + direction);
}

function draw() {
    canvas.ctx.clearRect(0, 0, canvas.size, canvas.size);
    drawGrid();
    drawApple();
    drawSnake();
}

function drawGrid() {
    for (let column = 0; column < canvas.squareSize; column++) {
        for (let row = 0; row < canvas.squareSize; row++) {
            canvas.ctx.fillStyle = (row + column) % 2 === 0 ? canvas.theme.primaryBackgroundColor : canvas.theme.secondaryBackgroundColor;
            canvas.ctx.fillRect(column * canvas.squareSize, row * canvas.squareSize, canvas.squareSize, canvas.squareSize);
        }
    }
}

function drawApple() {
    appleScale += 0.002 * UI.deltaTime;
    var appleRow = Math.floor(apple / ROWSIZE);
    var appleColumn = Math.floor(apple % ROWSIZE);
    canvas.ctx.fillStyle = "#e35655";
    var scaleFactor = Math.sin(appleScale) * 0.025 + 0.025;
    canvas.ctx.beginPath();
    canvas.ctx.arc((appleColumn + 0.5) * canvas.squareSize, (appleRow + 0.5) * canvas.squareSize, canvas.squareSize * (0.4 + scaleFactor), 0, 2 * Math.PI);
    canvas.ctx.fill();
}

function drawSnake() {
    drawHead();
    for (let i = 0; i < snake.length - 1; i++) {
        var row = Math.floor(snake[i] / ROWSIZE);
        var column = Math.floor(snake[i] % ROWSIZE);
        canvas.ctx.fillStyle = "#33bb66";
        canvas.ctx.fillRect((column + 0.1) * canvas.squareSize, (row + 0.1) * canvas.squareSize, canvas.squareSize * 0.8, canvas.squareSize * 0.8);
        if (i - 1 !== -1) {
            drawConnection(snake[i], snake[i - 1]);
        }
        if (i + 1 !== snake.length) {
            drawConnection(snake[i], snake[i + 1]);
        }
    }
}

function drawHead() {
    var row = Math.floor(head / ROWSIZE);
    var column = Math.floor(head % ROWSIZE);
    canvas.ctx.fillStyle = "#33bb66";
    canvas.ctx.fillRect((column + 0.1) * canvas.squareSize, (row + 0.1) * canvas.squareSize, canvas.squareSize * 0.8, canvas.squareSize * 0.8);
    if (snake.length !== 1) {
        drawConnection(head, snake[snake.length - 2]);
    }
    canvas.ctx.fillStyle = "#fff";
    var eyeOffsets = {
        left: {
            x: direction === 1 || direction === -ROWSIZE ? 0.5 : 0,
            y: direction === ROWSIZE || direction === 1 ? 0.5 : 0,
        },
        right: {
            x: direction === ROWSIZE || direction === 1 ? 0.5 : 0,
            y: direction === ROWSIZE || direction === -1 ? 0.5 : 0,
        }
    };
    canvas.ctx.beginPath();
    canvas.ctx.arc((column + 0.25 + eyeOffsets.left.x) * canvas.squareSize, (row + 0.25 + eyeOffsets.left.y) * canvas.squareSize, canvas.squareSize * 0.1, 0, Math.PI * 2);
    canvas.ctx.arc((column + 0.25 + eyeOffsets.right.x) * canvas.squareSize, (row + 0.25 + eyeOffsets.right.y) * canvas.squareSize, canvas.squareSize * 0.1, 0, Math.PI * 2);
    canvas.ctx.fill();

    canvas.ctx.fillStyle = "#000";
    canvas.ctx.beginPath();
    canvas.ctx.arc((column + 0.25 + eyeOffsets.left.x) * canvas.squareSize, (row + 0.25 + eyeOffsets.left.y) * canvas.squareSize, canvas.squareSize * 0.05, 0, Math.PI * 2);
    canvas.ctx.arc((column + 0.25 + eyeOffsets.right.x) * canvas.squareSize, (row + 0.25 + eyeOffsets.right.y) * canvas.squareSize, canvas.squareSize * 0.05, 0, Math.PI * 2);
    canvas.ctx.fill();
}

function drawConnection(node, connectsTo) {
    var connectionDirection = connectsTo - node;
    var row = Math.floor(node / ROWSIZE);
    var column = Math.floor(node % ROWSIZE);

    switch (connectionDirection) {
        case 1:
            canvas.ctx.fillRect((column + 0.8) * canvas.squareSize, (row + 0.1) * canvas.squareSize, canvas.squareSize * 0.2, canvas.squareSize * 0.8);
            break;
        case -1:
            canvas.ctx.fillRect(column * canvas.squareSize, (row + 0.1) * canvas.squareSize, canvas.squareSize * 0.2, canvas.squareSize * 0.8);
            break;
        case -ROWSIZE:
            canvas.ctx.fillRect((column + 0.1) * canvas.squareSize, row * canvas.squareSize, canvas.squareSize * 0.8, canvas.squareSize * 0.2);
            break;
        case ROWSIZE:
            canvas.ctx.fillRect((column + 0.1) * canvas.squareSize, (row + 0.8) * canvas.squareSize, canvas.squareSize * 0.8, canvas.squareSize * 0.2);
            break;
    }
}

var keymap = {
    "ArrowRight": 'right',
    "ArrowLeft": 'left',
    "ArrowUp": 'up',
    "ArrowDown": 'down',
    "KeyW": 'up',
    "KeyS": 'down',
    "KeyA": 'left',
    "KeyD": 'right',
};

window.addEventListener("keydown", (e) => {
    if (!e.repeat) {
        if (e.code === "KeyR") {
            head = Math.floor(ROWSIZE / 2) * ROWSIZE + Math.floor(ROWSIZE / 2);
            snake = [head];
            direction = 1;
            updateStep = 0;
            lastupdate = 0;
            keys = [];
            running = true;
            generateApple();
            return;
        }
        if (Object.keys(keymap).includes(e.code)) {
            var key = keymap[e.code];
            keys.push(key);
        }
    }
}, false);