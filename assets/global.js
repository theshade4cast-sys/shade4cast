/**
 * Global JavaScript for The Shade 4cast Theme
 */

// Utility functions
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

const throttle = (func, limit) => {
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
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
});

function initializeTheme() {
  // Initialize all theme components
  initMobileMenu();
  initVideoEmbeds();
  initNewsletterForm();
  initSmoothScrolling();
  initLazyLoading();
  initCartDrawer();
  initProductForms();
  initSearchFunctionality();
}

// Mobile Menu
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const headerNav = document.querySelector('.header__nav');
  
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = headerNav.classList.contains('is-open');
      
      if (isOpen) {
        headerNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      } else {
        headerNav.classList.add('is-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('mobile-nav-open');
      }
    });

    // Close mobile menu on resize
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 990) {
        headerNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.header__nav') && !e.target.closest('.mobile-nav-toggle')) {
        headerNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      }
    });
  }
}

// Video Embeds
function initVideoEmbeds() {
  const videoEmbeds = document.querySelectorAll('.video-embed');
  
  videoEmbeds.forEach(embed => {
    const iframe = embed.querySelector('iframe');
    if (iframe) {
      // Add loading lazy to iframes for performance
      iframe.setAttribute('loading', 'lazy');
      
      // Handle video aspect ratio
      const aspectRatio = embed.dataset.aspectRatio || '16:9';
      const [width, height] = aspectRatio.split(':');
      const paddingBottom = (height / width) * 100;
      embed.style.paddingBottom = `${paddingBottom}%`;
    }
  });
}

// Newsletter Form
function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter__form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = form.querySelector('.newsletter__input').value;
      const submitBtn = form.querySelector('.btn');
      
      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      
      // Simulate API call (replace with actual newsletter service)
      setTimeout(() => {
        showNotification('Thank you for subscribing!', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__message">${message}</span>
      <button class="notification__close" aria-label="Close notification">&times;</button>
    </div>
  `;
  
  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: 500;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${type === 'success' ? 'background-color: #10b981;' : ''}
    ${type === 'error' ? 'background-color: #ef4444;' : ''}
    ${type === 'info' ? 'background-color: #3b82f6;' : ''}
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.addEventListener('click', () => {
    closeNotification(notification);
  });
  
  // Auto close after 5 seconds
  setTimeout(() => {
    closeNotification(notification);
  }, 5000);
}

function closeNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 300);
}

// Smooth scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Lazy loading for images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Cart drawer functionality
function initCartDrawer() {
  const cartToggle = document.querySelector('.header__cart-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartClose = document.querySelector('.cart-drawer__close');
  const cartOverlay = document.querySelector('.cart-drawer__overlay');
  
  if (cartToggle && cartDrawer) {
    cartToggle.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
    
    if (cartClose) {
      cartClose.addEventListener('click', closeCartDrawer);
    }
    
    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCartDrawer);
    }
  }
}

function openCartDrawer() {
  const cartDrawer = document.querySelector('.cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.add('is-open');
    document.body.classList.add('cart-drawer-open');
  }
}

function closeCartDrawer() {
  const cartDrawer = document.querySelector('.cart-drawer');
  if (cartDrawer) {
    cartDrawer.classList.remove('is-open');
    document.body.classList.remove('cart-drawer-open');
  }
}

// Product forms
function initProductForms() {
  const productForms = document.querySelectorAll('.product-form');
  
  productForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('.product-form__cart-button');
      
      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Adding...';
      submitBtn.disabled = true;
      
      // Add to cart
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        showNotification('Product added to cart!', 'success');
        updateCartCount();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Error adding product to cart', 'error');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  });
}

// Update cart count
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
        cartCount.style.display = cart.item_count > 0 ? 'block' : 'none';
      }
    })
    .catch(error => console.error('Error updating cart count:', error));
}

// Search functionality
function initSearchFunctionality() {
  const searchToggle = document.querySelector('.header__search-toggle');
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-form__input');
  const searchResults = document.querySelector('.search-results');
  
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleSearch();
    });
    
    if (searchInput) {
      searchInput.addEventListener('input', debounce(performSearch, 300));
      
      // Close search when clicking outside
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-form') && !e.target.closest('.header__search-toggle')) {
          closeSearch();
        }
      });
    }
  }
}

function toggleSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-form__input');
  
  if (searchForm.classList.contains('is-open')) {
    closeSearch();
  } else {
    searchForm.classList.add('is-open');
    searchInput.focus();
  }
}

function closeSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchResults = document.querySelector('.search-results');
  
  searchForm.classList.remove('is-open');
  
  if (searchResults) {
    searchResults.style.display = 'none';
  }
}

function performSearch() {
  const searchInput = document.querySelector('.search-form__input');
  const searchResults = document.querySelector('.search-results');
  const query = searchInput.value.trim();
  
  if (query.length < 2) {
    if (searchResults) {
      searchResults.style.display = 'none';
    }
    return;
  }
  
  // Perform search API call
  fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,article,page`)
    .then(response => response.json())
    .then(data => {
      displaySearchResults(data);
    })
    .catch(error => {
      console.error('Search error:', error);
    });
}

function displaySearchResults(data) {
  const searchResults = document.querySelector('.search-results');
  
  if (!searchResults) return;
  
  let html = '';
  
  if (data.resources && data.resources.results) {
    const results = data.resources.results;
    
    if (results.products && results.products.length > 0) {
      html += '<h4>Products</h4>';
      results.products.forEach(product => {
        html += `
          <a href="${product.url}" class="search-result">
            <span class="search-result__title">${product.title}</span>
            <span class="search-result__price">${product.price}</span>
          </a>
        `;
      });
    }
    
    if (results.articles && results.articles.length > 0) {
      html += '<h4>Articles</h4>';
      results.articles.forEach(article => {
        html += `
          <a href="${article.url}" class="search-result">
            <span class="search-result__title">${article.title}</span>
          </a>
        `;
      });
    }
    
    if (results.pages && results.pages.length > 0) {
      html += '<h4>Pages</h4>';
      results.pages.forEach(page => {
        html += `
          <a href="${page.url}" class="search-result">
            <span class="search-result__title">${page.title}</span>
          </a>
        `;
      });
    }
  }
  
  if (html === '') {
    html = '<p>No results found</p>';
  }
  
  searchResults.innerHTML = html;
  searchResults.style.display = 'block';
}

// YouTube API integration
function initYouTubeAPI() {
  // Load YouTube API if needed
  if (document.querySelector('.youtube-feed')) {
    loadYouTubeVideos();
  }
}

function loadYouTubeVideos() {
  // This would integrate with YouTube API to fetch latest videos
  // For now, this is a placeholder for the actual implementation
  const channelId = 'YOUR_CHANNEL_ID'; // Replace with actual channel ID
  const apiKey = 'YOUR_API_KEY'; // Replace with actual API key
  
  // Example API call structure
  // fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&key=${apiKey}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     displayYouTubeVideos(data.items);
  //   });
}

// Accessibility improvements
function initAccessibility() {
  // Add skip links
  const skipLink = document.querySelector('.skip-to-content-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector('#MainContent');
      if (target) {
        target.focus();
        target.scrollIntoView();
      }
    });
  }
  
  // Keyboard navigation for dropdowns
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown__toggle');
    const menu = dropdown.querySelector('.dropdown__menu');
    
    if (toggle && menu) {
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    }
  });
}

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', initAccessibility);

// Expose global functions
window.ThemeShade4cast = {
  openCartDrawer,
  closeCartDrawer,
  showNotification,
  updateCartCount
};