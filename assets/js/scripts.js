
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
    
    // Contact Form Handler
    class ContactFormHandler {
        constructor() {
            this.form = document.getElementById('contact-form');
            this.init();
        }
        
        init() {
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        }
        
        handleSubmit(e) {
            e.preventDefault();
            
            // Basic form validation
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            if (!this.validateForm(data)) {
                return;
            }
            
            // Simulate form submission (replace with actual endpoint)
            this.submitForm(data);
        }
        
        validateForm(data) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!data.name || data.name.trim().length < 2) {
                this.showError('Please enter a valid name (minimum 2 characters)');
                return false;
            }
            
            if (!emailRegex.test(data.email)) {
                this.showError('Please enter a valid email address');
                return false;
            }
            
            if (!data.service) {
                this.showError('Please select a service of interest');
                return false;
            }
            
            if (!data.urgency) {
                this.showError('Please select a priority level');
                return false;
            }
            
            if (!data.subject || data.subject.trim().length < 5) {
                this.showError('Please enter a subject (minimum 5 characters)');
                return false;
            }
            
            if (!data.message || data.message.trim().length < 20) {
                this.showError('Please enter a message (minimum 20 characters)');
                return false;
            }
            
            if (!data['privacy-consent']) {
                this.showError('You must consent to processing of your information');
                return false;
            }
            
            return true;
        }
        
        submitForm(data) {
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'TRANSMITTING...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulate API call (replace with actual endpoint)
            setTimeout(() => {
                submitBtn.textContent = 'MESSAGE TRANSMITTED ✓';
                submitBtn.classList.remove('loading');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    this.form.reset();
                    this.showSuccess('Secure message transmitted successfully! We will respond within the specified timeframe.');
                }, 2000);
            }, 1500);
        }
        
        showError(message) {
            this.showNotification(message, 'error');
        }
        
        showSuccess(message) {
            this.showNotification(message, 'success');
        }
        
        showNotification(message, type) {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top:                                 <option value="threat-analysis">Custom Threat Analysis</option>
                                <option value="incident-response">Incident Response</option>
                                <option value="security-training">Security Training</option>
                                <option value="consultation">General Consultation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="urgency">Priority Level:</label>
                            <select id="urgency" name="urgency" required>
                                <option value="">Select priority...</option>
                                <option value="low">Low - General inquiry</option>
                                <option value="medium">Medium - Planning consultation</option>
                                <option value="high">High - Active security concern</option>
                                <option value="critical">Critical - Active incident</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Mission Objective:</label>
                        <input type="text" id="subject" name="subject" required>
                        <small>Brief description of your security needs</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Encrypted Message:</label>
                        <textarea id="message" name="message" rows="6" required></textarea>
                        <small>Detailed description of your requirements (minimum 20 characters)</small>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="pgp-request" name="pgp-request">
                            <span class="checkmark"></span>
                            Request PGP encrypted response for sensitive communications
                        </label>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="privacy-consent" name="privacy-consent" required>
                            <span class="checkmark"></span>
                            I consent to secure processing of this information for consultation purposes
                        </label>
                    </div>
                    
                    <button type="submit" class="submit-btn">TRANSMIT SECURE MESSAGE</button>
                </form>
            </div>
        </div>
    </section>

    <section class="security-info">
        <div class="container">
            <h2 class="section-title">Security Protocols</h2>
            <div class="security-grid">
                <div class="security-item">
                    <h3>🔐 PGP Encryption</h3>
                    <p>For highly sensitive communications, we recommend using PGP encryption.</p>
                    <div class="pgp-details">
                        <p><strong>Key ID:</strong> 0xDEF455EC789ABD21</p>
                        <p><strong>Fingerprint:</strong> A1B2 C3D4 E5F6 7890 1234 5678 DEF4 55EC 789A BD21</p>
                        <a href="#" class="download-key">Download Public Key</a>
                    </div>
                </div>
                
                <div class="security-item">
                    <h3>🛡️ Security Standards</h3>
                    <p>All communications are protected by:</p>
                    <ul>
                        <li>TLS 1.3 encryption in transit</li>
                        <li>AES-256 encryption at rest</li>
                        <li>Zero-knowledge architecture</li>
                        <li>Secure deletion protocols</li>
                        <li>Multi-factor authentication</li>
                    </ul>
                </div>
                
                <div class="security-item">
                    <h3>⏱️ Response Times</h3>
                    <p>Guaranteed response times based on priority:</p>
                    <ul>
                        <li><strong>Critical:</strong> Within 1 hour</li>
                        <li><strong>High:</strong> Within 4 hours</li>
                        <li><strong>Medium:</strong> Within 24 hours</li>
                        <li><strong>Low:</strong> Within 48 hours</li>
                    </ul>
                </div>
                
                <div class="security-item">
                    <h3>🏢 Secure Facilities</h3>
                    <p>Our operations are conducted from:</p>
                    <ul>
                        <li>TEMPEST-rated secure rooms</li>
                        <li>Biometric access controls</li>
                        <li>24/7 physical security</li>
                        <li>Air-gapped networks</li>
                        <li>Faraday cage protection</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section class="office-info">
        <div class="container">
            <h2 class="section-title">Operations Center</h2>
            <div class="office-grid">
                <div class="office-location">
                    <h3>Primary Operations Center</h3>
                    <p>🏢 Secure facility with restricted access</p>
                    <p>📍 Location disclosed to verified clients only</p>
                    <p>🔒 TEMPEST-rated secure communication room</p>
                    <p>🛡️ Military-grade security protocols</p>
                </div>
                <div class="office-hours">
                    <h3>Operation Hours</h3>
                    <p>🕒 Business Hours: Mon-Fri 9:00-18:00 GMT</p>
                    <p>🌙 Emergency Response: 24/7/365</p>
                    <p>📞 Incident Hotline: Always monitored</p>
                    <p>🔔 Automated threat monitoring: Continuous</p>
                </div>
                <div class="compliance-info">
                    <h3>Compliance & Certifications</h3>
                    <p>🏆 ISO 27001 Certified</p>
                    <p>📋 SOC 2 Type II Compliant</p>
                    <p>🔐 NIST Framework Aligned</p>
                    <p>🌍 GDPR Compliant Operations</p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <div class="footer-grid">
                <div class="footer-section">
                    <h4>HyperGrid Defenders Lab</h4>
                    <p>Elite cybersecurity solutions protecting the digital frontier.</p>
                    <div class="contact-info">
                        <p>📧 contact@hypergridsec.com</p>
                        <p>🔐 security@hypergridsec.com</p>
                        <p>📞 +1-555-SECURITY</p>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="services.html">Vulnerability Assessment</a></li>
                        <li><a href="services.html">Penetration Testing</a></li>
                        <li><a href="services.html">Security Implementation</a></li>
                        <li><a href="services.html">Threat Analysis</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="blog.html">Security Blog</a></li>
                        <li><a href="security.txt">Security Policy</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Security Notice</h4>
                    <div class="security-info">
                        <p>🛡️ This site uses HTTPS encryption</p>
                        <p>🔒 All communications are secured</p>
                        <p>🎯 Zero-trust security model</p>
                    </div>
                </div>
            </div>
            
            <div class="pgp-info">
                <h4>🔐 High-Security Communications</h4>
                <p>For sensitive inquiries requiring enhanced security:</p>
                <p><strong>PGP Key ID:</strong> 0xDEF455EC789ABD21</p>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 HyperGrid Defenders Lab. All rights reserved.</p>
                <p class="security-notice">"In the digital realm, security is not a destination—it's a continuous mission."</p>
            </div>
        </div>
    </footer>

    <script src="assets/js/scripts.js"></script>
</body>
</html>
