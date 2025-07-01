// === MODULAR FLY ANIMATION ===
class FlyAnimation {
    constructor(flyElementId, options = {}) {
        this.fly = document.getElementById(flyElementId);
        this.currentPosition = 0;
        this.isFlying = false;
        this.speed = options.speed || 600; // збільшена швидкість
        this.flyPositions = [];
        
        this.init();
    }
    
    getFlyPositions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width < 768) {
            return [
                { x: 50, y: 200 },
                { x: 150, y: 180 },
                { x: 100, y: 300 },
                { x: 200, y: 250 },
                { x: 80, y: 350 },
                { x: 180, y: 320 }
            ];
        } else if (width < 1024) {
            return [
                { x: 100, y: 200 },
                { x: 250, y: 150 },
                { x: 400, y: 280 },
                { x: 180, y: 350 },
                { x: 350, y: 220 },
                { x: 150, y: 280 },
                { x: 450, y: 200 }
            ];
        } else {
            return [
                { x: 120, y: 190 },
                { x: 900, y: 150 },
                { x: 500, y: 320 },
                { x: 200, y: 380 },
                { x: 600, y: 250 },
                { x: 150, y: 320 },
                { x: 450, y: 180 },
                { x: 350, y: 350 },
                { x: 550, y: 200 }
            ];
        }
    }
    
    setFlyPosition() {
        const pos = this.flyPositions[this.currentPosition];
        this.fly.style.left = pos.x + 'px';
        this.fly.style.top = pos.y + 'px';
    }
    
    calculateRotation(currentX, currentY, targetX, targetY) {
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        return angle;
    }
    
    animateFlyMovement(targetX, targetY) {
        this.isFlying = true;
        
        const currentX = parseInt(this.fly.style.left) || 0;
        const currentY = parseInt(this.fly.style.top) || 0;
        
        const rotation = this.calculateRotation(currentX, currentY, targetX, targetY);
        this.fly.style.transform = `rotate(${rotation}deg)`;
        
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = Math.min(distance / this.speed, 1.2) * 1000; // прискорено
        
        this.fly.style.transition = `
            left ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            top ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform ${Math.min(duration * 0.4, 300)}ms ease-out
        `;
        
        const steps = 12; // менше кроків для швидшої анімації
        let step = 0;
        
        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            
            const x = currentX + deltaX * progress;
            const y = currentY + deltaY * progress + Math.sin(progress * Math.PI * 3) * 6;
            
            this.fly.style.left = x + 'px';
            this.fly.style.top = y + 'px';
            
            if (step >= steps) {
                clearInterval(interval);
                this.fly.style.left = targetX + 'px';
                this.fly.style.top = targetY + 'px';
                this.isFlying = false;
            }
        }, duration / steps);
    }
    
    moveToNext() {
        if (this.isFlying) return;
        this.currentPosition = (this.currentPosition + 1) % this.flyPositions.length;
        const newPos = this.flyPositions[this.currentPosition];
        this.animateFlyMovement(newPos.x, newPos.y);
    }
    
    init() {
        this.flyPositions = this.getFlyPositions();
        this.setFlyPosition();
        
        // Event listeners
        this.fly.addEventListener('mouseenter', () => this.moveToNext());
        this.fly.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveToNext();
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.flyPositions = this.getFlyPositions();
            this.currentPosition = 0;
            this.setFlyPosition();
        });
    }
}

// === MODULAR SCROLL ANIMATIONS ===
class ScrollAnimations {
    constructor(options = {}) {
        this.observerOptions = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);
        
        // Observe service cards
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe stat items
        document.querySelectorAll('.stat-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// === MODULAR COUNTER ANIMATION ===
class CounterAnimation {
    constructor(selector = '#stats') {
        this.statsSection = document.querySelector(selector);
        this.init();
    }
    
    animateCounter(element, rawTarget) {
        const suffix = rawTarget.replace(/[\d.\-]/g, '');
        const target = parseFloat(rawTarget);
        
        let current = 0;
        const increment = target / 40; // прискорено
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30); // прискорено
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const numbers = entry.target.querySelectorAll('[data-target]');
                    numbers.forEach(number => {
                        const raw = number.getAttribute('data-target');
                        this.animateCounter(number, raw);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        if (this.statsSection) {
            observer.observe(this.statsSection);
        }
    }
}

// === UTILITY FUNCTIONS ===
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// === HEADER SCROLL EFFECT ===
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 215, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#FFD700';
            header.style.backdropFilter = 'none';
        }
    });
}

// === SERVICE CARDS HOVER EFFECT ===
function initServiceCardsHover() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// === CONTACT FORM ===
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Дякуємо за заявку! Наш менеджер зв\'яжеться з вами найближчим часом.');
        });
    }
}

// === HERO IMAGE SLIDESHOW ===
class HeroSlideshow {
    constructor(heroSelector = '#hero', imageSelector = '#heroImage') {
        this.heroSection = document.querySelector(heroSelector);
        this.heroImage = document.querySelector(imageSelector);
        this.images = [
            'images/hero.png',
            'images/hero2.png',
            'images/hero3.png'
        ];
        this.currentIndex = 0;
        this.isChanging = false;
        this.init();
    }
    
    changeImage() {
        if (this.isChanging) return;
        this.isChanging = true;
        
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        const newImage = this.images[this.currentIndex];
        
        // Fade out hero image
        this.heroImage.style.opacity = '0';
        
        // Prepare next background image
        this.heroSection.style.setProperty('--next-bg', `url('${newImage}')`);
        
        // Update ::after pseudo-element with new image
        const style = document.createElement('style');
        style.id = 'hero-bg-transition';
        style.textContent = `
            .hero::after {
                background-image: url('${newImage}') !important;
                opacity: 0.3 !important;
                transform: scale(1) !important;
            }
            .hero::before {
                opacity: 0 !important;
                transform: scale(0.9) !important;
            }
        `;
        
        // Remove old style if exists
        const oldStyle = document.getElementById('hero-bg-transition');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        document.head.appendChild(style);
        
        setTimeout(() => {
            // Change hero image
            this.heroImage.src = newImage;
            this.heroImage.style.opacity = '1';
            
            // Swap backgrounds
            setTimeout(() => {
                const swapStyle = document.createElement('style');
                swapStyle.id = 'hero-bg-swap';
                swapStyle.textContent = `
                    .hero::before {
                        background-image: url('${newImage}') !important;
                        opacity: 0.3 !important;
                        transform: scale(1) !important;
                    }
                    .hero::after {
                        opacity: 0 !important;
                        transform: scale(1.1) !important;
                    }
                `;
                
                // Remove old styles
                const oldSwapStyle = document.getElementById('hero-bg-swap');
                if (oldSwapStyle) {
                    oldSwapStyle.remove();
                }
                if (style.parentNode) {
                    style.remove();
                }
                
                document.head.appendChild(swapStyle);
                
                setTimeout(() => {
                    this.isChanging = false;
                }, 800);
            }, 100);
        }, 400);
    }
    
    init() {
        if (this.heroSection && this.heroImage) {
            setInterval(() => {
                this.changeImage();
            }, 3000);
        }
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new FlyAnimation('animatedFly', { speed: 600 });
    new ScrollAnimations();
    new CounterAnimation();
    new HeroSlideshow();
    
    // Initialize other features
    initHeaderScroll();
    initServiceCardsHover();
    initContactForm();
});