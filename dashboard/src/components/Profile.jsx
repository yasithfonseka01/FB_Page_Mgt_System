import React, { useEffect, useState } from 'react';
import PeofileHeader from './PeofileHeader';
import '../styles/profile.css';
import { ACCESS_TOKEN } from '../config';

const Profile = () => {
  const [profileImage, setProfileImage] = useState('');
  const [profileInfo, setProfileName] = useState('');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/362276116978303/picture?redirect=false', // Add redirect=false to get the URL in JSON
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`, // Include Bearer with the token
            },
          }
        );

        const response2 = await fetch(
            'https://graph.facebook.com/362276116978303', // Add redirect=false to get the URL in JSON
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`, // Include Bearer with the token
              },
            }
          );

        const data = await response.json();
        if (data && data.data && data.data.url) {
          setProfileImage(data.data.url); // Set the profile image URL
        }

        const data2 = await response2.json();
        if (data2 && data2.name && data2.id) {
          setProfileName(data2);
        } else {
          console.error('No data found in response');
        }

      } catch (error) {
        console.error('Error fetching profile image & data:', error);
      }
    };

    fetchProfileImage();

    // Set up an interval to fetch the feed data every 5 seconds
    const intervalId = setInterval(fetchProfileImage, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='profile'>
      <PeofileHeader />
      <div className='user-profile'>
        <div className='user--detail'>
          <img src={profileImage} alt='Profile' />
          <p><strong>Name:</strong> {profileInfo.name}</p>
          <p><strong>ID:</strong> {profileInfo.id}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
