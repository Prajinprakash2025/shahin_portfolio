// ========================================================
// SHAHINSHA KABEER - CINEMATIC PORTFOLIO JAVASCRIPT
// Features React Bits effects:
// 1. Interactive Particle Text Canvas (Hero)
// 2. Target Reticle Cursor with Magnetic Snapping (Works)
// 3. Spotlight Radial Glow Cards
// 4. Glare 3D Tilt Cards
// 5. Expandable Photography Grid & Full Archive Modal (19 Stills)
// ========================================================

// 19 Curated Photography Works from Shahin's Shoots (Including new folder additions)
const allPhotos = [
  { id: 1, src: 'img/photography/photo-10.jpg', title: 'Ghats Forest Canopy', subtitle: 'Idukki Highlands • Morning Mist', category: 'landscape', camera: 'f/1.8 • 1/200s' },
  { id: 2, src: 'img/photography/photo-03.jpg', title: 'Munnar Tea Canopy', subtitle: 'Western Ghats • Moody Cloud Cover', category: 'landscape', camera: 'Moody Raw' },
  { id: 3, src: 'img/photography/photo-06.jpg', title: 'Kochi Metro Viaduct', subtitle: 'Pathadipalam • Night Ride', category: 'street', camera: 'Night ISO 1600' },
  { id: 4, src: 'img/photography/photo-01.jpg', title: 'The White Umbrella', subtitle: 'Kerala Backcountry • Cinematic Framing', category: 'landscape', camera: 'Story Cut' },
  { id: 5, src: 'img/photography/photo-02.jpg', title: 'Tea Country Twilight', subtitle: 'Munnar Slopes • Golden Hour Glow', category: 'landscape', camera: 'Dusk Tint' },
  { id: 6, src: 'img/photography/photo-08.jpg', title: 'Platform Geometry', subtitle: 'Transit POV • Minimalist Framing', category: 'street', camera: 'Lines & Texture' },
  { id: 7, src: 'img/photography/photo-04.jpg', title: 'Rain on Glass', subtitle: 'Monsoon Depth of Field • Macro Bokeh', category: 'mood', camera: 'Macro f/1.8' },
  { id: 8, src: 'img/photography/photo-05.jpg', title: 'Cloud Inversion', subtitle: 'Untold Stories • Valley Horizon', category: 'landscape', camera: 'Fine Art' },
  // Extra photos (View More / Full Gallery):
  { id: 9, src: 'img/photography/photo-07.jpg', title: 'Monsoon Horizons', subtitle: 'Moody Overcast Mountain Ridge • Wide Angle', category: 'mood', camera: 'Wide 16mm' },
  { id: 10, src: 'img/photography/photo-11.jpg', title: 'Café Ambient Glow', subtitle: 'Cozy Street Corner • Warm Ambient Lighting', category: 'street', camera: 'Warm Bokeh' },
  { id: 11, src: 'img/photography/photo-12.jpg', title: 'Lotus Pond Sanctuary', subtitle: 'Still Water & Highland Botanicals', category: 'landscape', camera: 'Prime 85mm' },
  { id: 12, src: 'img/photography/photo-13.jpg', title: 'Midnight Beacon', subtitle: 'Highland Night Sky & Distant Beacon', category: 'mood', camera: 'Night Astro' },
  { id: 13, src: 'img/photography/photo-14.jpg', title: 'Colonial Architecture', subtitle: 'Architectural Stills • Natural Sunlight', category: 'street', camera: 'Architecture' },
  { id: 14, src: 'img/photography/photo-15.jpg', title: 'Vintage Red Coupe', subtitle: 'Urban Automotive Stills • Red Accent', category: 'street', camera: 'Street 50mm' },
  { id: 15, src: 'img/photography/photo-16.jpg', title: 'Overhead City Rush', subtitle: 'Long Exposure Night Light Trails • Cityscape', category: 'street', camera: 'Long Exposure' },
  { id: 16, src: 'img/photography/photo-17.jpg', title: 'Monochrome Rhythm', subtitle: 'Geometric Lines & Concrete Rhythm', category: 'mood', camera: 'Fine Art B&W' },
  { id: 17, src: 'img/photography/photo-18.jpg', title: 'Sunset Cloudscape', subtitle: 'Cloud Layering over Mountain Horizons', category: 'landscape', camera: 'Sunset 24mm' },
  { id: 18, src: 'img/photography/photo-19.jpg', title: 'Morning Foliage Dew', subtitle: 'Botanical Texture & Water Droplets', category: 'mood', camera: 'Macro 100mm' },
  { id: 19, src: 'img/photography/photo-20.jpg', title: 'Golden Canyon Pass', subtitle: 'Highland Road Curves • Munnar Pass', category: 'landscape', camera: 'Landscape 35mm' }
];

