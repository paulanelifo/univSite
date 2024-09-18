// Initial selected state value
let selectedState = 2;

// Select all dots
const dots = document.querySelectorAll('.dot');

// Function to update the state of the dots based on selectedState
function updateDots() {
    dots.forEach((dot, index) => {
        if (index === selectedState - 1) {
            // Set 100% opacity for the selected dot
            dot.style.backgroundColor = 'rgba(51, 51, 51, 1)';
        } else {
            // Set 20% opacity for other dots
            dot.style.backgroundColor = '#33333344';
        }
    });
}

// Add click event listener to change the selected state
// dots.forEach((dot, index) => {
//     dot.addEventListener('click', () => {
//         // Update selectedState to the clicked dot (1-based index)
//         selectedState = index + 1;
//         // Update the dots' appearance
//         updateDots();
//     });
// });

// Initial update to set the default state
updateDots();
