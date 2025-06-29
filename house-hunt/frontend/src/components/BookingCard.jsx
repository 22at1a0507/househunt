import React from 'react';

const BookingCard = ({ booking, property }) => {
  if (!property) return null;

  return (
    <tr>
      <td>{property.title}</td>
      <td className={`status-${booking.status}`}>
        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </td>
    </tr>
  );
};

export default BookingCard;
