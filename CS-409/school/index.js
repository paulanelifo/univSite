let mousePosition = {
    x: window.innerWidth / 2 - 25,
    y: window.innerHeight / 2 - 25
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
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.stroke()
        ctx.restore()
    }
}

class RegistrationData {
    constructor(fullName, dob, gender, nationality, civilStatus, phoneNumber, email, permanentAddress, currentAddress, guardianInfo, motherInfo, fatherInfo) {
        this.fullName = fullName;
        this.dob = dob;
        this.gender = gender;
        this.nationality = nationality;
        this.civilStatus = civilStatus;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.permanentAddress = permanentAddress;
        this.currentAddress = currentAddress;
        this.guardianInfo = guardianInfo;
        this.motherInfo = motherInfo;
        this.fatherInfo = fatherInfo;
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
        this.prevButton = document.getElementById('prev-button');
        this.closeButton = document.getElementById('close-button');
        this.checkbox = document.getElementById('agree-checkbox');

        // Bind methods
        this.updateDots = this.updateDots.bind(this);
        this.updateSteps = this.updateSteps.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
        this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this);

        // Initialize the stepper
        this.initialize();
        this.registrations = []; // Initialize the array
    }

    initialize() {
        this.fillMajorChoices();
        this.updateDots();
        this.updateSteps();
        this.setupFamilyInfo();
        this.nextButton.addEventListener('click', this.handleNextButtonClick);
        this.closeButton.addEventListener('click', this.handleCloseButtonClick);
        this.prevButton.addEventListener('click', this.handlePrevButtonClick);
    }

    // Step 1: Terms and Conditions
    handleStep1() {
        if (!this.checkbox.checked) {
            alert('Agree first.');
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
            // Check if the input is for the father and if "N/A" is checked
            if (input.id === 'father-name' || input.id === 'father-contact') {
                const fatherNaCheckbox = document.getElementById('father-na-checkbox');
                if (fatherNaCheckbox.checked) {
                    return; // Skip validation for father fields if N/A is checked
                }
            }
    
            if (!input.value.trim()) {
                allFilled = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
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
        const sameAsGuardianCheckbox = document.getElementById('same-as-guardian');
        const fatherNaCheckbox = document.getElementById('father-na-checkbox');

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
        sameAsGuardianCheckbox.addEventListener('change', () => {
            const isChecked = sameAsGuardianCheckbox.checked;
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

        // Add event listeners to sync guardian fields to mother fields in real-time
        guardianNameInput.addEventListener('input', () => {
            if (sameAsGuardianCheckbox.checked) {
                motherMaidenNameInput.value = guardianNameInput.value;
            }
        });
        guardianContactInput.addEventListener('input', () => {
            if (sameAsGuardianCheckbox.checked) {
                motherContactInput.value = guardianContactInput.value;
            }
        });
        guardianAddressInput.addEventListener('input', () => {
            if (sameAsGuardianCheckbox.checked) {
                motherAddressInput.value = guardianAddressInput.value;
            }
        });
        guardianOccupationInput.addEventListener('input', () => {
            if (sameAsGuardianCheckbox.checked) {
                motherOccupationInput.value = guardianOccupationInput.value;
            }
        });

        // Disable father fields if father is N/A
        fatherNaCheckbox.addEventListener('change', () => {
            const isChecked = fatherNaCheckbox.checked;
            fatherNameInput.disabled = isChecked;
            fatherContactInput.disabled = isChecked;
            fatherAddressInput.disabled = isChecked;
            fatherOccupationInput.disabled = isChecked;

            if (isChecked) {
                fatherNameInput.value = '';
                fatherContactInput.value = '';
                fatherAddressInput.value = '';
                fatherOccupationInput.value = '';
            }
        });
    }

    // Navigation
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.style.backgroundColor = index === this.selectedState - 1 ? 'rgba(51, 51, 51, 1)' : '#33333344';
        });
    }

    updateSteps() {
        this.nextButton.textContent = this.selectedState === 4 ? 'Register' : 'Next';
        this.nextButton.style.fontWeight = this.selectedState === 4 ? 'bold' : 'normal';

        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            activeStep.classList.remove('active');
        }
        this.showNextStep();
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
            fatherInfo
        );

        // Assuming you have an array to hold registrations
        this.registrations.push(newRegistration);
        this.saveToJSONFile();
    }

    saveToJSONFile() {
        const data = JSON.stringify(this.registrations, null, 2);
        // This is a placeholder for saving the JSON file
        console.log(data); // You would typically send this to your server to save
    }

    //--------------------------------------------------------

    handleNextButtonClick() {
        if (this.selectedState === 1 && !this.handleStep1()) {
            return;
        }
        if (!this.checkRequiredFields()) {
            alert('Please fill out all required fields.');
            return;
        }

        if (this.selectedState === 4) {
            this.saveRegistrationData(); // Save data on the last step
            return;
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
        this.founder_image = new Image()
        this.founder_image.src = '/school/founder.png'
        window.addEventListener('mousemove', function(e) {
            mousePosition.x = e.pageX
            mousePosition.y = e.pageY
        })
        window.addEventListener('ontouchmove', function(e) {
            mousePosition.x = e.pageX
            mousePosition.y = e.pageY
        })
        window.addEventListener('mousedown', function(e) {
            if (form.style.visibility === 'visible' || !hovered_building) return
            if (hovered_building.building_id === BUILDING_ID.REGISTRATION) {
                // this.window.location = '/registration/'
                form.style.visibility = 'visible'
                user_move = false
            }
            if (hovered_building.building_id === BUILDING_ID.ABOUT) this.window.location = '/about/'
            if (hovered_building.building_id === BUILDING_ID.ADMISSION) this.window.location = '/admission/'
            if (hovered_building.building_id === BUILDING_ID.PROGRAM_OFFERS) this.window.location = '/program_offers/'
            if (hovered_building.building_id === BUILDING_ID.HOME) this.window.location = '/'
        })
        window.addEventListener('keydown', function(e) {
            let key = (e.key.length > 1) ? e.key : e.key.toLowerCase();

            if (key === "e") {
                if (form.style.visibility === 'visible' || !hovered_building) return
                if (hovered_building.building_id === BUILDING_ID.REGISTRATION) {
                    // this.window.location = '/registration/'
                    form.style.visibility = 'visible'
                    user_move = false
                }
                if (hovered_building.building_id === BUILDING_ID.ABOUT) this.window.location = '/about/'
                if (hovered_building.building_id === BUILDING_ID.ADMISSION) this.window.location = '/admission/'
                if (hovered_building.building_id === BUILDING_ID.PROGRAM_OFFERS) this.window.location = '/program_offers/'
                if (hovered_building.building_id === BUILDING_ID.HOME) this.window.location = '/'
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

            new Building(window.innerWidth / 2 - (building_size.width - 150) / ratio.width / 2 , window.innerHeight + 10 * ratio.height - building_size.height / ratio.height, (building_size.width - 150) / ratio.width, building_size.height / ratio.height - 15 / ratio.height, '#88be22', BUILDING_ID.HOME),

            new Building(10 / ratio.width, window.innerHeight - 10 * ratio.height - building_size.height / ratio.height, building_size.width / ratio.width, building_size.height / ratio.height, '#88be22', BUILDING_ID.ADMISSION),
            new Building(window.innerWidth - 10 * ratio.width - building_size.width / ratio.width, window.innerHeight - 10 * ratio.height - building_size.height / ratio.height, building_size.width / ratio.width, building_size.height / ratio.height, '#88be22', BUILDING_ID.REGISTRATION),
        ]
        new FormStepper();
        loop()
    },
    draw_user: function() {
        if (!user_move) return
        this.ctx.save()
        const width = 100
        const height = 100
        this.ctx.drawImage(this.founder_image, mousePosition.x - width / 2, mousePosition.y - height / 2, width, height)
        this.ctx.restore()
    }
}

function checkIfUserInBuilding() {
    if (!user_move) return
    const ux = mousePosition.x
    const uy = mousePosition.y
    const width = 100;
    const height = 100;
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
    Main.ctx.clearRect(0, 0, Main.canvas.width, Main.canvas.height)
    requestAnimationFrame(loop)
    Main.ctx.drawImage(Main.background_image, 0, 0, Main.canvas.width, Main.canvas.height)
    for (let building of Main.buildings) {
        building.draw(Main.ctx)
    }
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