// Class to handle the form step and dot navigation
class FormStepper {
    constructor() {
        // Initial selected state value
        this.selectedState = 1;

        // Select all dots, form steps, next button, and checkbox
        this.dots = document.querySelectorAll('.dot');
        this.steps = document.querySelectorAll('.step');
        this.nextButton = document.getElementById('next-button');
        this.checkbox = document.getElementById('agree-checkbox');

        // Bind methods to the class instance
        this.updateDots = this.updateDots.bind(this);
        this.updateSteps = this.updateSteps.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);

        // Initialize the form stepper
        this.initialize();
    }

    // Method to update the state of the dots based on selectedState
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.selectedState - 1) {
                dot.style.backgroundColor = 'rgba(51, 51, 51, 1)';
            } else {
                dot.style.backgroundColor = '#33333344';
            }
        });
    }

    // Method to show the current step based on selectedState
    updateSteps() {
        this.steps.forEach((step, index) => {
            if (index === this.selectedState - 1) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        });
    }

    // Method to handle the click event on the next button
    handleNextButtonClick() {
        // Check if the checkbox is checked on the first step
        if (this.selectedState === 1 && !this.checkbox.checked) {
            alert('Agree first.');
            return; // Exit the function if checkbox is not checked
        }
        // Increment selectedState, wrap around if it exceeds the number of steps
        this.selectedState = (this.selectedState % this.steps.length) + 1;
        // Update the dots' appearance and visible form step
        this.updateDots();
        this.updateSteps();
    }

    // Method to initialize the form stepper
    initialize() {
        // Set the initial state of dots and steps
        this.updateDots();
        this.updateSteps();

        // Add click event listener to the button to change the selected state
        this.nextButton.addEventListener('click', this.handleNextButtonClick);
    }
}

// Create an instance of FormStepper to initialize and manage form navigation
const formStepper = new FormStepper();
