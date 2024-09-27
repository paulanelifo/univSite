import { RegistrationData } from '../registration.js'

let mousePosition = {
    x: 0,
    y: 0
}
let user_move = true
let hovered_building = null
const FPS = 60
const INTERVAL = 1000 / FPS
const BUILDING_ID = {
    REGISTRATION: 1,
    ABOUT: 2,
    PROGRAM_OFFERS: 3,
    ADMISSION: 4,
    HOME: 5
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
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.stroke()
        ctx.restore()
    }
}

class FormStepper {
    
    constructor() {
        this.selectedState = 1;
        this.majors = [
            "Computer Science",
            "Engineering",
            "Business Administration",
            "Psychology",
            "Biology",
            "Nursing",
            "Art",
            "Mathematics"
        ];
        this.dots = document.querySelectorAll('.dot');
        this.steps = document.querySelectorAll('.step');
        this.nextButton = document.getElementById('next-button');
        this.closeButton = document.getElementById('close-button');
        this.prevButton = document.getElementById('prev-button');
        this.checkbox = document.getElementById('agree-checkbox');
        this.error = document.getElementById("error");

        // Bind methods
        this.updateDots = this.updateDots.bind(this);
        this.updateSteps = this.updateSteps.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this);
        this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
        this.handleErrorAnimationEnd = this.handleErrorAnimationEnd.bind(this);
        
