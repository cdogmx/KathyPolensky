// JavaScript for Kathy Polensky Real Estate Website

// Sample testimonials data from multiple sources
const testimonials = [
    {
        text: "Kathy was absolutely amazing throughout our entire home buying process. Her knowledge of the Watertown market is unmatched, and she made what could have been a stressful experience completely smooth and enjoyable.",
        author: "Sarah & Mike Johnson",
        rating: 5,
        source: "Zillow",
        sourceUrl: "https://www.zillow.com/profile/user394835214",
        date: "2024-01-15"
    },
    {
        text: "Professional, responsive, and incredibly knowledgeable. Kathy helped us sell our home quickly and for more than we expected. Her marketing strategy and negotiation skills are top-notch.",
        author: "Robert Chen",
        rating: 5,
        source: "Realtor.com",
        sourceUrl: "https://www.realtor.com/realestateagents/5681933bbb954c01006972b4",
        date: "2024-01-10"
    },
    {
        text: "Kathy's dedication to her clients is evident in everything she does. She went above and beyond to help us find our dream home. I would recommend her to anyone looking to buy or sell in the area.",
        author: "Jennifer Martinez",
        rating: 5,
        source: "Facebook",
        sourceUrl: "https://www.facebook.com/profile.php?id=100063831829597&sk=reviews",
        date: "2024-01-08"
    },
    {
        text: "As a first-time homebuyer, I was nervous about the process. Kathy patiently explained everything and guided me through each step. Her expertise and professionalism made all the difference.",
        author: "David Thompson",
        rating: 5,
        source: "LinkedIn",
        sourceUrl: "https://www.linkedin.com/in/kathy-polensky-651a9879/",
        date: "2024-01-05"
    },
    {
        text: "Outstanding service! Kathy's attention to detail and market knowledge helped us make informed decisions. The entire process was seamless, and we couldn't be happier with our new home.",
        author: "Lisa & Tom Wilson",
        rating: 5,
        source: "Yelp",
        sourceUrl: "https://www.yelp.com/biz/realty-executives-platinum-kathy-polensky-watertown-3",
        date: "2024-01-03"
    },
    {
        text: "Kathy's communication throughout the selling process was excellent. She kept us informed every step of the way and delivered results that exceeded our expectations.",
        author: "Mark Anderson",
        rating: 5,
        source: "RateMyAgent",
        sourceUrl: "https://www.ratemyagent.com/real-estate-agent/kathy-polensky-b0vejm/sales/overview",
        date: "2024-01-01"
    },
    {
        text: "Working with Kathy was a pleasure. Her professionalism, market expertise, and genuine care for her clients set her apart. We highly recommend her services to anyone in the Watertown area.",
        author: "Amanda & Chris Davis",
        rating: 5,
        source: "Realty Executives",
        sourceUrl: "https://www.realtyexecutives.com/agent/kathy-polensky/testimonials",
        date: "2023-12-28"
    }
];

// Sample listings data for filtering
const sampleListings = [
    {
        id: 1,
        address: "305 Theresa St, Watertown, WI 53094",
        price: 324900,
        sqft: 1354,
        bedrooms: 3,
        bathrooms: 2,
        type: "single-family",
        status: "active",
        mlsId: "1929100"
    },
    {
        id: 2,
        address: "228 Fremont St, Watertown, WI 53098",
        price: 279900,
        sqft: 1320,
        bedrooms: 2,
        bathrooms: 2,
        type: "single-family",
        status: "active",
        mlsId: "1934327"
    },
    {
        id: 3,
        address: "605 Autumn Crest Dr, Watertown, WI 53094",
        price: 389900,
        sqft: 1816,
        bedrooms: 3,
        bathrooms: 3,
        type: "single-family",
        status: "pending",
        mlsId: "1934636"
    },
    {
        id: 4,
        address: "605 Labaree St, Watertown, WI 53098",
        price: 339900,
        sqft: 1778,
        bedrooms: 3,
        bathrooms: 3,
        type: "single-family",
        status: "active",
        mlsId: "1935083"
    },
    {
        id: 5,
        address: "Lt2 Circle View, Clyman, WI 53016",
        price: 24900,
        sqft: 0,
        bedrooms: 0,
        bathrooms: 0,
        type: "land",
        status: "active",
        mlsId: "1929666"
    }
];

// Authentication system
let currentUser = null;
const validCredentials = {
    'kathy': 'polensky2024',
    'admin': 'realtyexec2024',
    'kathy.polensky': 'watertown2024'
};

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonials();
    initializeListings();
    initializeForms();
    initializeCalculator();
    addSmoothScrolling();
    addAnimations();
    initializeAuth();
    updateUIForAuth();
});

