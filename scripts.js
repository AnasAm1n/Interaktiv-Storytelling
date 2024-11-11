const kr1 = document.getElementById("kr1");
const kr2 = document.getElementById("kr2");
const kr3 = document.getElementById("kr3");
const kr4 = document.getElementById("kr4");

function flytKrager() {
    const scrollPosition = window.scrollY;
    const videoSection = document.querySelector('.video').offsetTop;

    if (scrollPosition >= videoSection) {
        kr1.style.transform = `translateX(${scrollPosition - videoSection}px)`;
        kr2.style.transform = `translateX(${scrollPosition - videoSection}px)`;
        kr3.style.transform = `translateX(${scrollPosition - videoSection}px)`;
        kr4.style.transform = `translateX(${scrollPosition - videoSection}px)`;
    }
}

window.addEventListener('scroll', flytKrager);