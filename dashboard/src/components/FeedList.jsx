import React, { useEffect, useState } from 'react';
import '../styles/feedList.css'; // Make sure to import your CSS file
import { ACCESS_TOKEN } from '../config';

const FeedList = () => {
  const [feedData, setFeedData] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/362276116978303/feed?fields=from,is_popular,id,full_picture,is_instagram_eligible,message,place,to,shares,is_spherical,targeting,reactions,comments,status_type,width,likes.summary(true)',
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`, // Include Bearer with the token
            },
          }
        );

        const data = await response.json();
        if (data && data.data) {
          setFeedData(data.data);
        }
      } catch (error) {
        console.error('Error fetching feed data:', error);
      }
    };

    fetchFeedData();

    // Set up an interval to fetch the feed data every 5 seconds
    const intervalId = setInterval(fetchFeedData, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className='feed-list'>
      <h1>Feed List</h1>
      {feedData.map((item) => (
        <div key={item.id} className='feed-item'>
          {item.full_picture && <img src={item.full_picture} alt='Feed' className='feed-image' />}
          <div className='feed-content'>
            <h2 className='feed-title'>
              {item.from && item.from.name ? item.from.name : 'Unknown'}
            </h2>
            <p className='feed-message'>{item.message}</p>
            <div className='feed-details'>
              <span><strong>Status:</strong> {item.status_type}</span>
              {item.is_instagram_eligible && <span className='eligible'>-Eligible for Instagram</span>}
              {item.likes && (
                <span className='likes-count'>
                  <strong>-Likes:</strong> {item.likes.summary.total_count}
                </span>
              )}
            </div>
            {item.comments && item.comments.data.length > 0 && (
              <div className='comments'>
                <button 
                  className='dropdown-btn'
                  onClick={() => toggleDropdown(item.id)}
                >
                  {openDropdown === item.id ? 'Hide Comments' : 'Show Comments'}
                </button>
                <div className={`dropdown-content ${openDropdown === item.id ? 'show' : ''}`}>
                  {item.comments.data.map((comment) => (
                    <div key={comment.id} className='comment'>
                      <p><strong>{comment.from && comment.from.name ? comment.from.name : 'Unknown'}:</strong> {comment.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

  );
};

export default FeedList;