let currentPhotoIndex = 0;
let isMorePhotosExpanded = false;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  setupParticleText();
  setupSpotlightCards();
  setupGlareCards();
  setupTargetCursor();
  setupVideoHoverPreviews();
  setupNavbarScroll();
  setupMobileMenu();
});

// ==========================================
// 1. REACT BITS STYLE INTERACTIVE PARTICLE TEXT
// ==========================================
function setupParticleText() {
  const container = document.getElementById('particleTextContainer');
  const canvas = document.getElementById('particleCanvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let animationFrameId = null;

  const mouse = {
    x: -1000,
    y: -1000,
    radius: 80,
    isInteracting: false
  };

  // Pure uniform crisp color for 100% readability
  const particleColor = '#FFFFFF';

  class Particle {
    constructor(originX, originY) {
      this.originX = originX;
      this.originY = originY;
      this.x = originX + (Math.random() - 0.5) * 80;
      this.y = originY + (Math.random() - 0.5) * 80;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = 1.35;
      this.color = particleColor;
      this.ease = 0.09 + Math.random() * 0.03;
      this.friction = 0.88;
      this.idleOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius && mouse.isInteracting) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        const push = force * 9;
        this.vx -= Math.cos(angle) * push;
        this.vy -= Math.sin(angle) * push;
      }

      const idleFloatX = Math.cos(time * 0.002 + this.idleOffset) * 0.4;
      const idleFloatY = Math.sin(time * 0.002 + this.idleOffset) * 0.4;

      const targetX = this.originX + idleFloatX;
      const targetY = this.originY + idleFloatY;

      this.vx += (targetX - this.x) * this.ease;
      this.vy += (targetY - this.y) * this.ease;

      this.vx *= this.friction;
      this.vy *= this.friction;

      this.x += this.vx;
      this.y += this.vy;
    }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function resizeAndRasterize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    let fontSize = Math.floor(width / 9.5);
    if (fontSize > 68) fontSize = 68;
    if (fontSize < 32) fontSize = 32;

    offCtx.fillStyle = '#FFFFFF';
    offCtx.textAlign = 'left';
    offCtx.textBaseline = 'top';
    offCtx.font = `800 ${fontSize}px Syne, sans-serif`;

    const lineGap = fontSize * 1.05;
    const startY = Math.max(10, (height - lineGap * 2) / 2);
    const startX = 0;

    offCtx.fillText('SHAHINSHA', startX, startY);
    offCtx.fillText('KABEER.', startX, startY + lineGap);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const gap = 3;

    const newParticles = [];

    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const index = (y * width + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha > 100) {
          newParticles.push(new Particle(x, y));
        }
      }
    }

    particles = newParticles;
  }

  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(timestamp);
      particles[i].draw(ctx);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  function updateCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
    mouse.isInteracting = true;
  }

  container.addEventListener('mousemove', (e) => {
    updateCoords(e.clientX, e.clientY);
  });

  container.addEventListener('mouseleave', () => {
    mouse.isInteracting = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      updateCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updateCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    mouse.isInteracting = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resizeAndRasterize();
    }, 150);
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      resizeAndRasterize();
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(animate);
    });
  } else {
    setTimeout(() => {
      resizeAndRasterize();
      animationFrameId = requestAnimationFrame(animate);
    }, 200);
  }
}

