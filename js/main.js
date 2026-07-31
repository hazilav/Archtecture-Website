/* ==========================================================================
   AETHER VISUALS - ARCHITECTURE ANIMATION & VISUALIZATION STUDIO
   GSAP 4-IMAGE SCROLL-TRIGGERED CROSSFADE HERO SEQUENCER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBlueprintLoader();
  initNavbar();
  init4ImageHeroSequence();
  initBeforeAfterSlider();
  initPortfolioFilter();
  initProjectEstimator();
  initTestimonialSlider();
  initProcessTimeline();
  initStudioClocks();
  initAmbientAudio();
  initContactForm();
  initServiceModals();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

/* --------------------------------------------------------------------------
   1. ARCHITECTURAL BLUEPRINT LOADER
   -------------------------------------------------------------------------- */
function initBlueprintLoader() {
  const loader = document.getElementById('blueprintLoader');
  const fill = document.getElementById('loaderFill');
  const percentText = document.getElementById('loaderPercent');
  const statusText = document.getElementById('statusText');
  const canvas = document.getElementById('blueprintCanvas');
  if (!canvas || !loader) return;

  const ctx = canvas.getContext('2d');
  let progress = 0;

  const statusMessages = [
    "LOADING ARCHITECTURAL RENDERS...",
    "SYNCHRONIZING GSAP SCROLLTRIGGER TIMELINE...",
    "BUILDING PINNED CROSSFADE ENGINE...",
    "CONFIGURING SCALE TRANSITIONS...",
    "READY FOR ARCHITECTURAL VISUALIZATION..."
  ];

  function drawBlueprint(prog) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const maxLines = Math.floor((prog / 100) * 12);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.8;

    if (prog > 5) {
      ctx.beginPath();
      ctx.rect(90, 40, 120, 140);
      ctx.stroke();
    }
    for (let i = 0; i < maxLines; i++) {
      const y = 170 - (i * 10);
      ctx.beginPath();
      ctx.moveTo(90, y);
      ctx.lineTo(210, y);
      ctx.stroke();

      for (let x = 105; x < 200; x += 20) {
        ctx.fillStyle = (i % 2 === 0) ? '#F5D77F' : 'rgba(212, 175, 55, 0.4)';
        ctx.fillRect(x, y - 6, 8, 4);
      }
    }
    if (prog > 80) {
      ctx.beginPath();
      ctx.moveTo(150, 40);
      ctx.lineTo(150, 10);
      ctx.stroke();
    }
  }

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 6) + 4;
    if (progress > 100) progress = 100;

    fill.style.width = `${progress}%`;
    percentText.textContent = `${progress}%`;

    const statusIndex = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
    statusText.textContent = statusMessages[statusIndex];

    drawBlueprint(progress);

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 300);
    }
  }, 20);
}

/* --------------------------------------------------------------------------
   2. GSAP 4-IMAGE PINNED HERO CROSSFADE SEQUENCER
   -------------------------------------------------------------------------- */
