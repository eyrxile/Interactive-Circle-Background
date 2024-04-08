function create(type) {
    return document.createElementNS("http://www.w3.org/2000/svg", type)
}

let w //width
let h //height
let diag //diagonal
let time = 0 //beginning time
const init = Date.now()
const svg = create("svg")
let count = 5
document.body.appendChild(svg)
function createCircle(cx, cy, r){
    return ` M ${cx} ${cy}
        m ${-r}, 0
        a ${r},${r} 0 1,1 ${r * 2},0
        a ${r},${r} 0 1,1 ${-r * 2},0 `
}

const path = create('path')
path.setAttribute('fill-rule', 'evenodd')

svg.appendChild(path)
const radius = 100
const min = .2
function draw(){
    const circles = []
    for(let i = 0; i < count; i++){
        const ii = i / count + time / count * 2/3
        const ang = ii * Math.PI * 2
        const cos = Math.cos(ang) * 2
        const sin = Math.sin(ang)
        const c = 1/Math.tan(ang / 2)
        const x = cos * radius
        const y = sin * radius
        circles.push([w/2 + x, h / 2 + y + 30 * c, 30 * c])
    }
    if(Math.floor(time * 2/3) % 2)
        circles.push([w / 2, h / 2, diag / 2])

    path.setAttribute("d", circles.map(c => createCircle(...c)).join(' '))
    const r = -time * 70
    path.setAttribute('transform', `rotate(${r}, ${w/2}, ${h/2})`)
}

function loop() {
    time = (Date.now() - init) / 1000
    draw()
    window.requestAnimationFrame(loop)
}

function resize() {
    w = window.innerWidth
    h = window.innerHeight
    diag = Math.hypot(w, h)
    draw()
}

window.addEventListener('wheel', e => {
    e.preventDefault()
    count = Math.max(1, count + Math.sign(e.deltaY))
    draw()
})

path.addEventListener('click', (e) => {
    e.stopPropagation()
    svg.style.fill = `hsl(${Math.random()*360}, 100%, ${Math.random()*20+30}%)`
})

path.dispatchEvent(new Event('click'))
document.body.addEventListener('click', (e) => {
    e.stopPropagation()
    document.body.style.backgroundColor = `hsl(${Math.random()*360}, 100%, ${Math.random()*20}%)`
})

window.addEventListener('resize', resize)
resize()
loop()