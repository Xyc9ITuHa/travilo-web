// Responsive fly positions
function getFlyPositions() {
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

const fly = document.getElementById('animatedFly');
let currentPosition = 0;
let flyPositions = getFlyPositions();
let isFlying = false;

function setFlyPosition() {
    const pos = flyPositions[currentPosition];
    fly.style.left = pos.x + 'px';
    fly.style.top = pos.y + 'px';
}

function calculateRotation(currentX, currentY, targetX, targetY) {
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
}

function animateFlyMovement(targetX, targetY) {

    isFlying = true; 

    const currentX = parseInt(fly.style.left) || 0;
    const currentY = parseInt(fly.style.top) || 0;
    
    const rotation = calculateRotation(currentX, currentY, targetX, targetY);
    fly.style.transform = `rotate(${rotation}deg)`;
    
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Math.min(distance / 400, 1.5) * 1000;
    
    fly.style.transition = `
    left ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    top ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform ${Math.min(duration * 0.5, 400)}ms ease-out
`;
    
    const steps = 15;
    let step = 0;
    
    const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        const x = currentX + deltaX * progress;
        const y = currentY + deltaY * progress + Math.sin(progress * Math.PI * 3) * 8;
        
        fly.style.left = x + 'px';
        fly.style.top = y + 'px';
        
        if (step >= steps) {
            clearInterval(interval);
            fly.style.left = targetX + 'px';
            fly.style.top = targetY + 'px';
            isFlying = false; 
        }

    }, duration / steps);
}

fly.addEventListener('mouseenter', () => {
    if (isFlying) return;  // this now correctly blocks mid-flight
    currentPosition = (currentPosition + 1) % flyPositions.length;
    const newPos = flyPositions[currentPosition];
    animateFlyMovement(newPos.x, newPos.y);
});

fly.addEventListener('touchstart', (e) => {
    e.preventDefault();        
    if (isFlying) return;       
    currentPosition = (currentPosition + 1) % flyPositions.length; 
    const newPos = flyPositions[currentPosition];                   
    animateFlyMovement(newPos.x, newPos.y);                        
});

// Update positions on resize
window.addEventListener('resize', () => {
    flyPositions = getFlyPositions();
    currentPosition = 0;
    setFlyPosition();
});

setFlyPosition();

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

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

document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.stat-item').forEach(item => {
    observer.observe(item);
});

function animateCounter(element, rawTarget) {

    const suffix = rawTarget.replace(/[\d.\-]/g, '');
    const target = parseFloat(rawTarget);

    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = Math.floor(current) + suffix;
    }, 40);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const numbers = entry.target.querySelectorAll('[data-target]');
            numbers.forEach(number => {
                const raw = number.getAttribute('data-target');
                animateCounter(number, raw);
            });
        }
    });
}, observerOptions);


statsObserver.observe(document.getElementById('stats'));

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

document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Дякуємо за заявку! Наш менеджер зв\'яжеться з вами найближчим часом.');
});

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});