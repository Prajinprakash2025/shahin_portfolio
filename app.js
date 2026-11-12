// ========================================================
// SHAHINSHA KABEER - CINEMATIC PORTFOLIO JAVASCRIPT
// Features React Bits effects:
// 1. Interactive Particle Text Canvas (Hero)
// 2. Target Reticle Cursor with Magnetic Snapping (Works)
// 3. Spotlight Radial Glow Cards
// 4. Glare 3D Tilt Cards
// 5. Immersive 3D Dome Gallery (18 Curated Stills)
// ========================================================

// 18 Curated Photography Works from Shahin's Shoots
const photographyWorks = [
  { id: 1, src: 'img/photography/photo-01.jpg', title: 'Munnar Tea Highlands', subtitle: 'Western Ghats, Idukki', category: 'landscape', camera: 'Canon EOS' },
  { id: 2, src: 'img/photography/photo-02.jpg', title: 'Golden Hour Silhouette', subtitle: 'Highland Hilltop Sunset', category: 'mood', camera: '50mm Prime' },
  { id: 3, src: 'img/photography/photo-03.jpg', title: 'Urban Geometry & Facades', subtitle: 'Kochi Cityscape Stills', category: 'urban', camera: '24-70mm f/2.8' },
  { id: 4, src: 'img/photography/photo-04.jpg', title: 'Misty Pine Forest', subtitle: 'Vagamon Pine Valley', category: 'landscape', camera: 'Landscape Lens' },
  { id: 5, src: 'img/photography/photo-05.jpg', title: 'Highland Stream & Moss', subtitle: 'Anakkara Springs', category: 'landscape', camera: 'Macro Stills' },
  { id: 6, src: 'img/photography/photo-06.jpg', title: 'Night Bokeh & Street Vibrance', subtitle: 'Metropolitan Rhythm', category: 'urban', camera: 'Low-Light 35mm' },
  { id: 7, src: 'img/photography/photo-07.jpg', title: 'Moody Overcast Skyline', subtitle: 'Monsoon Mountain Mist', category: 'mood', camera: 'Ultra Wide' },
  { id: 8, src: 'img/photography/photo-08.jpg', title: 'Canyon Curves & Mountain Pass', subtitle: 'Gap Road, Munnar', category: 'landscape', camera: 'Telephoto Lens' },
  { id: 10, src: 'img/photography/photo-10.jpg', title: 'Emerald Canopy Flora', subtitle: 'Highland Botanical Study', category: 'mood', camera: 'Macro 100mm' },
  { id: 11, src: 'img/photography/photo-11.jpg', title: 'Night Café Ambient Glow', subtitle: 'Warm Bokeh Street Corner', category: 'urban', camera: 'Night Capture' },
  { id: 12, src: 'img/photography/photo-12.jpg', title: 'Lotus Pond Reflections', subtitle: 'Still Water Sanctuary', category: 'landscape', camera: 'Prime 85mm' },
  { id: 13, src: 'img/photography/photo-13.jpg', title: 'Midnight Beacon & Star Trails', subtitle: 'Idukki Mountain Night', category: 'mood', camera: 'Night Stills' },
  { id: 14, src: 'img/photography/photo-14.jpg', title: 'Heritage Facade & Shadows', subtitle: 'Colonial Architecture', category: 'urban', camera: 'Street Wide' },
  { id: 15, src: 'img/photography/photo-15.jpg', title: 'Vintage Red Coupe in Alley', subtitle: 'Automotive Street Stills', category: 'urban', camera: 'Street 50mm' },
  { id: 16, src: 'img/photography/photo-16.jpg', title: 'Overhead City Rush & Trails', subtitle: 'Long Exposure Night Transit', category: 'urban', camera: 'Long Exposure' },
  { id: 17, src: 'img/photography/photo-17.jpg', title: 'Abstract Monochrome Textures', subtitle: 'Structural Framing', category: 'mood', camera: 'Fine-Art Still' },
  { id: 18, src: 'img/photography/photo-18.jpg', title: 'Sunset Cloud Formations', subtitle: 'High Altitude Skies', category: 'landscape', camera: 'Atmosphere Lens' },
  { id: 19, src: 'img/photography/photo-19.jpg', title: 'Morning Dew & Fresh Leafage', subtitle: 'Macro Forest Detail', category: 'mood', camera: 'Macro Detail' }
];

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  setupParticleText();
  setupSpotlightCards();
  setupGlareCards();
  setupTargetCursor();
  setupDomeGallery();
  renderGridPhotos();
  setupVideoHoverPreviews();
  setupNavbarScroll();
  setupMobileMenu();
});

