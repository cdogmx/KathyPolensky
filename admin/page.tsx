'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

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

interface BulkListingData {
  mlsNumber: string;
  address: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold';
  description?: string;
}

interface BulkUploadResult {
  success: boolean;
  message: string;
  data?: {
    total: number;
    created: number;
    updated: number;
    errors: Array<{
      row: number;
      mlsNumber: string;
      error: string;
    }>;
  };
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [activeTab, setActiveTab] = useState('single');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<BulkListingData[]>([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // CSV Processing Functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCsvFile(file);
    } else {
      setSubmitMessage('Please select a valid CSV file.');
    }
  };

  const parseCsvFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names to match our interface
        const normalized = header.toLowerCase().trim();
        const mapping: { [key: string]: string } = {
          'mls number': 'mlsNumber',
          'mls_number': 'mlsNumber',
          'mls': 'mlsNumber',
          'address': 'address',
          'price': 'price',
          'status': 'status',
          'description': 'description'
        };
        return mapping[normalized] || normalized;
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          setSubmitMessage(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`);
          return;
        }

        const validData: BulkListingData[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          try {
            // Validate and transform data
            const listing: BulkListingData = {
              mlsNumber: String(row.mlsNumber || row.mls_number || row.mls || '').trim(),
              address: String(row.address || '').trim(),
              price: parseInt(String(row.price || '0').replace(/[^0-9]/g, '')),
              status: String(row.status || 'Active').trim() as 'Active' | 'Pending' | 'Sold',
              description: String(row.description || '').trim() || undefined
            };

            // Validate required fields
            if (!listing.mlsNumber) {
              errors.push(`Row ${index + 2}: MLS Number is required`);
              return;
            }
            if (!listing.address) {
              errors.push(`Row ${index + 2}: Address is required`);
              return;
            }
            if (!listing.price || listing.price <= 0) {
              errors.push(`Row ${index + 2}: Valid price is required`);
              return;
            }
            if (!['Active', 'Pending', 'Sold'].includes(listing.status)) {
              errors.push(`Row ${index + 2}: Status must be Active, Pending, or Sold`);
              return;
            }

            validData.push(listing);
          } catch (error) {
            errors.push(`Row ${index + 2}: Invalid data format`);
          }
        });

        if (errors.length > 0) {
          setSubmitMessage(`Validation errors found:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? `\n... and ${errors.length - 10} more errors` : ''}`);
        } else {
          setSubmitMessage(`CSV parsed successfully! Found ${validData.length} valid listings.`);
        }

        setCsvPreview(validData.slice(0, 10)); // Show first 10 rows as preview
      },
      error: (error) => {
        setSubmitMessage(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleBulkUpload = async () => {
    if (!csvFile || csvPreview.length === 0) {
      setSubmitMessage('Please select and parse a CSV file first.');
      return;
    }

    setIsProcessingCsv(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/listings/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'kathy-admin-2024'}`
        },
        body: JSON.stringify({ listings: csvPreview }),
      });

      const result: BulkUploadResult = await response.json();

      if (result.success) {
        setSubmitMessage(`Bulk upload completed! ${result.data?.created || 0} created, ${result.data?.updated || 0} updated. ${result.data?.errors?.length || 0} errors.`);
        setCsvFile(null);
        setCsvPreview([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setSubmitMessage(`Bulk upload failed: ${result.message}`);
      }
    } catch (error) {
      setSubmitMessage('Failed to upload listings. Please try again.');
    } finally {
      setIsProcessingCsv(false);
    }
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
                  MLS Listing Management
                </h1>
                <p className="text-muted text-center mb-0">
                  Add listings manually or import from PrimeAgent CSV exports
                </p>
              </div>

              <div className="card-body p-0">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-fill" id="listingTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'single' ? 'active' : ''}`}
                      onClick={() => setActiveTab('single')}
                      type="button"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Single Entry
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'bulk' ? 'active' : ''}`}
                      onClick={() => setActiveTab('bulk')}
                      type="button"
                    >
                      <i className="bi bi-upload me-2"></i>
                      Bulk Upload
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content p-5">
                  {/* Single Entry Tab */}
                  <div className={`tab-pane fade ${activeTab === 'single' ? 'show active' : ''}`}>
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
                  </div>

                  {/* Bulk Upload Tab */}
                  <div className={`tab-pane fade ${activeTab === 'bulk' ? 'show active' : ''}`}>
                    <div className="mb-4">
                      <h4 className="h5 text-primary mb-3">
                        <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                        CSV File Upload
                      </h4>
                      <p className="text-muted">
                        Upload a CSV file exported from PrimeAgent or other MLS systems. 
                        Required columns: MLS Number, Address, Price, Status, Description (optional).
                      </p>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                      <label htmlFor="csvFile" className="form-label fw-semibold">
                        Select CSV File
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="csvFile"
                        accept=".csv"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                      />
                      <div className="form-text">
                        Supported formats: CSV files with headers. Max file size: 10MB
                      </div>
                    </div>

                    {/* CSV Preview */}
                    {csvPreview.length > 0 && (
                      <div className="mb-4">
                        <h5 className="h6 text-primary mb-3">
                          <i className="bi bi-eye me-2"></i>
                          Preview ({csvPreview.length} rows)
                        </h5>
                        <div className="table-responsive">
                          <table className="table table-sm table-striped">
                            <thead className="table-light">
                              <tr>
                                <th>MLS Number</th>
                                <th>Address</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {csvPreview.map((listing, index) => (
                                <tr key={index}>
                                  <td>{listing.mlsNumber}</td>
                                  <td className="text-truncate" style={{ maxWidth: '200px' }} title={listing.address}>
                                    {listing.address}
                                  </td>
                                  <td>${listing.price.toLocaleString()}</td>
                                  <td>
                                    <span className={`badge ${
                                      listing.status === 'Active' ? 'bg-success' :
                                      listing.status === 'Pending' ? 'bg-warning' : 'bg-secondary'
                                    }`}>
                                      {listing.status}
                                    </span>
                                  </td>
                                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={listing.description}>
                                    {listing.description || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Upload Actions */}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-md-2"
                        onClick={() => {
                          setCsvFile(null);
                          setCsvPreview([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                          setSubmitMessage('');
                        }}
                        disabled={isProcessingCsv}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Clear
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={handleBulkUpload}
                        disabled={!csvFile || csvPreview.length === 0 || isProcessingCsv}
                      >
                        {isProcessingCsv ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-upload me-2"></i>
                            Upload {csvPreview.length} Listings
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                {submitMessage && (
                  <div className={`alert mt-4 mx-5 ${submitMessage.includes('successfully') || submitMessage.includes('completed') ? 'alert-success' : 'alert-danger'}`}>
                    <i className={`bi ${submitMessage.includes('successfully') || submitMessage.includes('completed') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{submitMessage}</pre>
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
