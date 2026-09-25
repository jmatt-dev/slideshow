// Add or remove filenames here when you change files in /slides
const slideFiles = [
  "01-welcome.html",
  "02-slide-two.html",
  "03-slide-three.html",
];

const slideshow = document.getElementById("slideshow");
const counter = document.getElementById("counter");
let slides = [];
let index = 0;

function showSlide(nextIndex) {
  if (!slides.length) return;
  slides[index].classList.remove("active");
  index = (nextIndex + slides.length) % slides.length;
  slides[index].classList.add("active");
  counter.textContent = `${index + 1} / ${slides.length}`;
}

async function loadSlides() {
  const controls = slideshow.querySelector(".controls");

  for (const [i, file] of slideFiles.entries()) {
    const response = await fetch(`slides/${file}`);
    if (!response.ok) {
      throw new Error(`Could not load slides/${file}`);
    }

    const html = await response.text();
    const section = document.createElement("section");
    section.className = "slide" + (i === 0 ? " active" : "");
    section.innerHTML = html;
    slideshow.insertBefore(section, controls);
  }

  slides = Array.from(document.querySelectorAll(".slide"));
  counter.textContent = `1 / ${slides.length}`;
}

document.getElementById("prev").addEventListener("click", () => showSlide(index - 1));
document.getElementById("next").addEventListener("click", () => showSlide(index + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showSlide(index - 1);
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    showSlide(index + 1);
  }
});

loadSlides().catch((error) => {
  console.error(error);
  counter.textContent = "Error";
});
