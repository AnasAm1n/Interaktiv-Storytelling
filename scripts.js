// henter alle elementerne
const kr1 = document.getElementById("kr1");
const kr2 = document.getElementById("kr2");
const kr3 = document.getElementById("kr3");
const kr4 = document.getElementById("kr4");
const felix = document.querySelector('.felix img');

// Define patients and their correct sequences
const patients = [
    {
        image: 'images/patient1.png',
        correctSequence: ['scissors'],
        speech: 'Mine bylder er fyldt med væske, de skal fjernes!'
    },
    {
        image: 'images/patient2.png',
        correctSequence: ['book'],
        speech: 'Hvad kan jeg gøre for at lindre smerten?'
    },
    {
        image: 'images/patient3.png',
        correctSequence: ['medicine'],
        speech: 'Jeg har åbne sår kan du rense dem?'
    }
];

let currentPatient = 0;
let currentStep = 0;
let results = [];

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Reset sound to start
    sound.play();
}

function handleScroll() {
    const scrollPosition = Math.round(window.scrollY);
    const ksektion = document.querySelector('.video').offsetTop;
    const manualSection = document.querySelector('.manueal').offsetTop;

    if (scrollPosition >= ksektion) {
        kr1.style.transform = "translateX(" + (scrollPosition - ksektion) * 3.0 + "px)";
        kr2.style.transform = "translateX(" + (scrollPosition - ksektion) * 1.8 + "px)";
        kr3.style.transform = "translateX(" + (-(scrollPosition - ksektion) * 1.8) + "px)";
        kr4.style.transform = "translateX(" + (-(scrollPosition - ksektion) * 2.8) + "px)";
    }

    if (scrollPosition >= manualSection) {
        felix.style.position = 'absolute';
        felix.style.top = `${manualSection}px`;
    } else {
        felix.style.position = 'fixed';
        felix.style.top = '20px';
    }
}

window.addEventListener('scroll', handleScroll);

document.querySelector('.start-button').addEventListener('click', function() {
    const initialState = document.querySelector('.game-initial');
    const dialogState = document.querySelector('.game-dialog');
    
    // Fade out initial state
    initialState.style.opacity = '0';
    
    setTimeout(() => {
        // Hide initial state and show dialog
        initialState.style.display = 'none';
        dialogState.style.display = 'block';
        
        // Trigger fade in
        setTimeout(() => {
            dialogState.style.opacity = '1';
            showNextPatient(); // Call to show the first patient
        }, 50);
    }, 500);
});

function showNextPatient() {
    const patientImage = document.querySelector('.dialog-character-right');
    const speechBubble = document.querySelector('.patient-speech-bubble');
    
    // Hide current patient and speech bubble
    patientImage.style.opacity = '0';
    patientImage.style.transform = 'translateX(50px)';
    if (speechBubble) speechBubble.style.opacity = '0'; // Hide the speech bubble

    setTimeout(() => {
        // Update patient image
        patientImage.src = patients[currentPatient].image;

        // Update speech bubble text
        speechBubble.textContent = patients[currentPatient].speech; // Set the speech text

        // Show new patient and speech bubble
        setTimeout(() => {
            patientImage.style.opacity = '1';
            patientImage.style.transform = 'translateX(0)';
            speechBubble.style.opacity = '1'; // Show the speech bubble
        }, 50);
    }, 500);
}

function handleIconClick(icon) {
    if (icon.style.opacity === '0') return;
    
    const iconType = icon.getAttribute('alt');
    const iconContainer = icon.parentElement;
    
    // Play sound
    const soundId = `${iconType}-sound`;
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.log("Audio playback failed:", error));
    }
    
    // Fade out the clicked icon
    icon.style.opacity = '0';
    iconContainer.classList.add('clicked');
    
    // Check if it's the correct choice for current patient
    const isCorrect = (iconType === patients[currentPatient].correctSequence[0]);
    results.push(isCorrect);
    
    // Move to next patient after a delay
    currentPatient++;
    
    // If we've treated all patients, show final screen
    if (currentPatient === patients.length) {
        setTimeout(() => {
            const gameDialog = document.querySelector('.game-dialog');
            
            // Calculate survivors
            const survivors = results.filter(result => result).length;
            
            // Create result boxes based on actual results
            const resultBoxes = results.map(result => 
                `<div class="result-box ${result ? 'checkmark' : 'skull'}"></div>`
            ).join('');
            
            // Create the final screen HTML
            gameDialog.innerHTML = `
                <div class="final-screen">
                    <div class="final-content">
                        <img src="images/plaguedoctor.jpg" class="plague-doctor-final" alt="Plague Doctor">
                        <h2 class="final-text">${survivors}/3 Overlevede</h2>
                        <button class="retry-button">
                            <img src="images/House.png" alt="Retry" class="retry-icon"> Prøv igen
                        </button>
                    </div>
                    <div class="results-bar">
                        ${resultBoxes}
                    </div>
                </div>
            `;
            
            gameDialog.style.opacity = '1';

            // Add this after gameDialog.style.opacity = '1';
            document.querySelector('.retry-button').addEventListener('click', function() {
                // Reload the page to reset the game
                location.reload();
            });
        }, 1000);
    } else {
        // Show next patient after icon fade animation
        setTimeout(showNextPatient, 500);
    }
}

// click listeners til alle ikoner
document.querySelectorAll('.icon-container .icon-image').forEach(icon => {
    icon.addEventListener('click', function() {
        handleIconClick(this);
    });
});

document.querySelectorAll('.icon-container > img.game-icon').forEach(icon => {
    const container = document.createElement('div');
    container.className = 'game-icon';
    const newIcon = icon.cloneNode(true);
    newIcon.className = 'icon-image';
    container.appendChild(newIcon);
    icon.parentNode.replaceChild(container, icon);
});
