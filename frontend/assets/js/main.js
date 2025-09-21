// 🎬 Cine Gama - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
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

    // Observe all movie cards and session cards for animations
    document.querySelectorAll('.movie-card, .session-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Bom dia! ☀️';
    else if (hour < 18) greeting = 'Boa tarde! 🌤️';
    else greeting = 'Boa noite! 🌙';

    console.log(`${greeting} Bem-vindo ao Cine Gama! 🎬`);

    // Add loading effect for movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('loaded');
        }, index * 100);
    });

    // Add hover effects for session cards
    const sessionCards = document.querySelectorAll('.session-card');
    sessionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderLeftColor = '#4ecdc4';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderLeftColor = '#ff6b6b';
        });
    });
});