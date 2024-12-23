// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#ffffff');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white'
ctx.lineWidth = 1;

class Particle {
    constructor (effect) {
        this.effect = effect;
        this.radius = 5 + Math.random() * 10;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - .5
        this.vy = Math.random() * 1 - .5
    }

    draw (ctx) {
        // ctx.fillStyle = `hsl(${this.x * .5},100%, 50%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }

    update () {
        this.x += this.vx
        this.y += this.vy
        if (this.x + this.radius > this.effect.width || this.x < this.radius) this.vx *= -1;
        if (this.y + this.radius > this.effect.height || this.y < this.radius) this.vy *= -1;
    }
}

class Effect {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.numberOfParticles = 150;
        this.createParticles()
    }

    createParticles () {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    handleParticles (ctx) {
        this.connectParticles(ctx)
        this.particles.forEach((particle) => {
            particle.update()
            particle.draw(ctx);
        })
    }
    connectParticles (ctx) {
        var maxDistance = 100
        for (let a=0; a<this.numberOfParticles; a++) {
            for(let b = a; b< this.particles.length; b++) {
                let pa = this.particles[a]
                let pb = this.particles[b]
                let dx = pa.x - pb.x
                let dy = pa.y - pb.y
                let dis = Math.hypot(dx, dy);
                if( dis < maxDistance ) {
                    ctx.beginPath();
                    ctx.moveTo(pb.x, pb.y);
                    ctx.lineTo(pa.x, pa.y)
                    ctx.stroke()
                }
            }
        }
    }
}

const effect = new Effect(canvas);
effect.handleParticles(ctx)

function animation () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx)
    requestAnimationFrame(animation)
}

requestAnimationFrame(animation)