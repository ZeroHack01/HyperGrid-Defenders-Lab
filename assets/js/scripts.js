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
    
    // Simplified Contact Form Handler for Formspree
    class ContactFormHandler {
        constructor() {
            this.form = document.getElementById('contact-form');
            this.statusDiv = document.getElementById('form-status');
            this.init();
        }
        
        init() {
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
                
                // Check if we returned from successful submission
                this.checkUrlForSuccess();
            }
        }
        
        checkUrlForSuccess() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('success') === '1') {
                this.showSuccess('🎯 Secure message transmitted successfully! We will respond within the specified timeframe to your email address.');
                
                // Clean up URL
                const url = new URL(window.location);
                url.searchParams.delete('success');
                window.history.replaceState({}, document.title, url);
            }
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'TRANSMITTING...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Clear any previous status
            if (this.statusDiv) {
                this.statusDiv.textContent = '';
            }
            
            try {
                // Submit to Formspree
                const formData = new FormData(this.form);
                const response = await fetch(this.form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success animation
                    submitBtn.textContent = 'MESSAGE TRANSMITTED ✓';
                    submitBtn.classList.remove('loading');
                    
                    setTimeout(() => {
                        this.form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        this.showSuccess('🛡️ Secure transmission successful! Your message has been encrypted and sent to our security team. Response time: 4-24 hours based on priority level.');
                    }, 2000);
                    
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to send message');
                }
                
            } catch (error) {
                // Error handling
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                
                this.showError('⚠️ Transmission failed. Please try again or contact us directly at secure.defenderslab@protonmail.com');
                console.error('Form submission error:', error);
            }
        }
        
        showSuccess(message) {
            this.showNotification(message, 'success');
        }
        
        showError(message) {
            this.showNotification(message, 'error');
        }
        
        showNotification(message, type) {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1.5rem 2rem;
                background: ${type === 'error' ? '#ff3333' : '#00cc33'};
                color: #0a0a0a;
                border-radius: 8px;
                z-index: 10000;
                font-family: 'Orbitron', monospace;
                font-weight: 600;
                font-size: 0.9rem;
                box-shadow: 0 0 25px ${type === 'error' ? '#ff3333' : '#00cc33'};
                animation: slideInRight 0.4s ease;
                max-width: 400px;
                word-wrap: break-word;
                line-height: 1.4;
                border: 2px solid ${type === 'error' ? '#ff3333' : '#00cc33'};
            `;
            
            // Add CSS animation if not exists
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Auto remove after delay
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.4s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }, 6000);
            
            // Click to dismiss
            notification.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.4s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            });
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
            message.textContent = '🛡️ Security protocols active. Unauthorized access attempts are logged.';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #111111;
                color: #00ff41;
                padding: 2rem;
                border: 2px solid #00ff41;
                border-radius: 10px;
                font-family: 'Orbitron', monospace;
                text-align: center;
                z-index: 10001;
                box-shadow: 0 0 30px #00ff41;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
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
        const cards = document.querySelectorAll('.service-card, .blog-card, .contact-method');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
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
                    const style = document.createElement('style');
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
            };
            
            setTimeout(typeWriter, 500);
        });
        
        console.log('[HyperGrid Security] All systems initialized and secured. Form submissions via Formspree active.');
    });
    
})();
