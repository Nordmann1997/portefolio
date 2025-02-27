function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}




class Ball {
    constructor(x, y, vx, vy, radius, imageUrl, productUrl) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.imageUrl = imageUrl;
        this.mass = radius;
        this.productUrl = productUrl; // Ny parameter for produktsiden

        // Lag div-element for ballen
        this.div = document.createElement('div');
        this.div.classList.add('ball');
        this.div.style.backgroundImage = `url('${imageUrl}')`;
        document.getElementById('gameContainer').appendChild(this.div);

         // Legg til en click-hendelse for å navigere til produktsiden
        this.div.addEventListener('click', () => {
            // Naviger til produktsiden for denne ballen
            window.location.href = this.productUrl;
        });
    

    }

    update(secondsPassed) {
        this.vy += 9,81 * secondsPassed; // Påfør gravitasjon
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        this.div.style.left = this.x - this.radius + 'px';
        this.div.style.top = this.y - this.radius + 'px';
    }
}

// Funksjon for å oppdatere ballstørrelsen basert på vinduets størrelse
function updateBallSizes() {
    let ballSizeVW = 15; // Størrelse i vw (f.eks. 15vw)
    let ballSize = (ballSizeVW / 100) * window.innerWidth; // Konverterer vw til piksler
    let newRadius = ballSize / 2;

    gameObjects.forEach(ball => {
        ball.radius = newRadius;
        ball.div.style.width = `${ballSize}px`;
        ball.div.style.height = `${ballSize}px`;
    });
    
    // Etter at størrelsen er oppdatert, sjekk og juster posisjonene slik at de ikke overlapper.
    repositionBalls();
}

// Funksjon for å sjekke om noen baller overlapper og justere posisjonene deres
function repositionBalls() {
    // Enkel iterasjon: for hver ball, sjekk med hver annen ball.
    for (let i = 0; i < gameObjects.length; i++) {
        for (let j = i + 1; j < gameObjects.length; j++) {
            let ball1 = gameObjects[i];
            let ball2 = gameObjects[j];

            if (rectIntersect(ball1.x, ball1.y, ball1.radius, ball2.x, ball2.y, ball2.radius)) {
                // Beregn avstanden og overflødig overlapp
                let dx = ball2.x - ball1.x;
                let dy = ball2.y - ball1.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Unngå deling med 0 hvis ballene er nøyaktig på samme sted
                if (distance === 0) {
                    dx = Math.random() - 0.5;
                    dy = Math.random() - 0.5;
                    distance = Math.sqrt(dx * dx + dy * dy);
                }

                // Hvor mye overlapper de?
                let overlap = ball1.radius + ball2.radius - distance;

                // Normaliser kollisjonsvektoren
                let nx = dx / distance;
                let ny = dy / distance;

                // Flytt hver ball halvparten av overlappen bort fra hverandre
                ball1.x -= nx * overlap / 2;
                ball1.y -= ny * overlap / 2;
                ball2.x += nx * overlap / 2;
                ball2.y += ny * overlap / 2;
            }
        }
    }
}

// Kollisjonsdeteksjon mellom to baller (samme som før)
function rectIntersect(x1, y1, r1, x2, y2, r2) {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < r1 + r2;
}

// Legg til denne linjen for å oppdatere ballstørrelsen ved vindusendring:
window.addEventListener('resize', updateBallSizes);

function createWorld() {

    let ballSizeVW = 15; // Størrelse i vw (f.eks. 10vw)
    let ballSize = (ballSizeVW / 100) * window.innerWidth; // Konverter til piksler

    gameObjects = [
        new Ball(100, 50, 50, 0, ballSize / 2, 'pictures/index/benk.jpg'),
        new Ball(400, 100, -50, 0, ballSize / 2, 'pictures/index/dørhåndtak.jpg'),
        new Ball(700, 150, 0, 50, ballSize / 2, 'pictures/index/ludo.jpg'),
        new Ball(900, 200, 30, 30, ballSize / 2, 'pictures/index/magnetholder.jpg'),
        new Ball(1100, 250, -30, 40, ballSize / 2, 'pictures/index/oval.jpg', 'oval.html')
    ];
}

// Kollisjonsdeteksjon mellom to baller
function rectIntersect(x1, y1, r1, x2, y2, r2) {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < r1 + r2;
}

const ballBounceFactor = 0.9; // 1.0 = perfect bounce, <1.0 = energy loss

function detectCollisions() {
    let obj1, obj2;
    for (let i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j];
            if (rectIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt(vCollision.x ** 2 + vCollision.y ** 2);
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};

                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                if (speed < 0) continue;

                let impulse = (2 * speed) / (obj1.mass + obj2.mass);
                obj1.vx -= impulse * obj2.mass * vCollisionNorm.x * ballBounceFactor;
                obj1.vy -= impulse * obj2.mass * vCollisionNorm.y * ballBounceFactor;
                obj2.vx += impulse * obj1.mass * vCollisionNorm.x * ballBounceFactor;
                obj2.vy += impulse * obj1.mass * vCollisionNorm.y * ballBounceFactor;
            }
        }
    }
}

let containerWidth = window.innerWidth;
let containerHeight = window.innerHeight 

window.addEventListener('resize', () => {
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight 
});
const bounceFactor = 0.7; // 1.0 = perfect bounce, <1.0 = loses energy

function detectEdgeCollisions() {
    for (let obj of gameObjects) {
        if (obj.x < obj.radius) {
            obj.vx = Math.abs(obj.vx) * bounceFactor;
            obj.x = obj.radius;
        } else if (obj.x > containerWidth - obj.radius) {
            obj.vx = -Math.abs(obj.vx) * bounceFactor;
            obj.x = containerWidth - obj.radius;
        }

        if (obj.y < obj.radius) {
            obj.vy = Math.abs(obj.vy) * bounceFactor;
            obj.y = obj.radius;
        } else if (obj.y > containerHeight - obj.radius) {
            obj.vy = -Math.abs(obj.vy) * bounceFactor;
            obj.y = containerHeight - obj.radius;
        }
    }
}

// Spillsløyfe
let lastTime = 0;

function gameLoop(timestamp) {
    let secondsPassed = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    detectEdgeCollisions();
    detectCollisions();

    for (let obj of gameObjects) {
        obj.update(secondsPassed);
    }

    requestAnimationFrame(gameLoop);
}

// Start spillet
createWorld();
requestAnimationFrame(gameLoop);