        // Initialize the stepper
        this.initialize();
        this.registrations = []; // Initialize the array
        this.user_data = null
        this.username = null        
        this.password = null        
    }

    initialize() {
        this.fillMajorChoices();
        this.updateDots();
        this.updateSteps();
        this.setupFamilyInfo();
        this.nextButton.addEventListener('click', this.handleNextButtonClick);
        this.prevButton.addEventListener('click', this.handlePrevButtonClick);
        this.closeButton.addEventListener('click', this.handleCloseButtonClick);
        this.error.addEventListener('animationend', this.handleErrorAnimationEnd);
    }

    // Step 1: Terms and Conditions
    handleStep1() {
        if (!this.checkbox.checked) {
            document.getElementById("error-title").innerHTML = "Agree to the terms and condition to proceed."
            this.error.style.animation = 'fadeOut 1.25s ease'
            return false;
        }
        return true;
    }
    

    // Step 2: Personal Information
    checkRequiredFields() {
        const currentStep = this.steps[this.selectedState - 1];
        const inputs = currentStep.querySelectorAll('input[required], select[required]');
        let allFilled = true;
    
        inputs.forEach(input => {
            if (input.id === "email") {
                 if (!input.value.match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  )) {
                    allFilled = false;
                    document.getElementById("error-title").innerHTML = `Email is invalid!`
                    this.error.style.animation = 'fadeOut 1.5s ease'
                    input.classList.add("error");
                    return
                  }
            }

            if (!input.value.trim()) {

                allFilled = false;
                document.getElementById("error-title").innerHTML = `${input.name} is empty, fill it out!`
                this.error.style.animation = 'fadeOut 1.5s ease'
                input.classList.add("error");
                return
            } else {
                input.classList.remove("error");
            }
        });
    
        return allFilled;
    }
    

    // Step 3: Academic Information
    fillMajorChoices() {
        const majorSelects = document.querySelectorAll('select[id^="intended-major"]');
        majorSelects.forEach(select => {
            this.majors.forEach(major => {
                const option = document.createElement('option');
                option.value = major;
                option.textContent = major;
                select.appendChild(option);
            });
        });
    }

    // Step 4: Family Information
    setupFamilyInfo() {
        const sameAsGuardianMotherCheckbox = document.getElementById('same-as-guardian-mother');
        const sameAsGuardianFatherCheckbox = document.getElementById('same-as-guardian-father');

        const guardianNameInput = document.getElementById('guardian-name');
        const guardianContactInput = document.getElementById('guardian-contact');
        const guardianAddressInput = document.getElementById('parent-address');
        const guardianOccupationInput = document.getElementById('parent-occupation');

        const motherContactInput = document.getElementById('mother-contact');
        const motherMaidenNameInput = document.getElementById('mother-maiden-name');
        const motherAddressInput = document.getElementById('mother-address');
        const motherOccupationInput = document.getElementById('mother-occupation');

        const fatherNameInput = document.getElementById('father-name');
        const fatherContactInput = document.getElementById('father-contact');
        const fatherAddressInput = document.getElementById('father-address');
        const fatherOccupationInput = document.getElementById('father-occupation');

        // Sync guardian's information with mother's if checkbox is checked
        sameAsGuardianMotherCheckbox.addEventListener('change', () => {
            const isChecked = sameAsGuardianMotherCheckbox.checked;
            if (isChecked) {
                motherMaidenNameInput.value = guardianNameInput.value;
                motherContactInput.value = guardianContactInput.value;
                motherAddressInput.value = guardianAddressInput.value;
                motherOccupationInput.value = guardianOccupationInput.value;
            } else {
                motherMaidenNameInput.value = '';
                motherContactInput.value = '';
                motherAddressInput.value = '';
                motherOccupationInput.value = '';
            }

            motherMaidenNameInput.disabled = isChecked;
            motherContactInput.disabled = isChecked;
            motherAddressInput.disabled = isChecked;
            motherOccupationInput.disabled = isChecked;
        });

        // Sync guardian's information with father's if checkbox is checked
        sameAsGuardianFatherCheckbox.addEventListener('change', () => {
            const isChecked = sameAsGuardianFatherCheckbox.checked;
            if (isChecked) {
                fatherNameInput.value = guardianNameInput.value;
                fatherContactInput.value = guardianContactInput.value;
                fatherAddressInput.value = guardianAddressInput.value;
                fatherOccupationInput.value = guardianOccupationInput.value;
            } else {
                fatherNameInput.value = '';
                fatherContactInput.value = '';
                fatherAddressInput.value = '';
                fatherOccupationInput.value = '';
            }

            fatherNameInput.disabled = isChecked;
            fatherContactInput.disabled = isChecked;
            fatherAddressInput.disabled = isChecked;
            fatherOccupationInput.disabled = isChecked;
        });

        // Add event listeners to sync guardian fields to mother fields in real-time
        guardianNameInput.addEventListener('input', () => {
            if (sameAsGuardianMotherCheckbox.checked) {
                motherMaidenNameInput.value = guardianNameInput.value;
            }
            if (sameAsGuardianFatherCheckbox.checked) {
                fatherNameInput.value = guardianNameInput.value;
            }
        });
        guardianContactInput.addEventListener('input', () => {
            if (sameAsGuardianMotherCheckbox.checked) {
                motherContactInput.value = guardianContactInput.value;
            }
            if (sameAsGuardianFatherCheckbox.checked) {
                fatherContactInput.value = guardianContactInput.value;
            }
        });
        guardianAddressInput.addEventListener('input', () => {
            if (sameAsGuardianMotherCheckbox.checked) {
                motherAddressInput.value = guardianAddressInput.value;
            }
            if (sameAsGuardianFatherCheckbox.checked) {
                fatherAddressInput.value = guardianAddressInput.value;
            }
        });
        guardianOccupationInput.addEventListener('input', () => {
            if (sameAsGuardianMotherCheckbox.checked) {
                motherOccupationInput.value = guardianOccupationInput.value;
            }
            if (sameAsGuardianFatherCheckbox.checked) {
                fatherOccupationInput.value = guardianOccupationInput.value;
            }
        });
    }

    validateAccount() {
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const cpassword = document.getElementById("confirm-password");

        if (password.value.length < 8) {
            document.getElementById("error-title").innerHTML = "Password must be at least 8 in length."
            this.error.style.animation = 'fadeOut 1.5s ease'
            return false
        }

        if (password.value != cpassword.value) {
            document.getElementById("error-title").innerHTML = "Password does not match!\nPlease try again."
            this.error.style.animation = 'fadeOut 1.5s ease'
            return false
        }
        this.username = username.value
        this.password = password.value
        return true
    }

    // Navigation
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.style.backgroundColor = index === this.selectedState - 1 ? 'rgba(51, 51, 51, 1)' : '#33333344';
        });
    }

    updateSteps() {
        if (this.selectedState !== 6) this.nextButton.textContent = this.selectedState === 5 ? 'Register' : 'Next';
        this.nextButton.style.fontWeight = this.selectedState === 5 ? 'bold' : 'normal';
    
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            activeStep.classList.remove('active');
        }
        this.showNextStep();
    
        // Hide the previous button if on the first step
        if (this.selectedState === 1) {
            this.prevButton.style.display = 'none'; // Hide the previous button
        } else {
            this.prevButton.style.display = 'block'; // Show the previous button for other steps
        }
    }
    

    showNextStep() {
        const nextStep = this.steps[this.selectedState - 1];
        nextStep.classList.add('active');
    }

    //------------------------------------------------------------------
    saveRegistrationData() {
        const guardianInfo = {
            name: document.getElementById('guardian-name').value,
            contact: document.getElementById('guardian-contact').value,
            address: document.getElementById('parent-address').value,
            occupation: document.getElementById('parent-occupation').value,
        };

        const motherInfo = {
            maidenName: document.getElementById('mother-maiden-name').value,
            contact: document.getElementById('mother-contact').value,
            address: document.getElementById('mother-address').value,
            occupation: document.getElementById('mother-occupation').value,
        };

        const fatherInfo = {
            name: document.getElementById('father-name').value,
            contact: document.getElementById('father-contact').value,
            address: document.getElementById('father-address').value,
            occupation: document.getElementById('father-occupation').value,
        };

        const academicInfo = {
            name: document.getElementById("high-school-name").value,
            address: document.getElementById("high-school-address").value,
            gd: document.getElementById("high-school-graduation-date").value,
            gpa: document.getElementById("gpa-academic-honors").value,
            firstChoice: document.getElementById("intended-major1").value,
            secondChoice: document.getElementById("intended-major2").value,
            thirdChoice: document.getElementById("intended-major3").value,
            collegeInfo: document.getElementById("previous-college-info").value,
        };

        const newRegistration = new RegistrationData(
            document.getElementById('full-name').value,
            document.getElementById('dob').value,
            document.getElementById('gender').value,
            document.getElementById('nationality').value,
            document.getElementById('civil-status').value,
            document.getElementById('phone-number').value,
            document.getElementById('email').value,
            document.getElementById('permanent-address').value,
            document.getElementById('current-address').value,
            guardianInfo,
            motherInfo,
            fatherInfo,
            academicInfo,
            document.getElementById('username').value,
            document.getElementById('password').value
        );

        const confirmation = document.getElementById("confirmation")
        const jsonified = newRegistration.JSONify()
        for (const [key, value] of Object.entries(jsonified)) {
            const dataLabel = document.createElement("label")
            dataLabel.setAttribute("for", key)
            dataLabel.setAttribute("class", "confirmation-data-label")
            dataLabel.innerText = key
            confirmation.appendChild(dataLabel)
            if (key.includes("Info")) {
                for (const [info, _value] of Object.entries(jsonified[key])) {
                    const data = document.createElement("input")
                    const dataLabel = document.createElement("label")
                    dataLabel.setAttribute("for", info)
                    dataLabel.setAttribute("class", "confirmation-data-info-labael")
                    dataLabel.innerText = info
                    data.setAttribute("type", "text")
                    data.setAttribute("class", "confirmation-data")
                    data.setAttribute("name", info)
                    data.setAttribute("placeholder", _value)
                    data.setAttribute("disabled", true)
                    confirmation.appendChild(dataLabel)
                    confirmation.appendChild(data)
                }
            } else {
                const data = document.createElement("input")
                data.setAttribute("type", "text")
                data.setAttribute("class", "confirmation-data")
                data.setAttribute("name", key)
                data.setAttribute("placeholder", value)
                data.setAttribute("disabled", true)
                confirmation.appendChild(data)
            }
        }
        this.nextButton.innerText = "Confirm"
        this.user_data = jsonified
    }

    //--------------------------------------------------------

    handleErrorAnimationEnd() {
        this.error.style.animation = ''
    }

    handleNextButtonClick() {
        if (this.nextButton.innerText === "Confirm") {
            document.getElementById("error-title").innerHTML = "Account successfully registered."
            this.error.style.animation = 'fadeOut 1.5s ease'
            form.style.visibility = 'hidden'
            user_move = true
            Main.ongoing_registration = false
            localStorage.setItem(this.username, this.password)
            localStorage.setItem(`${this.username}-data`, this.user_data)
            return
        }

        if(this.selectedState===1){
            if(!this.handleStep1()){
                return;
            }
        }
        
        if (!this.checkRequiredFields()) {
            return;
        }

        if (this.selectedState === 5) {
            if (!this.validateAccount()) {
                return;
            }
            this.saveRegistrationData();
        }

        this.selectedState++;
        this.updateDots();
        this.updateSteps();
    }

    handlePrevButtonClick() {
        if (this.selectedState > 1) {
            this.selectedState--;
            this.updateDots();
            this.updateSteps();
        }
    }

    handleCloseButtonClick() {
        form.style.visibility = 'hidden'
        user_move = true
        Main.ongoing_registration = false
    }
}

