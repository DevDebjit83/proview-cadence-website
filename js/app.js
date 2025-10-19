// =====================================================
// ProView Cadence - Main JavaScript
// Dynamic Content Loading & Interactions
// =====================================================

// Global variables
let currentSlide = 0;
let currentTestimonial = 0;
let siteData = null;

// =====================================================
// Initialize on DOM Load
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadSiteData();
    initNavigation();
    initScrollEffects();
    initContactForm();
    initWhatsAppButton();
});

// =====================================================
// Load Site Data from JSON
// =====================================================
async function loadSiteData() {
    try {
        // Try to fetch from API first (dynamic mode)
        let response;
        try {
            response = await fetch('/api/data');
            if (!response.ok) throw new Error('API not available');
        } catch (apiError) {
            // Fallback to static file if API is not available
            console.log('API not available, loading static data...');
            response = await fetch('data/data.json');
        }
        
        siteData = await response.json();
        
        // Render all sections
        renderNewsTicker();
        renderLogo();
        renderHeroSlider();
        renderStats();
        renderServices();
        renderProjects();
        renderTestimonials();
        renderFAQs();
        renderContactInfo();
        renderGallery();
        
        // Initialize hero slider after rendering
        initHeroSlider();
    } catch (error) {
        console.error('Error loading site data:', error);
        showFallbackContent();
    }
}

// =====================================================
// News Ticker Rendering
// =====================================================
function renderNewsTicker() {
    const tickerText = document.getElementById('tickerText');
    const newsTicker = document.getElementById('newsTicker');
    if (!tickerText || !siteData || !siteData.newsTicker) return;
    
    // Update ticker text
    tickerText.textContent = siteData.newsTicker.text;
    
    // Show/hide ticker based on enabled status
    if (siteData.newsTicker.enabled === false) {
        newsTicker.style.display = 'none';
    } else {
        newsTicker.style.display = 'block';
    }
}

// =====================================================
// Logo Rendering
// =====================================================
function renderLogo() {
    const navLogo = document.getElementById('navLogo');
    if (!navLogo || !siteData) return;
    
    const logo = siteData.logo;
    
    if (logo.type === 'image' && logo.image) {
        navLogo.innerHTML = `<img src="${logo.image}" alt="${logo.text}" class="logo-image">`;
    } else {
        // Default text logo
        const words = logo.text.split(' ');
        if (words.length === 2) {
            navLogo.innerHTML = `<h2>${words[0]} <span>${words[1]}</span></h2>`;
        } else {
            navLogo.innerHTML = `<h2>${logo.text}</h2>`;
        }
    }
}

// =====================================================
// Hero Slider with Background Images
// =====================================================
function renderHeroSlider() {
    const heroSlider = document.getElementById('heroSlider');
    const heroDots = document.getElementById('heroDots');
    if (!heroSlider || !siteData || !siteData.hero || !siteData.hero.slides) return;
    
    const slides = siteData.hero.slides;
    
    // Render slides
    heroSlider.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${slide.backgroundImage}');">
            <div class="hero-overlay"></div>
            <div class="hero-content container">
                <span class="hero-tag">${slide.tag}</span>
                <h1 class="hero-title">${slide.title}</h1>
                <p class="hero-description">${slide.description}</p>
                <a href="${slide.buttonLink}" class="btn btn-primary">${slide.buttonText}</a>
            </div>
        </div>
    `).join('');
    
    // Render dots
    heroDots.innerHTML = slides.map((_, index) => `
        <span class="hero-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
    `).join('');
}

// =====================================================
// Stats Section
// =====================================================
function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid || !siteData) return;
    
    statsGrid.innerHTML = siteData.stats.map((stat, index) => `
        <div class="stat-item" style="animation-delay: ${index * 0.1}s">
            <div class="stat-number" data-target="${stat.number}">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
    
    animateNumbers();
}

function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.getAttribute('data-target');
                animateValue(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(num => observer.observe(num));
}

