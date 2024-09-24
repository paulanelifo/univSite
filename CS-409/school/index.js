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
    PROGRAM_OFFERS: 3,
    ADMISSION: 4
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
        this.background_image = new Image()
        this.background_image.src = '/school/school.png'
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
                if (hovered_building.building_id === BUILDING_ID.ADMISSION) this.window.location = '/admission/'
                if (hovered_building.building_id === BUILDING_ID.PROGRAM_OFFERS) this.window.location = '/program_offers/'
            } 
        })

        let ratio = {
            width: 1920 / this.canvas.width,
            height: 1080 / this.canvas.height
        }
        const building_size = {
            width: 550,
            height: 270
        }

        this.buildings = [
            new Building(10 / ratio.width, 10 / ratio.height, building_size.width / ratio.width, building_size.height / ratio.height, '#88be22', BUILDING_ID.ABOUT),
            new Building(window.innerWidth - 10 * ratio.width - building_size.width / ratio.width, 10 / ratio.height, building_size.width / ratio.width, building_size.height / ratio.height, '#88be22', BUILDING_ID.PROGRAM_OFFERS),

            new Building(10 / ratio.width, window.innerHeight - 10 * ratio.height - building_size.height / ratio.height, building_size.width / ratio.width, building_size.height / ratio.height, '#88be22', BUILDING_ID.ADMISSION),
            new Building(window.innerWidth - 10 * ratio.width - building_size.width / ratio.width, window.innerHeight - 10 * ratio.height - building_size.height / ratio.height, building_size.width / ratio.width, building_size.height / ratio.height, '#88be22', BUILDING_ID.REGISTRATION),
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
    Main.ctx.drawImage(Main.background_image, 0, 0, Main.canvas.width, Main.canvas.height)
    Main.load_buildings()
    checkIfUserInBuilding()
    Main.draw_user()
}
if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        window.location = '/about'
    } else {
        Main.menu()
    }