let Main = {
    Block: document.getElementById('Block'),
    canvas: document.getElementById('canvas'),
    menu: function() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
                this.mobile = true
                this.canvas.width = window.outerWidth
                this.canvas.height = window.outerHeight / 1.5
                mousePosition.x = this.canvas.width / 2 - 100 / (1920 / this.canvas.width)
                mousePosition.y = this.canvas.height / 2 - 100 / (1080 / this.canvas.height)
            }
        this.user_color = '#2596be';
        this.ctx = this.canvas.getContext('2d')
        this.background_image = new Image()
        this.background_image.src = '/school/school.png'
        this.founder_image = new Image()
        this.founder_image.src = '/school/founder.png'
        this.ongoing_registration = false
        window.addEventListener('mousemove', function(e) {
            mousePosition.x = e.pageX
            mousePosition.y = e.pageY
        })
        window.addEventListener('ontouchmove', function(e) {
            mousePosition.x = e.pageX
            mousePosition.y = e.pageY
        })
        window.addEventListener('mousedown', function(e) {
            open_building()
        })
        window.addEventListener('keydown', function(e) {
            let key = (e.key.length > 1) ? e.key : e.key.toLowerCase();

            if (key === "e") {
                open_building()
            } 
        })

        this.ratio = {
            width: 1920 / this.canvas.width,
            height: 1080 / this.canvas.height
        }
        const building_size = {
            width: 550,
            height: 270
        }
        const edgeX = (this.mobile) ? this.canvas.width - building_size.width / this.ratio.width : this.canvas.width - 10 * this.ratio.width - building_size.width / this.ratio.width
        this.buildings = [
            new Building(10 / this.ratio.width, 10 / this.ratio.height, building_size.width / this.ratio.width, building_size.height / this.ratio.height, '#88be22', BUILDING_ID.ABOUT),
            new Building(edgeX, 10 / this.ratio.height, building_size.width / this.ratio.width, building_size.height / this.ratio.height, '#88be22', BUILDING_ID.PROGRAM_OFFERS),

            new Building(this.canvas.width / 2 - (building_size.width - 150) / this.ratio.width / 2 , this.canvas.height + 10 * this.ratio.height - building_size.height / this.ratio.height, (building_size.width - 150) / this.ratio.width, building_size.height / this.ratio.height - 15 / this.ratio.height, '#88be22', BUILDING_ID.HOME),

            new Building(10 / this.ratio.width, this.canvas.height - 10 * this.ratio.height - building_size.height / this.ratio.height, building_size.width / this.ratio.width, building_size.height / this.ratio.height, '#88be22', BUILDING_ID.ADMISSION),
            new Building(edgeX, this.canvas.height - 10 * this.ratio.height - building_size.height / this.ratio.height, building_size.width / this.ratio.width, building_size.height / this.ratio.height, '#88be22', BUILDING_ID.REGISTRATION),
        ]
        this.formstepper = new FormStepper();
        loop()
    },
    draw_user: function() {
        if (!user_move) return
        this.ctx.save()
        const width = 100 / this.ratio.width
        const height = 100 / this.ratio.height
        this.ctx.beginPath()
        this.ctx.drawImage(this.founder_image, mousePosition.x - width / 2, mousePosition.y - height / 2, width, height)
        this.ctx.restore()
    }
}