// ==========================================
// 2. REACT BITS "GLARE HOVER" 3D TILT EFFECT
// ==========================================
function setupGlareCards() {
  const cards = document.querySelectorAll('.glare-card');

  cards.forEach(card => {
    const inner = card.querySelector('.glare-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 16;
      const rotateY = (x - 0.5) * 16;

      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
      card.style.setProperty('--glare-x', `${x * 100}%`);
      card.style.setProperty('--glare-y', `${y * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================
// 3. REACT BITS "TARGET CURSOR" (WORKS SECTION)
// ==========================================
function setupTargetCursor() {
  const worksSection = document.getElementById('works');
  const cursorWrapper = document.getElementById('targetCursorWrapper');
  const cursorDot = document.getElementById('targetCursorDot');
  const cursorBox = document.getElementById('targetCursorBox');
  const cursorLabel = document.getElementById('targetCursorLabel');

  if (!worksSection || !cursorWrapper || !cursorBox || !cursorDot) return;

  let mouseX = -100;
  let mouseY = -100;
  let isInsideWorks = false;
  let activeTarget = null;

  let currentBox = { x: -100, y: -100, w: 36, h: 36 };
  let targetBox = { x: -100, y: -100, w: 36, h: 36 };

  worksSection.addEventListener('mouseenter', () => {
    isInsideWorks = true;
    cursorWrapper.style.opacity = '1';
    cursorBox.style.opacity = '1';
  });

  worksSection.addEventListener('mouseleave', () => {
    isInsideWorks = false;
    activeTarget = null;
    cursorWrapper.style.opacity = '0';
    cursorBox.style.opacity = '0';
    if (cursorLabel) cursorLabel.classList.remove('active');
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isInsideWorks) return;

    cursorWrapper.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    if (activeTarget) {
      const rect = activeTarget.getBoundingClientRect();
      const padding = 8;
      targetBox.x = rect.left - padding;
      targetBox.y = rect.top - padding;
      targetBox.w = rect.width + padding * 2;
      targetBox.h = rect.height + padding * 2;
    } else {
      targetBox.w = 38;
      targetBox.h = 38;
      targetBox.x = mouseX - targetBox.w / 2;
      targetBox.y = mouseY - targetBox.h / 2;
    }
  });

  const targets = worksSection.querySelectorAll('.target-element, .target-interactive');

  targets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      activeTarget = target;
      const labelText = target.dataset.targetLabel || 'VIEW FILM [16:9]';
      if (cursorLabel) {
        cursorLabel.textContent = labelText;
        cursorLabel.classList.add('active');
      }
    });

    target.addEventListener('mouseleave', () => {
      if (activeTarget === target) {
        activeTarget = null;
        if (cursorLabel) {
          cursorLabel.classList.remove('active');
        }
      }
    });
  });

  function renderCursor() {
    if (isInsideWorks) {
      const lerp = 0.22;
      currentBox.x += (targetBox.x - currentBox.x) * lerp;
      currentBox.y += (targetBox.y - currentBox.y) * lerp;
      currentBox.w += (targetBox.w - currentBox.w) * lerp;
      currentBox.h += (targetBox.h - currentBox.h) * lerp;

      cursorBox.style.transform = `translate3d(${currentBox.x}px, ${currentBox.y}px, 0)`;
      cursorBox.style.width = `${currentBox.w}px`;
      cursorBox.style.height = `${currentBox.h}px`;
    }

    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}

// ==========================================
// 4. REACT BITS SPOTLIGHT CARD BORDER GLOW
// ==========================================
function setupSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ==========================================
// 5. NAVBAR SCROLL EFFECT
// ==========================================
function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-brand-darker/90', 'backdrop-blur-md', 'shadow-2xl', 'border-b', 'border-brand-border/60');
    } else {
      navbar.classList.remove('bg-brand-darker/90', 'backdrop-blur-md', 'shadow-2xl', 'border-b', 'border-brand-border/60');
    }
  });
}

// ==========================================
// 6. MOBILE MENU
// ==========================================
function setupMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// ==========================================
// 7. VIDEO CARD HOVER PLAY / PAUSE PREVIEW
// ==========================================
function setupVideoHoverPreviews() {
  const videoCards = document.querySelectorAll('.project-item');

  videoCards.forEach(card => {
    const video = card.querySelector('video.work-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(err => {
        console.log('Video preview hover play muted', err);
      });
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

// ==========================================
// 8. FILTER PORTFOLIO WORKS (FILMS)
// ==========================================
function filterWorks(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.project-item');

  buttons.forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('bg-brand-gold', 'text-black');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.remove('bg-brand-gold', 'text-black');
      btn.classList.add('text-gray-400');
    }
  });

  items.forEach(item => {
    const itemCat = item.dataset.category;
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// ==========================================
// 9. IN-GRID "VIEW MORE" EXPANSION TOGGLE
// ==========================================
function toggleMorePhotos() {
  isMorePhotosExpanded = !isMorePhotosExpanded;
  const extraPhotos = document.querySelectorAll('.extra-photo');
  const btnText = document.getElementById('toggleMoreText');
  const icon = document.getElementById('toggleMoreIcon');

  extraPhotos.forEach(card => {
    if (isMorePhotosExpanded) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  if (btnText) {
    btnText.textContent = isMorePhotosExpanded ? 'Show Less Stills ↑' : 'View More Stills (+11 Captures)';
  }

  if (icon) {
    if (isMorePhotosExpanded) {
      icon.style.transform = 'rotate(180deg)';
    } else {
      icon.style.transform = 'rotate(0deg)';
    }
  }

  if (!isMorePhotosExpanded) {
    const photoSection = document.getElementById('photography');
    if (photoSection) {
      photoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupGlareCards();
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ==========================================
// 10. FILTER PHOTOGRAPHY GALLERY
// ==========================================
function filterPhotos(category) {
  const buttons = document.querySelectorAll('.photo-filter-btn');
  const items = document.querySelectorAll('.photo-card-item');
  const moreBtnContainer = document.getElementById('viewMoreControls');

  buttons.forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('bg-brand-cyan', 'text-black');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.remove('bg-brand-cyan', 'text-black');
      btn.classList.add('text-gray-400');
    }
  });

  if (category === 'all') {
    // Restore collapsed or expanded state
    items.forEach(item => {
      item.style.display = '';
      if (item.classList.contains('extra-photo')) {
        if (isMorePhotosExpanded) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      } else {
        item.classList.remove('hidden');
      }
    });
    if (moreBtnContainer) moreBtnContainer.style.display = 'flex';
  } else {
    // When a specific category is chosen, display ALL matching items (even if extra)
    items.forEach(item => {
      item.style.display = '';
      const itemCat = item.dataset.category;
      if (itemCat === category) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    // Hide View More button when filtering by specific category
    if (moreBtnContainer) moreBtnContainer.style.display = 'none';
  }

  setupGlareCards();
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ==========================================
// 11. DEDICATED FULL GALLERY ARCHIVE MODAL
// ==========================================
let isArchiveRendered = false;

function openFullGalleryModal() {
  const modal = document.getElementById('fullGalleryModal');
  const grid = document.getElementById('archivePhotosGrid');
  if (!modal) return;

  if (!isArchiveRendered && grid) {
    grid.innerHTML = allPhotos.map((photo, idx) => `
      <div class="archive-photo-card glare-card rounded-2xl overflow-hidden glass-panel border border-white/10 group cursor-pointer" data-category="${photo.category}" onclick="openPhotoModalByIndex(${idx})">
        <div class="glare-card-inner relative w-full aspect-[3/4] bg-black/60 overflow-hidden">
          <img 
            src="${photo.src}" 
            alt="${photo.title}" 
            loading="lazy" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="glare-sheen"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-brand-gold">
            ${photo.camera}
          </div>

          <div class="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
            <span class="text-[9px] font-mono text-brand-cyan uppercase tracking-wider">${photo.category}</span>
            <h5 class="text-xs font-bold font-syne text-white truncate leading-tight">${photo.title}</h5>
          </div>
        </div>
      </div>
    `).join('');

    isArchiveRendered = true;
    setupGlareCards();
  }

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeFullGalleryModal() {
  const modal = document.getElementById('fullGalleryModal');
  if (!modal) return;

  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.classList.remove('opacity-100');
  document.body.style.overflow = 'auto';
}

function filterArchivePhotos(category) {
  const buttons = document.querySelectorAll('.archive-filter-btn');
  const items = document.querySelectorAll('.archive-photo-card');
  const countText = document.getElementById('archiveCountText');
  let visibleCount = 0;

  buttons.forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('bg-brand-cyan', 'text-black');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.remove('bg-brand-cyan', 'text-black');
      btn.classList.add('text-gray-400');
    }
  });

  items.forEach(item => {
    const itemCat = item.dataset.category;
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  if (countText) {
    countText.textContent = `Displaying ${visibleCount} of ${allPhotos.length} Stills`;
  }
}

// ==========================================
// 12. FULLSCREEN PHOTO LIGHTBOX MODAL WITH PREV/NEXT
// ==========================================
const photoModal = document.getElementById('photoModal');
const modalPhotoImage = document.getElementById('modalPhotoImage');
const modalPhotoTitle = document.getElementById('modalPhotoTitle');
const modalPhotoSubtitle = document.getElementById('modalPhotoSubtitle');
const modalPhotoWhatsAppLink = document.getElementById('modalPhotoWhatsAppLink');
const modalPhotoCounter = document.getElementById('modalPhotoCounter');

function openPhotoModal(imageSrc, title, subtitle) {
  const idx = allPhotos.findIndex(p => p.src === imageSrc);
  if (idx !== -1) {
    currentPhotoIndex = idx;
  }
  updatePhotoModal();
}

function openPhotoModalByIndex(index) {
  if (index >= 0 && index < allPhotos.length) {
    currentPhotoIndex = index;
    updatePhotoModal();
  }
}

function updatePhotoModal() {
  if (!photoModal || !modalPhotoImage) return;

  const photo = allPhotos[currentPhotoIndex];
  if (!photo) return;

  modalPhotoImage.src = photo.src;
  modalPhotoTitle.textContent = photo.title || 'Shahin Photography';
  modalPhotoSubtitle.textContent = `${photo.subtitle || 'Highland Capture'} • ${photo.camera || 'Fine-Art Still'}`;

  if (modalPhotoCounter) {
    modalPhotoCounter.textContent = `Photo ${currentPhotoIndex + 1} of ${allPhotos.length}`;
  }

  const encodedText = encodeURIComponent(`Hi Shahinsha! I saw your photograph "${photo.title}" on your portfolio and I'm interested in booking a photography / portrait shoot.`);
  if (modalPhotoWhatsAppLink) {
    modalPhotoWhatsAppLink.href = `https://wa.me/918547277727?text=${encodedText}`;
  }

  photoModal.classList.remove('opacity-0', 'pointer-events-none');
  photoModal.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
}

function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
  updatePhotoModal();
}

function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
  updatePhotoModal();
}

function closePhotoModal() {
  if (!photoModal || !modalPhotoImage) return;

  photoModal.classList.add('opacity-0', 'pointer-events-none');
  photoModal.classList.remove('opacity-100');
  modalPhotoImage.src = '';
  document.body.style.overflow = 'auto';
}

// ==========================================
// 13. VIDEO THEATER MODAL
// ==========================================
const modal = document.getElementById('videoModal');
const modalPlayer = document.getElementById('modalVideoPlayer');
const modalTitle = document.getElementById('modalVideoTitle');
const modalSubtitle = document.getElementById('modalVideoSubtitle');
const modalWhatsAppLink = document.getElementById('modalWhatsAppLink');

function openVideoModal(videoSrc, title, subtitle) {
  if (!modal || !modalPlayer) return;

  modalPlayer.src = videoSrc;
  modalTitle.textContent = title || 'Cinematic Film';
  modalSubtitle.textContent = (subtitle || 'Director Cut') + ' • High Definition';
  
  const encodedText = encodeURIComponent(`Hi Shahinsha! I saw your project "${title}" on your portfolio and I would love to discuss a video project.`);
  if (modalWhatsAppLink) {
    modalWhatsAppLink.href = `https://wa.me/918547277727?text=${encodedText}`;
  }

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';

  modalPlayer.play().catch(() => {});
}

function closeVideoModal() {
  if (!modal || !modalPlayer) return;

  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.classList.remove('opacity-100');
  modalPlayer.pause();
  modalPlayer.src = '';
  document.body.style.overflow = 'auto';
}

// Global Keyboard Navigation
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && !modal.classList.contains('opacity-0')) {
      closeVideoModal();
    }
    if (photoModal && !photoModal.classList.contains('opacity-0')) {
      closePhotoModal();
    }
    const archiveModal = document.getElementById('fullGalleryModal');
    if (archiveModal && !archiveModal.classList.contains('opacity-0')) {
      closeFullGalleryModal();
    }
  }

  // Arrow keys for lightbox modal
  if (photoModal && !photoModal.classList.contains('opacity-0')) {
    if (e.key === 'ArrowRight') {
      nextPhoto();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    }
  }
});

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal();
  });
}

if (photoModal) {
  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) closePhotoModal();
  });
}

const fullGalleryModalEl = document.getElementById('fullGalleryModal');
if (fullGalleryModalEl) {
  fullGalleryModalEl.addEventListener('click', (e) => {
    if (e.target === fullGalleryModalEl) closeFullGalleryModal();
  });
}

// ==========================================
// 14. CONTACT FORM VIA WHATSAPP
// ==========================================
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const category = document.getElementById('projectCategory').value;
  const details = document.getElementById('projectDetails').value.trim();

  const message = `🎬 *New Project Inquiry for Shahinsha Kabeer*\n\n*Name:* ${name}\n*Contact:* ${phone}\n*Category:* ${category}\n*Details:* ${details}\n\nSent from Portfolio Website.`;

  const waUrl = `https://wa.me/918547277727?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}
