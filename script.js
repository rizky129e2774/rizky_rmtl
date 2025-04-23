// ===== GABUNGAN SCRIPT DARI TIGA FILE JAVASCRIPT =====
// Menggabungkan particles.js, portfolio-script.js, dan scroll-animations.js

// ===== PARTICLES SCRIPT (dari particles.js) =====
// Fungsi untuk membuat efek partikel di background
class ParticleBackground {
    constructor(options) {
        this.options = Object.assign({
            selector: 'body',
            maxParticles: 100,
            sizeVariance: 3,
            speed: 1,
            color: ['#2ecc71', '#3498db', '#e74c3c', '#f1c40f'],
            minDistance: 100,
            connectParticles: true,
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        maxParticles: 50
                    }
                },
                {
                    breakpoint: 425,
                    options: {
                        maxParticles: 25
                    }
                }
            ]
        }, options);

        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-background';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.right = '0';
        this.canvas.style.bottom = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        
        const targetElement = document.querySelector(this.options.selector);
        if (targetElement.style.position === '' || targetElement.style.position === 'static') {
            targetElement.style.position = 'relative';
        }
        
        targetElement.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: this.options.minDistance / 2
        };
        
        this.resize();
        this.createParticles();
        this.loop();
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Handle responsive options
        if (this.options.responsive) {
            for (const item of this.options.responsive) {
                if (window.innerWidth <= item.breakpoint) {
                    this.options.maxParticles = item.options.maxParticles;
                    if (this.particles.length > this.options.maxParticles) {
                        this.particles = this.particles.slice(0, this.options.maxParticles);
                    }
                    break;
                }
            }
        }

        this.createParticles();
    }

    createParticles() {
        if (this.particles.length > 0) {
            return;
        }

        for (let i = 0; i < this.options.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * this.options.sizeVariance + 1,
                color: this.options.color[Math.floor(Math.random() * this.options.color.length)],
                speedX: (Math.random() - 0.5) * this.options.speed,
                speedY: (Math.random() - 0.5) * this.options.speed
            });
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        this.connectParticles();
        requestAnimationFrame(this.loop.bind(this));
    }

    updateParticles() {
        for (const p of this.particles) {
            // Pergerakan
            p.x += p.speedX;
            p.y += p.speedY;

            // Batas canvas
            if (p.x > this.canvas.width) p.x = 0;
            else if (p.x < 0) p.x = this.canvas.width;
            if (p.y > this.canvas.height) p.y = 0;
            else if (p.y < 0) p.y = this.canvas.height;

            // Interaksi mouse
            if (this.mouse.x && this.mouse.y) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist <= this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * 1;
                    p.y += Math.sin(angle) * 1;
                }
            }
        }
    }

    drawParticles() {
        for (const p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }
    }

    connectParticles() {
        if (!this.options.connectParticles) return;
        
        const minDistance = this.options.minDistance;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist <= minDistance) {
                    const opacity = 1 - (dist / minDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(150, 150, 150, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

// ===== PORTFOLIO SCRIPT (dari portfolio-script.js) =====
// ===== ELEMENT SELECTIONS =====
const header = document.querySelector('header');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
// Navigation and section elements
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');

// Skill, project and form elements
const skillBars = document.querySelectorAll('.skill-bar .progress');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');
const contactForm = document.getElementById('contactForm');

// ===== STICKY HEADER =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    
    // Toggle icon between bars and times
    const icon = menuBtn.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        
        // Reset icon
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION LINKS ON SCROLL =====
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const headerHeight = header.offsetHeight;
        
        if (window.scrollY >= sectionTop - headerHeight - 100) {
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

// Skill bars animation
const animateSkillBars = () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.progress');
                const width = progress.getAttribute('data-width');
                
                // Reset animation state
                progress.style.width = '0';
                
                // Trigger animation
                setTimeout(() => {
                    progress.style.width = width;
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    skillItems.forEach(item => {
        observer.observe(item);
    });
};

// Initialize skill bar animation
document.addEventListener('DOMContentLoaded', animateSkillBars);

// ===== FILTER PROJECTS =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        const filter = btn.getAttribute('data-filter');
        
        projectItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || filter === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== FORM VALIDATION AND SUBMISSION =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Show success message
            alert('Message sent successfully!');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===== REVEAL ELEMENTS ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-on-scroll');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Initial check
revealOnScroll();

// Add scroll event listener
window.addEventListener('scroll', revealOnScroll);

// ===== TYPING EFFECT =====
const createTypingEffect = () => {
    const typingText = document.querySelector('.hero-content h1 span.typing-text'); // More specific selector
    if (!typingText) return;
    
    const originalText = typingText.textContent;
    typingText.textContent = ''; // Clear initial text only if effect applies
    
    let charIndex = 0;
    const type = () => { // Renamed inner function to avoid conflict
        if (charIndex < originalText.length) {
            typingText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
             typingText.style.borderRight = 'none'; // Remove cursor after typing
        }
    };
    
    // Ensure the element exists before starting
    if(typingText) {
       setTimeout(type, 1000); // Start typing after a delay
    }
};

// Dark Mode Toggle with Forced Reload
const createDarkModeToggle = () => {
    // Create the toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
    darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    
    // Append to header container
    const headerContainer = document.querySelector('header .container');
    if (headerContainer) {
        headerContainer.appendChild(darkModeToggle);
    }
    
    // Toggle theme on click
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        document.body.classList.toggle('dark-mode');
        
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Update icon and save preference
        darkModeToggle.innerHTML = isDarkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Dispatch both scroll and resize events to force updates
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
        
        // For stubborn elements, try adding a slight delay before updating classes
        setTimeout(() => {
            document.querySelectorAll('.project-item, input, textarea, .info-item, .card-bg')
                .forEach(el => {
                    el.style.transition = "none";
                    el.offsetHeight; // Force reflow
                    el.style.transition = "";
                });
        }, 50);
    });
};

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== SCROLL ANIMATIONS SCRIPT (dari scroll-animations.js) =====
// Animasi saat scroll
class ScrollAnimator {
    constructor() {
        this.elements = {
            reveal: document.querySelectorAll('.reveal-on-scroll'),
            fadeIn: document.querySelectorAll('.fade-in'),
            slideUp: document.querySelectorAll('.slide-up'),
            slideLeft: document.querySelectorAll('.slide-left'),
            slideRight: document.querySelectorAll('.slide-right')
        };
        
        this.windowHeight = window.innerHeight;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.checkPosition.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        this.checkPosition();
    }
    
    onResize() {
        this.windowHeight = window.innerHeight;
    }
    
    checkPosition() {
        const scrollPosition = window.scrollY + this.windowHeight;
        
        // Reveal elements
        this.elements.reveal.forEach(element => {
            const position = element.getBoundingClientRect().top + window.scrollY + element.offsetHeight / 4;
            
            if (scrollPosition > position) {
                element.classList.add('active');
            }
        });
        
        // FadeIn elements
        this.elements.fadeIn.forEach(element => {
            const position = element.getBoundingClientRect().top + window.scrollY + element.offsetHeight / 3;
            
            if (scrollPosition > position) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        // Slide Up elements
        this.elements.slideUp.forEach(element => {
            const position = element.getBoundingClientRect().top + window.scrollY + element.offsetHeight / 3;
            
            if (scrollPosition > position) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        // Slide Left elements
        this.elements.slideLeft.forEach(element => {
            const position = element.getBoundingClientRect().top + window.scrollY + element.offsetHeight / 3;
            
            if (scrollPosition > position) {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }
        });
        
        // Slide Right elements
        this.elements.slideRight.forEach(element => {
            const position = element.getBoundingClientRect().top + window.scrollY + element.offsetHeight / 3;
            
            if (scrollPosition > position) {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }
        });
    }
}

// Efek Tilt 3D
class TiltEffect {
    constructor(elements, options = {}) {
        this.elements = document.querySelectorAll(elements);
        this.options = Object.assign({
            max: 15,
            perspective: 1000,
            scale: 1.05,
            speed: 500,
            easing: 'cubic-bezier(.03,.98,.52,.99)',
        }, options);
        
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            element.style.transition = `transform ${this.options.speed}ms ${this.options.easing}`;
            
            this.bindEvents(element);
        });
    }
    
    bindEvents(element) {
        element.addEventListener('mouseenter', this.onMouseEnter.bind(this, element));
        element.addEventListener('mousemove', this.onMouseMove.bind(this, element));
        element.addEventListener('mouseleave', this.onMouseLeave.bind(this, element));
    }
    
    onMouseEnter(element) {
        element.style.willChange = 'transform';
    }
    
    onMouseMove(element, e) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const rotateX = this.remap(mouseY, centerY - rect.height / 2, centerY + rect.height / 2, this.options.max * -1, this.options.max);
        const rotateY = this.remap(mouseX, centerX - rect.width / 2, centerX + rect.width / 2, this.options.max * -1, this.options.max);
        
        element.style.transform = `perspective(${this.options.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})`;
    }
    
    onMouseLeave(element) {
        element.style.willChange = '';
        element.style.transform = `perspective(${this.options.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
    
    remap(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }
}

// Text Scramble Effect untuk animasi teks yang berubah
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ===== MAIN INITIALIZATION =====
// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply dark mode if needed (do this first)
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
    }
    
    // Create dark mode toggle
    createDarkModeToggle();
    
    // Initialize scroll animations
    new ScrollAnimator();
    
    // Initialize particle background in hero section
    new ParticleBackground({
        selector: '.hero',
        maxParticles: 80,
        sizeVariance: 2,
        speed: 0.5,
        color: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f'],
        connectParticles: true
    });
    
    // Initialize tilt effect on project cards
    new TiltEffect('.project-item', {
        max: 10,
        scale: 1.03
    });
    
    // Initialize scramble text on hero heading
    const phrases = [
        'Desain Kreatif',
        'Web Development',
        'UI/UX Design',
        'Mobile Development'
    ];
    
    const scrambleElement = document.querySelector('.scramble-text');
    if (scrambleElement) {
        const textScramble = new TextScramble(scrambleElement);
        let counter = 0;
        
        const next = () => {
            textScramble.setText(phrases[counter]).then(() => {
                setTimeout(next, 3000);
            });
            counter = (counter + 1) % phrases.length;
        };
        
        next();
    }

    // Add CSS class to body when DOM is loaded
    document.body.classList.add('dom-loaded');
    
    // Initialize projects filter
    if (document.querySelector('.filter-btn[data-filter="all"]')) {
        document.querySelector('.filter-btn[data-filter="all"]').click();
    }
    
    // Trigger animations for elements in viewport on load
    setTimeout(() => {
        revealElements();
    }, 500);
    
    // Initialize skill bars when skills section is visible
    const skillsSectionObserverTarget = document.querySelector('#skills');
    if (skillsSectionObserverTarget) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSectionObserverTarget);
    }
    
    // Initialize typing effect
    createTypingEffect();
    
    // Simplify animations except for About section
    simplifyAnimations();
    
    // Fix profile image
    fixProfileImage();
    
    // Initialize new features
    createSpotlightEffect();
    createScrollToTopButton();
    createImageGallery();
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    loaderProgress.style.width = '100%';
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// ===== SIMPLIFIED ANIMATIONS =====
function simplifyAnimations() {
    // Nonaktifkan beberapa animasi KECUALI pada bagian "Tentang Saya"
    const elementsToExclude = document.querySelectorAll('#about .float, #about .float-slow, #about .float-fast, #about .rotate-slow, #about .pulse, #about .spotlight-effect, #about .slide-left, #about .slide-right, #about .slide-up');
    const elementsToSimplify = document.querySelectorAll('.float:not(#about .float), .float-slow:not(#about .float-slow), .float-fast:not(#about .float-fast), .rotate-slow:not(#about .rotate-slow), .pulse:not(#about .pulse), .spotlight-effect:not(#about .spotlight-effect), .slide-left:not(#about .slide-left), .slide-right:not(#about .slide-right), .slide-up:not(#about .slide-up), .tilt-effect');
    
    elementsToSimplify.forEach(el => {
        el.classList.remove('float', 'float-slow', 'float-fast', 'rotate-slow', 'pulse', 'spotlight-effect', 'slide-left', 'slide-right', 'slide-up', 'tilt-effect');
    });
    
    // Sederhanakan animasi reveal kecuali di bagian Tentang Saya
    const revealElements = document.querySelectorAll('.reveal-on-scroll:not(#about .reveal-on-scroll)');
    revealElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.remove('reveal-on-scroll');
    });
    
    // Aktifkan animasi untuk bagian About
    setTimeout(function() {
        const aboutElements = document.querySelectorAll('#about .float, #about .float-slow, #about .float-fast, #about .rotate-slow, #about .pulse');
        aboutElements.forEach(el => {
            el.style.animation = '';
            el.style.transform = '';
        });
        
        // Pastikan badge pengalaman memiliki animasi
        const experienceBadge = document.querySelector('.experience-badge');
        if (experienceBadge) {
            experienceBadge.style.animation = 'pulse 3s infinite ease-in-out';
        }
    }, 500);
}

// ===== PROFILE IMAGE FIX =====
function fixProfileImage() {
    setTimeout(function() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg && (!profileImg.complete || profileImg.naturalHeight === 0)) {
            console.log('Fixing profile image');
            profileImg.src = 'assets/img/foto1.jpg';
            
            // Force visibility
            profileImg.style.opacity = '1';
            profileImg.style.visibility = 'visible';
            profileImg.style.display = 'block';
        }
    }, 500);
}

// ===== IMAGE DIAGNOSTIC =====
function setupImageDiagnostic() {
    console.log('DOM Content Loaded - Checking images');
    
    // Cek gambar profil
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        console.log('Profil image found in DOM');
        
        // Tampilkan informasi gambar
        profileImg.addEventListener('load', function() {
            console.log('Gambar profil berhasil dimuat', this.src);
            console.log('Natural dimensions:', this.naturalWidth, 'x', this.naturalHeight);
            console.log('Display dimensions:', this.offsetWidth, 'x', this.offsetHeight);
            console.log('CSS computed style:');
            const style = window.getComputedStyle(this);
            console.log('- display:', style.display);
            console.log('- visibility:', style.visibility);
            console.log('- opacity:', style.opacity);
            console.log('- position:', style.position);
            console.log('- z-index:', style.zIndex);
        });
        
        // Error handler dan fallbacks
        profileImg.addEventListener('error', function() {
            console.error('Gambar profil gagal dimuat:', this.src);
            
            // Try all possible combinations
            const paths = [
                'assets/img/foto1.jpg',
                './assets/img/foto1.jpg',
                'assets/img/foto 1.jpg',
                './assets/img/foto 1.jpg',
                'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600'
            ];
            
            let tried = false;
            const tryNextPath = () => {
                if (paths.length > 0) {
                    const path = paths.shift();
                    console.log('Trying alternative path:', path);
                    this.src = path;
                    tried = true;
                } else if (tried) {
                    console.log('All paths failed, using fallback image');
                    this.src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600';
                }
            };
            
            tryNextPath();
        });
        
        // Force display of the image
        setTimeout(function() {
            if (profileImg.style.opacity !== '1') {
                console.log('Forcing display of profile image');
                profileImg.style.opacity = '1';
                profileImg.style.visibility = 'visible';
                profileImg.style.display = 'block';
            }
        }, 1000);
        
        // Check what other images might be working
        const testPaths = [
            './assets/img/foto1.jpg',
            './assets/img/foto 1.jpg',
            'assets/img/foto1.jpg',
            'assets/img/foto 1.jpg',
            './assets/img/foto2.jpg',
            'assets/img/foto2.jpg',
            './assets/img/foto 2.jpg',
            'assets/img/foto 2.jpg'
        ];
        
        // Test all paths
        testPaths.forEach(path => {
            const img = new Image();
            img.onload = function() {
                console.log('Path berhasil:', path, this.naturalWidth, 'x', this.naturalHeight);
            };
            img.onerror = function() {
                console.log('Path gagal:', path);
            };
            img.src = path;
        });
    } else {
        console.error('Gambar profil tidak ditemukan di DOM');
    }
}

// Call image diagnostic setup
setupImageDiagnostic();

// ===== SPOTLIGHT EFFECT =====
function createSpotlightEffect() {
    const spotlightElements = document.querySelectorAll('.spotlight-effect');
    
    spotlightElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--x', `${x}px`);
            element.style.setProperty('--y', `${y}px`);
        });
    });
}

// ===== SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
    // Create button element
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    // Add to body
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== IMAGE GALLERY WITH LIGHTBOX =====
function createImageGallery() {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="Gallery Image">
            <div class="lightbox-caption"></div>
            <div class="lightbox-nav">
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Add gallery functionality to project images
    const galleryImages = document.querySelectorAll('.project-img img');
    let currentImageIndex = 0;
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        currentImageIndex = index;
        const img = galleryImages[index];
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        lightboxImg.src = img.src;
        caption.textContent = img.alt || 'Project Image';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function navigateGallery(direction) {
        currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
        const img = galleryImages[currentImageIndex];
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        lightboxImg.src = img.src;
        caption.textContent = img.alt || 'Project Image';
    }
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateGallery(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateGallery(1));
    
    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            navigateGallery(1);
        }
    });
}

// Progress bar animation
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-progress');
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 100);
    });
};

// Intersection Observer for progress bars
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            progressObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

// Observe skills section
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    progressObserver.observe(skillsSection);
}

// Add hover effects to skill items
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(5px)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
    });
});

// Add hover effects to skill categories
const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach(category => {
    category.addEventListener('mouseenter', () => {
        category.style.transform = 'translateY(-5px)';
        category.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    });
    
    category.addEventListener('mouseleave', () => {
        category.style.transform = 'translateY(0)';
        category.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    });
});

// Add hover effects to info cards
const infoCards = document.querySelectorAll('.info-card');
infoCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    });
});

// Add hover effects to CTA button
const ctaButton = document.querySelector('.primary-btn');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-3px)';
        ctaButton.style.boxShadow = '0 10px 20px rgba(67, 160, 71, 0.3)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translateY(0)';
        ctaButton.style.boxShadow = 'none';
    });
}

// Add smooth scroll to CTA button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 