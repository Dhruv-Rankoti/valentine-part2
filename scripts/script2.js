
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const celebrationMessage = document.getElementById('celebration-message');
const imgElement = document.querySelector('img');
const images = ['img/image1.gif', 'img/image2.gif', 'img/image3.gif', 'img/image4.gif', 'img/image5.gif', 'img/image6.gif']; // Array of image paths (excluding image7)
let currentImageIndex = 0;

// Function to grow Yes button
function growYesButton() {
    const currentSize = parseFloat(getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = (currentSize * 2.2) + 'px';
}

noButton.addEventListener('click', () => {
    growYesButton();
    const buttonContainer = document.querySelector('.button-container');
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
    }
    imgElement.src = images[currentImageIndex];
});

yesButton.addEventListener('click', () => {
    celebrationMessage.classList.remove('hidden');
    const buttonContainer = document.querySelector('.button-container');
    imgElement.src = 'img/image7.gif';
    celebrationMessage.classList.remove('hidden');
    buttonContainer.style.display = 'none';
});
