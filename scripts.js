const kr1 = document.getElementById("kr1");
const kr2 = document.getElementById("kr2");
const kr3 = document.getElementById("kr3");
const kr4 = document.getElementById("kr4");
const felix = document.querySelector('.felix img');

// Add state variable to track current patient
let currentPatient = 1;

// Add sound functions at the top of your file
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
        kr1.style.transform = `translateX(${scrollPosition - ksektion}px)`;
        kr2.style.transform = `translateX(${(scrollPosition - ksektion) * 1.2}px)`;
        kr3.style.transform = `translateX(${-(scrollPosition - ksektion) * 0.8}px)`;
        kr4.style.transform = `translateX(${-(scrollPosition - ksektion) * 1.5}px)`;
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
    const patient = document.querySelector('.dialog-character-right');
    
    // Fade out initial state
    initialState.style.opacity = '0';
    
    setTimeout(() => {
        // Hide initial state and show dialog
        initialState.style.display = 'none';
        dialogState.style.display = 'block';
        
        // Trigger fade in
        setTimeout(() => {
            dialogState.style.opacity = '1';
            patient.style.opacity = '1';
            patient.style.transform = 'translateX(0)';
        }, 50);
    }, 500);
});

// Function to handle icon clicks
function handleIconClick(icon) {
    // Prevent clicking if icon is already clicked
    if (icon.style.opacity === '0') return;
    
    const patient = document.querySelector('.dialog-character-right');
    const iconContainer = icon.parentElement;
    
    // Play sound based on icon type
    const iconType = icon.getAttribute('alt');
    const soundId = `${iconType}-sound`;
    const sound = document.getElementById(soundId);
    
    if (sound) {
        sound.currentTime = 0; // Reset sfx til start
        sound.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
    }
    
    // Add click animation class to container
    iconContainer.classList.add('clicked');
    
    // Fade out ikon 
    icon.style.opacity = '0';
    
    // Fade out nuværende patient
    patient.style.transition = 'opacity 0.5s ease-in-out';
    patient.style.opacity = '0';
    
    setTimeout(() => {
        //Skifter til næste patient
        currentPatient++;
        patient.src = `images/patient${currentPatient}.png`;
        patient.style.opacity = '1';
    }, 500);
}

// click listeners ttil alle ikoner
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