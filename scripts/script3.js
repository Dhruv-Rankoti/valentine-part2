// Initialize Matter.js
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});

// Get references to the buttons
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const celebrationMessage = document.getElementById('celebration-message');
const imgElement = document.querySelector('img');
const images = ['img/image1.gif', 'img/image2.gif', 'img/image3.gif', 'img/image4.gif', 'img/image5.gif', 'img/image6.gif'];
let currentImageIndex = 0;

// Create invisible container boundaries
// Move ground exactly to bottom of screen
const walls = [
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 60, window.innerWidth, 60, { 
        isStatic: true,
        render: { visible: false }
    }),
    Bodies.rectangle(-40, window.innerHeight / 2, 60, window.innerHeight, { 
        isStatic: true,
        render: { visible: true }
    }),
    Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight, { 
        isStatic: true,
        render: { visible: false }
    })
];

World.add(world, walls);

// Start the engine
Engine.run(engine);
Render.run(render);

// Store physics buttons
let physicsButtons = [];

noButton.addEventListener('click', () => {
    createPhysicsButtons();
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        imgElement.src = images[currentImageIndex];
    }
});

yesButton.addEventListener('click', () => {
    celebrationMessage.classList.remove('hidden');
    clearPhysicsButtons();
    imgElement.src = 'img/image7.gif';
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.style.display = 'none';
});

function createPhysicsButtons() {
    for (let i = 0; i < 30; i++) {
        // Create visual button with exact same style as original
        const visualButton = document.createElement('button');
        visualButton.innerText = 'Yes';
        visualButton.style.cssText = `
            position: absolute;
            background-color: #ff69b4;
            border: 1px solid #d5006d;
            color: white;
            border-radius: 5px;
            padding: 15px 30px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s;
            z-index: 100;
            pointer-events: auto;
            width: auto;
            height: auto;
            transform-origin: center;
        `;
        document.body.appendChild(visualButton);

        // Calculate button dimensions after it's added to DOM
        const buttonRect = visualButton.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

        // Create physics body matching button size
        const x = Math.random() * (window.innerWidth - buttonWidth) + buttonWidth/2;
        const physicsButton = Bodies.rectangle(x, -50 - (i * 10), buttonWidth, buttonHeight, {
            restitution: 0.6,
            friction: 0.3,
            density: 0.002,
            render: {
                visible: false
            }
        });

        // Store reference to visual button
        physicsButton.visualElement = visualButton;

        // Set the visual button's initial position to match the physics button
        visualButton.style.left = `${x}px`;
        visualButton.style.top = `-50px`;

        // Add hover effects
        visualButton.addEventListener('mouseenter', () => {
            visualButton.style.transform = `scale(1.1) translate(${physicsButton.position.x - buttonWidth/2}px, ${physicsButton.position.y - buttonHeight/2}px) rotate(${physicsButton.angle}rad)`;
        });

        visualButton.addEventListener('mouseleave', () => {
            visualButton.style.transform = `translate(${physicsButton.position.x - buttonWidth/2}px, ${physicsButton.position.y - buttonHeight/2}px) rotate(${physicsButton.angle}rad)`;
        });

        // Add click handler
        visualButton.addEventListener('click', () => {
            imgElement.src = 'img/image7.gif';
            celebrationMessage.classList.remove('hidden');
            clearPhysicsButtons();
            const buttonContainer = document.querySelector('.button-container');
            buttonContainer.style.display = 'none';
        });

        World.add(world, physicsButton);
        physicsButtons.push(physicsButton);
    }

    // Update visual button positions
    Matter.Events.on(engine, 'afterUpdate', () => {
        physicsButtons.forEach(physicsButton => {
            if (physicsButton.visualElement) {
                const buttonRect = physicsButton.visualElement.getBoundingClientRect();
                const pos = physicsButton.position;
                const angle = physicsButton.angle;
                physicsButton.visualElement.style.transform = `translate(${0}px, ${pos.y}px) rotate(${angle}rad)`;
            }
        });
    });
}

function clearPhysicsButtons() {
    physicsButtons.forEach(button => {
        World.remove(world, button);
        if (button.visualElement) {
            button.visualElement.remove();
        }
    });
    physicsButtons = [];
}

// Handle window resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    
    // Update wall positions
    walls[0].position.x = window.innerWidth / 2;
    walls[0].position.y = window.innerHeight + 30; // Keep ground at bottom
    walls[2].position.x = window.innerWidth + 30;
});

// Add necessary styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    canvas {
        position: fixed !important;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 1;
    }

    .container {
        position: relative;
        z-index: 3;
    }
`;
document.head.appendChild(styleSheet);