function open_building() {
    if (form.style.visibility === 'visible' || !hovered_building) return
    if (hovered_building.building_id === BUILDING_ID.REGISTRATION) {
        form.style.visibility = 'visible'
        user_move = false
        Main.ongoing_registration = true
    }
    if (hovered_building.building_id === BUILDING_ID.ABOUT) window.location = '/about/'
    if (hovered_building.building_id === BUILDING_ID.ADMISSION) window.location = '../#gallery-wrapper'
    if (hovered_building.building_id === BUILDING_ID.PROGRAM_OFFERS) window.location = '../#programs-offered'
    if (hovered_building.building_id === BUILDING_ID.HOME) window.location = '/'
}

function checkIfUserInBuilding() {
    if (!user_move) return
    const ux = mousePosition.x
    const uy = mousePosition.y
    const width = 100 / Main.ratio.width
    const height = 100 / Main.ratio.height
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
            tooltip.style.top = `${mousePosition.y - height}px`
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
    if (!Main.ongoing_registration) {
        Main.ctx.clearRect(0, 0, Main.canvas.width, Main.canvas.height)
        requestAnimationFrame(loop)
        Main.ctx.save()
        Main.ctx.beginPath()
        Main.ctx.drawImage(Main.background_image, 0, 0, Main.canvas.width, Main.canvas.height)
        Main.ctx.restore()
        for (let building of Main.buildings) {
            building.draw(Main.ctx)
        }
        checkIfUserInBuilding()
        Main.draw_user()
    } else {
        requestAnimationFrame(loop)
    }
}

Main.menu()
