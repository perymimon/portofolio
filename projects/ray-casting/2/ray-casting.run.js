import {FrameEngine} from '../../_glossary/FrameEngine.js'
import Point from '../../_glossary/particles/Point.primitive.js'
import Segment from '../../_glossary/particles/Segment.primitive.js'
import Pointer from '../../_glossary/Pointer.js'
import {getProperty} from '../../_helpers/basic.js'
import {getRadialGradient} from '../../_helpers/cavas.basic.js'
import Light from '../Light.js'

var canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var walls = Array.from({length: 5}, (_) => {
    let p1 = new Point(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
    )
    let p2 = new Point(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
    )
    let wall = new Segment(p1, p2)
    wall.length = 60 + Math.random() * 150
    let speed = (Math.random() - 0.5) * 2
    let limit = Math.random() * 300
    for (let p of wall) {
        p.x.speed = speed
        p.x.max = p.x.value + limit
        p.x.min = p.x.value - limit
        p.x.onExceedBoundary = p.x.reflect.bind(p.x)
    }
    return wall
})


var light0 = new Light(canvas.width / 2, canvas.height / 2, {
    color: '--shade-0',
    boundaries: walls,
    beamDirection: 0,
    spread: Math.PI * 2,
    range: 300,
})


var light1 = new Light(0, 0, {
    color:  '--shade-1',
    boundaries: walls,
    beamDirection: -Math.PI / 4,
    spread: Math.PI / 3,
    range: 800,
})
var light2 = new Light(0, canvas.height, {
    color:  '--shade-2',
    boundaries: walls,
    beamDirection: Math.PI / 4,
    spread: Math.PI / 6,
    range: 800,
})

const mouse = new Pointer(canvas)
mouse.onMove = (mouse) => {
    light0.moveTo(mouse)
}

new FrameEngine(25, function () {
    // ctx.fillStyle = gradient0
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    walls.forEach(wall => wall.update())

    light0.update()
    light1.update()
    light2.update()
    ctx.save()
    ctx.globalAlpha = 0.4
    light0.draw(ctx)
    light1.draw(ctx)
    light2.draw(ctx)
    ctx.restore()
    walls.forEach(wall =>
        wall.draw(ctx, {
            strokeStyle: getProperty(ctx, '--color-secondary'),
            lineWidth: 8,
        }),
    )

}).start()
