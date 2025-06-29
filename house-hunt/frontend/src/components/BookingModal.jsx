import React, { useState } from 'react';

const BookingModal = ({ property, owner, currentUser, onClose, onSubmit }) => {
  const [renterName, setRenterName] = useState('');
  const [renterContact, setRenterContact] = useState('');
  const [renterMessage, setRenterMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      propertyId: property.id,
      renterId: currentUser.id,
      ownerId: owner?.id,
      renterName,
      renterContact,
      renterMessage
    });
    onClose();
  };

  if (!property) return null;

  return (
    <div className="modal-backdrop show" role="dialog" aria-modal="true" aria-labelledby="modalTitle" tabIndex="-1">
      <div className="modal" role="document">
        <header className="modal-header">
          <div id="modalTitle">{property.title}</div>
          <button aria-label="Close modal" onClick={onClose}>&times;</button>
        </header>

        <div className="modal-content">
          <div className="modal-section">
            <h3>Property Details</h3>
            <p><strong>Location:</strong> {property.location}</p>
            <p>{property.description}</p>
            <p><strong>Monthly Rent:</strong> ${property.price}</p>
            <p><strong>Status:</strong> {property.status}</p>
          </div>

          <div className="modal-section">
            <h3>Owner Information</h3>
            <p><strong>Name:</strong> {owner?.name || 'Not Available'}</p>
            <p><strong>Email:</strong> {owner?.email || 'Not Available'}</p>
          </div>

          <div className="modal-section">
            <h3>Your Details for Booking</h3>
            <form onSubmit={handleSubmit} className="booking-form">
              <label htmlFor="renterName">Name</label>
              <input
                type="text"
                id="renterName"
                name="renterName"
                required
                placeholder="Your full name"
                value={renterName}
                onChange={(e) => setRenterName(e.target.value)}
              />

              <label htmlFor="renterContact">Contact Number</label>
              <input
                type="text"
                id="renterContact"
                name="renterContact"
                required
                placeholder="Phone or alternate contact"
                value={renterContact}
                onChange={(e) => setRenterContact(e.target.value)}
              />

              <label htmlFor="renterMessage">Message (optional)</label>
              <textarea
                id="renterMessage"
                name="renterMessage"
                placeholder="Additional message"
                value={renterMessage}
                onChange={(e) => setRenterMessage(e.target.value)}
              />

              <button type="submit">Send Booking Request</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
