const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const popup = document.getElementById('popup');
const overlay = document.getElementById('popup-overlay');

// Open the pop-up when either button is clicked
loginButton.addEventListener('click', () => {
  popup.style.display = 'block';
  overlay.style.display = 'block';
});

registerButton.addEventListener('click', () => {
  popup.style.display = 'block';
  overlay.style.display = 'block';
});

// Close the pop-up by clicking anywhere on the overlay
overlay.addEventListener('click', () => {
  popup.style.display = 'none';
  overlay.style.display = 'none';
});
