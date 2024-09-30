import React, { useState, useEffect } from 'react';
import AddPostForm from './AddPostForm';
import '../styles/postManage.css'; // Your CSS for FeedList
import { ACCESS_TOKEN } from '../config';

const PostManage = () => {
  const [feedData, setFeedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const postsPerPage = 5; // Number of posts per page

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/362276116978303/posts?fields=created_time,message,id',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
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

    // Fetch the feed data once when the component loads
    fetchFeedData();

    // Set up an interval to fetch the feed data every 10 seconds
    const intervalId = setInterval(fetchFeedData, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData) => {
    const message = formData.get('message');
    const link = formData.get('link');
    const published = formData.get('published'); 
    const scheduled_publish_time = formData.get('scheduled_publish_time'); 

    let payload = {
      message,
      link: link || undefined,
      published: published === 'true', 
    };

    if (scheduled_publish_time) {
      payload = {
        ...payload,
        scheduled_publish_time: parseInt(scheduled_publish_time, 10), 
        published: false, 
      };
    }

    try {
      const response = await fetch(
        'https://graph.facebook.com/v20.0/362276116978303/feed',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result && result.id) {
        setFeedData([{ ...result, message, created_time: new Date().toISOString() }, ...feedData]);
        closeModal();
      }
    } catch (error) {
      console.error('Error adding new post:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      if (response.ok) {
        setFeedData(feedData.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = feedData.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(feedData.length / postsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className='feed-list'>
      <h1>Feed List</h1>
      <button onClick={openModal} className='add-post-button'>Add Post</button>
      <table>
        <thead>
          <tr>
            <th>Created Time</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.created_time).toLocaleString()}</td>
              <td>{item.message || 'No message'}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <AddPostForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default PostManage;
