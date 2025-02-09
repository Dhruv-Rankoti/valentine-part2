
const yesButton = document.getElementById('yes-button'); 
const imgElement = document.querySelector('img');
const images = ['img/image1.gif', 'img/image2.gif', 'img/image3.gif', 'img/image4.gif', 'img/image5.gif', 'img/image6.gif']; // Array of image paths (excluding image7)
let currentImageIndex = 0;

const noButton = document.getElementById('no-button');
const celebrationMessage = document.getElementById('celebration-message');

let yesButtonCount = 1;
let isBetweenDragAndClick = false;
let isDragging = false;
let currentlyDraggedButton = null;

// Add event listener for the Yes button
yesButton.addEventListener('click', () => {
    if(isBetweenDragAndClick) {
        isBetweenDragAndClick = false;
        return;
    }
    imgElement.src = 'img/image7.gif';
    celebrationMessage.classList.remove('hidden');
    clearButtons();
});

// Add event listener for the No button
noButton.addEventListener('click', () => {
    yesButtonCount *= 2;
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
    }
    imgElement.src = images[currentImageIndex];
    addYesButtons(yesButtonCount);
});

// Function to add Yes buttons based on count
function addYesButtons(count) {
    const buttonContainer = document.querySelector('.button-container');

    for (let i = 0; i < count; i++) {
        const newYesButton = document.createElement('button');
        newYesButton.textContent = 'Yes';
        newYesButton.addEventListener('click', () => {
            if(isBetweenDragAndClick) {
                isBetweenDragAndClick = false;
                return;
            }
            imgElement.src = 'img/image7.gif';
            celebrationMessage.classList.remove('hidden');
            clearButtons();
        });

        // Randomly position the Yes button
        newYesButton.style.position = 'absolute';
        newYesButton.style.top = Math.random() * (window.innerHeight - 50) + 'px';
        newYesButton.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        buttonContainer.appendChild(newYesButton);

        // Add transition classes
        newYesButton.classList.add('fade-in');
        setTimeout(() => {
            newYesButton.classList.add('show');
        }, 10);

        // Drag functionality
        newYesButton.onmousedown = function(event) {
            currentlyDraggedButton = newYesButton;
            currentlyDraggedButton.style.zIndex = '1000';
            let shiftX = event.clientX - newYesButton.getBoundingClientRect().left;
            let shiftY = event.clientY - newYesButton.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                const buttonRect = newYesButton.getBoundingClientRect();
                
                let newLeft = pageX - shiftX;
                let newTop = pageY - shiftY;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + buttonRect.width > window.innerWidth) newLeft = window.innerWidth - buttonRect.width;
                if (newTop + buttonRect.height > window.innerHeight) newTop = window.innerHeight - buttonRect.height;
                
                currentlyDraggedButton.style.left = newLeft + 'px';
                currentlyDraggedButton.style.top = newTop + 'px';
                isBetweenDragAndClick = true;
            }

            function onMouseMove(event) {
                if (isDragging) moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);
            isDragging = true;

            newYesButton.onmouseup = function() {
                currentlyDraggedButton.style.zIndex = '';
                currentlyDraggedButton = null;
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                newYesButton.onmouseup = null;
            };
        };
    }

    // Stop dragging when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}

// Function to clear all buttons from the screen
function clearButtons() {
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.innerHTML = '';
}
