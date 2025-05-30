// HyperGrid Defenders Lab - Main JavaScript
// Security-focused, no inline scripts

(function() {
    'use strict';
    
    // Matrix Rain Effect Class
    class MatrixRain {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.opacity = '0.15';
            this.canvas.style.pointerEvents = 'none';
            
            const matrixBg = document.getElementById('matrix-bg');
            if (matrixBg) {
                matrixBg.appendChild(this.canvas);
            }
            
            this.chars = '01';
            this.fontSize = 14;
            this.columns = 0;
            this.drops = [];
            
            this.resize();
            this.init();
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = Array(this.columns).fill(1);
        }
        
        init() {
            this.ctx.fillStyle = '#0a0a0a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        animate() {
            this.ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#00ff41';
            this.ctx.font = this.fontSize + 'px monospace';
            
            for (let i = 0; i < this.drops.length; i++) {
                const text = this.chars[Math.floor(Math.random() * this.chars.length)];
                this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
                
                if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
            
            setTimeout(() => this.animate(), 50);
        }
    }
    
    // Navigation Handler
    class NavigationHandler {
        constructor() {
            this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
            this.navLinks = document.getElementById('nav-links');
            this.navItems = document.querySelectorAll('.nav-links a');
            
            this.init();
        }
        
        init() {
            if (this.mobileMenuBtn && this.navLinks) {
                this.mobileMenuBtn.addEventListener('click', () => {
                    this.navLinks.classList.toggle('active');
                    this.updateMenuButton();
                });
            }
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.navLinks && 
                    !this.navLinks.contains(e.target) && 
                    !this.mobileMenuBtn.contains(e.target)) {
                    this.navLinks.classList.remove('active');
                    this.updateMenuButton();
                }
            });
            
            // Smooth scrolling for anchor links
            this.navItems.forEach(item => {
                if (item.getAttribute('href').startsWith('#')) {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = item.getAttribute('href');
                        const targetSection = document.querySelector(targetId);
                        
                        if (targetSection) {
                            const offsetTop = targetSection.offsetTop - 80;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                        
                        if (this.navLinks) {
                            this.navLinks.classList.remove('active');
                            this.updateMenuButton();
                        }
                    });
                }
            });
        }
        
        updateMenuButton() {
            if (this.mobileMenuBtn) {
                const isActive = this.navLinks.classList.contains('active');
                this.mobileMenuBtn.innerHTML = isActive ? '✕' : '☰';
                this.mobileMenuBtn.setAttribute('aria-expanded', isActive);
            }
        }
    }
    
    // Simplified Contact Form Handler - No interference with Formspree
    class ContactFormHandler {
        constructor() {
            this.form = document.getElementById('contact-form');
            this.init();
        }
        
        init() {
            if (this.form) {
                // Only add visual effects, don't interfere with submission
                this.form.addEventListener('submit', (e) => {
                    const submitBtn = this.form.querySelector('.submit-btn');
                    if (submitBtn) {
                        const originalText = submitBtn.textContent;
                        submitBtn.textContent = 'TRANSMITTING...';
                        submitBtn.disabled = true;
                        submitBtn.classList.add('loading');
                        
                        // Add a timeout to re-enable button if form fails
                        setTimeout(() => {
                            if (submitBtn.textContent === 'TRANSMITTING...') {
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                                submitBtn.classList.remove('loading');
                            }
                        }, 10000); // 10 second timeout
                    }
                    
                    // Let form submit naturally to Formspree - don't prevent default
                });
                
                // Check URL for success parameter
                this.checkForSuccess();
            }
        }
        
        checkForSuccess() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('success') === '1') {
                // Show success message
                setTimeout(() => {
                    this.showSuccessMessage();
                    this.cleanUrl();
                }, 500);
            }
        }
        
        showSuccessMessage() {
            // Remove any existing notifications
            const existingNotifications = document.querySelectorAll('.success-notification');
            existingNotifications.forEach(notification => notification.remove());
            
            const notification = document.createElement('div');
            notification.className = 'success-notification';
            notification.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🛡️</div>
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; color: #00ff41;">TRANSMISSION SUCCESSFUL</div>
                    <div style="font-size: 0.9rem;">Your secure message has been encrypted and transmitted to our security team.</div>
                    <div style="font-size: 0.8rem; margin-top: 1rem; opacity: 0.8;">Response time: 4-24 hours based on priority level</div>
                </div>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #111111;
                color: #00cc33;
                padding: 3rem;
                border-radius: 15px;
                z-index: 10001;
                font-family: 'Orbitron', monospace;
                font-weight: 600;
                text-align: center;
                box-shadow: 0 0 40px #00cc33;
                border: 2px solid #00cc33;
                max-width: 500px;
                animation: successPulse 0.5s ease-in-out;
            `;
            
            // Add success animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes successPulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'successPulse 0.3s ease-in-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                    if (style.parentNode) {
                        style.remove();
                    }
                }, 300);
            }, 5000);
            
            // Click to dismiss
            notification.addEventListener('click', () => {
                notification.style.animation = 'successPulse 0.3s ease-in-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        }
        
        cleanUrl() {
            // Clean up URL parameters
            const url = new URL(window.location);
            url.searchParams.delete('success');
            window.history.replaceState({}, document.title, url);
        }
    }
    
    // Scroll Animations
    class ScrollAnimations {
        constructor() {
            this.observer = null;
            this.init();
        }
        
        init() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animated');
                    }
                });
            }, observerOptions);
            
            // Observe elements that should animate on scroll
            const animateElements = document.querySelectorAll(`
                .service-card, 
                .blog-card, 
                .contact-method, 
                .stat, 
                .approach-item, 
                .value-card, 
                .cert-item,
                .category-card,
                .additional-service,
                .process-step,
                .security-item
            `);
            
            animateElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                this.observer.observe(el);
            });
        }
    }
    
    // Security Features
    class SecurityFeatures {
        constructor() {
            this.init();
        }
        
        init() {
            // Disable right-click context menu (basic protection)
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showSecurityMessage();
            });
            
            // Disable common developer shortcuts
            document.addEventListener('keydown', (e) => {
                // Disable F12, Ctrl+Shift+I, Ctrl+U
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    this.showSecurityMessage();
                }
            });
            
            // Console warning
            console.warn(`
    🛡️ HyperGrid Defenders Lab Security Notice 🛡️
    
    This website is protected by advanced security measures.
    Unauthorized access attempts are monitored and logged.
    
    For legitimate security research or vulnerability reporting,
    please contact: secure.defenderslab@protonmail.com
    
    PGP Key: 0xDEF455EC789ABD21
            `);
        }
        
        showSecurityMessage() {
            const message = document.createElement('div');
            message.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">🛡️</div>
                    <div>Security protocols active.</div>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">Unauthorized access attempts are logged.</div>
                </div>
            `;
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #111111;
                color: #00ff41;
                padding: 2rem 3rem;
                border: 2px solid #00ff41;
                border-radius: 10px;
                font-family: 'Orbitron', monospace;
                text-align: center;
                z-index: 10001;
                box-shadow: 0 0 30px #00ff41;
                animation: securityPulse 0.3s ease-in-out;
            `;
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes securityPulse {
                    0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
                if (style.parentNode) {
                    style.remove();
                }
            }, 3000);
        }
    }
    
    // Utility Functions
    class Utils {
        static debounce(func, wait) {
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
        
        static throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all components
        new MatrixRain();
        new NavigationHandler();
        new ContactFormHandler();
        new ScrollAnimations();
        new SecurityFeatures();
        
        // Card hover effects
        const cards = document.querySelectorAll('.service-card, .blog-card, .contact-method, .stat');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.style.transform.includes('translateY')) {
                    card.style.transform = 'translateY(-10px)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Enhanced button effects
        const buttons = document.querySelectorAll('.cta-button, .service-btn, .submit-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Terminal typing effect for hero
        const terminalPrompts = document.querySelectorAll('.terminal-prompt');
        terminalPrompts.forEach(prompt => {
            const text = prompt.textContent;
            prompt.textContent = '';
            prompt.style.opacity = '1';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    prompt.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    // Add blinking cursor
                    prompt.innerHTML += '<span class="cursor">|</span>';
                    
                    // Add cursor blinking animation
                    if (!document.getElementById('cursor-blink-style')) {
                        const style = document.createElement('style');
                        style.id = 'cursor-blink-style';
                        style.textContent = `
                            .cursor {
                                animation: blink 1s infinite;
                            }
                            @keyframes blink {
                                0%, 50% { opacity: 1; }
                                51%, 100% { opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }
            };
            
            setTimeout(typeWriter, 500);
        });
        
        // Smooth scroll for internal links
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        console.log('[HyperGrid Security] All systems initialized and secured. Formspree integration active.');
    });
    
})();
