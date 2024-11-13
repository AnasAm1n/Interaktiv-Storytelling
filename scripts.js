// henter alle elementerne
const kr1 = document.getElementById("kr1");
const kr2 = document.getElementById("kr2");
const kr3 = document.getElementById("kr3");
const kr4 = document.getElementById("kr4");
const felix = document.querySelector('.felix img');

// Definer patienter og deres korrekte sekvenser
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
    sound.currentTime = 0; // Reset lyd
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
    
    // Fade ud
    initialState.style.opacity = '0';
    
    setTimeout(() => {
        // Hide initial state and show dialog
        initialState.style.display = 'none';
        dialogState.style.display = 'block';
        
        // Fade in
        setTimeout(() => {
            dialogState.style.opacity = '1';
            showNextPatient(); // Kald til at vise første patient
        }, 50);
    }, 500);
});

function showNextPatient() {
    const patientImage = document.querySelector('.dialog-character-right');
    const speechBubble = document.querySelector('.patient-speech-bubble');
    
    // Gem nuværende patient and tale bobbel
    patientImage.style.opacity = '0';
    patientImage.style.transform = 'translateX(50px)';
    if (speechBubble) speechBubble.style.opacity = '0'; // Gem tale bobbel

    setTimeout(() => {
        // Opdater patient billede
        patientImage.src = patients[currentPatient].image;

        // Opdater tale bobbel
        speechBubble.textContent = patients[currentPatient].speech; // Set the speech text

        // Vise næste patient og tale bobbel
        setTimeout(() => {
            patientImage.style.opacity = '1';
            patientImage.style.transform = 'translateX(0)';
            speechBubble.style.opacity = '1'; // Show the speech bubble
        }, 50);
    }, 500);
}

function handleIconClick(icon) {
    if (icon.style.opacity === '0') return; // Ignore hvis den allerede er klikket

    // Stopper alle ikoner i spam klik
    document.querySelectorAll('.icon-container .icon-image').forEach(icon => {
        icon.style.pointerEvents = 'none'; // Disable pointer events
    });

    const iconType = icon.getAttribute('alt');
    const iconContainer = icon.parentElement;

    // Afspil lyd
    const soundId = `${iconType}-sound`;
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.log("Audio playback failed:", error));
    }

    // Fade ud det klikke ikon
    icon.style.opacity = '0'; // Opaciteten for fade out effekten til 0
    iconContainer.classList.add('clicked'); // 

    // Tjekker hvis det er det korrekte valg for nuværende patient
    const isCorrect = (iconType === patients[currentPatient].correctSequence[0]);
    results.push(isCorrect);

    // Gå videre til næste patient efter et delay
    currentPatient++;

    // If we've treated all patients, show final screen
    if (currentPatient === patients.length) {
        setTimeout(() => {
            const gameDialog = document.querySelector('.game-dialog');

            //  kalkulerer overlevende patienter
            const survivors = results.filter(result => result).length;

            //  Laver resultat boks baseret på aktuelle resultater
            const resultBoxes = results.map(result => 
                `<div class="result-box ${result ? 'checkmark' : 'skull'}"></div>`
            ).join('');

            // Final screen (slutningen af spillet) 
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

            // Afspil sidste lyd (final screen)
            const finalScreenSound = document.getElementById('final-screen-sound');
            if (finalScreenSound) {
                finalScreenSound.currentTime = 0; // Reset sound to start
                finalScreenSound.play().catch(error => console.log("Audio playback failed:", error));
            }

            // Add this after gameDialog.style.opacity = '1';
            document.querySelector('.retry-button').addEventListener('click', function() {
                // Reloader siden til at genstarte spillet med nye muligheder
                location.reload();
            });
        }, 1000);
    } else {
        //  Vis næste patient efter ikonet animation har kørt
        setTimeout(showNextPatient, 500);
    }

    // Genaktivere ikoner efter 2 sekunder (spam klikking debug)
    setTimeout(() => {
        document.querySelectorAll('.icon-container .icon-image').forEach(icon => {
            // Only reset pointer events for icons that are still visible
            if (icon.style.opacity !== '0') {
                icon.style.pointerEvents = 'auto'; // Re-enable pointer events
            }
        });
    }, 2000); // 2000 milliseconds = 2 sekunder
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
