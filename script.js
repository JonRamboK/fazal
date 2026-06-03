/* ===================================
   PORTFOLIO WEBSITE JAVASCRIPT
   Modern Interactivity & Features
   =================================== */

// ===================================
// THEME TOGGLE (Dark/Light Mode)
// ===================================

const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on page load
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
}

// Theme toggle button event listener
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update icon based on current theme
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// SMOOTH SCROLLING NAVIGATION
// ===================================

// Get all scroll links
const scrollLinks = document.querySelectorAll('[data-scroll]');

scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Calculate scroll position with offset for fixed navbar
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        if (window.scrollY >= (sectionTop - navHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================

const revealElements = document.querySelectorAll('.reveal');

// Intersection Observer for scroll reveal animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stagger animation for multiple elements
            const siblings = Array.from(revealElements).filter(el => 
                el.parentElement === entry.target.parentElement
            );
            const index = siblings.indexOf(entry.target);
            entry.target.style.animationDelay = `${index * 0.1}s`;
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    observer.observe(element);
});

// ===================================
// PROGRESS BAR ANIMATION ON SCROLL
// ===================================

const progressFills = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const width = entry.target.parentElement.getAttribute('data-width') || 
                         entry.target.style.width;
            entry.target.classList.add('animated');
            // Animate after a small delay for visual effect
            setTimeout(() => {
                entry.target.style.opacity = '1';
            }, 100);
        }
    });
}, { threshold: 0.5 });

progressFills.forEach(fill => {
    progressObserver.observe(fill);
});

// ===================================
// CONTACT FORM HANDLING
// ===================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !message) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        try {
            // Simulate form submission (replace with actual backend endpoint)
            const formData = {
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            };
            
            // Log the form data (in production, send to backend)
            console.log('Form submitted:', formData);
            
            // Show success message
            showNotification('Message sent successfully! Thank you for reaching out.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Optional: Redirect or additional action after 2 seconds
            setTimeout(() => {
                // Scroll to top or perform other action
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error sending message. Please try again.', 'error');
        }
    });
}

// Notification function for form feedback
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // Add shadow to navbar when scrolled
    if (scrollTop > 50) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// ===================================
// SCROLL TO TOP BUTTON (Optional)
// ===================================

// Create scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-lg);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll to top button hover effect
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// ===================================
// PAGE LOAD ANIMATION
// ===================================

window.addEventListener('load', () => {
    // Trigger initial animations
    document.body.style.opacity = '1';
    updateActiveNav();
});

// ===================================
// KEYBOARD ACCESSIBILITY
// ===================================

// Escape key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// ANIMATED SKILL BARS
// ===================================

const skillBars = document.querySelectorAll('.skill-item');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated-skill')) {
            const progressFill = entry.target.querySelector('.progress-fill');
            if (progressFill) {
                entry.target.classList.add('animated-skill');
                progressFill.style.width = progressFill.style.width;
            }
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ===================================
// PROJECT CARD INTERACTION
// ===================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Get computed style value
function getCSSVariable(variable) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variable).trim();
}

// Debounce function for resize events
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

// Handle window resize
const handleResize = debounce(() => {
    updateActiveNav();
}, 250);

window.addEventListener('resize', handleResize);

// ===================================
// LAZY LOADING FOR IMAGES (when added)
// ===================================

// If you add actual images, use this for lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// CONSOLE GREETING
// ===================================

console.log('%c🎨 Welcome to the Portfolio! ', 'font-size: 16px; color: #6366f1; font-weight: bold;');
console.log('%cCheck out the source code and customize it to make it your own!', 'font-size: 12px; color: #6366f1;');

// ===================================
// PERFORMANCE MONITORING (Optional)
// ===================================

// Monitor when interactive elements become interactive
if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`%c${entry.name}: ${entry.duration.toFixed(2)}ms`, 'color: #10b981; font-size: 10px;');
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
        // Performance observer not supported
    }
}

// Mark when page is fully interactive
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`%cPage fully loaded in ${loadTime.toFixed(2)}ms`, 'color: #10b981; font-weight: bold;');
});

// ===================================
// INITIALIZE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Page is ready
    updateActiveNav();
    
    // Add any additional initialization code here
    console.log('%c✨ Portfolio JavaScript loaded successfully!', 'color: #ec4899; font-weight: bold;');
});
