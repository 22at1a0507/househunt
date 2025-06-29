import React, { useState, useEffect } from 'react';
import RenterDashboard from './RenterDashboard';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';

function Homepage() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [showHomeMessage, setShowHomeMessage] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sampleProperties = [
    {
      id: crypto.randomUUID(),
      title: 'Cozy Studio Apartment',
      description: 'A cozy studio apartment in downtown with all amenities included.',
      location: 'Downtown City',
      price: 1200,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/672cbdd2-5128-4c16-b1f1-9a8a47d5f20c.png',
      ownerId: null,
      status: 'available',
    },
    {
      id: crypto.randomUUID(),
      title: 'Spacious 2-Bedroom Condo',
      description: 'Modern 2-bedroom condo with great city views and parking.',
      location: 'City Center',
      price: 2000,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/35866d55-80f0-4314-9772-07794becd72e.png',
      ownerId: null,
      status: 'available',
    },
  ];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedProps = JSON.parse(localStorage.getItem('properties')) || [];
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];

    let initProps = storedProps;
    let initUsers = storedUsers;

    if (storedProps.length === 0) {
      const sampleOwnerId = crypto.randomUUID();
      const sampleOwner = {
        id: sampleOwnerId,
        name: 'Sample Owner',
        email: 'owner@example.com',
        password: 'ownerpass',
        role: 'owner',
        approved: true,
        bookings: [],
      };
      const sampleAdmin = {
        id: crypto.randomUUID(),
        name: 'AdminUser',
        email: 'admin@example.com',
        password: 'adminpass',
        role: 'admin',
        approved: true,
        bookings: [],
      };
      initUsers.push(sampleOwner, sampleAdmin);
      sampleProperties[0].ownerId = sampleOwnerId;
      initProps = sampleProperties;
    }

    setUsers(initUsers);
    setProperties(initProps);
    setBookings(storedBookings);

    const curr = localStorage.getItem('currentUser');
    if (curr) {
      const parsed = JSON.parse(curr);
      const match = initUsers.find((u) => u.id === parsed.id);
      if (match) setCurrentUser(match);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('properties', JSON.stringify(properties));
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [users, properties, bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuth = (e) => {
    e.preventDefault();
    setShowHomeMessage(false);
    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;
    const name = isRegisterMode ? e.target.name?.value : null;
    const role = isRegisterMode ? e.target.role.value : null;

    if (!email || !password || (isRegisterMode && (!role || !name))) {
      setAuthMessage('Please fill out all required fields.');
      return;
    }

    if (isRegisterMode) {
      if (users.find((u) => u.email === email)) {
        setAuthMessage('An account with this email already exists.');
        return;
      }
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role,
        approved: role !== 'owner', // ✅ owner requires approval; others are auto-approved
        bookings: [],
      };
      setUsers([...users, newUser]);
      setIsRegisterMode(false);
      setAuthMessage('Registration successful. Please login.');
      return;
    }

    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      setAuthMessage('Invalid email or password.');
      return;
    }
    if (found.role === 'owner' && !found.approved) {
      setAuthMessage('Your owner account is pending admin approval.');
      return;
    }
    setCurrentUser(found);
    setAuthMessage('');
  };

  const handleLogout = () => setCurrentUser(null);

  const handleApproveUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved: true } : u));
  };

  const handleRejectUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleApproveProperty = (propertyId) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: 'available' } : p));
  };

  const handleRejectProperty = (propertyId) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: 'rejected' } : p));
  };

  const handleUpdateProperty = (updatedProperty) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };

  const handleDeleteProperty = (propertyId) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleAddBooking = (newBooking) => {
    setBookings(prev => [...prev, newBooking]);
  };

  const handleBookingAction = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const AuthForm = () => (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="app-title">HOUSEHUNT</h1>
        <nav className="auth-nav">
          <span onClick={() => {
            setIsRegisterMode(false);
            setShowHomeMessage(true);
            setIsResetMode(false);
          }} style={{ cursor: 'pointer', marginRight: '16px', color: 'black' }}>
            Home
          </span>
          <span onClick={() => {
            setIsRegisterMode(false);
            setShowHomeMessage(false);
            setIsResetMode(false);
          }} style={{ cursor: 'pointer', marginRight: '16px', color: 'black' }}>
            Login
          </span>
          <span onClick={() => {
            setIsRegisterMode(true);
            setShowHomeMessage(false);
            setIsResetMode(false);
          }} style={{ cursor: 'pointer', color: 'black' }}>
            Register
          </span>
        </nav>
      </div>

      {showHomeMessage && (
        <div className="home-message" style={{ margin: '20px auto', textAlign: 'center', fontSize: '18px', maxWidth: '500px' }}>
          👋 <strong>Welcome to HouseHunt!</strong><br />
          A smart platform to find, rent, and manage your dream property.<br />
          Please login or register to get started.
        </div>
      )}

      {isResetMode ? (
        <div className="auth-form-container">
          <h2>Reset Password</h2>
          <form className="auth-form" onSubmit={(e) => {
            e.preventDefault();
            const userIndex = users.findIndex(u => u.email === resetEmail);
            if (userIndex === -1) {
              setAuthMessage('Email not found.');
              return;
            }
            const updatedUsers = [...users];
            updatedUsers[userIndex].password = newPassword;
            setUsers(updatedUsers);
            setIsResetMode(false);
            setAuthMessage('Password updated. Please login.');
            setResetEmail('');
            setNewPassword('');
          }}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn">Reset Password</button>
            <div className="auth-switch">
              <span onClick={() => {
                setIsResetMode(false);
                setShowHomeMessage(false);
              }} style={{ cursor: 'pointer' }}>
                Back to Login
              </span>
            </div>
          </form>
        </div>
      ) : isRegisterMode ? (
        <div className="auth-form-container">
          <h2>Sign up</h2>
          <form className="auth-form" onSubmit={handleAuth}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Full Name" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Email Address" required />
            </div>
            <div className="form-group">
              <input type="password" name="password" placeholder="Password" required />
            </div>
            <div className="form-group">
              <select name="role" required>
                <option value="">User Type</option>
                <option value="renter">Renter</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="auth-submit-btn">SIGN UP</button>
            <div className="auth-switch">
              Already have an account?{' '}
              <span onClick={() => {
                setIsRegisterMode(false);
                setShowHomeMessage(false);
              }} style={{ cursor: 'pointer' }}>
                Sign in
              </span>
            </div>
          </form>
        </div>
      ) : (
        <div className="auth-form-container">
          <h2>Sign In</h2>
          <form className="auth-form" onSubmit={handleAuth}>
            <div className="form-group">
              <input type="email" name="email" placeholder="Email Address" required />
            </div>
            <div className="form-group">
              <input type="password" name="password" placeholder="Password" required />
            </div>
            <button type="submit" className="auth-submit-btn">SIGN IN</button>
            <div className="auth-links">
              <span onClick={() => {
                setIsResetMode(true);
                setIsRegisterMode(false);
                setShowHomeMessage(false);
                setAuthMessage('');
              }} style={{ cursor: 'pointer' }}>
                Forgot password?
              </span>
              <span onClick={() => {
                setIsRegisterMode(true);
                setShowHomeMessage(false);
              }} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                Don't have an account? Sign Up
              </span>
            </div>
          </form>
        </div>
      )}

      {authMessage && <div className="auth-message">{authMessage}</div>}
    </div>
  );

  return (
    <>
      {!currentUser ? (
        <AuthForm />
      ) : (
        <>
          <header>
            <div className="logo">HOUSEHUNT</div>
            <div className="user-info">
              <span>{currentUser.name} ({currentUser.role})</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </header>
          <main>
            {currentUser.role === 'renter' ? (
              <RenterDashboard
                currentUser={currentUser}
                properties={properties}
                bookings={bookings}
                users={users}
                onAddBooking={handleAddBooking}
              />
            ) : currentUser.role === 'owner' ? (
              <OwnerDashboard
  currentUser={currentUser}
  properties={properties}
  bookings={bookings}
  onPropertyAdd={(newProperty) =>
    setProperties((prev) => [...prev, newProperty])
  }
  onPropertyUpdate={handleUpdateProperty}
  onPropertyDelete={handleDeleteProperty}
  onBookingAction={handleBookingAction}
/>

            ) : currentUser.role === 'admin' ? (
              <AdminDashboard
                users={users}
                properties={properties}
                onApproveUser={handleApproveUser}
                onRejectUser={handleRejectUser}
                onApproveProperty={handleApproveProperty}
                onRejectProperty={handleRejectProperty}
              />
            ) : null}
          </main>
        </>
      )}
    </>
  );
}

export default Homepage;