// Initialize testimonials carousel
function initializeTestimonials() {
    const carouselInner = document.querySelector('#testimonialsCarousel .carousel-inner');
    
    testimonials.forEach((testimonial, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        
        carouselItem.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-rating">
                    ${generateStars(testimonial.rating)}
                </div>
                <div class="testimonial-text">
                    "${testimonial.text}"
                </div>
                <div class="testimonial-author">
                    - ${testimonial.author}
                </div>
                <div class="testimonial-source">
                    <a href="${testimonial.sourceUrl}" target="_blank" rel="noopener">
                        ${testimonial.source} • ${formatDate(testimonial.date)}
                    </a>
                </div>
            </div>
        `;
        
        carouselInner.appendChild(carouselItem);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }
    return stars;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Initialize listings functionality
function initializeListings() {
    // Set up filter event listeners
    document.getElementById('priceFilter').addEventListener('change', filterListings);
    document.getElementById('typeFilter').addEventListener('change', filterListings);
    document.getElementById('statusFilter').addEventListener('change', filterListings);
}

// Filter listings based on selected criteria
function filterListings() {
    const priceFilter = document.getElementById('priceFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredListings = sampleListings.filter(listing => {
        let matches = true;
        
        // Price filter
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (max) {
                matches = matches && listing.price >= min && listing.price <= max;
            } else {
                matches = matches && listing.price >= min;
            }
        }
        
        // Type filter
        if (typeFilter) {
            matches = matches && listing.type === typeFilter;
        }
        
        // Status filter
        if (statusFilter) {
            matches = matches && listing.status === statusFilter;
        }
        
        return matches;
    });
    
    // In a real implementation, this would update the map markers
    console.log('Filtered listings:', filteredListings);
    
    // Show results count
    showFilterResults(filteredListings.length);
}

// Reset all filters
function resetFilters() {
    document.getElementById('priceFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = '';
    filterListings();
}

// Show filter results count
function showFilterResults(count) {
    // Create or update results display
    let resultsDiv = document.getElementById('filterResults');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'filterResults';
        resultsDiv.className = 'alert alert-info mt-3';
        document.querySelector('.filter-controls').appendChild(resultsDiv);
    }
    
    resultsDiv.textContent = `Showing ${count} listing${count !== 1 ? 's' : ''}`;
}

// Add new listing
function addListing() {
    const address = document.getElementById('listingAddress').value;
    const price = document.getElementById('listingPrice').value;
    const type = document.getElementById('listingType').value;
    const status = document.getElementById('listingStatus').value;
    
    if (!address || !price || !type || !status) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // In a real implementation, this would send data to a server
    const newListing = {
        id: sampleListings.length + 1,
        address: address,
        price: parseInt(price),
        type: type,
        status: status,
        mlsId: 'NEW' + Date.now()
    };
    
    sampleListings.push(newListing);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addListingModal'));
    modal.hide();
    document.getElementById('addListingForm').reset();
    
    // Show success message
    showMessage('Listing added successfully!', 'success');
}

// Initialize forms
function initializeForms() {
    // Home valuation form
    document.getElementById('homeValuationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleHomeValuation();
    });
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactForm();
    });
    
    // Free book form
    document.getElementById('freeBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFreeBookForm();
    });
}

// Handle home valuation form submission
function handleHomeValuation() {
    const name = document.getElementById('valuationName').value;
    const zip = document.getElementById('valuationZip').value;
    const contact = document.getElementById('valuationContact').value;
    
    // In a real implementation, this would send data to a server
    console.log('Home valuation request:', { name, zip, contact });
    
    showMessage('Thank you! Your home valuation request has been submitted. I will contact you within 24 hours.', 'success');
    document.getElementById('homeValuationForm').reset();
}

// Handle contact form submission
function handleContactForm() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const comments = document.getElementById('contactComments').value;
    
    // In a real implementation, this would send data to a server
    console.log('Contact form submission:', { name, email, phone, comments });
    
    showMessage('Thank you for your message! I will get back to you as soon as possible.', 'success');
    document.getElementById('contactForm').reset();
}

// Handle free book form submission
function handleFreeBookForm() {
    const name = document.getElementById('bookName').value;
    const email = document.getElementById('bookEmail').value;
    const phone = document.getElementById('bookPhone').value;
    
    // In a real implementation, this would send data to a server
    console.log('Free book request:', { name, email, phone });
    
    showMessage('Thank you! Your free real estate guide will be sent to your email shortly.', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('freeBookModal'));
    modal.hide();
    document.getElementById('freeBookForm').reset();
}

// Submit free book form (called from modal button)
function submitFreeBook() {
    document.getElementById('freeBookForm').dispatchEvent(new Event('submit'));
}

// Initialize mortgage calculator
function initializeCalculator() {
    // Set up event listeners for calculator inputs
    const inputs = ['purchasePrice', 'downPayment', 'interestRate', 'loanTerm', 'propertyTax', 'insurance', 'hoaFees'];
    inputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', calculateMortgage);
    });
    
    // Calculate initial values
    calculateMortgage();
}

// Calculate mortgage payments
function calculateMortgage() {
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    const propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
    const insurance = parseFloat(document.getElementById('insurance').value) || 0;
    const hoaFees = parseFloat(document.getElementById('hoaFees').value) || 0;
    
    const loanAmount = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate principal and interest
    let monthlyPI = 0;
    if (monthlyRate > 0) {
        monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                   (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
        monthlyPI = loanAmount / totalPayments;
    }
    
    // Calculate other monthly costs
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyHOA = hoaFees / 12;
    
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;
    
    // Update display
    document.getElementById('principalInterest').textContent = formatCurrency(monthlyPI);
    document.getElementById('monthlyTax').textContent = formatCurrency(monthlyTax);
    document.getElementById('monthlyInsurance').textContent = formatCurrency(monthlyInsurance);
    document.getElementById('monthlyHOA').textContent = formatCurrency(monthlyHOA);
    document.getElementById('totalPayment').textContent = formatCurrency(totalMonthly);
}

// Calculate mortgage (called from button)
function calculateMortgage() {
    initializeCalculator();
}

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Add smooth scrolling to anchor links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add scroll animations
function addAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Handle form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
        
        // Email validation
        if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            field.classList.add('is-invalid');
            isValid = false;
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });
    
    return isValid;
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', function() {
    // Add validation to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this.id)) {
                e.preventDefault();
                showMessage('Please fill in all required fields correctly.', 'error');
            }
        });
    });
});

// Google Maps integration placeholder
// In a real implementation, this would initialize Google Maps with actual listings
function initializeGoogleMaps() {
    // This would be implemented with actual Google Maps API
    console.log('Google Maps would be initialized here with listing markers');
}

// Social media feed integration placeholder
// In a real implementation, this would pull from actual social media APIs
function initializeSocialFeed() {
    // This would be implemented with actual social media APIs
    console.log('Social media feed would be initialized here');
}

// Authentication Functions
function initializeAuth() {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!username || !password) {
        showMessage('Please enter both username and password.', 'error');
        return;
    }
    
    if (validCredentials[username] && validCredentials[username] === password) {
        currentUser = {
            username: username,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        // Save to localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        // Close modal and update UI
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        updateUIForAuth();
        showMessage(`Welcome back, ${username}!`, 'success');
        
        // Clear form
        document.getElementById('loginForm').reset();
    } else {
        showMessage('Invalid username or password.', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    updateUIForAuth();
    showMessage('You have been logged out.', 'info');
}

function updateUIForAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const addListingSection = document.getElementById('addListingSection');
    const loginRequiredSection = document.getElementById('loginRequiredSection');
    
    if (currentUser) {
        // User is logged in
        loginBtn.innerHTML = `
            <i class="bi bi-person-check-fill"></i>
            <span>${currentUser.username}</span>
        `;
        loginBtn.setAttribute('onclick', 'handleLogout()');
        loginBtn.setAttribute('data-bs-toggle', '');
        loginBtn.setAttribute('data-bs-target', '');
        
        // Show add listing section
        addListingSection.classList.remove('d-none');
        loginRequiredSection.classList.add('d-none');
    } else {
        // User is not logged in
        loginBtn.innerHTML = `
            <i class="bi bi-person-circle"></i>
            <span>Login</span>
        `;
        loginBtn.setAttribute('onclick', '');
        loginBtn.setAttribute('data-bs-toggle', 'modal');
        loginBtn.setAttribute('data-bs-target', '#loginModal');
        
        // Hide add listing section
        addListingSection.classList.add('d-none');
        loginRequiredSection.classList.remove('d-none');
    }
}

function isAuthenticated() {
    return currentUser !== null;
}

// Protected function - only allow adding listings if authenticated
function addListing() {
    if (!isAuthenticated()) {
        showMessage('Please log in to add new listings.', 'error');
        return;
    }
    
    const address = document.getElementById('listingAddress').value;
    const price = document.getElementById('listingPrice').value;
    const type = document.getElementById('listingType').value;
    const status = document.getElementById('listingStatus').value;
    
    if (!address || !price || !type || !status) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // In a real implementation, this would send data to a server
    const newListing = {
        id: sampleListings.length + 1,
        address: address,
        price: parseInt(price),
        type: type,
        status: status,
        mlsId: 'NEW' + Date.now(),
        addedBy: currentUser.username,
        addedAt: new Date().toISOString()
    };
    
    sampleListings.push(newListing);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addListingModal'));
    modal.hide();
    document.getElementById('addListingForm').reset();
    
    // Show success message
    showMessage(`Listing added successfully by ${currentUser.username}!`, 'success');
}

// Export functions for global access
window.filterListings = filterListings;
window.resetFilters = resetFilters;
window.addListing = addListing;
window.calculateMortgage = calculateMortgage;
window.submitFreeBook = submitFreeBook;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
