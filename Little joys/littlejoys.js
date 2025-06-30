// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const ctaButton = document.querySelector('.cta-button');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.gallery-item, .rhyme-card, .video-card, .konte-card, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // CTA Button functionality
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('CTA button clicked!');
            const gallerySection = document.querySelector('#gallery');
            
            if (gallerySection) {
                const offsetTop = gallerySection.offsetTop - 80; // Account for fixed navbar
                console.log('Scrolling to gallery section at offset:', offsetTop);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                console.log('Gallery section not found!');
            }
        });
        console.log('CTA button event listener added successfully!');
    } else {
        console.log('CTA button not found!');
    }
});

// Gallery hover effects
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// --- RHYME AUDIO PLAYBACK LOGIC ---
let currentAudio = null;
let currentPlayButton = null;
let currentWave = null;

const playButtons = document.querySelectorAll('.play-button');
playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const audioId = 'audio-' + btn.getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        const wave = btn.parentElement.querySelector('.wave-animation');

        // Pause any currently playing audio
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            if (currentPlayButton) {
                currentPlayButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            if (currentWave) {
                currentWave.style.opacity = '0.6';
            }
        }

        // Play or pause the selected audio
        if (audio.paused) {
            audio.play();
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            wave.style.opacity = '1';
            currentAudio = audio;
            currentPlayButton = btn;
            currentWave = wave;
        } else {
            audio.pause();
            btn.innerHTML = '<i class="fas fa-play"></i>';
            wave.style.opacity = '0.6';
            currentAudio = null;
            currentPlayButton = null;
            currentWave = null;
        }
    });
});

// When audio ends, reset play button and wave
const rhymeAudios = document.querySelectorAll('.rhyme-cover audio');
rhymeAudios.forEach(audio => {
    audio.addEventListener('ended', () => {
        if (currentPlayButton) {
            currentPlayButton.innerHTML = '<i class="fas fa-play"></i>';
        }
        if (currentWave) {
            currentWave.style.opacity = '0.6';
        }
        currentAudio = null;
        currentPlayButton = null;
        currentWave = null;
    });
});

// --- YOUTUBE VIDEO PLAYER FUNCTIONALITY ---
const playerIds = [
    {iframe: 'youtubePlayer1', btn: 'playPauseBtn1'},
    {iframe: 'youtubePlayer2', btn: 'playPauseBtn2'},
    {iframe: 'youtubePlayer3', btn: 'playPauseBtn3'},
    {iframe: 'youtubePlayer4', btn: 'playPauseBtn4'}
];
let players = {};
let isPlaying = {};

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    playerIds.forEach((obj, idx) => {
        players[obj.iframe] = new YT.Player(obj.iframe, {
            events: {
                'onStateChange': (event) => onPlayerStateChange(event, obj.iframe, obj.btn)
            }
        });
        isPlaying[obj.iframe] = false;
    });
}

function onPlayerStateChange(event, iframeId, btnId) {
    const playPauseBtn = document.getElementById(btnId);
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying[iframeId] = true;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying[iframeId] = false;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    playerIds.forEach(({iframe, btn}) => {
        const playPauseBtn = document.getElementById(btn);
        const videoWrapper = document.getElementById(iframe)?.parentElement;
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayPause(iframe, btn);
            });
        }
        if (videoWrapper) {
            videoWrapper.addEventListener('click', (e) => {
                if (!e.target.closest('.play-pause-btn')) {
                    togglePlayPause(iframe, btn);
                }
            });
        }
    });
});

