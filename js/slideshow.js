// Add media filenames from /slides here (order = slide order).
// Supported: .png .jpg .jpeg .webp .gif .mp4 .webm .mov
// Example:
//   const slideFiles = ["intro.png", "demo.mp4", "outro.jpg"];
const slideFiles = [
  // Drop image/video files into slides/ and list them above.
];

// How long each image stays on screen (videos advance when they finish).
const IMAGE_DURATION_MS = 8000;

const IMAGE_EXT = /\.(png|jpe?g|webp|gif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

const slideshow = document.getElementById("slideshow");
let slides = [];
let index = 0;
let imageTimer = null;

function isImage(file) {
  return IMAGE_EXT.test(file);
}

function isVideo(file) {
  return VIDEO_EXT.test(file);
}

function clearImageTimer() {
  if (imageTimer !== null) {
    clearTimeout(imageTimer);
    imageTimer = null;
  }
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

function scheduleAdvance() {
  clearImageTimer();
  const media = slides[index]?.querySelector("img, video");
  if (!media) return;

  if (media.tagName === "VIDEO") {
    media.currentTime = 0;
    media.play().catch(() => {
      // If autoplay is blocked, still move on after the image duration.
      imageTimer = setTimeout(() => showSlide(index + 1), IMAGE_DURATION_MS);
    });
    return;
  }

  imageTimer = setTimeout(() => showSlide(index + 1), IMAGE_DURATION_MS);
}

function showSlide(nextIndex) {
  if (!slides.length) return;
  clearImageTimer();
  pauseAllVideos();
  slides[index].classList.remove("active");
  index = (nextIndex + slides.length) % slides.length;
  slides[index].classList.add("active");
  scheduleAdvance();
}

function createMediaElement(file) {
  const src = `slides/${file}`;

  if (isImage(file)) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.draggable = false;
    return img;
  }

  if (isVideo(file)) {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.addEventListener("ended", () => showSlide(index + 1));
    return video;
  }

  throw new Error(`Unsupported media type: ${file}`);
}

function buildSlides() {
  if (!slideFiles.length) {
    console.info(
      "No slides yet. Add image/video files to slides/ and list them in slideFiles in js/slideshow.js."
    );
    return;
  }

  for (const [i, file] of slideFiles.entries()) {
    const section = document.createElement("section");
    section.className = "slide" + (i === 0 ? " active" : "");
    section.appendChild(createMediaElement(file));
    slideshow.appendChild(section);
  }

  slides = Array.from(document.querySelectorAll(".slide"));
  scheduleAdvance();
}

// Optional: keyboard still works, nothing on screen.
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
}
