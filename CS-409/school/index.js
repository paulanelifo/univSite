let mousePosition = {
    x: window.innerWidth / 2 - 25,
    y: window.innerHeight / 2 - 25
}
let hovered_building = null
const FPS = 60
const INTERVAL = 1000 / FPS
const BUILDING_ID = {
    REGISTRATION: 1,
    ABOUT: 2,
    VISION_MISSION: 3,
}

const form = document.getElementById("register-container")

class Building {
    constructor(x, y, width, height, fillStyle, building_id=0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle
        this.building_id = building_id
    }

    draw(ctx) {
        ctx.save()
        ctx.fillStyle = this.fillStyle
        ctx.strokeStyle = '#000'
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
}

let Main = {
    Block: document.getElementById('Block'),
    canvas: document.getElementById('canvas'),
    menu: function() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.user_color = '#2596be';
        this.ctx = this.canvas.getContext('2d')
        window.addEventListener('mousemove', function(e) {
            mousePosition.x = e.pageX
            mousePosition.y = e.pageY
        })
        window.addEventListener('ontouchmove', function(e) {
            mousePosition.x = e.pageX
            mousePosition.y = e.pageY
        })
        window.addEventListener('keydown', function(e) {
            let key = (e.key.length > 1) ? e.key : e.key.toLowerCase();

            if (key === "e") {
                if (hovered_building.building_id === BUILDING_ID.REGISTRATION) this.window.location = '/registration/'
                if (hovered_building.building_id === BUILDING_ID.ABOUT) this.window.location = '/about/'
            } 
        })
        this.buildings = [
            new Building(0, 0, 200, 200, '#88be22'),
            new Building(500, 0, 300, 300, '#88be22'),
            new Building(this.canvas.width/2 - 200, this.canvas.height - 200, 200, 200, '#88be22', BUILDING_ID.ABOUT),
            
            new Building(this.canvas.width/2 + 100, this.canvas.height - 200, 200, 200, '#88be22', BUILDING_ID.REGISTRATION),
        ]
        loop()
    },
    draw_user: function() {
        this.ctx.save()
        this.ctx.fillStyle = Main.user_color
        const width = 50
        const height = 50
        this.ctx.fillRect(mousePosition.x - width / 2, mousePosition.y - height / 2, width, height)
        this.ctx.restore()
    },
    load_buildings: function() {
        for (let building of this.buildings) {
            building.draw(this.ctx)
        }
    }
}

function checkIfUserInBuilding() {
    const ux = mousePosition.x
    const uy = mousePosition.y
    const width = 50;
    const height = 50;
    const tooltip = document.getElementById('tooltip')
    tooltip.style.width = `${width}px`

    for (let building of Main.buildings) {
        if (
            ux + width / 2 >= building.x &&
            ux - width / 2 <= building.x + building.width &&
            uy - height / 2 <= building.y + building.height &&
            uy + height / 2 >= building.y
        ) {
            tooltip.style.opacity = 1
            tooltip.style.visibility = 'visible'
            tooltip.style.top = `${mousePosition.y - 60}px`
            tooltip.style.left = `${mousePosition.x - width / 2}px`
            Main.user_color = '#000000'
            hovered_building = building
            return
        } else {
            tooltip.style.opacity = 0
            tooltip.style.visibility = 'hidden'
            tooltip.style.top = `0px`
            tooltip.style.left = `0px`
            Main.user_color = '#2596be'
            hovered_building = null
        }
    }
}

function loop() {
    Main.ctx.clearRect(0, 0, Main.canvas.width, Main.canvas.height)
    requestAnimationFrame(loop)
    Main.load_buildings()
    checkIfUserInBuilding()
    Main.draw_user()
}

Main.menu()