function togglePlayPause(iframeId, btnId) {
    const player = players[iframeId];
    if (player && player.playVideo && player.pauseVideo) {
        if (isPlaying[iframeId]) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
}

loadYouTubeAPI();

// Konte Panulu cards tilt effect
const konteCards = document.querySelectorAll('.konte-card');
konteCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Testimonial cards hover effect
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Floating elements animation
const floatingElements = document.querySelectorAll('.floating-balloon, .floating-star, .floating-cloud, .floating-heart, .floating-teddy, .floating-rainbow');

floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`;
    
    // Add random movement
    setInterval(() => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        element.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }, 3000 + index * 500);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image-container');
    
    if (heroSection && heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 200);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Konami code for extra joy
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Trigger extra joy animation
        createJoyAnimation();
        konamiCode = [];
    }
});

function createJoyAnimation() {
    const joyEmojis = ['😊', '🎉', '✨', '💖', '🎈', '🌈', '🌟', '💝'];
    const colors = ['#FFB8D9', '#B8E6FF', '#FFF2B8', '#B8FFD9', '#E6B8FF', '#FFD9B8'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = joyEmojis[Math.floor(Math.random() * joyEmojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.top = window.innerHeight + 'px';
            emoji.style.fontSize = '2rem';
            emoji.style.zIndex = '9999';
            emoji.style.pointerEvents = 'none';
            emoji.style.transition = 'all 3s ease-out';
            
            document.body.appendChild(emoji);
            
            setTimeout(() => {
                emoji.style.top = '-50px';
                emoji.style.transform = 'rotate(360deg)';
            }, 100);
            
            setTimeout(() => {
                document.body.removeChild(emoji);
            }, 3000);
        }, i * 100);
    }
}

// Add some extra interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add click sound effect to buttons
    const buttons = document.querySelectorAll('button, .rhyme-card, .video-card');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button, .rhyme-card, .video-card {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations
}, 16)); // ~60fps

console.log('🌟 Little Joys loaded with love and happiness! 💖');

// --- LAUGH SECTION FUNCTIONALITY ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D tilt effect for laugh cards
    const laughCards = document.querySelectorAll('.laugh-card[data-tilt]');
    
    laughCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Laugh button functionality
    const laughButtons = document.querySelectorAll('.laugh-btn');
    let currentLaughAudio = null;
    
    laughButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const audioId = 'audio-' + btn.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            
            // Stop any currently playing audio
            if (currentLaughAudio && currentLaughAudio !== audio) {
                currentLaughAudio.pause();
                currentLaughAudio.currentTime = 0;
            }
            
            // Play or pause the selected audio
            if (audio.paused) {
                audio.play();
                btn.innerHTML = '<span class="btn-text">Playing...</span><i class="fas fa-pause"></i><div class="btn-ripple"></div>';
                currentLaughAudio = audio;
                
                // Add playing animation
                btn.style.background = 'linear-gradient(45deg, var(--lemon-yellow), var(--mint-green))';
            } else {
                audio.pause();
                btn.innerHTML = '<span class="btn-text">Play Laughter</span><i class="fas fa-play"></i><div class="btn-ripple"></div>';
                currentLaughAudio = null;
                
                // Reset button style
                btn.style.background = 'linear-gradient(45deg, var(--soft-pink), var(--baby-blue))';
            }
            
            // Create ripple effect
            createRippleEffect(btn, e);
        });
    });
    
    // When laugh audio ends, reset button
    const laughAudios = document.querySelectorAll('#audio-giggle, #audio-belly, #audio-joyful, #audio-playful');
    laughAudios.forEach(audio => {
        audio.addEventListener('ended', () => {
            const btn = document.querySelector(`[data-audio="${audio.id.replace('audio-', '')}"]`);
            if (btn) {
                btn.innerHTML = '<span class="btn-text">Play Laughter</span><i class="fas fa-play"></i><div class="btn-ripple"></div>';
                btn.style.background = 'linear-gradient(45deg, var(--soft-pink), var(--baby-blue))';
            }
            currentLaughAudio = null;
        });
    });
    
    // CTA button functionality
    const ctaLaughBtn = document.querySelector('.cta-laugh-btn');
    if (ctaLaughBtn) {
        ctaLaughBtn.addEventListener('click', () => {
            // Scroll to hero section
            const heroSection = document.querySelector('#hero');
            if (heroSection) {
                const offsetTop = heroSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Add celebration animation
            createCelebrationEffect();
        });
    }
});

// Create ripple effect for buttons
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('btn-ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Create celebration effect
function createCelebrationEffect() {
    const emojis = ['🎉', '✨', '💖', '🎈', '🌈', '🌟', '💝', '😊'];
    const colors = ['#FFB8D9', '#B8E6FF', '#FFF2B8', '#B8FFD9', '#E6B8FF', '#FFD9B8'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.top = window.innerHeight + 'px';
            emoji.style.fontSize = '2rem';
            emoji.style.zIndex = '9999';
            emoji.style.pointerEvents = 'none';
            emoji.style.transition = 'all 3s ease-out';
            emoji.style.filter = 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))';
            
            document.body.appendChild(emoji);
            
            setTimeout(() => {
                emoji.style.top = '-50px';
                emoji.style.transform = 'rotate(360deg) scale(1.5)';
            }, 100);
            
            setTimeout(() => {
                if (document.body.contains(emoji)) {
                    document.body.removeChild(emoji);
                }
            }, 3000);
        }, i * 100);
    }
}

// Add sparkle animation to laugh cards
function addSparkleAnimation() {
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        sparkle.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize sparkle animations
document.addEventListener('DOMContentLoaded', addSparkleAnimation); 