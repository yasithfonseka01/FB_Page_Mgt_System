import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router for navigation
import '../styles/login.css'; // Ensure this CSS file includes the necessary styles
import { ACCESS_TOKEN } from '../config'; // Import the ACCESS_TOKEN

const Login = () => {
  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch profile image
        const imageResponse = await fetch(
          'https://graph.facebook.com/362276116978303/picture?redirect=false', // Add redirect=false to get the URL in JSON
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`, // Include Bearer with the token
            },
          }
        );
        const imageData = await imageResponse.json();
        setProfileImage(imageData.data.url);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin') {
      // Successful login for admin credentials
      localStorage.setItem('token', 'admin-token'); // Simulate a token
      navigate('/dashboard'); // Redirect to admin dashboard
    } else {
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Username:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your username"
            required
          />
          
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <p className="error-message">{error}</p>} {/* Show error message */}

          <button type="submit">Login</button>
        </form>
      </div>

      <div className="tea-info">
        <h2>About Higurupathwaldeniya Estates</h2>
        {profileImage && (
          <img src={profileImage} alt="Profile" className="profile-image" />
        )}
        <p>Discover the rich history and culture of Higurupathwaldeniya Estates, renowned for its exquisite tea plantations and lush landscapes. Join us in celebrating the legacy of tea cultivation.</p>
      </div>
    </div>
  );
};

export default Login;
