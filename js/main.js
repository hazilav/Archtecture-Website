/* ==========================================================================
   ARCHTECTURE - ARCHITECTURE ANIMATION & VISUALIZATION STUDIO
   INSTANT-LOAD 260-FRAME CANVAS SCROLL-TRIGGERED SCRUBBING ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  init260FrameCanvasHero();
  initNavbar();
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
   1. INSTANT-LOAD 260-FRAME HTML5 CANVAS HERO SCROLL-SCRUBBING ENGINE
   -------------------------------------------------------------------------- */
function init260FrameCanvasHero() {
  const loader = document.getElementById('blueprintLoader');
  const fill = document.getElementById('loaderFill');
  const percentText = document.getElementById('loaderPercent');
  const statusText = document.getElementById('statusText');
  const canvas = document.getElementById('heroCanvas');
  const textOverlay = document.getElementById('heroTextOverlay');
  const badge = document.getElementById('heroLayerBadge');
  const scrollInd = document.getElementById('heroScrollIndicator');
  const badgeNum = document.getElementById('badgeNum');
  const badgeTitle = document.getElementById('badgeTitle');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const frameCount = 260;
  const images = [];
  const seq = { frame: 0 };
  let imagesLoaded = 0;
  let loaderDismissed = false;

  function currentFramePath(index) {
    return `./assets/images/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(Math.floor(seq.frame));
  }

  // Find exact loaded frame or closest loaded neighbor for smooth 60fps rendering
  function getBestLoadedImage(index) {
    const target = images[index];
    if (target && target.complete && target.naturalWidth > 0) {
      return target;
    }
    // Search backwards for nearest ready frame
    for (let i = index - 1; i >= 0; i--) {
      if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
        return images[i];
      }
    }
    // Search forwards
    for (let i = index + 1; i < frameCount; i++) {
      if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
        return images[i];
      }
    }
    return null;
  }

  function renderFrame(index) {
    const img = getBestLoadedImage(index);
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Full-screen fit ratio so the entire building frame is visible without cropping/zooming in
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function dismissLoader() {
    if (loaderDismissed) return;
    loaderDismissed = true;

    if (fill) fill.style.width = '100%';
    if (percentText) percentText.textContent = '100%';
    if (statusText) statusText.textContent = 'STUDIO READY...';

    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 250);
    }
    setupGSAPScrollScrub();
  }

  // Safety fallback: Dismiss loader after 2.2 seconds max regardless of network latency
  const safetyTimeout = setTimeout(() => {
    dismissLoader();
  }, 2200);

  // Preload Key Anchor Frames First for Ultra-Fast Instant Launch
  const priorityIndices = [];
  for (let i = 0; i < frameCount; i += 5) priorityIndices.push(i);
  for (let i = 0; i < frameCount; i++) {
    if (i % 5 !== 0) priorityIndices.push(i);
  }

  // Initialize image slots
  for (let i = 0; i < frameCount; i++) {
    images[i] = new Image();
  }

  let priorityCount = 0;
  const targetPriority = Math.min(15, priorityIndices.length);

  priorityIndices.forEach((frameIdx) => {
    const img = images[frameIdx];
    img.src = currentFramePath(frameIdx);

    img.onload = () => {
      imagesLoaded++;
      priorityCount++;

      const visualProgress = Math.min(100, Math.round((priorityCount / targetPriority) * 100));

      if (fill) fill.style.width = `${visualProgress}%`;
      if (percentText) percentText.textContent = `${visualProgress}%`;
      if (statusText) statusText.textContent = `PRELOADING FRAME ${imagesLoaded} / ${frameCount}...`;

      if (imagesLoaded === 1) {
        renderFrame(0);
      }

      // Fast-launch: Open website as soon as priority anchor frames are loaded
      if (priorityCount >= targetPriority && !loaderDismissed) {
        clearTimeout(safetyTimeout);
        dismissLoader();
      }
    };

    img.onerror = () => {
      imagesLoaded++;
      if (!loaderDismissed && imagesLoaded > 10) {
        dismissLoader();
      }
    };
  });

  function setupGSAPScrollScrub() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(setupGSAPScrollScrub, 50);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // GSAP 260-Frame Scrubbing Timeline
    gsap.to(seq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#heroPinSection",
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const currentIdx = Math.floor(seq.frame);
          renderFrame(currentIdx);

          const p = self.progress;
          const frameNumStr = String(currentIdx + 1).padStart(3, '0');
          if (badgeNum) badgeNum.textContent = `FRAME ${frameNumStr} / 260`;

          if (badgeTitle) {
            if (p < 0.25) {
              badgeTitle.textContent = "EXTERIOR FACADE ANATOMY";
            } else if (p >= 0.25 && p < 0.50) {
              badgeTitle.textContent = "EXPLODED ARCHITECTURAL CUTAWAY";
            } else if (p >= 0.50 && p < 0.75) {
              badgeTitle.textContent = "PANORAMIC FACADE ZOOM-OUT";
            } else {
              badgeTitle.textContent = "X-RAY WIREFRAME BLUEPRINT";
            }
          }
        }
      }
    });

    // Fade out text overlay, frame badge indicator, and mouse scroll icon on initial scroll
    const hideTargets = [textOverlay, badge, scrollInd].filter(Boolean);

    if (hideTargets.length) {
      gsap.to(hideTargets, {
        opacity: 0,
        y: -30,
        pointerEvents: "none",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#heroPinSection",
          start: "top top",
          end: "+=20%",
          scrub: true
        }
      });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
}

/* --------------------------------------------------------------------------
   2. STICKY NAVBAR & NAVIGATION
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
   3. INTERACTIVE BEFORE / AFTER SLIDER
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
   4. PORTFOLIO FILTER & LIGHTBOX VIDEO MODAL
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
      const imgSrc = item.getAttribute('data-img') || './assets/images/ezgif-frame-001.png';
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
   5. INTERACTIVE PROJECT SCOPE ESTIMATOR
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
   6. TESTIMONIAL CAROUSEL
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
   7. PROCESS TIMELINE SCROLL PROGRESS
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
   8. WORLD STUDIO CLOCKS
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
   9. WEB AUDIO API AMBIENT SOUNDSCAPE SYNTHESIZER
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
   10. CONTACT FORM & SERVICE MODALS
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
