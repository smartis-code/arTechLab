const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Oggetto per memorizzare la posizione del mouse
const mouse = {
    x: null,
    y: null,
    radius: 150 // Raggio d'azione del campo di forza
};

// Ascoltiamo i movimenti del mouse sulla finestra
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Quando il mouse esce dalla finestra, azzeriamo le coordinate
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 2;
        this.color = `hsl(${Math.random() * 60 + 260}, 80%, 70%)`;
    }

    update() {
        // --- INTERATTIVITÀ CON IL MOUSE (Campo di Forza) ---
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Se il mouse è vicino alla particella, la respingiamo
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                
                // Spingiamo la particella lontano dal cursore
                this.x -= forceDirectionX * force * 5;
                this.y -= forceDirectionY * force * 5;
            }
        }

        // Movimento normale basato sui vettori di velocità
        this.x += this.vx;
        this.y += this.vy;

        // Rimbalzo sui bordi dello schermo
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const particlesArray = [];
const numberOfParticles = 200;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

function animate() {
    // Sfondo semitrasparente per l'effetto motion blur
    ctx.fillStyle = 'rgba(11, 11, 16, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();