let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x: boardWidth / 2 - playerWidth / 2, // Fixed calculation
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight, // Fixed typo
    velocityX: playerVelocityX
};

//Ball 
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x:boardHeight / 2,
    y:boardWidth / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
};

//block
let blockArray = [];
let blockHeight = 10;
let blockWidth = 50;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

//starting blocking corner top left 
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    //create block
    createBlocks();
}

function update() {
    requestAnimationFrame(update)
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, boardHeight, boardWidth);
    
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //bounce ball of walls
    if (ball.y <= 0) {
        //if ball touch top of canvas
        ball.velocityY *= -1;
    } else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        //if ball touch left or right of canvas
        ball.velocityX *= -1; //revers direction
    } else if (ball.y + ball.height >= boardHeight) {
        //if ball touches of canvas game over
        //game over
        context .font = "20px sans-serif"
        context.fillText("Game Over: resate game  Press 'Space'", 80, 400);
        gameOver = true;
    }
    //bouncing of the ball
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;
    } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;
    }

    //broke
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;
                ball.velocityY *= -1;//flep y direction up and down 
                score += 100;
                blockCount -= 1;
            } else if (rightCollision(ball, block) || leftCollision(ball, block)) {
                block.break = true;
                ball.velocityX *= -1;// fliyp x direction up and bown
                score += 100;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //next level 
    if (blockCount == 0) {
        score += 100 * blockRows * blockColumns; // bonas points :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }
    context.font = "20px sans-serif"
    context.fillText(score, 10, 25);

}

function outOfBound(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}


function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
    }
    
    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX;
        let nextPlayerX = player.x - player.velocityX;
        if (!outOfBound(nextPlayerX)) {
            player.x = nextPlayerX;
        }

    } else if (e.code == "ArrowRight") {
        // player.x += player.velocityX
        let nextPlayerX = player.x + player.velocityX;
        if (!outOfBound(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; //clear block Arrays
    for (let c = 0; c < blockColumns; c++){
        for (let r = 0; r < blockRows; r++){
            let block = {
                x: blockX + c * blockWidth + c*10,
                y: blockY + r * blockHeight + r*10,
                width: blockWidth,
                height: blockHeight,
                break: false,
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth / 2 - playerWidth / 2, // Fixed calculation
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight, // Fixed typo
        velocityX: playerVelocityX
    };
    ball = {
        x: boardHeight / 2,
        y: boardWidth / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY,
    };
    blockRows = 3;
    blockArray = [];
    score = 0;
    createBlocks(); 
}