// Three.js Heart Particle Animation with color #800020
console.clear();

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', function() {
  initHeartAnimation();
});

function initHeartAnimation() {
  const heartContainer = document.getElementById('heart-container');
  if (!heartContainer) {
    console.error('Heart container not found');
    return;
  }

/* SETUP */
const scene = new THREE.Scene();
const containerWidth = heartContainer.clientWidth || window.innerWidth;
const containerHeight = heartContainer.clientHeight || window.innerHeight;

const camera = new THREE.PerspectiveCamera(
  75,
  containerWidth / containerHeight,
  0.1,
  5000
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(containerWidth, containerHeight);
renderer.setClearColor(0x000000, 0);
heartContainer.appendChild(renderer.domElement);

/* CONTROLS */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);
controlsWebGL.enableDamping = true;
controlsWebGL.dampingFactor = 0.05;
controlsWebGL.enableZoom = false;
controlsWebGL.enablePan = false;

/* PARTICLES */
// Create a global gsap timeline that contains all tweens
const tl = gsap.timeline({
  repeat: -1,
  yoyo: true
});

const path = document.querySelector("path");
const length = path.getTotalLength();
const vertices = [];

for (let i = 0; i < length; i += 0.1) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);
  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;
  vertices.push(vector);
  
  // Create a tween for that vector
  tl.from(vector, {
      x: 600 / 2, // Center X of the heart
      y: -552 / 2, // Center Y of the heart
      z: 0, // Center of the scene
      ease: "power2.inOut",
      duration: "random(2, 5)" // Random duration
    },
    i * 0.002 // Delay calculated from the distance along the path
  );
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
// Change color from 0xee5282 to 0x800020 (burgundy)
const material = new THREE.PointsMaterial({ 
  color: 0x800020, 
  blending: THREE.AdditiveBlending, 
  size: 3,
  sizeAttenuation: true
});
const particles = new THREE.Points(geometry, material);

// Offset the particles in the scene based on the viewbox values
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);


gsap.fromTo(scene.rotation, {
  y: -0.2
}, {
  y: 0.2,
  repeat: -1,
  yoyo: true,
  ease: 'power2.inOut',
  duration: 3
});

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  controlsWebGL.update();
  // Update the geometry from the animated vertices
  geometry.setFromPoints(vertices);
  renderer.render(scene, camera);
}

/* EVENTS */
function onWindowResize() {
  const containerWidth = heartContainer.clientWidth;
  const containerHeight = heartContainer.clientHeight;
  
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(containerWidth, containerHeight);
}

window.addEventListener("resize", onWindowResize, false);
// Initial resize call
onWindowResize();

// Start the animation loop
render();

} // End of initHeartAnimation function

// Smooth scroll behavior for sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Make first section visible immediately
const firstSection = document.querySelector('section');
if (firstSection) {
    firstSection.classList.add('visible');
}

// Observe photo gallery for staggered animations
const photoGalleryElement = document.querySelector('.photo-gallery');
if (photoGalleryElement) {
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    galleryObserver.observe(photoGalleryElement);
}

// CSS Letter Section - Envelope and Letters functionality
const letter = document.querySelector(".letter");
let zIndexCounter = 10;

if (letter) {
  function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

  if (!isOverflown(letter)) {
    letter.classList.add("center");
  }

  let offsetX, offsetY;
  
  const startDrag = (e) => {
    if (e.target.tagName !== "BUTTON") {
      e.preventDefault();
      const rect = letter.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      letter.style.position = "fixed";
      letter.style.left = `${rect.left}px`;
      letter.style.top = `${rect.top}px`;
      letter.style.transform = "none"; // Remove all transforms when dragging
      letter.style.transition = "none"; // Disable animation when dragging

      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      letter.style.zIndex = zIndexCounter++ + 100; // High z-index only when dragging

      const moveAt = (posX, posY) => {
        letter.style.left = `${posX - offsetX}px`;
        letter.style.top = `${posY - offsetY}px`;
      };

      const onMove = (moveEvent) => {
        moveEvent.preventDefault();
        const moveX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const moveY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
        moveAt(moveX, moveY);
      };

      const onEnd = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    }
  };

  letter.addEventListener("mousedown", startDrag);
  letter.addEventListener("touchstart", startDrag, { passive: false });
}

document.querySelector("#openEnvelope")?.addEventListener("click", () => {
  document.querySelector(".envelope").classList.add("active");
});

const closeButtons = document.querySelectorAll(".closeLetter");
closeButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const letter = e.target.closest(".letter");
    if (letter) {
      letter.style.display = "none";
    }
  });
});

// Photo Gallery Lightbox Functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
let currentPhotoIndex = 0;
let photos = [];

// Function to open lightbox
function openLightbox(index) {
  if (photos.length === 0) return;
  currentPhotoIndex = index;
  updateLightboxImage();
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Function to close lightbox
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Function to update lightbox image
function updateLightboxImage() {
  if (photos[currentPhotoIndex]) {
    lightboxImage.src = photos[currentPhotoIndex].src;
    lightboxImage.alt = photos[currentPhotoIndex].alt || "Photo";
    lightboxCaption.textContent = photos[currentPhotoIndex].caption || "";
  }
}

// Function to go to previous photo
function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
  updateLightboxImage();
}

// Function to go to next photo
function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
  updateLightboxImage();
}

// Event listeners
if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prevPhoto();
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextPhoto();
  });
}

// Close lightbox when clicking outside
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  
  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    prevPhoto();
  } else if (e.key === "ArrowRight") {
    nextPhoto();
  }
});

// Initialize photo gallery - automatically load photos from img folder
const photoGallery = document.getElementById("photo-gallery");
if (photoGallery) {
  // Photo file names - update this array if you add more photos
  const photoFiles = [
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 
    'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg'
  ];
  
  // Also check for alternative extensions
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  // Function to add photo to gallery
  function addPhotoToGallery(src, alt = "", caption = "", index) {
    const photoItem = document.createElement("div");
    photoItem.className = "photo-item";
    photoItem.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
    
    photoItem.addEventListener("click", () => {
      openLightbox(index);
    });
    
    photoGallery.appendChild(photoItem);
    
    // Add to photos array for lightbox
    photos.push({ src, alt, caption });
  }
  
  // Load photos
  photoFiles.forEach((filename, index) => {
    const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    // Try different extensions
    let photoLoaded = false;
    extensions.forEach(ext => {
      if (!photoLoaded) {
        const img = new Image();
        const photoPath = `img/${nameWithoutExt}${ext}`;
        
        img.onload = () => {
          addPhotoToGallery(photoPath, `Photo ${index + 1}`, `Memory ${index + 1}`, photos.length);
          photoLoaded = true;
        };
        
        img.src = photoPath;
      }
    });
  });
  
  // Remove placeholder if photos are loaded
  setTimeout(() => {
    const placeholder = photoGallery.querySelector(".photo-placeholder");
    if (placeholder && photos.length > 0) {
      placeholder.style.display = 'none';
    }
  }, 1000);
  
  // Make placeholder clickable for future photo upload
  const placeholder = photoGallery.querySelector(".photo-placeholder");
  if (placeholder) {
    placeholder.addEventListener("click", () => {
      // This can be extended to open a file upload dialog
      console.log("Photo upload functionality can be added here");
    });
  }
}

