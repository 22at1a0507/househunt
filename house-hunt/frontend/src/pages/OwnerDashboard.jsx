import { useState } from 'react';

export default function OwnerDashboard({
  currentUser,
  properties,
  bookings,
  onPropertyUpdate,
  onPropertyDelete,
  onPropertyAdd,
  onBookingAction,
  onLogout,
}) {
  const [editProperty, setEditProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    image: '',
  });

  const ownerProperties = properties.filter(p => p.ownerId === currentUser.id);
  const ownerBookings = bookings.filter(b => {
    const prop = properties.find(p => p.id === b.propertyId);
    return prop && prop.ownerId === currentUser.id;
  });

  const handleInputChange = (e, field, isNew = false) => {
    const value = e.target.value;
    if (isNew) {
      setNewProperty(prev => ({ ...prev, [field]: value }));
    } else {
      setEditProperty(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEditClick = (property) => {
    setEditProperty({ ...property });
  };

  const handleSaveClick = () => {
    if (!editProperty.title || !editProperty.location || !editProperty.price) {
      alert('Title, Location, and Price are required.');
      return;
    }

    const updated = {
      ...editProperty,
      price: parseFloat(editProperty.price),
    };
    onPropertyUpdate(updated);
    setEditProperty(null);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      onPropertyDelete(id);
    }
  };

  const handleAddProperty = () => {
    const { title, location, price } = newProperty;
    if (!title || !location || !price) {
      alert('Please fill in all required fields: Title, Location, and Price');
      return;
    }

    const newId = Date.now().toString();
    const property = {
      ...newProperty,
      id: newId,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      price: parseFloat(newProperty.price),
      status: 'available',
      createdAt: new Date().toISOString()
    };

    onPropertyAdd(property);
    setNewProperty({
      title: '',
      location: '',
      price: '',
      description: '',
      image: '',
    });
  };

  return (
    <div className="owner-dashboard">
      {/* Header with Logout */}
      <div
        className="dashboard-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1>Welcome, {currentUser.name}</h1>
      </div>

      {/* Add New Property Section */}
      <section>
        <h2 className="section-title">Add New Property</h2>
        <div className="owner-property-card">
          <input
            type="text"
            value={newProperty.title}
            onChange={(e) => handleInputChange(e, 'title', true)}
            placeholder="Title *"
            required
          />
          <input
            type="text"
            value={newProperty.location}
            onChange={(e) => handleInputChange(e, 'location', true)}
            placeholder="Location *"
            required
          />
          <input
            type="number"
            value={newProperty.price}
            onChange={(e) => handleInputChange(e, 'price', true)}
            placeholder="Price *"
            min="0"
            required
          />
          <textarea
            value={newProperty.description}
            onChange={(e) => handleInputChange(e, 'description', true)}
            placeholder="Description"
          />
          <input
            type="text"
            value={newProperty.image}
            onChange={(e) => handleInputChange(e, 'image', true)}
            placeholder="Image URL"
          />
          <button onClick={handleAddProperty}>Add Property</button>
        </div>
      </section>

      {/* List Existing Properties */}
      <section>
        <h2 className="section-title">Your Properties</h2>
        <div className="owner-properties">
          {ownerProperties.length === 0 ? (
            <p>You haven't added any properties yet.</p>
          ) : (
            ownerProperties.map((property) => (
              <div key={property.id} className="owner-property-card">
                {editProperty && editProperty.id === property.id ? (
                  <>
                    <input
                      type="text"
                      value={editProperty.title}
                      onChange={(e) => handleInputChange(e, 'title')}
                      placeholder="Title *"
                      required
                    />
                    <input
                      type="text"
                      value={editProperty.location}
                      onChange={(e) => handleInputChange(e, 'location')}
                      placeholder="Location *"
                      required
                    />
                    <input
                      type="number"
                      value={editProperty.price}
                      onChange={(e) => handleInputChange(e, 'price')}
                      placeholder="Price *"
                      min="0"
                      required
                    />
                    <textarea
                      value={editProperty.description}
                      onChange={(e) => handleInputChange(e, 'description')}
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editProperty.image}
                      onChange={(e) => handleInputChange(e, 'image')}
                      placeholder="Image URL"
                    />
                    <div className="owner-property-actions">
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={() => setEditProperty(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{property.title}</h3>
                    <p><strong>Status:</strong> {property.status}</p>
                    <p>{property.location}</p>
                    <p>${property.price} / month</p>
                    <p>{property.description}</p>
                    {property.image && (
                      <img
                        src={property.image}
                        alt={property.title}
                        style={{ width: '100%', borderRadius: '12px' }}
                      />
                    )}
                    <div className="owner-property-actions">
                      <button onClick={() => handleEditClick(property)}>Edit</button>
                      <button onClick={() => handleDeleteClick(property.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Bookings Section */}
      <section>
        <h2 className="section-title">Bookings for Your Properties</h2>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Renter</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ownerBookings.length === 0 ? (
              <tr><td colSpan="5">No bookings found.</td></tr>
            ) : (
              ownerBookings.map(b => {
                const property = properties.find(p => p.id === b.propertyId);
                return (
                  <tr key={b.id}>
                    <td>{property ? property.title : 'Unknown'}</td>
                    <td>{b.renterName}</td>
                    <td>{b.startDate} to {b.endDate}</td>
                    <td className={`status-${b.status}`}>{b.status}</td>
                    <td>
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => onBookingAction(b.id, 'approved')}>Approve</button>
                          <button onClick={() => onBookingAction(b.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