function animateValue(element, target) {
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const steps = 60;
    const stepValue = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        let displayValue = Math.floor(current);
        if (isPercentage) displayValue += '%';
        if (isPlus && current >= numericValue) displayValue += '+';
        element.textContent = displayValue;
    }, duration / steps);
}

// =====================================================
// Services Section
// =====================================================
function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid || !siteData) return;
    
    servicesGrid.innerHTML = siteData.services.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-icon">${service.icon}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-details">
                <ul>
                    ${service.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            <button class="service-toggle" onclick="toggleService(${service.id})">Learn More</button>
        </div>
    `).join('');
}

function toggleService(serviceId) {
    const card = document.querySelector(`[data-service-id="${serviceId}"]`);
    const button = card.querySelector('.service-toggle');
    
    card.classList.toggle('expanded');
    button.textContent = card.classList.contains('expanded') ? 'Show Less' : 'Learn More';
}

// =====================================================
// Projects Section
// =====================================================
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid || !siteData) return;
    
    projectsGrid.innerHTML = siteData.projects.map(project => {
        const hasGithub = project.githubLink && project.githubLink !== '';
        const hasLive = project.liveLink && project.liveLink !== '';
        
        return `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <span class="project-category">${project.category}</span>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                ${(hasGithub || hasLive) ? `
                <div class="project-links">
                    ${hasGithub ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="project-link github-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>` : ''}
                    ${hasLive ? `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="project-link live-link">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>` : ''}
                </div>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');
    
    initProjectFilters();
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// =====================================================
// Testimonials Section
// =====================================================
function renderTestimonials() {
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    if (!testimonialsSlider || !siteData) return;
    
    testimonialsSlider.innerHTML = siteData.testimonials.map((testimonial, index) => `
        <div class="testimonial-card ${index === 0 ? 'active' : ''}">
            <div class="testimonial-avatar">${testimonial.avatar}</div>
            <div class="testimonial-rating">
                ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
            </div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <h4 class="testimonial-name">${testimonial.name}</h4>
            <p class="testimonial-position">${testimonial.position}</p>
        </div>
    `).join('');
    
    initTestimonialSlider();
}

function initTestimonialSlider() {
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => changeTestimonial(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeTestimonial(1));
    
    // Auto-advance testimonials
    setInterval(() => changeTestimonial(1), 5000);
}

function changeTestimonial(direction) {
    if (!siteData) return;
    
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials[currentTestimonial].classList.remove('active');
    
    currentTestimonial += direction;
    if (currentTestimonial >= testimonials.length) currentTestimonial = 0;
    if (currentTestimonial < 0) currentTestimonial = testimonials.length - 1;
    
    testimonials[currentTestimonial].classList.add('active');
}

// =====================================================
// FAQs Section
// =====================================================
function renderFAQs() {
    const faqList = document.getElementById('faqList');
    if (!faqList || !siteData) return;
    
    faqList.innerHTML = siteData.faqs.map(faq => `
        <div class="faq-item" data-faq-id="${faq.id}">
            <div class="faq-question" onclick="toggleFAQ(${faq.id})">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down faq-icon"></i>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

function toggleFAQ(faqId) {
    const faqItem = document.querySelector(`[data-faq-id="${faqId}"]`);
    faqItem.classList.toggle('active');
}

// =====================================================
// Contact Information
// =====================================================
function renderContactInfo() {
    if (!siteData) return;
    
    const emailEl = document.getElementById('contactEmail');
    const phoneEl = document.getElementById('contactPhone');
    const addressEl = document.getElementById('contactAddress');
    
    if (emailEl) emailEl.textContent = siteData.contact.email;
    if (phoneEl) phoneEl.textContent = siteData.contact.phone;
    if (addressEl) addressEl.textContent = siteData.contact.address;
    
    // Render social media links
    renderSocialLinks();
}

// =====================================================
// Social Media Links
// =====================================================
function renderSocialLinks() {
    if (!siteData || !siteData.contact || !siteData.contact.social) return;
    
    const social = siteData.contact.social;
    const socialLinks = document.getElementById('socialLinks');
    const footerSocial = document.getElementById('footerSocial');
    
    // Social media configuration
    const socialPlatforms = [
        { key: 'linkedin', icon: 'fab fa-linkedin', label: 'LinkedIn' },
        { key: 'github', icon: 'fab fa-github', label: 'GitHub' },
        { key: 'twitter', icon: 'fab fa-twitter', label: 'Twitter' },
        { key: 'facebook', icon: 'fab fa-facebook', label: 'Facebook' },
        { key: 'instagram', icon: 'fab fa-instagram', label: 'Instagram' }
    ];
    
    // Generate social links HTML
    const socialHTML = socialPlatforms
        .filter(platform => social[platform.key] && social[platform.key] !== '' && social[platform.key] !== '#')
        .map(platform => `
            <a href="${social[platform.key]}" 
               class="social-link" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${platform.label}">
                <i class="${platform.icon}"></i>
            </a>
        `).join('');
    
    // Render in contact section
    if (socialLinks) {
        socialLinks.innerHTML = socialHTML || '<p style="color: #999;">No social media links configured</p>';
    }
    
    // Render in footer
    if (footerSocial) {
        footerSocial.innerHTML = socialHTML;
    }
}

// =====================================================
// Gallery Section
// =====================================================
let currentLightboxIndex = 0;

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !siteData || !siteData.gallery) return;
    
    galleryGrid.innerHTML = siteData.gallery.map((item, index) => `
        <div class="gallery-item" onclick="openLightbox(${index})">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
}

function openLightbox(index) {
    if (!siteData || !siteData.gallery) return;
    
    currentLightboxIndex = index;
    const lightbox = document.getElementById('galleryLightbox');
    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    
    const item = siteData.gallery[index];
    image.src = item.image;
    caption.innerHTML = `<strong>${item.title}</strong><br>${item.description}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    if (!siteData || !siteData.gallery) return;
    
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= siteData.gallery.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = siteData.gallery.length - 1;
    
    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const item = siteData.gallery[currentLightboxIndex];
    
    image.src = item.image;
    caption.innerHTML = `<strong>${item.title}</strong><br>${item.description}`;
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    }
});

// =====================================================
// Hero Slider
// =====================================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    const dots = document.querySelectorAll('.hero-dot');
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    
    // Auto-advance slides
    setInterval(() => changeSlide(1), 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// =====================================================
// Navigation
// =====================================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
    
    // Hide/show navbar on scroll
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Hide navbar when scrolling down, show when scrolling up
        if (currentScroll > scrollThreshold) {
            if (currentScroll > lastScrollTop) {
                // Scrolling down
                header.classList.add('hidden');
            } else {
                // Scrolling up
                header.classList.remove('hidden');
            }
        } else {
            // At top of page, always show
            header.classList.remove('hidden');
        }
        
        lastScrollTop = currentScroll;
        
        // Header shadow on scroll
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active navigation link
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

// =====================================================
// Scroll Effects
// =====================================================
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards, project cards, etc.
    setTimeout(() => {
        const elementsToAnimate = document.querySelectorAll('.service-card, .project-card, .faq-item');
        elementsToAnimate.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }, 100);
}

// =====================================================
// Contact Form
// =====================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
            
            // In a real application, you would send this to a backend server
            // Example: sendToServer(formData);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
}

// =====================================================
// Fallback Content
// =====================================================
function showFallbackContent() {
    console.log('Loading fallback content...');
    // You can add fallback content here if data.json fails to load
}

// =====================================================
// Utility Functions
// =====================================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =====================================================
// WhatsApp Button
// =====================================================
function initWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsappButton');
    
    if (whatsappButton && siteData && siteData.contact && siteData.contact.whatsapp) {
        const whatsappNumber = siteData.contact.whatsapp;
        const message = encodeURIComponent('Hello! I would like to know more about your services.');
        
        // Set WhatsApp URL
        whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }
}

// Export functions to global scope for inline onclick handlers
window.toggleService = toggleService;
window.toggleFAQ = toggleFAQ;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
