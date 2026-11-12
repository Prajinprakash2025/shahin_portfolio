// Initialize Everything on DOM Load
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

      // 3D rotation limits
      const rotateX = (0.5 - y) * 18;
      const rotateY = (x - 0.5) * 18;

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
      const labelText = target.dataset.targetLabel || 'VIEW [●]';
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
// 9. FILTER PHOTOGRAPHY GALLERY
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
// 10. FULLSCREEN PHOTO LIGHTBOX MODAL
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
  modalPhotoWhatsAppLink.href = `https://wa.me/918547277727?text=${encodedText}`;

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
// 11. VIDEO THEATER MODAL
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
  modalWhatsAppLink.href = `https://wa.me/918547277727?text=${encodedText}`;

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
// 12. CONTACT FORM VIA WHATSAPP
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
