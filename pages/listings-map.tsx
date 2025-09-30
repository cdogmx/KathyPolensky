import React from 'react';
import Head from 'next/head';
import MapWithFilters from '../components/MapWithFilters';

const ListingsMapPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Property Listings Map - Kathy Polensky Real Estate</title>
        <meta name="description" content="Interactive map showing all available property listings in Watertown and surrounding areas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            {/* Page Header */}
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold text-primary mb-3">
                <i className="bi bi-geo-alt-fill me-3"></i>
                Property Listings Map
              </h1>
              <p className="lead text-muted">
                Explore available properties in Watertown and surrounding areas
              </p>
            </div>

            {/* Map Component */}
            <MapWithFilters />

            {/* Additional Information */}
            <div className="row mt-5">
              <div className="col-lg-8 mx-auto">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary">
                      <i className="bi bi-info-circle me-2"></i>
                      About This Map
                    </h5>
                    <p className="card-text">
                      This interactive map shows all available property listings from our MLS database. 
                      Use the filters above to narrow down your search by status, price range, or keywords. 
                      Click on any marker to view property details.
                    </p>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#28a745' }}></div>
                          <small className="text-muted">Active Listings</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#ffc107' }}></div>
                          <small className="text-muted">Pending Sales</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#6c757d' }}></div>
                          <small className="text-muted">Sold Properties</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsMapPage;
