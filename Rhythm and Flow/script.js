// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Three.js Scene Variables
let scene, camera, renderer, particles, particleSystem;
let heroCanvas, animationId;

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.querySelector('body');
    
    // Simulate loading time
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.overflow = 'visible';
            
            // Initialize all components
            initializeApp();
        }, 500);
    }, 2000);
});

// Initialize Locomotive Scroll
let locoScroll;

function initializeApp() {
    // Initialize 3D Hero Effects
    initializeHero3D();
    
    // Initialize Locomotive Scroll
    locoScroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        lerp: 0.1,
        smartphone: {
            smooth: true,
            multiplier: 1,
            lerp: 0.1
        },
        tablet: {
            smooth: true,
            multiplier: 1,
            lerp: 0.1
        }
    });

    // Update ScrollTrigger when Locomotive Scroll updates
    locoScroll.on('scroll', ScrollTrigger.update);

    // Tell ScrollTrigger to use these proxy methods for the "[data-scroll-container]" element
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
    });

    // Initialize all components
    initializeNavigation();
    initializeEnergyVibes();
    initializeWhispers();
    initializeScrollAnimations();
    initializeNightMode();
    initializeDanceTherapyEffects();
    initializeHeroAnimations();
}

// Initialize 3D Hero Effects
function initializeHero3D() {
    heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: heroCanvas, 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle system
    createParticleSystem();
    
    // Position camera
    camera.position.z = 5;

    // Animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createParticleSystem() {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Color
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.7, 0.8, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Size
        sizes[i] = Math.random() * 2 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
                gl_FragColor = vec4(vColor, 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (particleSystem) {
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
        
        const positions = particleSystem.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + i) * 0.001;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize Hero Animations
function initializeHeroAnimations() {
    // Title animations
    const titleLines = document.querySelectorAll('.title-line');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const floatingDancer = document.querySelector('.floating-dancer');
    const musicNotes = document.querySelectorAll('.note');

    // Create timeline for hero animations
    const heroTl = gsap.timeline({ delay: 0.5 });

    // Animate title lines with 3D effect
    heroTl.fromTo(titleLines, {
        opacity: 0,
        y: 100,
        rotationX: -90,
        transformOrigin: "50% 50% -100px"
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // Animate subtitle
    heroTl.fromTo(heroSubtitle, {
        opacity: 0,
        y: 50,
        scale: 0.8
    }, {
        opacity: 0.9,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5");

    // Animate buttons
    heroTl.fromTo(heroButtons, {
        opacity: 0,
        y: 30,
        scale: 0.9
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3");

    // Animate floating dancer
    heroTl.fromTo(floatingDancer, {
        opacity: 0,
        x: 100,
        rotationY: -45
    }, {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");

    // Animate music notes
    heroTl.fromTo(musicNotes, {
        opacity: 0,
        scale: 0,
        rotation: -180
    }, {
        opacity: 0.8,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.6");

    // Add hover effects for title lines
    titleLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            gsap.to(line, {
                scale: 1.05,
                rotationY: 5,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        line.addEventListener('mouseleave', () => {
            gsap.to(line, {
                scale: 1,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Add parallax effect to floating elements
    gsap.to('.floating-dancer', {
        y: -50,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    gsap.to('.floating-music-notes', {
        y: -30,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Add energy orb animations
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
        gsap.to(orb, {
            y: -20,
            rotation: 360,
            duration: 8 + index * 2,
            repeat: -1,
            ease: "none"
        });
    });

    // Add button particle effects
    const ctaBtn = document.querySelector('.cta-btn.primary');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', createButtonParticles);
    }
}

function createButtonParticles() {
    const btn = document.querySelector('.cta-btn.primary');
    const rect = btn.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            left: ${rect.width / 2}px;
            top: ${rect.height / 2}px;
        `;
        
        btn.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            x: x,
            y: y,
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                locoScroll.scrollTo(targetSection);
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                locoScroll.scrollTo(targetSection);
            }
        });
    });
}

// Energy Vibes Section
function initializeEnergyVibes() {
    const emotionCards = document.querySelectorAll('.emotion-card');
    const emotionGrid = document.querySelector('.emotion-grid');

    const emotionVideos = {
        anxious: [
            { title: 'Gentle Flow', url: 'https://www.youtube.com/embed/BqBfdNVbpFE', fallback: true },
            { title: 'Breathing Dance', url: 'https://www.youtube.com/embed/TNvC1VQCDkM', fallback: true },
            { title: 'Peaceful Dance Movement', url: 'https://www.youtube.com/embed/R5mhNH-syXU', fallback: true }
        ],
        numb: [
            { title: 'Emotional Expression', url: 'https://www.youtube.com/embed/m0R-ftFBm38', fallback: true },
            { title: 'Feeling Flow', url: 'https://www.youtube.com/embed/hw_pN4cPkSU', fallback: true },
            { title: 'Soul Awakening', url: 'https://www.youtube.com/embed/gL_9vehvbO0', fallback: true }
        ],
        powerful: [
            { title: 'Power Flow', url: 'https://www.youtube.com/embed/OPo6X96wXJg', fallback: true },
            { title: 'Strength Dance', url: 'https://www.youtube.com/embed/_D-ABJjbeEA', fallback: true },
            { title: 'Warrior Spirit', url: 'https://www.youtube.com/embed/DUpKfvDlinI', fallback: true }
        ],
        sad: [
            { title: 'Gentle Release', url: 'https://www.youtube.com/embed/VRNS8XTADEU', fallback: true },
            { title: 'Healing Flow', url: 'https://www.youtube.com/embed/KRyks99Y9Qc', fallback: true },
            { title: 'Comfort Dance', url: 'https://www.youtube.com/embed/-iWJa_c7udU', fallback: true }
        ],
        stressed: [
            { title: 'Nature Flow', url: 'https://www.youtube.com/embed/dEhDzQzSLGI', fallback: true },
            { title: 'Calm Waters', url: 'https://www.youtube.com/embed/dABeLs3gjvQ', fallback: true },
            { title: 'Forest Dance', url: 'https://www.youtube.com/embed/DrpyDzU8X_g', fallback: true }
        ],
        joyful: [
            { title: 'Joyful Flow', url: 'https://www.youtube.com/embed/chnH6sDow60', fallback: true },
            { title: 'Celebration Dance', url: 'https://www.youtube.com/embed/8Lu41LulQos', fallback: true },
            { title: 'Happy Movement', url: 'https://www.youtube.com/embed/cQ6BPWyIueQ', fallback: true }
        ]
    };

    let currentChildContainer = null;

    // Function to create animated figure fallback
    function createAnimatedFigure(emotion) {
        const figures = {
            anxious: { emoji: '🧘', animation: 'gentle-flow', icon: 'fas fa-wind' },
            numb: { emoji: '❄️', animation: 'snow-dance', icon: 'fas fa-snowflake' },
            powerful: { emoji: '🔥', animation: 'power-move', icon: 'fas fa-fire' },
            sad: { emoji: '🌧️', animation: 'gentle-sway', icon: 'fas fa-cloud-rain' },
            stressed: { emoji: '🍃', animation: 'nature-flow', icon: 'fas fa-leaf' },
            joyful: { emoji: '☀️', animation: 'joy-bounce', icon: 'fas fa-sun' }
        };
        
        const figure = figures[emotion] || { emoji: '💫', animation: 'default-dance', icon: 'fas fa-star' };
        
        return `
            <div class="animated-figure-container">
                <div class="animated-figure ${figure.animation}">
                    <div class="figure-emoji">${figure.emoji}</div>
                    <div class="figure-icon">
                        <i class="${figure.icon}"></i>
                    </div>
                    <div class="figure-particles">
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                    </div>
                </div>
                <div class="figure-text">Experience the movement</div>
                <div class="figure-subtext">Click to watch on YouTube</div>
            </div>
        `;
    }

    emotionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous child container if exists
            if (currentChildContainer) {
                currentChildContainer.remove();
                currentChildContainer = null;
            }
            // Remove selected class from all cards
            emotionCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');

            const emotion = card.getAttribute('data-emotion');
            const videos = emotionVideos[emotion];
            if (videos && videos.length > 0) {
                // Create child card container
                const childContainer = document.createElement('div');
                childContainer.className = 'emotion-child-cards';
                
                // Add child cards with permanent animated figures
                childContainer.innerHTML = videos.map((video, index) => `
                    <div class="emotion-child-card" data-youtube-url="${video.url}" data-video-index="${index}">
                        <div class="child-card-title">${video.title}</div>
                        <div class="child-card-video">
                            <div class="video-fallback" style="display: flex;">
                                ${createAnimatedFigure(emotion)}
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Insert after the emotion grid
                emotionGrid.parentNode.insertBefore(childContainer, emotionGrid.nextSibling);
                currentChildContainer = childContainer;
                
                // Add click handlers for child cards
                const childCards = childContainer.querySelectorAll('.emotion-child-card');
                childCards.forEach((childCard, index) => {
                    childCard.addEventListener('click', () => {
                        const url = videos[index].url.replace('/embed/', '/watch?v=');
                        window.open(url, '_blank');
                    });
                });
                
                // Smooth scroll to the child cards
                setTimeout(() => {
                    if (locoScroll) {
                        locoScroll.scrollTo(childContainer, {
                            offset: -100,
                            duration: 1.5,
                            easing: [0.25, 0.46, 0.45, 0.94]
                        });
                    }
                }, 100);
            }
        });
    });
}

// Whispers of Healing Section
function initializeWhispers() {
    const whisperCards = document.querySelectorAll('.whisper-card');
    const prevBtn = document.querySelector('.whisper-nav.prev');
    const nextBtn = document.querySelector('.whisper-nav.next');
    let currentWhisper = 0;
    
    function showWhisper(index) {
        whisperCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        // Reset typewriter animation
        const activeCard = whisperCards[index];
        const typewriterText = activeCard.querySelector('.typewriter-text');
        typewriterText.style.animation = 'none';
        setTimeout(() => {
            typewriterText.style.animation = 'typewriter 3s ease-out forwards';
        }, 10);
    }
    
    function nextWhisper() {
        currentWhisper = (currentWhisper + 1) % whisperCards.length;
        showWhisper(currentWhisper);
    }
    
    function prevWhisper() {
        currentWhisper = (currentWhisper - 1 + whisperCards.length) % whisperCards.length;
        showWhisper(currentWhisper);
    }
    
    prevBtn.addEventListener('click', prevWhisper);
    nextBtn.addEventListener('click', nextWhisper);
    
    // Auto-advance whispers
    setInterval(nextWhisper, 5000);
    
    // Show first whisper
    showWhisper(0);
}

// Scroll Animations
function initializeScrollAnimations() {
    // Hero section animations
    gsap.from('.hero-title .title-line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });
    
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Emotion cards
    gsap.utils.toArray('.emotion-card').forEach((card, index) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Night Mode
function initializeNightMode() {
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const body = document.body;
    let isDarkMode = false;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        body.setAttribute('data-theme', 'dark');
        nightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    nightModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            body.setAttribute('data-theme', 'dark');
            nightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            nightModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Dance Therapy 3D Effects
function initializeDanceTherapyEffects() {
    const techniqueCards = document.querySelectorAll('.technique-card');
    
    // Mouse movement 3D effect
    techniqueCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translateY(-15px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.05)
                translateZ(20px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
        });
        
        // Add click effect
        card.addEventListener('click', () => {
            card.style.transform = 'translateY(-20px) rotateX(10deg) rotateY(10deg) scale(1.1) translateZ(30px)';
            setTimeout(() => {
                card.style.transform = 'translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.05) translateZ(20px)';
            }, 200);
        });
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const danceSection = document.querySelector('.dance-therapy-section');
        if (danceSection) {
            const rate = scrolled * -0.5;
            danceSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Intersection Observer for staggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'cardFloatIn 0.8s ease-out forwards';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    techniqueCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add floating animation to icons
    techniqueCards.forEach((card, index) => {
        const icon = card.querySelector('.technique-icon');
        if (icon) {
            icon.style.animationDelay = `${index * 0.2}s`;
            icon.style.animation = 'iconFloat 3s ease-in-out infinite';
        }
    });
}

// Add CSS for icon floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes iconFloat {
        0%, 100% {
            transform: translateY(0px) rotateY(0deg);
        }
        25% {
            transform: translateY(-5px) rotateY(5deg);
        }
        50% {
            transform: translateY(-10px) rotateY(0deg);
        }
        75% {
            transform: translateY(-5px) rotateY(-5deg);
        }
    }
    
    .technique-card:hover .technique-icon {
        animation: iconFloat 1.5s ease-in-out infinite !important;
    }
`;
document.head.appendChild(style);

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && locoScroll) {
        locoScroll.scrollTo(section);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (locoScroll) {
        locoScroll.update();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (locoScroll) {
        locoScroll.destroy();
    }
    ScrollTrigger.killAll();
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.emotion-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.floating-particles');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
});

// Add smooth reveal animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initLocomotiveScroll();
    initGSAPAnimations();
    initEmotionCards();
    initFadeAnimations();
}); 