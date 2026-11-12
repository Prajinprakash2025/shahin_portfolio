// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  setupVideoHoverPreviews();
  setupNavbarScroll();
  setupMobileMenu();
});

// Navbar background blur effect on scroll
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

// Mobile Menu Toggle
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

// Video Card Hover Play / Pause Preview
function setupVideoHoverPreviews() {
  const videoCards = document.querySelectorAll('.project-item');

  videoCards.forEach(card => {
    const video = card.querySelector('video.work-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(err => {
        // Autoplay may be restricted in some browsers without user interaction
        console.log('Video preview hover play muted', err);
      });
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

// Filter Portfolio Works
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

  // Re-run icons in case layout shifted
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Video Theater Modal Open/Close
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

// Close modal on escape key or clicking backdrop
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.classList.contains('opacity-0')) {
    closeVideoModal();
  }
});

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });
}

// Handle Contact Form Submission via WhatsApp
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const category = document.getElementById('projectCategory').value;
  const details = document.getElementById('projectDetails').value.trim();

  const message = `🎬 *New Project Inquiry for Shahinsha Kabeer*\n\n*Name:* ${name}\n*Contact:* ${phone}\n*Project Type:* ${category}\n*Details:* ${details}\n\nSent from Portfolio Website.`;

  const waUrl = `https://wa.me/918547277727?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}
