// 🎬 Cine Gama - Enhanced JavaScript with Carbon Design
// Modern ES6+ JavaScript with accessibility and performance optimizations

class CineGamaApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupScrollProgress();
        this.setupNotificationSystem();
    }

    init() {
        console.log('🎬 Cine Gama - Carbon Design System Initialized');
        
        // Set up initial theme
        this.setTheme();
        
        // Initialize accessibility features
        this.setupAccessibility();
        
        // Load movie data dynamically if needed
        this.loadMovieData();
    }

    setTheme() {
        // Detect user preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'dark'); // Always dark for cinema theme
    }

    setupEventListeners() {
        // Movie card interactions serão configurados pelo movies-dynamic.js
        // após o carregamento dinâmico
        
        // CTA button enhancement
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', this.handleCTAClick.bind(this));
        }

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Responsive navigation
        this.setupResponsiveNavigation();
    }

    loadMovieData() {
        // Movie data será carregado dinamicamente pelo movies-dynamic.js
        console.log('📽️ Sistema de filmes dinâmico ativo');
    }

    handleSessionCardClick(event) {
        const card = event.currentTarget;
        const sessionTime = card.querySelector('.session-time')?.textContent;
        const sessionRoom = card.querySelector('.session-room')?.textContent;
        
        // Add visual feedback
        this.addClickFeedback(card);
        
        // Show notification
        this.showNotification(
            'Sessão Selecionada',
            `Sessão das ${sessionTime} em ${sessionRoom}. Deseja comprar ingresso?`,
            'info'
        );

        // Copy session info to clipboard
        const message = `Quero comprar ingresso para a sessão das ${sessionTime} na ${sessionRoom}`;
        this.copyToClipboard(message);

        // Analytics tracking (placeholder)
        this.trackEvent('session_card_click', { time: sessionTime, room: sessionRoom });
    }

    handleCardKeydown(event) {
        // Handle Enter and Space keys for accessibility
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
        }
    }

    handleCTAClick(event) {
        event.preventDefault();
        
        // Smooth scroll to movies section
        const moviesSection = document.querySelector('#filmes');
        if (moviesSection) {
            moviesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Show notification
        this.showNotification(
            'Explorando Filmes',
            'Confira nossa seleção de filmes em cartaz!',
            'info'
        );
    }

    handleSmoothScroll(event) {
        event.preventDefault();
        
        const targetId = event.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        const updateScrollProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const progress = (scrollTop / documentHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };

        // Throttle scroll events for performance
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updateScrollProgress(); // Initial call
    }

    setupNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.position = 'fixed';
            container.style.top = '80px';
            container.style.right = '1rem';
            container.style.zIndex = '9999';
            container.style.pointerEvents = 'none';
            document.body.appendChild(container);
        }
    }

    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        // Icon mapping
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        notification.innerHTML = `
            <span class="notification-icon material-symbols-outlined">${icons[type] || 'info'}</span>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;

        // Add to container
        container.appendChild(notification);

        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    addClickFeedback(element) {
        // Add temporary visual feedback
        element.style.transform = 'translateY(2px)';
        element.style.transition = 'transform 150ms ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                return success;
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }

    setupAccessibility() {
        // Ensure proper focus management
        document.addEventListener('keydown', (event) => {
            // Add visible focus indicators when using keyboard
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to main content link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#filmes';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--cds-interactive-01);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupResponsiveNavigation() {
        // Handle mobile navigation if needed
        const navbar = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        
        // Add mobile menu button if screen is small
        const addMobileMenu = () => {
            if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-button')) {
                const mobileButton = document.createElement('button');
                mobileButton.className = 'mobile-menu-button';
                mobileButton.innerHTML = '<span class="material-symbols-outlined">menu</span>';
                mobileButton.setAttribute('aria-label', 'Abrir menu de navegação');
                mobileButton.style.cssText = `
                    background: none;
                    border: none;
                    color: var(--cds-text-primary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    transition: background var(--cds-transition-moderate);
                `;
                
                mobileButton.addEventListener('click', () => {
                    navLinks.classList.toggle('mobile-open');
                    mobileButton.innerHTML = navLinks.classList.contains('mobile-open') 
                        ? '<span class="material-symbols-outlined">close</span>'
                        : '<span class="material-symbols-outlined">menu</span>';
                });
                
                navbar.appendChild(mobileButton);
            }
        };

        // Check on load and resize
        addMobileMenu();
        window.addEventListener('resize', addMobileMenu);
    }

    loadMovieData() {
        // This could be expanded to load data from an API
        // For now, we'll work with the static HTML content
        const movieCards = document.querySelectorAll('.movie-card');
        console.log(`📽️ Loaded ${movieCards.length} movies`);
    }

    trackEvent(eventName, data) {
        // Placeholder for analytics tracking
        console.log(`📊 Event: ${eventName}`, data);
        
        // In a real application, you would send this to your analytics service
        // Example: gtag('event', eventName, data);
    }
}

// Performance optimization: Use IntersectionObserver for animations
class LazyAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.setupObserver();
    }

    setupObserver() {
        if (!window.IntersectionObserver) return;

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );

        // Observe all cards
        const cards = document.querySelectorAll('.movie-card, .session-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            this.observer.observe(card);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                this.observer.unobserve(element);
            }
        });
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new CineGamaApp();
    
    // Initialize lazy animations
    const animations = new LazyAnimations();
    
    // Store app instance globally for debugging
    window.CineGamaApp = app;
    
    console.log('🎬 Cine Gama fully loaded and ready!');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}