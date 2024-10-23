let fruits = [
    '🍎', '🍌', '🍇', '🍒', '🍍', '🍉', 
    '🍓', '🍈', '🍋', '🍑', '🍏', '🥝', 
    '🥭', '🍊', '🥥', '🍆'
];

let firstCard = '';
let secondCard = '';
let hasFlippedCard = false;
let lockBoard = false;
let matchedCards = 0;
let timer = 0;
let score = 0;
let level = 1;
let interval;

const gameContainer = document.getElementById('game-container');
const levelSelection = document.getElementById('level-selection');
const restartBtn = document.getElementById('restart-btn');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const infoContainer = document.getElementById('info-container');
const levelButtons = document.querySelectorAll('.level-btn');

// Sound effects initialization
const flipSound = new Audio('flip.mp3');
const matchSound = new Audio('match.mp3');
const clapSound = new Audio('clap.mp3'); // Clapping sound for level completion
const tapSound = new Audio('tap.mp3'); // Tap sound for card flip
const buttonClickSound = new Audio('buttonClick.mp3'); // Button click sound
const beepSound = new Audio('beep.mp3'); // Beep sound for restart button

// Shuffle cards
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Create and display cards
function createCards(level) {
    let gridSize, cardSet, fruitCount;

    switch(level) {
        case 1:
            gridSize = 6; // 3 columns x 2 rows
            fruitCount = 3; // 3 different fruits
            break;

        case 2:
            gridSize = 12; // 3 columns x 4 rows
            fruitCount = 6; // 6 different fruits
            break;

        // Additional levels can be added here if needed
        default:
            gridSize = 6; // fallback to 3x2 if level is undefined
            fruitCount = 3;
    }

    // Get the required number of fruits and repeat them to fill the grid
    cardSet = fruits.slice(0, fruitCount).flatMap(fruit => [fruit, fruit]);
    
    // Make sure the total number of cards matches the grid size
    cardSet = cardSet.slice(0, gridSize);
    shuffle(cardSet);

    // Set grid layout
    gameContainer.style.gridTemplateColumns = `repeat(3, 100px)`;
    gameContainer.style.gridTemplateRows = `repeat(${gridSize / 3}, 100px)`; // Adjust rows according to gridSize

    cardSet.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.cardValue = card;

        // Event listener for flipping the card
        cardElement.addEventListener('click', flipCard);
        gameContainer.appendChild(cardElement);
    });
}

// Start the timer
function startTimer() {
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(interval);
}

// Flip the card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.cardValue;
    flipSound.play(); // Play flip sound
    tapSound.play(); // Play tap sound when card is clicked

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Check for a match
function checkForMatch() {
    const isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;
    isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
// Disable matched cards
function disableCards() {
    matchedCards += 2;
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();

    // Play match sound
    matchSound.play();

    let totalCards = level === 1 ? 6 :
                     level === 2 ? 12 :
                     level === 3 ? 12 : 0;

    if (matchedCards === totalCards) {
        stopTimer();
        setTimeout(() => {
            if (level === 1) {
                clapSound.play(); // Play clapping sound for Level 1 completion
                confettiPop(); // Trigger confetti for Level 1
                alert(`Level 1 Complete!`);
                matchedCards = 0;
            } else if (level === 2) {
                clapSound.play(); // Play clapping sound for Level 2 completion
                confettiPop(); // Trigger confetti for Level 2
                alert(`Level 2 Complete!`);
                matchedCards = 0;
            } else {
                alert('Congratulations! You completed all levels!');
            }
        }, 100);
    }
}

// Confetti function for celebration
function confettiPop() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}



// Unflip cards if they don't match
function unflipCards() {
    lockBoard = true;
    score -= 5;
    scoreDisplay.textContent = `Score: ${score}`;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

// Reset the board for the next turn
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    firstCard = '';
    secondCard = '';
}

// Restart the game
function restartGame() {
    beepSound.play(); // Play beep sound for restart button
    matchedCards = 0;
    score = 0;
    timer = 0;

    stopTimer();
    timerDisplay.textContent = `Time: ${timer}s`;
    scoreDisplay.textContent = `Score: ${score}`;

    gameContainer.innerHTML = '';
    infoContainer.classList.add('hidden');
    levelSelection.classList.remove('hidden');
}

// Level button click handler
function handleLevelSelection(event) {
    buttonClickSound.play(); // Play click sound for level selection buttons
    const selectedLevel = parseInt(event.target.dataset.level);
    level = selectedLevel;
    levelDisplay.textContent = `Level: ${level}`;
    matchedCards = 0;

    levelSelection.classList.add('hidden');
    infoContainer.classList.remove('hidden');
    createCards(level);
    startTimer();
}

// Event Listeners
levelButtons.forEach(button => button.addEventListener('click', handleLevelSelection));
restartBtn.addEventListener('click', restartGame);
