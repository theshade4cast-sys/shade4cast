// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial call to set active nav on load
    updateActiveNav();

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--background-color)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for animation
    document.querySelectorAll('.feature-card, .episode-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Episode card click handlers (placeholder for future YouTube integration)
    document.querySelectorAll('.episode-card').forEach(card => {
        card.addEventListener('click', function() {
            // Placeholder for YouTube video opening
            console.log('Opening episode:', this.querySelector('h3').textContent);
            // In a real implementation, this would open a modal or navigate to YouTube
        });
    });

    // Add loading animation to play buttons
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate loading and then revert (placeholder)
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-play"></i>';
            }, 2000);
        });
    });
});

// Utility functions
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
}

// Add to favorites functionality (localStorage)
function addToFavorites(episodeId, episodeTitle) {
    let favorites = JSON.parse(localStorage.getItem('shade4cast-favorites') || '[]');
    
    if (!favorites.find(fav => fav.id === episodeId)) {
        favorites.push({
            id: episodeId,
            title: episodeTitle,
            addedAt: new Date().toISOString()
        });
        localStorage.setItem('shade4cast-favorites', JSON.stringify(favorites));
        
        // Show notification (you could enhance this with a toast library)
        console.log(`Added "${episodeTitle}" to favorites`);
    }
}

function removeFromFavorites(episodeId) {
    let favorites = JSON.parse(localStorage.getItem('shade4cast-favorites') || '[]');
    favorites = favorites.filter(fav => fav.id !== episodeId);
    localStorage.setItem('shade4cast-favorites', JSON.stringify(favorites));
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('shade4cast-favorites') || '[]');
}

// Newsletter signup functionality
function handleNewsletterSignup(email) {
    // Placeholder for newsletter signup
    console.log('Newsletter signup:', email);
    
    // In a real implementation, this would make an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Successfully subscribed to newsletter!' });
        }, 1000);
    });
}

// Search functionality placeholder
function searchEpisodes(query) {
    // Placeholder for search functionality
    console.log('Searching for:', query);
    
    // In a real implementation, this would search through episodes
    return [];
}

// Social sharing functionality
function shareEpisode(episodeTitle, episodeUrl) {
    if (navigator.share) {
        navigator.share({
            title: `The Shade 4cast: ${episodeTitle}`,
            text: `Check out this episode from The Shade 4cast podcast!`,
            url: episodeUrl
        });
    } else {
        // Fallback: copy to clipboard
        const shareText = `Check out "${episodeTitle}" from The Shade 4cast: ${episodeUrl}`;
        navigator.clipboard.writeText(shareText).then(() => {
            console.log('Episode URL copied to clipboard');
        });
    }
}

// Theme switching functionality (for future dark mode)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shade4cast-theme', newTheme);
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('shade4cast-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', loadSavedTheme);