function init4ImageHeroSequence() {
  const heroPinSection = document.getElementById('heroPinSection');
  const img1 = document.getElementById('heroImg1');
  const img2 = document.getElementById('heroImg2');
  const img3 = document.getElementById('heroImg3');
  const img4 = document.getElementById('heroImg4');
  const textOverlay = document.getElementById('heroTextOverlay');
  const badgeNum = document.getElementById('badgeNum');
  const badgeTitle = document.getElementById('badgeTitle');

  if (!heroPinSection || typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Set explicit initial GSAP properties
  gsap.set(img1, { opacity: 1, scale: 1.0 });
  gsap.set(img2, { opacity: 0, scale: 1.0 });
  gsap.set(img3, { opacity: 0, scale: 1.0 });
  gsap.set(img4, { opacity: 0, scale: 1.0 });
  gsap.set(textOverlay, { opacity: 1, y: 0 });

  // Construct GSAP Pinned Scrub Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#heroPinSection",
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        // Update Dynamic Layer Badge Title
        if (p < 0.25) {
          badgeNum.textContent = "01 / 04";
          badgeTitle.textContent = "BUILDING EXTERIOR FACADE";
        } else if (p >= 0.25 && p < 0.50) {
          badgeNum.textContent = "02 / 04";
          badgeTitle.textContent = "EXPLODED ARCHITECTURAL CUTAWAY";
        } else if (p >= 0.50 && p < 0.75) {
          badgeNum.textContent = "03 / 04";
          badgeTitle.textContent = "EXTERIOR PANORAMIC VIEW";
        } else {
          badgeNum.textContent = "04 / 04";
          badgeTitle.textContent = "X-RAY WIREFRAME BLUEPRINT";
        }
      }
    }
  });

  // 1. Hero Text Overlay Fade Out (0.00 -> 0.15)
  tl.to(textOverlay, { 
    opacity: 0, 
    y: -40, 
    duration: 0.15, 
    ease: "power1.inOut" 
  }, 0);

  // 2. Image 1 Ken Burns Scale & Crossfade to Image 2 (0.00 -> 0.33)
  tl.to(img1, { 
    scale: 1.06, 
    duration: 0.33, 
    ease: "none" 
  }, 0)
  .to(img2, { 
    opacity: 1, 
    scale: 1.03, 
    duration: 0.25, 
    ease: "power2.inOut" 
  }, 0.08)
  .to(img1, { 
    opacity: 0, 
    duration: 0.20, 
    ease: "power2.inOut" 
  }, 0.12);

  // 3. Image 2 Ken Burns Scale & Crossfade to Image 3 (0.33 -> 0.66)
  tl.to(img2, { 
    scale: 1.06, 
    duration: 0.33, 
    ease: "none" 
  }, 0.33)
  .to(img3, { 
    opacity: 1, 
    scale: 1.03, 
    duration: 0.25, 
    ease: "power2.inOut" 
  }, 0.41)
  .to(img2, { 
    opacity: 0, 
    duration: 0.20, 
    ease: "power2.inOut" 
  }, 0.45);

  // 4. Image 3 Ken Burns Scale & Crossfade to Image 4 (0.66 -> 1.00)
  tl.to(img3, { 
    scale: 1.06, 
    duration: 0.33, 
    ease: "none" 
  }, 0.66)
  .to(img4, { 
    opacity: 1, 
    scale: 1.03, 
    duration: 0.25, 
    ease: "power2.inOut" 
  }, 0.74)
  .to(img3, { 
    opacity: 0, 
    duration: 0.20, 
    ease: "power2.inOut" 
  }, 0.78)
  .to(img4, { 
    scale: 1.06, 
    duration: 0.26, 
    ease: "none" 
  }, 0.74);
}

/* --------------------------------------------------------------------------
   3. STICKY NAVBAR & NAVIGATION
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNav();
  });

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      mobileOverlay.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileOverlay.classList.remove('active');
      });
    });
  }
}

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = sec.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE BEFORE / AFTER SLIDER
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterSlider');
  const clip = document.getElementById('wireframeClip');
  const handle = document.getElementById('sliderHandle');
  if (!container || !clip || !handle) return;

  let isDragging = false;

  function updateSlider(x) {
    const rect = container.getBoundingClientRect();
    let offsetX = x - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    clip.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* --------------------------------------------------------------------------
   5. PORTFOLIO FILTER & LIGHTBOX VIDEO MODAL
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title') || 'Project Architectural Film';
      const imgSrc = item.getAttribute('data-img') || 'assets/images/image_1.png';
      openVideoModal(title, imgSrc);
    });
  });
}

function openVideoModal(title, imgSrc) {
  const videoModal = document.getElementById('videoModal');
  const modalImg = document.getElementById('videoModalImg');
  const modalTitle = document.getElementById('videoModalTitle');

  if (videoModal && modalImg && modalTitle) {
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    videoModal.classList.add('active');
  }
}

function closeVideoModal() {
  const videoModal = document.getElementById('videoModal');
  if (videoModal) videoModal.classList.remove('active');
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE PROJECT SCOPE ESTIMATOR
   -------------------------------------------------------------------------- */
