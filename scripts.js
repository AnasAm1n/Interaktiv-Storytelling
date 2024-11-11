const kr1 = document.getElementById("kr1");
const kr2 = document.getElementById("kr2");
const kr3 = document.getElementById("kr3");
const kr4 = document.getElementById("kr4");

function flytKrager() {
    const scrollPosition = Math.round(window.scrollY);
    const ksektion = document.querySelector('.video').offsetTop;

    if (scrollPosition >= ksektion) {
        kr1.style.transform = `translateX(${scrollPosition - ksektion}px)`;
        kr2.style.transform = `translateX(${(scrollPosition - ksektion) * 1.2}px)`;
        kr3.style.transform = `translateX(${-(scrollPosition - ksektion) * 0.8}px)`; // Flyver mod venstre
        kr4.style.transform = `translateX(${-(scrollPosition - ksektion) * 1.5}px)`; // Flyver mod venstre
    }
}

window.onscroll = flytKrager;