// ==========================================
// 1. REACT BITS "DOME GALLERY" 3D PROJECTION
// ==========================================
let domeAutoRotate = true;
let domeRotX = 0;
let domeRotY = 0;
let domeVx = 0;
let domeVy = 0;

function setupDomeGallery() {
  const viewport = document.getElementById('domeViewport');
  const world = document.getElementById('domeWorld');
  if (!viewport || !world) return;

  world.innerHTML = '';

  // Responsive radius
  const isMobile = window.innerWidth < 640;
  const radius = isMobile ? 420 : 580;

  // 18 photos arranged in 3 horizontal tiers (latitude rows)
  // Row -1: latitude -22deg (6 items, yaw: 0, 60, 120, 180, 240, 300 + 10deg)
  // Row  0: latitude   0deg (6 items, yaw: 0, 60, 120, 180, 240, 300 + 40deg)
  // Row +1: latitude +22deg (6 items, yaw: 0, 60, 120, 180, 240, 300 + 25deg)
  const rows = [
    { pitch: -22, offset: 10, count: 6 },
    { pitch: 0,   offset: 40, count: 6 },
    { pitch: 22,  offset: 25, count: 6 }
  ];

  let itemIdx = 0;
  rows.forEach((row) => {
    const step = 360 / row.count;
    for (let c = 0; c < row.count; c++) {
      if (itemIdx >= photographyWorks.length) break;
      const photo = photographyWorks[itemIdx];
      const yaw = c * step + row.offset;
      const pitch = row.pitch;

      const card = document.createElement('div');
      card.className = 'dome-card';
      card.dataset.index = itemIdx;
      // 3D placement on hemispheric surface facing center/viewer
      card.style.transform = `rotateY(${yaw}deg) rotateX(${pitch}deg) translateZ(${radius}px)`;

      card.innerHTML = `
        <img 
          src="${photo.src}" 
          alt="${photo.title}" 
          loading="lazy" 
          class="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 p-3.5 flex flex-col justify-end">
          <span class="text-[9px] font-mono text-brand-gold uppercase tracking-wider font-semibold">${photo.category}</span>
          <h4 class="text-xs sm:text-sm font-bold text-white font-syne leading-tight mt-0.5">${photo.title}</h4>
          <span class="text-[10px] text-gray-300 font-sans mt-0.5 truncate">${photo.subtitle}</span>
          <div class="mt-2 flex items-center gap-1 text-[10px] text-brand-gold font-mono">
            <span>Click to expand</span>
            <span>↗</span>
          </div>
        </div>
      `;

      world.appendChild(card);
      itemIdx++;
    }
  });

  // Pointer drag & touch swipe state
  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragDistance = 0;

  viewport.addEventListener('pointerdown', (e) => {
    isDragging = true;
    hasDragged = false;
    dragDistance = 0;
    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastY = e.clientY;
    domeVx = 0;
    domeVy = 0;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    dragDistance += Math.hypot(dx, dy);

    if (dragDistance > 6) {
      hasDragged = true;
    }

    const sensitivity = 0.28;
    domeRotY += dx * sensitivity;
    domeRotX -= dy * (sensitivity * 0.85);

    // Clamp vertical tilt so it stays hemispheric
    domeRotX = Math.max(-36, Math.min(36, domeRotX));

    domeVx = dx * sensitivity;
    domeVy = dy * sensitivity * 0.85;

    lastX = e.clientX;
    lastY = e.clientY;

    world.style.transform = `rotateX(${domeRotX.toFixed(2)}deg) rotateY(${domeRotY.toFixed(2)}deg)`;
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    try {
      if (viewport.hasPointerCapture(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  // Card click detection (only if user did not drag)
  world.addEventListener('click', (e) => {
    if (hasDragged) return;
    const card = e.target.closest('.dome-card');
    if (!card) return;
    const idx = parseInt(card.dataset.index, 10);
    const photo = photographyWorks[idx];
    if (photo) {
      openPhotoModal(photo.src, photo.title, photo.subtitle);
    }
  });

  // Continuous animation loop: handles auto-spin + momentum inertia
  function animateDome() {
    if (!isDragging) {
      if (domeAutoRotate) {
        domeRotY += 0.08; // Smooth ambient rotation
      }

      // Apply inertia momentum
      if (Math.abs(domeVx) > 0.005 || Math.abs(domeVy) > 0.005) {
        domeRotY += domeVx;
        domeRotX -= domeVy;
        domeVx *= 0.92;
        domeVy *= 0.92;
      }

      domeRotX = Math.max(-36, Math.min(36, domeRotX));
      world.style.transform = `rotateX(${domeRotX.toFixed(2)}deg) rotateY(${domeRotY.toFixed(2)}deg)`;
    }

    requestAnimationFrame(animateDome);
  }

  requestAnimationFrame(animateDome);
}

// Toggle Dome Auto Rotation
function toggleDomeAutoRotate() {
  domeAutoRotate = !domeAutoRotate;
  const label = document.getElementById('autoRotateText');
  const btn = document.getElementById('domeAutoRotateBtn');
  if (label) {
    label.textContent = domeAutoRotate ? 'Auto-Spin: ON' : 'Auto-Spin: PAUSED';
  }
  if (btn) {
    if (domeAutoRotate) {
      btn.classList.add('text-brand-gold');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.remove('text-brand-gold');
      btn.classList.add('text-gray-400');
    }
  }
}

// Reset Dome View Position
function resetDomePosition() {
  domeRotX = 0;
  domeRotY = 0;
  domeVx = 0;
  domeVy = 0;
  const world = document.getElementById('domeWorld');
  if (world) {
    world.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }
}

// Switch between 3D Dome View and Flat Grid View
function switchGalleryView(mode) {
  const domeView = document.getElementById('domeGalleryView');
  const gridView = document.getElementById('gridGalleryView');
  const domeBtn = document.getElementById('viewDomeBtn');
  const gridBtn = document.getElementById('viewGridBtn');

  if (mode === 'dome') {
    if (domeView) domeView.classList.remove('hidden');
    if (gridView) gridView.classList.add('hidden');

    if (domeBtn) {
      domeBtn.className = 'px-4 py-2 rounded-xl text-xs font-medium text-black bg-brand-gold transition flex items-center gap-1.5 shadow-md';
    }
    if (gridBtn) {
      gridBtn.className = 'px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition flex items-center gap-1.5';
    }
  } else {
    if (domeView) domeView.classList.add('hidden');
    if (gridView) gridView.classList.remove('hidden');

    if (gridBtn) {
      gridBtn.className = 'px-4 py-2 rounded-xl text-xs font-medium text-black bg-brand-gold transition flex items-center gap-1.5 shadow-md';
    }
    if (domeBtn) {
      domeBtn.className = 'px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition flex items-center gap-1.5';
    }

    setupGlareCards();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Render Photos in Grid View
function renderGridPhotos() {
  const grid = document.getElementById('photoGrid');
  if (!grid) return;

  grid.innerHTML = photographyWorks.map(photo => `
    <div class="photo-card-item glare-card rounded-2xl overflow-hidden glass-panel border border-white/10 group cursor-pointer" data-category="${photo.category}">
      <div class="glare-card-inner relative w-full aspect-[4/5] bg-black/60 overflow-hidden">
        <img 
          src="${photo.src}" 
          alt="${photo.title}" 
          loading="lazy" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div class="glare-sheen"></div>
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
        
        <!-- Top Category Badge -->
        <div class="absolute top-3 left-3 z-20">
          <span class="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-brand-gold uppercase tracking-wider">
            ${photo.category}
          </span>
        </div>
        
        <!-- Quick View Action Button -->
        <button 
          onclick="openPhotoModal('${photo.src}', '${photo.title}', '${photo.subtitle}')" 
          class="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-gold hover:text-black"
          title="Full View"
        >
          <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
        </button>

        <!-- Bottom Captions -->
        <div class="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col justify-end">
          <h4 class="text-base font-bold font-syne text-white group-hover:text-brand-gold transition leading-snug">
            ${photo.title}
          </h4>
          <p class="text-xs text-gray-300 font-sans mt-0.5 truncate">
            ${photo.subtitle}
          </p>
          <div class="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>${photo.camera}</span>
            <span class="text-brand-gold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View Still <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// ==========================================
// 2. REACT BITS STYLE INTERACTIVE PARTICLE TEXT
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

  const colors = [
    '#F59E0B',
    '#FBBF24',
    '#FCD34D',
    '#FEF3C7',
    '#06B6D4'
  ];

  class Particle {
    constructor(originX, originY) {
      this.originX = originX;
      this.originY = originY;
      this.x = originX + (Math.random() - 0.5) * 200;
      this.y = originY + (Math.random() - 0.5) * 200;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.size = Math.random() * 1.6 + 1.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.ease = 0.08 + Math.random() * 0.04;
      this.friction = 0.86;
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
    const gap = 4;

    const newParticles = [];

    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const index = (y * width + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha > 128) {
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
// 3. REACT BITS "GLARE HOVER" 3D TILT EFFECT
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
// 4. REACT BITS "TARGET CURSOR" (WORKS SECTION)
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
// 5. REACT BITS SPOTLIGHT CARD BORDER GLOW
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
// 6. NAVBAR SCROLL EFFECT
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
// 7. MOBILE MENU
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
// 8. VIDEO CARD HOVER PLAY / PAUSE PREVIEW
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
// 9. FILTER PORTFOLIO WORKS (FILMS)
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
// 10. FILTER PHOTOGRAPHY GRID
// ==========================================
function filterPhotos(category) {
  const buttons = document.querySelectorAll('.photo-filter-btn');
  const items = document.querySelectorAll('.photo-card-item');

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
    } else {
      item.style.display = 'none';
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// ==========================================
// 11. FULLSCREEN PHOTO LIGHTBOX MODAL
// ==========================================
const photoModal = document.getElementById('photoModal');
const modalPhotoImage = document.getElementById('modalPhotoImage');
const modalPhotoTitle = document.getElementById('modalPhotoTitle');
const modalPhotoSubtitle = document.getElementById('modalPhotoSubtitle');
const modalPhotoWhatsAppLink = document.getElementById('modalPhotoWhatsAppLink');

function openPhotoModal(imageSrc, title, subtitle) {
  if (!photoModal || !modalPhotoImage) return;

  modalPhotoImage.src = imageSrc;
  modalPhotoTitle.textContent = title || 'Shahin Photography';
  modalPhotoSubtitle.textContent = (subtitle || 'Highland Capture') + ' • Fine-Art Still';

  const encodedText = encodeURIComponent(`Hi Shahinsha! I saw your photograph "${title}" on your portfolio and I'm interested in booking a photography / portrait shoot.`);
  if (modalPhotoWhatsAppLink) {
    modalPhotoWhatsAppLink.href = `https://wa.me/918547277727?text=${encodedText}`;
  }

  photoModal.classList.remove('opacity-0', 'pointer-events-none');
  photoModal.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
  if (!photoModal || !modalPhotoImage) return;

  photoModal.classList.add('opacity-0', 'pointer-events-none');
  photoModal.classList.remove('opacity-100');
  modalPhotoImage.src = '';
  document.body.style.overflow = 'auto';
}

// ==========================================
// 12. VIDEO THEATER MODAL
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

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && !modal.classList.contains('opacity-0')) {
      closeVideoModal();
    }
    if (photoModal && !photoModal.classList.contains('opacity-0')) {
      closePhotoModal();
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

// ==========================================
// 13. CONTACT FORM VIA WHATSAPP
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
