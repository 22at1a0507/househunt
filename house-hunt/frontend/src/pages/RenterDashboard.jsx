import { useState } from 'react';
import BookingCard from '../components/BookingCard';
import BookingModal from '../components/BookingModal';
import PropertyCardRenter from '../components/PropertyCardRenter';

export default function RenterDashboard({
  currentUser,
  properties,
  bookings,
  users,
  onAddBooking, // ✅ ensure this is passed from Homepage
}) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Open booking modal with property + owner info
  const handleOpenModal = (property) => {
    const owner = users.find((u) => u.id === property.ownerId);
    setSelectedProperty(property);
    setSelectedOwner(owner);
    setShowModal(true);
  };

  // ✅ Close booking modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setSelectedOwner(null);
  };

  // ✅ When renter submits booking request
  const handleBookingSubmit = (formData) => {
    const newBooking = {
      id: crypto.randomUUID(),
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      renterId: currentUser.id,
      renterName: currentUser.name,
      ownerId: selectedOwner.id,
      ownerName: selectedOwner.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'pending', // default status
    };
    onAddBooking(newBooking); // pass booking to parent
    handleCloseModal(); // close modal after submit
  };

  // ✅ Filter only available properties
  const availableProperties = properties.filter((p) => p.status === 'available');

  // ✅ Filter only current user's bookings
  const userBookings = bookings.filter((b) => b.renterId === currentUser.id);

  return (
    <div className="renter-dashboard">
      {/* ---------- Available Properties Section ---------- */}
      <section>
        <h2 className="section-title">Available Properties</h2>
        <div className="properties-list">
          {availableProperties.length === 0 ? (
            <p>No properties available at the moment.</p>
          ) : (
            availableProperties.map((prop) => (
              <PropertyCardRenter
                key={prop.id}
                property={prop}
                onInfoClick={() => handleOpenModal(prop)}
              />
            ))
          )}
        </div>
      </section>

      {/* ---------- Bookings Section ---------- */}
      <section>
        <h2 className="section-title">Your Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userBookings.length === 0 ? (
              <tr>
                <td colSpan="3">No bookings found.</td>
              </tr>
            ) : (
              userBookings.map((b) => {
                const property = properties.find((p) => p.id === b.propertyId);
                return (
                  <BookingCard key={b.id} booking={b} property={property} />
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* ---------- Booking Modal ---------- */}
      {showModal && selectedProperty && selectedOwner && (
        <BookingModal
          property={selectedProperty}
          owner={selectedOwner}
          currentUser={currentUser}
          onClose={handleCloseModal}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
}
