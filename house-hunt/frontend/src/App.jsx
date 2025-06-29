import React, { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import RenterDashboard from './pages/RenterDashboard';
import OwnerDashboard from './pages/OwnerDashboard'; // ✅ Make sure this matches the filename exactly
import AdminDashboard from './pages/AdminDashboard';
import './styles/main.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedProps = JSON.parse(localStorage.getItem("properties")) || [];
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    setCurrentUser(storedUser);
    setProperties(storedProps);
    setBookings(storedBookings);
    setUsers(storedUsers);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("properties", JSON.stringify(properties));
    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("users", JSON.stringify(users));
  }, [properties, bookings, users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Handlers
  const handlePropertyAdd = (newProperty) => {
    setProperties(prev => [...prev, newProperty]);
  };

  const handlePropertyUpdate = (updatedProperty) => {
    setProperties(prev =>
      prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    );
  };

  const handlePropertyDelete = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleBookingAdd = (newBooking) => {
    setBookings(prev => [...prev, newBooking]);
  };

  const handleBookingAction = (bookingId, newStatus) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <HomePage
        setCurrentUser={setCurrentUser}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  if (currentUser.role === 'renter') {
    return (
      <RenterDashboard
        currentUser={currentUser}
        properties={properties.filter(p => p.status === 'available')}
        bookings={bookings.filter(b => b.renterId === currentUser.id)}
        onBookingAdd={handleBookingAdd}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser.role === 'owner') {
    return (
      <OwnerDashboard
        currentUser={currentUser}
        properties={properties}
        bookings={bookings}
        onPropertyAdd={handlePropertyAdd} // ✅ This is correct
        onPropertyUpdate={handlePropertyUpdate}
        onPropertyDelete={handlePropertyDelete}
        onBookingAction={handleBookingAction}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        properties={properties}
        bookings={bookings}
        users={users}
        setUsers={setUsers}
        setProperties={setProperties}
        onLogout={handleLogout}
      />
    );
  }

  return <div>Invalid user role.</div>;
}

export default App;