function initProjectEstimator() {
  const typeBtns = document.querySelectorAll('.option-btn[data-type]');
  const areaRange = document.getElementById('areaRange');
  const areaVal = document.getElementById('areaVal');
  const timeRange = document.getElementById('timeRange');
  const timeVal = document.getElementById('timeVal');
  const turnaroundRadios = document.querySelectorAll('input[name="turnaround"]');

  const calcPrice = document.getElementById('calcPrice');
  const sumType = document.getElementById('sumType');
  const sumArea = document.getElementById('sumArea');
  const sumTime = document.getElementById('sumTime');
  const sumTimeline = document.getElementById('sumTimeline');

  let currentBase = 4500;
  let currentTypeName = '3D Architectural Walkthrough';

  if (!areaRange || !calcPrice) return;

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentBase = parseInt(btn.getAttribute('data-base')) || 4500;
      currentTypeName = btn.innerText.trim();
      calculateEstimate();
    });
  });

  areaRange.addEventListener('input', () => {
    const sqft = parseInt(areaRange.value).toLocaleString();
    areaVal.textContent = `${sqft} SQ FT`;
    calculateEstimate();
  });

  timeRange.addEventListener('input', () => {
    timeVal.textContent = `${timeRange.value} SECONDS`;
    calculateEstimate();
  });

  turnaroundRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
      radio.closest('.radio-card').classList.add('active');
      calculateEstimate();
    });
  });

  function calculateEstimate() {
    const area = parseInt(areaRange.value);
    const time = parseInt(timeRange.value);
    const speedMult = parseFloat(document.querySelector('input[name="turnaround"]:checked').value);

    const baseTotal = currentBase + (area * 0.12) + (time * 45);
    const lowEst = Math.round((baseTotal * speedMult * 0.9) / 100) * 100;
    const highEst = Math.round((baseTotal * speedMult * 1.25) / 100) * 100;

    calcPrice.textContent = `$${lowEst.toLocaleString()} - $${highEst.toLocaleString()}`;

    sumType.textContent = currentTypeName;
    sumArea.textContent = `${area.toLocaleString()} SQ FT`;
    sumTime.textContent = `${time} Seconds (4K/8K)`;
    sumTimeline.textContent = speedMult > 1.1 ? '10-14 Days (Priority)' : '3-4 Weeks';
  }

  calculateEstimate();
}

function applyEstimateToContact() {
  const sumType = document.getElementById('sumType').textContent;
  const price = document.getElementById('calcPrice').textContent;

  const notesInput = document.getElementById('projectNotes');
  if (notesInput) {
    notesInput.value = `Inquiry based on Estimator Quote: ${sumType} (${price}). Please contact me regarding CAD files and scheduling.`;
  }
}

/* --------------------------------------------------------------------------
   7. TESTIMONIAL CAROUSEL
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentIndex = 0;

  if (!cards.length) return;

  function showSlide(index) {
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = (index + cards.length) % cards.length;
    cards[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  setInterval(() => {
    showSlide(currentIndex + 1);
  }, 7000);
}

/* --------------------------------------------------------------------------
   8. PROCESS TIMELINE SCROLL PROGRESS
   -------------------------------------------------------------------------- */
function initProcessTimeline() {
  const timelineSection = document.getElementById('process');
  const progressBar = document.getElementById('timelineProgressBar');
  const steps = document.querySelectorAll('.timeline-step');
  if (!timelineSection || !progressBar) return;

  window.addEventListener('scroll', () => {
    const rect = timelineSection.getBoundingClientRect();
    const sectionHeight = timelineSection.offsetHeight;
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
      const scrolled = (windowHeight / 2 - rect.top) / sectionHeight;
      const pct = Math.min(Math.max(scrolled * 100, 0), 100);
      progressBar.style.height = `${pct}%`;

      steps.forEach((step) => {
        const stepTop = step.getBoundingClientRect().top;
        if (stepTop < windowHeight * 0.7) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   9. WORLD STUDIO CLOCKS
   -------------------------------------------------------------------------- */
function initStudioClocks() {
  const nyClock = document.getElementById('clockNY');
  const londonClock = document.getElementById('clockLondon');
  const tokyoClock = document.getElementById('clockTokyo');

  function updateClocks() {
    const now = new Date();

    if (nyClock) {
      nyClock.textContent = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' });
    }
    if (londonClock) {
      londonClock.textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' });
    }
    if (tokyoClock) {
      tokyoClock.textContent = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' });
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* --------------------------------------------------------------------------
   10. WEB AUDIO API AMBIENT SOUNDSCAPE SYNTHESIZER
   -------------------------------------------------------------------------- */
function initAmbientAudio() {
  const audioBtn = document.getElementById('audioToggle');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let osc1, osc2, gainNode;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientSound();
      audioBtn.classList.add('playing');
      isPlaying = true;
    } else {
      stopAmbientSound();
      audioBtn.classList.remove('playing');
      isPlaying = false;
    }
  });

  function startAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      osc1 = audioCtx.createOscillator();
      osc2 = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, audioCtx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(164.81, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
    } catch (e) {
      console.log('Web Audio API not supported on browser');
    }
  }

  function stopAmbientSound() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        if (osc1) osc1.stop();
        if (osc2) osc2.stop();
        if (audioCtx) audioCtx.close();
      }, 1000);
    }
  }
}

