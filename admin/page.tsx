'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface ListingFormData {
  mlsNumber: string;
  address: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold';
  description?: string;
}

interface AuthData {
  password: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const router = useRouter();

  const {
    register: registerAuth,
    handleSubmit: handleAuthSubmit,
    formState: { errors: authErrors }
  } = useForm<AuthData>();

  const {
    register: registerListing,
    handleSubmit: handleListingSubmit,
    formState: { errors: listingErrors },
    reset
  } = useForm<ListingFormData>();

  const handleAuthentication = async (data: AuthData) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setSubmitMessage('');
      } else {
        setSubmitMessage('Invalid password. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Authentication failed. Please try again.');
    }
  };

  const handleListingSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage('Listing added successfully!');
        reset();
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Error: ${errorData.message || 'Failed to add listing'}`);
      }
    } catch (error) {
      setSubmitMessage('Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSubmitMessage('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="h3 text-primary mb-3">Admin Access</h2>
                    <p className="text-muted">Enter password to access the admin panel</p>
                  </div>
                  
                  <form onSubmit={handleAuthSubmit(handleAuthentication)}>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${authErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        {...registerAuth('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        placeholder="Enter admin password"
                      />
                      {authErrors.password && (
                        <div className="invalid-feedback">
                          {authErrors.password.message}
                        </div>
                      )}
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-lg">
                        <i className="bi bi-shield-lock me-2"></i>
                        Access Admin Panel
                      </button>
                    </div>
                  </form>

                  {submitMessage && (
                    <div className={`alert mt-3 ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                      {submitMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#17a9c2' }}>
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            <i className="bi bi-house-door me-2"></i>
            Kathy Polensky - Admin
          </a>
          <div className="navbar-nav ms-auto">
            <button 
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 py-4">
                <h1 className="h2 text-center text-primary mb-2">
                  <i className="bi bi-plus-circle me-3"></i>
                  Add MLS Listing
                </h1>
                <p className="text-muted text-center mb-0">
                  Manually add listings from PrimeAgent or other MLS exports
                </p>
              </div>

              <div className="card-body p-5">
                <form onSubmit={handleListingSubmit(handleListingSubmit)}>
                  <div className="row">
                    {/* MLS Number */}
                    <div className="col-md-6 mb-4">
                      <label htmlFor="mlsNumber" className="form-label fw-semibold">
                        MLS Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${listingErrors.mlsNumber ? 'is-invalid' : ''}`}
                        id="mlsNumber"
                        {...registerListing('mlsNumber', { 
                          required: 'MLS Number is required',
                          pattern: {
                            value: /^[A-Za-z0-9-]+$/,
                            message: 'MLS Number can only contain letters, numbers, and hyphens'
                          }
                        })}
                        placeholder="e.g., 1929100"
                      />
                      {listingErrors.mlsNumber && (
                        <div className="invalid-feedback">
                          {listingErrors.mlsNumber.message}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="col-md-6 mb-4">
                      <label htmlFor="price" className="form-label fw-semibold">
                        Price <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className={`form-control ${listingErrors.price ? 'is-invalid' : ''}`}
                          id="price"
                          {...registerListing('price', { 
                            required: 'Price is required',
                            min: {
                              value: 1,
                              message: 'Price must be greater than 0'
                            },
                            max: {
                              value: 999999999,
                              message: 'Price must be less than $1 billion'
                            }
                          })}
                          placeholder="324900"
                          step="1"
                        />
                        {listingErrors.price && (
                          <div className="invalid-feedback">
                            {listingErrors.price.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <label htmlFor="address" className="form-label fw-semibold">
                      Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${listingErrors.address ? 'is-invalid' : ''}`}
                      id="address"
                      {...registerListing('address', { 
                        required: 'Address is required',
                        minLength: {
                          value: 5,
                          message: 'Address must be at least 5 characters'
                        }
                      })}
                      placeholder="e.g., 305 Theresa St, Watertown, WI 53094"
                    />
                    {listingErrors.address && (
                      <div className="invalid-feedback">
                        {listingErrors.address.message}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <label htmlFor="status" className="form-label fw-semibold">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${listingErrors.status ? 'is-invalid' : ''}`}
                      id="status"
                      {...registerListing('status', { 
                        required: 'Status is required'
                      })}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                    </select>
                    {listingErrors.status && (
                      <div className="invalid-feedback">
                        {listingErrors.status.message}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-semibold">
                      Description <span className="text-muted">(Optional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows={4}
                      {...registerListing('description')}
                      placeholder="Enter property description, features, or additional details..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-md-2"
                      onClick={() => reset()}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding Listing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle me-2"></i>
                          Add Listing
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Status Message */}
                {submitMessage && (
                  <div className={`alert mt-4 ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                    <i className={`bi ${submitMessage.includes('successfully') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <i className="bi bi-list-ul text-primary display-6 mb-3"></i>
                    <h5 className="card-title">View All Listings</h5>
                    <p className="card-text text-muted">Manage existing listings</p>
                    <a href="/admin/listings" className="btn btn-outline-primary">
                      <i className="bi bi-eye me-2"></i>
                      View Listings
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <i className="bi bi-upload text-primary display-6 mb-3"></i>
                    <h5 className="card-title">Bulk Import</h5>
                    <p className="card-text text-muted">Import multiple listings</p>
                    <button className="btn btn-outline-primary" disabled>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
