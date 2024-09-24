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
        this.checkbox = document.getElementById('agree-checkbox');

        // Bind methods
        this.updateDots = this.updateDots.bind(this);
        this.updateSteps = this.updateSteps.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
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
}

// Initialize the form stepper
const formStepper = new FormStepper();