/* --------------------------------------------------------------------------
   11. CONTACT FORM & SERVICE MODALS
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successModal = document.getElementById('successModal');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group.classList.add('invalid');
        isValid = false;
      } else {
        group.classList.remove('invalid');
      }
    });

    if (isValid) {
      form.reset();
      if (successModal) successModal.classList.add('active');
    }
  });
}

function closeSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) successModal.classList.remove('active');
}

const serviceData = {
  1: {
    title: "3D Architectural Walkthroughs",
    icon: "ri-walk-line",
    desc: "Our spatial walkthroughs take clients on an emotional journey through your architectural vision. We choreograph camera paths with true human perspective, dynamic lighting changes (dawn to dusk), and real-world material responses.",
    features: [
      "8K 60FPS fluid camera choreography",
      "Custom sound design and orchestral scoring",
      "Photometric lighting based on actual GPS sun coordinates",
      "Ideal for developer sales centers and investor presentations"
    ]
  },
  2: {
    title: "Exterior Photorealistic Renders",
    icon: "ri-building-4-line",
    desc: "Single still frames that command attention. We render exterior facades with ultra-accurate glass dispersion, wet pavement reflections, volumetric fog, and ambient vegetation.",
    features: [
      "Up to 12K print-resolution output",
      "Custom twilight, night, rainy & sunny atmospheric passes",
      "Full 3D landscape and foliage ecosystem staging",
      "Perfect for billboards, competition panels, and magazine spreads"
    ]
  },
  3: {
    title: "Interior Fly-Throughs",
    icon: "ri-sofa-line",
    desc: "Highlighting interior craftsmanship with tactile intimacy. We capture micro-details of custom millwork, marble veining, fabric textures, and indirect ambient LED light wells.",
    features: [
      "Bespoke 3D furniture & luxury decor staging",
      "PBR material shaders with physical roughness & normal maps",
      "Daylight simulation & artificial lighting balancing",
      "Tailored for luxury interior designers and penthouse marketing"
    ]
  },
  4: {
    title: "VR / AR Real-Time Walkthroughs",
    icon: "ri-headset-line",
    desc: "Powered by Unreal Engine 5.4. Prospective buyers can wear VR headsets or interact on touchscreens to freely explore spaces, change kitchen finishes, or adjust time of day live.",
    features: [
      "Meta Quest, HTC Vive & WebXR standalone compatibility",
      "Instant material, flooring, and furniture color swapping",
      "Interactive lighting and sun angle control",
      "Enables pre-sale buyers to customize units before groundbreaking"
    ]
  },
  5: {
    title: "Drone-Style Flyover Films",
    icon: "ri-flight-takeoff-line",
    desc: "Blending physical drone flight camera paths with CGI masterplan models. We track camera movement in 3D space to composite your unbuilt tower into actual city skylines.",
    features: [
      "High-precision 3D matchmoving & camera tracking",
      "Integration of actual 4K aerial drone footage",
      "Surrounding urban masterplan & transit mapping overlays",
      "Unrivaled for mega-developments and urban regeneration films"
    ]
  },
  6: {
    title: "Real Estate Animation Films",
    icon: "ri-film-fill",
    desc: "Complete cinematic productions. We handle storyboarding, scriptwriting, voiceover casting, 3D animation, titles, and sound mastering to deliver a turnkey launch film.",
    features: [
      "Hollywood-style storyboard & narrative direction",
      "Professional voiceover recording in 12+ languages",
      "Social media teasers (9:16) & full widescreen launch edits",
      "Proven to accelerate pre-lease rates and investor buy-in"
    ]
  }
};

function initServiceModals() {}

function openServiceModal(serviceId) {
  const modal = document.getElementById('serviceModal');
  const body = document.getElementById('modalServiceBody');
  const data = serviceData[serviceId];
  if (!modal || !body || !data) return;

  body.innerHTML = `
    <div style="font-size: 2.5rem; color: var(--color-gold); margin-bottom: 1rem;"><i class="${data.icon}"></i></div>
    <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 1rem;">${data.title}</h3>
    <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${data.desc}</p>
    <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-gold); margin-bottom: 0.8rem; letter-spacing: 1px;">KEY DELIVERABLES:</h4>
    <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
      ${data.features.map(f => `<li style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-main); margin-bottom: 0.5rem; font-size: 0.9rem;"><i class="ri-checkbox-circle-line" style="color: var(--color-gold);"></i> ${f}</li>`).join('')}
    </ul>
    <a href="#contact" class="btn btn-gold btn-block" onclick="closeServiceModal()">Inquire About This Service</a>
  `;

  modal.classList.add('active');
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (modal) modal.classList.remove('active');
}
