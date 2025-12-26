// ==============================================
// AUTOMATIZAI - Landing Page Interactive JS
// Professional animations and interactions
// ==============================================

// ============================================
// 1. INFINITE LOGO SCROLL (6 rows)
// ============================================
const initInfiniteLogoScroll = () => {
  const logoRows = [
    {
      id: 'row-1',
      speed: 30,
      logos: [
        { name: 'Instagram', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg' },
        { name: 'Facebook', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg' },
        { name: 'TikTok', img: 'https://img.icons8.com/fluency/96/tiktok.png' },
        { name: 'Twitter', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg' },
        { name: 'LinkedIn', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg' },
        { name: 'YouTube', img: 'https://img.icons8.com/fluency/96/youtube-play.png' }
      ]
    },
    {
      id: 'row-2',
      speed: 25,
      logos: [
        { name: 'Salesforce', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg' },
        { name: 'HubSpot', img: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-hubspot-a-developer-and-marketer-of-software-products-for-inbound-marketing-logo-color-tal-revivo.png' },
        { name: 'Zoho', img: 'https://img.icons8.com/color/96/zoho-crm.png' },
        { name: 'Pipedrive', img: 'https://img.icons8.com/color/96/pipedrive.png' },
        { name: 'Monday', img: 'https://img.icons8.com/color/96/monday.png' }
      ]
    },
    {
      id: 'row-3',
      speed: 35,
      logos: [
        { name: 'Shopify', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg' },
        { name: 'WooCommerce', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg' },
        { name: 'Magento', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg' },
        { name: 'PrestaShop', img: 'https://img.icons8.com/color/96/prestashop.png' },
        { name: 'BigCommerce', img: 'https://img.icons8.com/color/96/bigcommerce.png' }
      ]
    },
    {
      id: 'row-4',
      speed: 28,
      logos: [
        { name: 'Mailchimp', img: 'https://img.icons8.com/color/96/mailchimp.png' },
        { name: 'SendGrid', img: 'https://img.icons8.com/color/96/sendgrid.png' },
        { name: 'ActiveCampaign', img: 'https://img.icons8.com/color/96/activecampaign.png' },
        { name: 'GetResponse', img: 'https://img.icons8.com/color/96/getresponse.png' },
        { name: 'ConvertKit', img: 'https://img.icons8.com/color/96/convertkit.png' }
      ]
    },
    {
      id: 'row-5',
      speed: 32,
      logos: [
        { name: 'Slack', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg' },
        { name: 'Trello', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg' },
        { name: 'Asana', img: 'https://img.icons8.com/color/96/asana.png' },
        { name: 'Notion', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg' },
        { name: 'ClickUp', img: 'https://img.icons8.com/color/96/clickup.png' }
      ]
    },
    {
      id: 'row-6',
      speed: 26,
      logos: [
        { name: 'Google Analytics', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googleanalytics/googleanalytics-original.svg' },
        { name: 'Mixpanel', img: 'https://img.icons8.com/color/96/mixpanel.png' },
        { name: 'Amplitude', img: 'https://img.icons8.com/color/96/amplitude.png' },
        { name: 'Segment', img: 'https://img.icons8.com/color/96/segment.png' },
        { name: 'Tableau', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tableau/tableau-original.svg' }
      ]
    }
  ];

  const container = document.getElementById('infinite-logos-container');
  if (!container) return;

  logoRows.forEach((row, index) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'logo-row';
    rowDiv.id = row.id;
    rowDiv.setAttribute('data-speed', row.speed);

    // Duplicate logos for seamless loop
    const allLogos = [...row.logos, ...row.logos, ...row.logos];

    const track = document.createElement('div');
    track.className = 'logo-track';

    allLogos.forEach(logo => {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'logo-item';
      logoDiv.innerHTML = `
        <img src="${logo.img}" alt="${logo.name}" />
        <span class="logo-name">${logo.name}</span>
      `;
      track.appendChild(logoDiv);
    });

    rowDiv.appendChild(track);
    container.appendChild(rowDiv);

    // Start animation
    animateLogoRow(track, row.speed, index % 2 === 0);
  });
};

const animateLogoRow = (track, speed, reverse = false) => {
  let position = 0;
  const move = () => {
    if (reverse) {
      position += speed / 60;
      if (position >= track.scrollWidth / 3) {
        position = 0;
      }
      track.style.transform = `translateX(-${position}px)`;
    } else {
      position -= speed / 60;
      if (Math.abs(position) >= track.scrollWidth / 3) {
        position = 0;
      }
      track.style.transform = `translateX(${position}px)`;
    }
    requestAnimationFrame(move);
  };
  move();
};

// ============================================
// 2. STATS COUNTER ANIMATION
// ============================================
const initStatsCounter = () => {
  const counters = document.querySelectorAll('.stat-number');

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
};

// ============================================
// 3. SCROLL ANIMATIONS
// ============================================
const initScrollAnimations = () => {
  const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
};

// ============================================
// 4. TESTIMONIAL SLIDER
// ============================================
const initTestimonialSlider = () => {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  const nextBtn = document.getElementById('testimonial-next');
  const prevBtn = document.getElementById('testimonial-prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateSlider();
    });
  }

  const updateSlider = () => {
    cards.forEach((card, index) => {
      card.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
  };

  // Auto-slide every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
  }, 5000);
};

// ============================================
// 5. FAQ ACCORDION
// ============================================
const initFAQAccordion = () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked (if wasn't open)
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
};

// ============================================
// 6. PRICING TOGGLE (Monthly/Annual)
// ============================================
const initPricingToggle = () => {
  const toggle = document.getElementById('pricing-toggle');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    const prices = document.querySelectorAll('.plan-price');

    prices.forEach(price => {
      const monthly = parseInt(price.getAttribute('data-monthly'));
      const annual = parseInt(price.getAttribute('data-annual'));

      if (isAnnual) {
        price.textContent = `$${annual}`;
        price.nextElementSibling.textContent = '/año';
      } else {
        price.textContent = `$${monthly}`;
        price.nextElementSibling.textContent = '/mes';
      }
    });
  });
};

// ============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
const initSmoothScroll = () => {
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
};

// ============================================
// 8. MOBILE MENU
// ============================================
const initMobileMenu = () => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
};

// ============================================
// 9. VIDEO DEMO MODAL
// ============================================
const initVideoDemo = () => {
  const demoBtn = document.getElementById('watch-demo-btn');
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close');
  const video = document.getElementById('demo-video');

  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      modal.classList.add('active');
      video?.play();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      video?.pause();
      video.currentTime = 0;
    });
  }

  // Close on outside click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      video?.pause();
      video.currentTime = 0;
    }
  });
};

// ============================================
// 10. PARALLAX EFFECT
// ============================================
const initParallax = () => {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
};

// ============================================
// 11. SCROLL PROGRESS BAR
// ============================================
const initScrollProgress = () => {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
};

// ============================================
// 12. FORM VALIDATION & SUBMISSION
// ============================================
const initFormHandlers = () => {
  const ctaForm = document.getElementById('cta-form');

  if (ctaForm) {
    ctaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('cta-email').value;
      const name = document.getElementById('cta-name').value;

      // Send to API
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name })
        });

        if (response.ok) {
          alert('¡Gracias! Te contactaremos pronto.');
          ctaForm.reset();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar. Intenta de nuevo.');
      }
    });
  }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initInfiniteLogoScroll();
  initStatsCounter();
  initScrollAnimations();
  initTestimonialSlider();
  initFAQAccordion();
  initPricingToggle();
  initSmoothScroll();
  initMobileMenu();
  initVideoDemo();
  initParallax();
  initScrollProgress();
  initFormHandlers();

  console.log('🚀 AutomatizAI Landing initialized!');
});

// Prevent scroll on load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
