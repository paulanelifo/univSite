import { RegistrationData } from "./registration.js";

class Navbar {
  constructor(navbarSelector) {
    this.navbar = document.querySelector(navbarSelector);
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleScroll() {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // If scrolling down, hide the navbar
    if (currentScroll > this.lastScrollTop) {
      this.navbar.style.top = "-10%"; // Adjust this value based on your navbar height
    } else {
      // If scrolling up, show the navbar
      this.navbar.style.top = "0";
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
  }
}
class PopupManager {
  constructor() {
    this.initAnchors();
    this.initLogin();
    this.initRegister();
    this.initLoginRegister();
    this.initCloseLogin();
  }

  initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  initLogin() {
    document
      .getElementById("login-button")
      .addEventListener("click", () => {
        document.getElementById("popup-overlay").style.display = "block";
        document.getElementById("login-container").style.display = "flex";
        document.body.style.overflow = "hidden";
        this.scrollToTop();
      });

    document
      .getElementById("popup-overlay")
      .addEventListener("click", () => {
        document.getElementById("popup-overlay").style.display = "none";
        document.getElementById("login-container").style.display = "none";
        document.getElementById("register-container").style.display = "none";
        document.body.style.overflow = "auto";
      });
  }

  initRegister() {
    document
      .getElementById("register-button")
      .addEventListener("click", () => {
        document.getElementById("popup-overlay").style.display = "block";
        document.getElementById("register-container").style.display = "flex";
        document.body.style.overflow = "hidden";
        this.scrollToTop();
      });
  }

  initLoginRegister() {
    document
      .getElementById("login-register-button")
      .addEventListener("click", () => {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("popup-overlay").style.display = "block";
        document.getElementById("register-container").style.display = "flex";
      });
  }

  initCloseLogin() {
    document
      .getElementById("login-button-x")
      .addEventListener("click", () => {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (localStorage.getItem(username) !== null) {
          if (password === localStorage.getItem(username)) {
            document.body.style.overflow = "auto";
            document.getElementById("popup-overlay").style.display = "none";
            document.getElementById("login-container").style.display = "none";
            document.getElementById("successful-login").style.animation =
              "fadeOut 1.5s ease";
          }
        }
      });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      "Mathematics",
    ];
    this.dots = document.querySelectorAll(".dot");
    this.steps = document.querySelectorAll(".step");
    this.nextButton = document.getElementById("next-button");
    this.closeButton = document.getElementById("close-button");
    this.prevButton = document.getElementById("prev-button");
    this.checkbox = document.getElementById("agree-checkbox");
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
    this.user_data = null;
    this.username = null;
    this.password = null;
  }

  initialize() {
    this.fillMajorChoices();
    this.updateDots();
    this.updateSteps();
    this.setupFamilyInfo();
    this.nextButton.addEventListener("click", this.handleNextButtonClick);
    this.prevButton.addEventListener("click", this.handlePrevButtonClick);
    this.closeButton.addEventListener("click", this.handleCloseButtonClick);
    this.error.addEventListener("animationend", this.handleErrorAnimationEnd);
  }

  // Step 1: Terms and Conditions
  handleStep1() {
    if (!this.checkbox.checked) {
      document.getElementById("error-title").innerHTML =
        "Agree to the terms and condition to proceed.";
      this.error.style.animation = "fadeOut 1.25s ease";
      return false;
    }
    return true;
  }

  // Step 2: Personal Information
  checkRequiredFields() {
    const currentStep = this.steps[this.selectedState - 1];
    const inputs = currentStep.querySelectorAll(
      "input[required], select[required]"
    );
    let allFilled = true;

    inputs.forEach((input) => {
      if (input.id === "email") {
        if (
          !input.value.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ) {
          allFilled = false;
          document.getElementById(
            "error-title"
          ).innerHTML = `Email is invalid!`;
          this.error.style.animation = "fadeOut 1.5s ease";
          input.classList.add("error");
          return;
        }
      }

      if (!input.value.trim()) {
        allFilled = false;
        document.getElementById(
          "error-title"
        ).innerHTML = `${input.name} is empty, fill it out!`;
        this.error.style.animation = "fadeOut 1.5s ease";
        input.classList.add("error");
        return;
      } else {
        input.classList.remove("error");
      }
    });

    return allFilled;
  }

  // Step 3: Academic Information
  fillMajorChoices() {
    const majorSelects = document.querySelectorAll(
      'select[id^="intended-major"]'
    );
    majorSelects.forEach((select) => {
      this.majors.forEach((major) => {
        const option = document.createElement("option");
        option.value = major;
        option.textContent = major;
        select.appendChild(option);
      });
    });
  }

  // Step 4: Family Information
  setupFamilyInfo() {
    const sameAsGuardianMotherCheckbox = document.getElementById(
      "same-as-guardian-mother"
    );
    const sameAsGuardianFatherCheckbox = document.getElementById(
      "same-as-guardian-father"
    );

    const guardianNameInput = document.getElementById("guardian-name");
    const guardianContactInput = document.getElementById("guardian-contact");
    const guardianAddressInput = document.getElementById("parent-address");
    const guardianOccupationInput =
      document.getElementById("parent-occupation");

    const motherContactInput = document.getElementById("mother-contact");
    const motherMaidenNameInput = document.getElementById("mother-maiden-name");
    const motherAddressInput = document.getElementById("mother-address");
    const motherOccupationInput = document.getElementById("mother-occupation");

    const fatherNameInput = document.getElementById("father-name");
    const fatherContactInput = document.getElementById("father-contact");
    const fatherAddressInput = document.getElementById("father-address");
    const fatherOccupationInput = document.getElementById("father-occupation");

    // Sync guardian's information with mother's if checkbox is checked
    sameAsGuardianMotherCheckbox.addEventListener("change", () => {
      const isChecked = sameAsGuardianMotherCheckbox.checked;
      if (isChecked) {
        motherMaidenNameInput.value = guardianNameInput.value;
        motherContactInput.value = guardianContactInput.value;
        motherAddressInput.value = guardianAddressInput.value;
        motherOccupationInput.value = guardianOccupationInput.value;
      } else {
        motherMaidenNameInput.value = "";
        motherContactInput.value = "";
        motherAddressInput.value = "";
        motherOccupationInput.value = "";
      }

      motherMaidenNameInput.disabled = isChecked;
      motherContactInput.disabled = isChecked;
      motherAddressInput.disabled = isChecked;
      motherOccupationInput.disabled = isChecked;
    });

    // Sync guardian's information with father's if checkbox is checked
    sameAsGuardianFatherCheckbox.addEventListener("change", () => {
      const isChecked = sameAsGuardianFatherCheckbox.checked;
      if (isChecked) {
        fatherNameInput.value = guardianNameInput.value;
        fatherContactInput.value = guardianContactInput.value;
        fatherAddressInput.value = guardianAddressInput.value;
        fatherOccupationInput.value = guardianOccupationInput.value;
      } else {
        fatherNameInput.value = "";
        fatherContactInput.value = "";
        fatherAddressInput.value = "";
        fatherOccupationInput.value = "";
      }

      fatherNameInput.disabled = isChecked;
      fatherContactInput.disabled = isChecked;
      fatherAddressInput.disabled = isChecked;
      fatherOccupationInput.disabled = isChecked;
    });

    // Add event listeners to sync guardian fields to mother fields in real-time
    guardianNameInput.addEventListener("input", () => {
      if (sameAsGuardianMotherCheckbox.checked) {
        motherMaidenNameInput.value = guardianNameInput.value;
      }
      if (sameAsGuardianFatherCheckbox.checked) {
        fatherNameInput.value = guardianNameInput.value;
      }
    });
    guardianContactInput.addEventListener("input", () => {
      if (sameAsGuardianMotherCheckbox.checked) {
        motherContactInput.value = guardianContactInput.value;
      }
      if (sameAsGuardianFatherCheckbox.checked) {
        fatherContactInput.value = guardianContactInput.value;
      }
    });
    guardianAddressInput.addEventListener("input", () => {
      if (sameAsGuardianMotherCheckbox.checked) {
        motherAddressInput.value = guardianAddressInput.value;
      }
      if (sameAsGuardianFatherCheckbox.checked) {
        fatherAddressInput.value = guardianAddressInput.value;
      }
    });
    guardianOccupationInput.addEventListener("input", () => {
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
      document.getElementById("error-title").innerHTML =
        "Password must be at least 8 in length.";
      this.error.style.animation = "fadeOut 1.5s ease";
      return false;
    }

    if (password.value != cpassword.value) {
      document.getElementById("error-title").innerHTML =
        "Password does not match!\nPlease try again.";
      this.error.style.animation = "fadeOut 1.5s ease";
      return false;
    }
    this.username = username.value;
    this.password = password.value;
    return true;
  }

  // Navigation
  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.style.backgroundColor =
        index === this.selectedState - 1 ? "rgba(51, 51, 51, 1)" : "#33333344";
    });
  }

  updateSteps() {
    if (this.selectedState !== 6)
      this.nextButton.textContent =
        this.selectedState === 5 ? "Register" : "Next";
    this.nextButton.style.fontWeight =
      this.selectedState === 5 ? "bold" : "normal";

    const activeStep = document.querySelector(".step.active");
    if (activeStep) {
      activeStep.classList.remove("active");
    }
    this.showNextStep();

    // Hide the previous button if on the first step
    if (this.selectedState === 1) {
      this.prevButton.style.display = "none"; // Hide the previous button
    } else {
      this.prevButton.style.display = "block"; // Show the previous button for other steps
    }
  }

  showNextStep() {
    const nextStep = this.steps[this.selectedState - 1];
    nextStep.classList.add("active");
  }

  //------------------------------------------------------------------
  saveRegistrationData() {
    const guardianInfo = {
      name: document.getElementById("guardian-name").value,
      contact: document.getElementById("guardian-contact").value,
      address: document.getElementById("parent-address").value,
      occupation: document.getElementById("parent-occupation").value,
    };

    const motherInfo = {
      maidenName: document.getElementById("mother-maiden-name").value,
      contact: document.getElementById("mother-contact").value,
      address: document.getElementById("mother-address").value,
      occupation: document.getElementById("mother-occupation").value,
    };

    const fatherInfo = {
      name: document.getElementById("father-name").value,
      contact: document.getElementById("father-contact").value,
      address: document.getElementById("father-address").value,
      occupation: document.getElementById("father-occupation").value,
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
      document.getElementById("full-name").value,
      document.getElementById("dob").value,
      document.getElementById("gender").value,
      document.getElementById("nationality").value,
      document.getElementById("civil-status").value,
      document.getElementById("phone-number").value,
      document.getElementById("email").value,
      document.getElementById("permanent-address").value,
      document.getElementById("current-address").value,
      guardianInfo,
      motherInfo,
      fatherInfo,
      academicInfo,
      document.getElementById("username").value,
      document.getElementById("password").value
    );

    const confirmation = document.getElementById("confirmation");
    const jsonified = newRegistration.JSONify();
    for (const [key, value] of Object.entries(jsonified)) {
      const dataLabel = document.createElement("label");
      dataLabel.setAttribute("for", key);
      dataLabel.setAttribute("class", "confirmation-data-label");
      dataLabel.innerText = key;
      confirmation.appendChild(dataLabel);
      if (key.includes("Info")) {
        for (const [info, _value] of Object.entries(jsonified[key])) {
          const data = document.createElement("input");
          const dataLabel = document.createElement("label");
          dataLabel.setAttribute("for", info);
          dataLabel.setAttribute("class", "confirmation-data-info-labael");
          dataLabel.innerText = info;
          data.setAttribute("type", "text");
          data.setAttribute("class", "confirmation-data");
          data.setAttribute("name", info);
          data.setAttribute("placeholder", _value);
          data.setAttribute("disabled", true);
          confirmation.appendChild(dataLabel);
          confirmation.appendChild(data);
        }
      } else {
        const data = document.createElement("input");
        data.setAttribute("type", "text");
        data.setAttribute("class", "confirmation-data");
        data.setAttribute("name", key);
        data.setAttribute("placeholder", value);
        data.setAttribute("disabled", true);
        confirmation.appendChild(data);
      }
    }
    this.nextButton.innerText = "Confirm";
    this.user_data = jsonified;
  }

  //--------------------------------------------------------

  handleErrorAnimationEnd() {
    this.error.style.animation = "";
  }

  handleNextButtonClick() {
    if (this.nextButton.innerText === "Confirm") {
      document.getElementById("error-title").innerHTML =
        "Account successfully registered.";
      this.error.style.animation = "fadeOut 1.5s ease";
      document.getElementById("popup-overlay").style.display = "none";
      document.getElementById("register-container").style.display = "none"; // Use flex to maintain centering
      localStorage.setItem(this.username, this.password);
      localStorage.setItem(`${this.username}-data`, this.user_data);
      return;
    }

    if (this.selectedState === 1) {
      if (!this.handleStep1()) {
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
    document.getElementById("popup-overlay").style.display = "none";
    document.getElementById("register-container").style.display = "none";
    document.body.style.overflow = "auto";
  }
}
class Carousel {
  constructor(carouselSelector, arrowSelector) {
      this.carousel = document.querySelector(carouselSelector);
      this.firstImg = this.carousel.querySelectorAll("img")[0];
      this.arrowIcons = document.querySelectorAll(arrowSelector);
      this.isDragStart = false;
      this.isDragging = false;
      this.prevPageX = 0;
      this.prevScrollLeft = 0;
      this.positionDiff = 0;

      this.init();
  }

  init() {
      this.arrowIcons.forEach(icon => {
          icon.addEventListener("click", () => this.arrowClick(icon));
      });

      this.carousel.addEventListener("mousedown", (e) => this.dragStart(e));
      this.carousel.addEventListener("touchstart", (e) => this.dragStart(e));
      document.addEventListener("mousemove", (e) => this.dragging(e));
      this.carousel.addEventListener("touchmove", (e) => this.dragging(e));
      document.addEventListener("mouseup", () => this.dragStop());
      this.carousel.addEventListener("touchend", () => this.dragStop());
  }

  showHideIcons() {
      let scrollWidth = this.carousel.scrollWidth - this.carousel.clientWidth;
      this.arrowIcons[0].style.display = this.carousel.scrollLeft == 0 ? "none" : "block";
      this.arrowIcons[1].style.display = this.carousel.scrollLeft == scrollWidth ? "none" : "block";
  }

  arrowClick(icon) {
      let firstImgWidth = this.firstImg.clientWidth + 14;
      this.carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
      setTimeout(() => this.showHideIcons(), 60);
  }

  autoSlide() {
      if (this.carousel.scrollLeft - (this.carousel.scrollWidth - this.carousel.clientWidth) > -1 || this.carousel.scrollLeft <= 0) return;

      this.positionDiff = Math.abs(this.positionDiff);
      let firstImgWidth = this.firstImg.clientWidth + 14;
      let valDifference = firstImgWidth - this.positionDiff;

      if (this.carousel.scrollLeft > this.prevScrollLeft) {
          return this.carousel.scrollLeft += this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff;
      }

      this.carousel.scrollLeft -= this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff;
  }

  dragStart(e) {
      this.isDragStart = true;
      this.prevPageX = e.pageX || e.touches[0].pageX;
      this.prevScrollLeft = this.carousel.scrollLeft;
  }

  dragging(e) {
      if (!this.isDragStart) return;
      e.preventDefault();
      this.isDragging = true;
      this.carousel.classList.add("dragging");
      this.positionDiff = (e.pageX || e.touches[0].pageX) - this.prevPageX;
      this.carousel.scrollLeft = this.prevScrollLeft - this.positionDiff;
      this.showHideIcons();
  }

  dragStop() {
      this.isDragStart = false;
      this.carousel.classList.remove("dragging");

      if (!this.isDragging) return;
      this.isDragging = false;
      this.autoSlide();
  }
}

// instantiations

const navbar = new Navbar(".navbar");

document.addEventListener("DOMContentLoaded", () => {new PopupManager();});

new FormStepper();

const myCarousel = new Carousel(".carousel", ".wrapper i");
