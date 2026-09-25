// Add media filenames from /slides here (order = slide order).
// Supported: .png .jpg .jpeg .webp .gif .mp4 .webm .mov
// Example:
//   const slideFiles = ["intro.png", "demo.mp4", "outro.jpg"];
const slideFiles = [
  // Drop image/video files into slides/ and list them above.
];

const IMAGE_EXT = /\.(png|jpe?g|webp|gif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

const slideshow = document.getElementById("slideshow");
const counter = document.getElementById("counter");
let slides = [];
let index = 0;

function isImage(file) {
  return IMAGE_EXT.test(file);
}

function isVideo(file) {
  return VIDEO_EXT.test(file);
}

function pauseAllVideos() {
  for (const slide of slides) {
    const video = slide.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
}

function playActiveVideo() {
  const video = slides[index]?.querySelector("video");
  if (!video) return;
  video.currentTime = 0;
  video.play().catch(() => {
    /* Autoplay may be blocked; controls remain available. */
  });
}

function showSlide(nextIndex) {
  if (!slides.length) return;
  pauseAllVideos();
  slides[index].classList.remove("active");
  index = (nextIndex + slides.length) % slides.length;
  slides[index].classList.add("active");
  counter.textContent = `${index + 1} / ${slides.length}`;
  playActiveVideo();
}

function createMediaElement(file) {
  const src = `slides/${file}`;

  if (isImage(file)) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    return img;
  }

  if (isVideo(file)) {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    return video;
  }

  throw new Error(`Unsupported media type: ${file}`);
}

function buildSlides() {
  const controls = slideshow.querySelector(".controls");

  if (!slideFiles.length) {
    counter.textContent = "0 / 0";
    console.info(
      "No slides yet. Add image/video files to slides/ and list them in slideFiles in js/slideshow.js."
    );
    return;
  }

  for (const [i, file] of slideFiles.entries()) {
    const section = document.createElement("section");
    section.className = "slide" + (i === 0 ? " active" : "");
    section.appendChild(createMediaElement(file));
    slideshow.insertBefore(section, controls);
  }

  slides = Array.from(document.querySelectorAll(".slide"));
  counter.textContent = `1 / ${slides.length}`;
  playActiveVideo();
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

try {
  buildSlides();
} catch (error) {
  console.error(error);
  counter.textContent = "Error";
}
