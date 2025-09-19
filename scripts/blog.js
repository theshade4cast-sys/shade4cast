// Blog page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                handleNewsletterSignup(email).then(response => {
                    if (response.success) {
                        showNotification('Thank you for subscribing!', 'success');
                        this.querySelector('input[type="email"]').value = '';
                    } else {
                        showNotification('Subscription failed. Please try again.', 'error');
                    }
                });
            }
        });
    }

    // Load more posts functionality
    const loadMoreBtn = document.querySelector('.load-more .btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading more posts
            setTimeout(() => {
                loadMorePosts();
                this.innerHTML = 'Load More Articles';
            }, 1500);
        });
    }

    // Enhanced scroll animations for blog elements
    const blogObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe blog elements
    document.querySelectorAll('.blog-post, .featured-post, .sidebar-widget').forEach(element => {
        blogObserver.observe(element);
    });

    // Category filtering (placeholder)
    document.querySelectorAll('.categories-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            filterPostsByCategory(category);
        });
    });

    // Tag filtering
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const tagName = this.textContent.trim();
            filterPostsByTag(tagName);
        });
    });

    // Reading time calculation for dynamic posts
    calculateReadingTimes();

    // Social sharing for posts
    addSocialSharing();
});

// Newsletter signup handler
async function handleNewsletterSignup(email) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                success: Math.random() > 0.1, // 90% success rate simulation
                message: 'Successfully subscribed!' 
            });
        }, 1000);
    });
}

// Load more posts functionality
function loadMorePosts() {
    const blogPosts = document.querySelector('.blog-posts');
    const additionalPosts = [
        {
            title: "Behind Closed Doors: Congressional Deal-Making Exposed",
            author: "Maya Patel",
            date: "December 1, 2024",
            readTime: "6 min read",
            excerpt: "What really happens when politicians negotiate behind closed doors? Our investigation reveals the tactics and compromises that shape legislation.",
            tags: ["Congress", "Legislative Process"],
            icon: "fas fa-handshake"
        },
        {
            title: "The Revolving Door: From Capitol Hill to K Street",
            author: "Jordan Chen",
            date: "November 28, 2024",
            readTime: "7 min read",
            excerpt: "Former government officials becoming lobbyists is nothing new, but the speed and scale of this transition has reached unprecedented levels.",
            tags: ["Lobbying", "Government Ethics"],
            icon: "fas fa-sync-alt"
        }
    ];

    additionalPosts.forEach((post, index) => {
        const postElement = createPostElement(post);
        postElement.style.opacity = '0';
        postElement.style.transform = 'translateY(30px)';
        blogPosts.appendChild(postElement);
        
        // Animate in
        setTimeout(() => {
            postElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            postElement.style.opacity = '1';
            postElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Create post element
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    
    article.innerHTML = `
        <div class="post-image-small">
            <div class="post-placeholder-small">
                <i class="${post.icon}"></i>
            </div>
        </div>
        <div class="post-content">
            <h3><a href="#" class="post-title-link">${post.title}</a></h3>
            <div class="post-meta">
                <span class="post-author">${post.author}</span>
                <span class="post-date">${post.date}</span>
                <span class="post-reading-time">${post.readTime}</span>
            </div>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return article;
}

// Filter posts by category
function filterPostsByCategory(category) {
    console.log(`Filtering posts by category: ${category}`);
    showNotification(`Showing posts in category: ${category}`, 'info');
    
    // In a real implementation, this would filter the posts
    // For now, we'll just show a notification
}

// Filter posts by tag
function filterPostsByTag(tag) {
    console.log(`Filtering posts by tag: ${tag}`);
    showNotification(`Showing posts tagged: ${tag}`, 'info');
    
    // In a real implementation, this would filter the posts
}

// Calculate reading times for posts
function calculateReadingTimes() {
    const wordsPerMinute = 200;
    
    document.querySelectorAll('.post-excerpt').forEach(excerpt => {
        const wordCount = excerpt.textContent.split(' ').length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        
        // Update reading time if element exists
        const readTimeElement = excerpt.closest('.post-content').querySelector('.post-reading-time');
        if (readTimeElement && readTime > 0) {
            readTimeElement.innerHTML = `<i class="fas fa-clock"></i> ${readTime} min read`;
        }
    });
}

// Add social sharing functionality
function addSocialSharing() {
    document.querySelectorAll('.post-title-link').forEach(titleLink => {
        titleLink.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const title = this.textContent;
            const url = window.location.href;
            sharePost(title, url);
        });
    });
}

// Share post functionality
function sharePost(title, url) {
    if (navigator.share) {
        navigator.share({
            title: `The Shade 4cast: ${title}`,
            text: `Check out this article from The Shade 4cast blog!`,
            url: url
        });
    } else {
        const shareText = `Check out "${title}" from The Shade 4cast blog: ${url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Post URL copied to clipboard!', 'success');
        });
    }
}

// Search functionality
function searchPosts(query) {
    console.log(`Searching for: ${query}`);
    
    // In a real implementation, this would search through posts
    const posts = document.querySelectorAll('.blog-post, .featured-post');
    let matches = 0;
    
    posts.forEach(post => {
        const title = post.querySelector('h2, h3').textContent.toLowerCase();
        const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
        const isMatch = title.includes(query.toLowerCase()) || excerpt.includes(query.toLowerCase());
        
        post.style.display = isMatch ? 'block' : 'none';
        if (isMatch) matches++;
    });
    
    showNotification(`Found ${matches} posts matching "${query}"`, 'info');
}

// Bookmark functionality
function bookmarkPost(postId, postTitle) {
    let bookmarks = JSON.parse(localStorage.getItem('shade4cast-bookmarks') || '[]');
    
    if (!bookmarks.find(bookmark => bookmark.id === postId)) {
        bookmarks.push({
            id: postId,
            title: postTitle,
            bookmarkedAt: new Date().toISOString()
        });
        localStorage.setItem('shade4cast-bookmarks', JSON.stringify(bookmarks));
        showNotification(`Bookmarked: "${postTitle}"`, 'success');
    } else {
        showNotification('Post already bookmarked!', 'info');
    }
}

// Get bookmarked posts
function getBookmarks() {
    return JSON.parse(localStorage.getItem('shade4cast-bookmarks') || '[]');
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : type === 'error' ? '#e74c3c' : 'var(--primary-color)'};
        color: white;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Advanced search with filters
function advancedSearch(options) {
    const { query, author, dateFrom, dateTo, tags, category } = options;
    
    console.log('Advanced search with options:', options);
    
    // This would integrate with a backend search API in a real implementation
    return {
        results: [],
        totalCount: 0,
        filters: options
    };
}

// Comment system placeholder
function loadComments(postId) {
    console.log(`Loading comments for post: ${postId}`);
    
    // This would load comments from a backend service
    return {
        comments: [],
        totalCount: 0
    };
}

// Related posts functionality
function getRelatedPosts(currentPostId, tags) {
    console.log(`Finding related posts for: ${currentPostId} with tags:`, tags);
    
    // This would find related posts based on tags and content similarity
    return [];
}