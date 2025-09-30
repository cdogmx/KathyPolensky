'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Slider from 'react-slider';

// Types
interface Listing {
  id: string;
  mlsNumber: string;
  address: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold';
  description?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

interface MapFilters {
  status: string;
  priceRange: [number, number];
  searchTerm: string;
}

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  selectedListing: Listing | null;
}

// Map configuration
const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 43.1945, // Watertown, WI coordinates
  lng: -88.7289
};

const defaultZoom = 12;

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return '#28a745';
    case 'Pending': return '#ffc107';
    case 'Sold': return '#6c757d';
    default: return '#007bff';
  }
};

// Price formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const MapWithFilters: React.FC = () => {
  // State
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    center: defaultCenter,
    zoom: defaultZoom,
    selectedListing: null
  });
  const [filters, setFilters] = useState<MapFilters>({
    status: '',
    priceRange: [0, 1000000],
    searchTerm: ''
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Refs
  const mapRef = useRef<GoogleMap>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Initialize geocoder
  useEffect(() => {
    if (isMapLoaded && window.google) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isMapLoaded]);

  // Fetch listings from API
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/listings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setListings(data);
      
      // Set initial price range based on data
      if (data.length > 0) {
        const prices = data.map((listing: Listing) => listing.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setFilters(prev => ({
          ...prev,
          priceRange: [minPrice, maxPrice]
        }));
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Geocode address if coordinates not available
  const geocodeAddress = useCallback(async (listing: Listing): Promise<{ lat: number; lng: number } | null> => {
    if (listing.latitude && listing.longitude) {
      return { lat: listing.latitude, lng: listing.longitude };
    }

    if (!geocoderRef.current) {
      console.warn('Geocoder not initialized');
      return null;
    }

    try {
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoderRef.current!.geocode(
          { address: listing.address },
          (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });

      if (results.length > 0) {
        const location = results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng()
        };
      }
    } catch (err) {
      console.error(`Geocoding failed for ${listing.address}:`, err);
    }

    return null;
  }, []);

  // Process listings with geocoding
  const processListings = useCallback(async (listingsToProcess: Listing[]) => {
    const processedListings: Listing[] = [];

    for (const listing of listingsToProcess) {
      const coordinates = await geocodeAddress(listing);
      if (coordinates) {
        processedListings.push({
          ...listing,
          latitude: coordinates.lat,
          longitude: coordinates.lng
        });
      }
    }

    return processedListings;
  }, [geocodeAddress]);

  // Apply filters
  const applyFilters = useCallback((listingsToFilter: Listing[]) => {
    return listingsToFilter.filter(listing => {
      // Status filter
      if (filters.status && listing.status !== filters.status) {
        return false;
      }

      // Price range filter
      if (listing.price < filters.priceRange[0] || listing.price > filters.priceRange[1]) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          listing.address.toLowerCase().includes(searchLower) ||
          listing.mlsNumber.toLowerCase().includes(searchLower) ||
          (listing.description && listing.description.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [filters]);

  // Update filtered listings when filters change
  useEffect(() => {
    const filtered = applyFilters(listings);
    setFilteredListings(filtered);
  }, [listings, applyFilters]);

  // Load listings on component mount
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Process listings with geocoding after initial load
  useEffect(() => {
    if (listings.length > 0 && isMapLoaded) {
      processListings(listings).then(processed => {
        setListings(processed);
      });
    }
  }, [listings.length, isMapLoaded, processListings]);

  // Handle filter changes
  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priceRange: priceRange,
      searchTerm: ''
    });
  };

  // Handle marker click
  const handleMarkerClick = (listing: Listing) => {
    setMapState(prev => ({
      ...prev,
      selectedListing: listing
    }));
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setMapState(prev => ({
      ...prev,
      selectedListing: null
    }));
  };

  // Fit map to show all markers
  const fitMapToMarkers = () => {
    if (mapRef.current && filteredListings.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredListings.forEach(listing => {
        if (listing.latitude && listing.longitude) {
          bounds.extend({ lat: listing.latitude, lng: listing.longitude });
        }
      });
      mapRef.current.fitBounds(bounds);
    }
  };

  // Get unique statuses for filter dropdown
  const uniqueStatuses = Array.from(new Set(listings.map(listing => listing.status)));

  return (
    <div className="map-container">
      {/* Filters Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Property Filters
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-md-4">
              <label htmlFor="searchInput" className="form-label">
                <i className="bi bi-search me-1"></i>
                Search
              </label>
              <input
                type="text"
                className="form-control"
                id="searchInput"
                placeholder="Address, MLS number, or description..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="col-md-3">
              <label htmlFor="statusFilter" className="form-label">
                <i className="bi bi-tag me-1"></i>
                Status
              </label>
              <select
                className="form-select"
                id="statusFilter"
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="col-md-4">
              <label className="form-label">
                <i className="bi bi-currency-dollar me-1"></i>
                Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              </label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onChange={handlePriceRangeChange}
                  min={priceRange[0]}
                  max={priceRange[1]}
                  step={1000}
                  className="horizontal-slider"
                  thumbClassName="slider-thumb"
                  trackClassName="slider-track"
                  renderThumb={(props, state) => (
                    <div {...props} className="slider-thumb">
                      <div className="slider-thumb-value">
                        {formatPrice(state.valueNow)}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-md-1 d-flex align-items-end">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearFilters}
                  title="Clear Filters"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={fitMapToMarkers}
                  title="Fit to Markers"
                >
                  <i className="bi bi-geo-alt"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  Showing {filteredListings.length} of {listings.length} properties
                </span>
                {loading && (
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="card">
        <div className="card-body p-0">
          {error ? (
            <div className="alert alert-danger m-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          ) : (
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
              onLoad={() => setIsMapLoaded(true)}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapState.center}
                zoom={mapState.zoom}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
                options={{
                  styles: [
                    {
                      featureType: 'poi',
                      elementType: 'labels',
                      stylers: [{ visibility: 'off' }]
                    }
                  ]
                }}
              >
                {/* Render markers for filtered listings */}
                {filteredListings.map((listing) => {
                  if (!listing.latitude || !listing.longitude) return null;

                  return (
                    <Marker
                      key={listing.id}
                      position={{
                        lat: listing.latitude,
                        lng: listing.longitude
                      }}
                      onClick={() => handleMarkerClick(listing)}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: getStatusColor(listing.status),
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                      }}
                    />
                  );
                })}

                {/* Info Window */}
                {mapState.selectedListing && (
                  <InfoWindow
                    position={{
                      lat: mapState.selectedListing.latitude!,
                      lng: mapState.selectedListing.longitude!
                    }}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <div className="info-window">
                      <h6 className="fw-bold mb-2">
                        {mapState.selectedListing.address}
                      </h6>
                      <div className="mb-2">
                        <span className="badge me-2" style={{ backgroundColor: getStatusColor(mapState.selectedListing.status) }}>
                          {mapState.selectedListing.status}
                        </span>
                        <span className="fw-bold text-primary">
                          {formatPrice(mapState.selectedListing.price)}
                        </span>
                      </div>
                      <div className="small text-muted mb-2">
                        MLS: {mapState.selectedListing.mlsNumber}
                      </div>
                      {mapState.selectedListing.description && (
                        <p className="small mb-0">
                          {mapState.selectedListing.description}
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .horizontal-slider {
          width: 100%;
          height: 20px;
          position: relative;
        }

        .slider-track {
          height: 4px;
          background: #dee2e6;
          border-radius: 2px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
        }

        .slider-thumb {
          width: 20px;
          height: 20px;
          background: #007bff;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-thumb-value {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          white-space: nowrap;
        }

        .info-window {
          min-width: 200px;
          max-width: 300px;
        }

        .map-container {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default MapWithFilters;
