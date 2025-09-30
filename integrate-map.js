/**
 * Integration script to add Google Maps to the main HTML site
 * This creates a simple iframe integration for the static site
 */

// Function to create map integration
function createMapIntegration() {
  // Find the MLS listings section
  const mlsSection = document.getElementById('mlsListings');
  if (!mlsSection) {
    console.error('MLS listings section not found');
    return;
  }

  // Create map container
  const mapContainer = document.createElement('div');
  mapContainer.id = 'mapContainer';
  mapContainer.className = 'map-integration-container';
  mapContainer.innerHTML = `
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-geo-alt-fill me-2"></i>
          Interactive Property Map
        </h5>
      </div>
      <div class="card-body p-0">
        <div class="map-placeholder">
          <div class="text-center py-5">
            <i class="bi bi-map display-1 text-muted mb-3"></i>
            <h4 class="text-muted">Interactive Property Map</h4>
            <p class="text-muted mb-4">
              View all available properties on an interactive map with advanced filtering options.
            </p>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="rounded-circle me-2" style="width: 12px; height: 12px; background-color: #28a745;"></div>
                  <small class="text-muted">Active Listings</small>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="rounded-circle me-2" style="width: 12px; height: 12px; background-color: #ffc107;"></div>
                  <small class="text-muted">Pending Sales</small>
                </div>
              </div>
            </div>
            <a href="/listings-map" class="btn btn-primary btn-lg">
              <i class="bi bi-arrow-right me-2"></i>
              View Interactive Map
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert map container after the existing MLS content
  mlsSection.appendChild(mapContainer);

  // Add CSS for the map integration
  const style = document.createElement('style');
  style.textContent = `
    .map-integration-container {
      margin-top: 2rem;
    }
    
    .map-placeholder {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 0.375rem;
    }
    
    .map-placeholder .display-1 {
      opacity: 0.3;
    }
    
    .map-integration-container .card {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .map-integration-container .card-header {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Map integration added successfully');
}

// Function to add map link to navigation
function addMapNavigation() {
  // Find the main navigation or create a new one
  const nav = document.querySelector('nav') || document.querySelector('.navbar');
  if (!nav) {
    console.log('No navigation found, skipping navigation integration');
    return;
  }

  // Look for existing nav items
  const navItems = nav.querySelector('.navbar-nav') || nav.querySelector('.nav');
  if (navItems) {
    const mapLink = document.createElement('li');
    mapLink.className = 'nav-item';
    mapLink.innerHTML = `
      <a class="nav-link" href="/listings-map">
        <i class="bi bi-geo-alt me-1"></i>
        Property Map
      </a>
    `;
    navItems.appendChild(mapLink);
    console.log('✅ Map navigation link added');
  }
}

// Function to add map CTA to hero section
function addMapCTA() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) {
    console.log('Hero section not found, skipping CTA integration');
    return;
  }

  // Find existing CTA buttons or create a new section
  const ctaContainer = heroSection.querySelector('.hero-cta') || heroSection.querySelector('.container');
  if (ctaContainer) {
    const mapCTA = document.createElement('div');
    mapCTA.className = 'text-center mt-4';
    mapCTA.innerHTML = `
      <a href="/listings-map" class="btn btn-outline-light btn-lg me-3">
        <i class="bi bi-geo-alt me-2"></i>
        View Property Map
      </a>
    `;
    ctaContainer.appendChild(mapCTA);
    console.log('✅ Map CTA added to hero section');
  }
}

// Initialize map integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🗺️ Initializing map integration...');
  
  try {
    createMapIntegration();
    addMapNavigation();
    addMapCTA();
    console.log('🎉 Map integration completed successfully!');
  } catch (error) {
    console.error('❌ Error during map integration:', error);
  }
});

// Export functions for manual use
window.MapIntegration = {
  createMapIntegration,
  addMapNavigation,
  addMapCTA
};
