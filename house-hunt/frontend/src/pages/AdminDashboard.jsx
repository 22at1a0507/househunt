import React, { useState } from 'react';
import '../styles/main.css';

export default function AdminDashboard({
  users = [],
  properties = [],
  bookings = [],
  onApproveUser,
  onRejectUser,
  onApproveProperty,
  onRejectProperty,
}) {
  const [activeTab, setActiveTab] = useState('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [listingTypeFilter, setListingTypeFilter] = useState('All');

  const pendingOwners = users?.filter(user => user.role === 'owner' && !user.approved) || [];
  const pendingProperties = properties?.filter(p => p.status === 'pending') || [];

  const currentUserId = localStorage.getItem('currentUser');
  const currentUser = users?.find(user => user.id === currentUserId) || {};
  const adminName = currentUser?.name ? `${currentUser.name}` : 'Admin';

  const filteredProperties = properties?.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPropertyType = propertyTypeFilter === 'All' || property.type === propertyTypeFilter;
    const matchesListingType = listingTypeFilter === 'All' || property.listingType === listingTypeFilter;
    return matchesSearch && matchesPropertyType && matchesListingType;
  }) || [];

  const filteredBookings = bookings?.map(booking => {
    const property = properties?.find(p => p.id === booking.propertyId) || {};
    const user = users?.find(u => u.id === booking.userId) || {};
    return {
      ...booking,
      propertyTitle: property.title || 'Deleted Property',
      userName: user.name || 'Deleted User',
      propertyImage: property.image || ''
    };
  }) || [];

  return (
    <div className="admin-dashboard">
      {/* <header className="admin-header">
        <div className="header-left">
          <h1 className="app-title">HOUSEHUNT</h1>
        </div>
        <div className="user-info">
          <span className="welcome-message">Hi {adminName}</span>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('currentUser');
              window.location.reload();
            }}
          >
            Log Out
          </button>
        </div>
      </header> */}

      {/* Nav Buttons BELOW the header */}
      <nav className="admin-nav">
        <button
          className={`nav-button ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          ALL PROPERTIES
        </button>
        <button
          className={`nav-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          BOOKING HISTORY
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {/* Filters */}
        {activeTab === 'properties' && (
          <section className="filter-section">
            <div className="filter-group">
              <label htmlFor="search">Filter By:</label>
              <input
                id="search"
                type="text"
                placeholder="Address or property name"
                className="filter-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="property-type">Property Type:</label>
              <select
                id="property-type"
                className="filter-select"
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="listing-type">Listing Type:</label>
              <select
                id="listing-type"
                className="filter-select"
                value={listingTypeFilter}
                onChange={(e) => setListingTypeFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="For Rent">For Rent</option>
                <option value="For Sale">For Sale</option>
              </select>
            </div>
          </section>
        )}

        {/* Approvals */}
        <section className="approval-sections">
          {/* Owner Approvals */}
          <div className="approval-section">
            <h2 className="section-title">Pending Owner Approvals</h2>
            {pendingOwners.length === 0 ? (
              <p className="no-data-message">No pending owner accounts.</p>
            ) : (
              <div className="approval-list">
                {pendingOwners.map(owner => (
                  <div key={owner.id} className="approval-item">
                    <div className="approval-info">
                      <h4>{owner.name}</h4>
                      <p>{owner.email}</p>
                      <small>Registered: {new Date(owner.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="approval-actions">
                      <button className="btn-approve" onClick={() => onApproveUser(owner.id)}>Approve</button>
                      <button className="btn-reject" onClick={() => onRejectUser(owner.id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Approvals */}
          <div className="approval-section">
            <h2 className="section-title">Pending Property Approvals</h2>
            {pendingProperties.length === 0 ? (
              <p className="no-data-message">No properties pending approval.</p>
            ) : (
              <div className="approval-list">
                {pendingProperties.map(property => (
                  <div key={property.id} className="approval-item">
                    <div className="approval-info">
                      <h4>{property.title}</h4>
                      <p>{property.location}</p>
                      <p>${property.price} {property.listingType === 'For Rent' ? '/month' : ''}</p>
                    </div>
                    <div className="approval-actions">
                      <button className="btn-approve" onClick={() => onApproveProperty(property.id)}>Approve</button>
                      <button className="btn-reject" onClick={() => onRejectProperty(property.id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Properties Section */}
        {activeTab === 'properties' && (
          <section className="properties-section">
            <h2 className="section-title">All Properties</h2>
            {filteredProperties.length === 0 ? (
              <p className="no-data-message">No properties match your filters.</p>
            ) : (
              <div className="properties-grid">
                {filteredProperties.map(property => (
                  <div key={property.id} className="property-card">
                    {property.image && (
                      <div className="property-image-container">
                        <img src={property.image} alt={property.title} className="property-image" />
                      </div>
                    )}
                    <div className="property-details">
                      <h3>{property.title}</h3>
                      <p className="property-location">{property.location}</p>
                      <p className="property-price">
                        ${property.price}{property.listingType === 'For Rent' ? '/month' : ''}
                      </p>
                      <div className="property-meta">
                        <span className="property-type">{property.type}</span>
                        <span className="property-listing-type">{property.listingType}</span>
                        <span className={`property-status ${property.status}`}>{property.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Bookings Section */}
        {activeTab === 'bookings' && (
          <section className="bookings-section">
            <h2 className="section-title">Booking History</h2>
            {filteredBookings.length === 0 ? (
              <p className="no-data-message">No booking history available.</p>
            ) : (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>User</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="booking-property">
                          {booking.propertyImage && (
                            <img src={booking.propertyImage} alt={booking.propertyTitle} className="booking-property-image" />
                          )}
                          {booking.propertyTitle}
                        </td>
                        <td>{booking.userName}</td>
                        <td>
                          {new Date(booking.startDate).toLocaleDateString()} - {' '}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                        </td>
                        <td>${booking.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
