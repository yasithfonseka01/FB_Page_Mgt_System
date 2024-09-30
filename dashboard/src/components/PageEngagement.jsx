import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../config';
import '../styles/PageEngagement.css';

const PageEngagement = () => {
  const [engagementData, setEngagementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5); // Initial visible cards

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/362276116978303/feed?fields=likes.summary(true),comments.summary(true),id,created_time,full_picture,message',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        console.log(data); // Log the response to check structure
        if (data.data) {
          setEngagementData(data.data);
        }
      } catch (error) {
        console.error('Error fetching page engagement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementData();

    const intervalId = setInterval(fetchEngagementData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const sortedData = engagementData
    .filter(post => post.likes && post.likes.summary && post.comments && post.comments.summary)
    .sort((a, b) => {
      const likesA = a.likes.summary.total_count || 0;
      const likesB = b.likes.summary.total_count || 0;
      const commentsA = a.comments.summary.total_count || 0;
      const commentsB = b.comments.summary.total_count || 0;

      return (likesB + commentsB) - (likesA + commentsA);
    });

  const topLikedPost = sortedData.reduce((prev, current) =>
    (prev.likes.summary.total_count > current.likes.summary.total_count) ? prev : current
  , { likes: { summary: { total_count: 0 } } });

  const topCommentedPost = sortedData.reduce((prev, current) =>
    (prev.comments.summary.total_count > current.comments.summary.total_count) ? prev : current
  , { comments: { summary: { total_count: 0 } } });

  const latestPosts = [...engagementData]
    .sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
    .slice(0, 5);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 5); // Increase visible cards by 5
  };

  return (
    <div className="page-engagement">
      <h1 className="engagement-header">Popular Posts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="section">
            <h2>Most Liked Post</h2>
            {topLikedPost && (
              <div className="card">
                <a href={`https://www.facebook.com/${topLikedPost.id}`} target="_blank" rel="noopener noreferrer">
                  {topLikedPost.full_picture && (
                    <img src={topLikedPost.full_picture} alt="Post image" className="post-image" />
                  )}
                  <div className="card-title">Most Liked Post</div>
                  <div className="card-description">{topLikedPost.message || 'No description available'}</div>
                  <div className="card-subtitle">Likes</div>
                  <div className="card-value">{topLikedPost.likes.summary.total_count || 0}</div>
                  <div className="card-subtitle">Comments</div>
                  <div className="card-value">{topLikedPost.comments.summary.total_count || 0}</div>
                </a>
              </div>
            )}
          </div>

          <div className="section">
            <h2>Most Commented Post</h2>
            {topCommentedPost && (
              <div className="card">
                <a href={`https://www.facebook.com/${topCommentedPost.id}`} target="_blank" rel="noopener noreferrer">
                  {topCommentedPost.full_picture && (
                    <img src={topCommentedPost.full_picture} alt="Post image" className="post-image" />
                  )}
                  <div className="card-title">Most Commented Post</div>
                  <div className="card-description">{topCommentedPost.message || 'No description available'}</div>
                  <div className="card-subtitle">Likes</div>
                  <div className="card-value">{topCommentedPost.likes.summary.total_count || 0}</div>
                  <div className="card-subtitle">Comments</div>
                  <div className="card-value">{topCommentedPost.comments.summary.total_count || 0}</div>
                </a>
              </div>
            )}
          </div>

          <div className="section">
            <h2>Latest 5 Posts</h2>
            <div className="card-container">
              {latestPosts.map((post) => (
                <div key={post.id} className="card">
                  <a href={`https://www.facebook.com/${post.id}`} target="_blank" rel="noopener noreferrer">
                    {post.full_picture && (
                      <img src={post.full_picture} alt="Post image" className="post-image" />
                    )}
                    <div className="card-title">Post</div>
                    <div className="card-description">{post.message || 'No description available'}</div>
                    <div className="card-subtitle">Likes</div>
                    <div className="card-value">{post.likes.summary.total_count || 0}</div>
                    <div className="card-subtitle">Comments</div>
                    <div className="card-value">{post.comments.summary.total_count || 0}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
  <h2>All Posts</h2>
  <div className="card-container">
    {sortedData.slice(0, visibleCount).map((metric) => (
      <div key={metric.id} className="card">
        <a href={`https://www.facebook.com/${metric.id}`} target="_blank" rel="noopener noreferrer">
          <div className="card-title">Post</div>
          <div className="card-subtitle">Likes</div>
          <div className="card-value">{metric.likes.summary.total_count || 0}</div>
          <div className="card-subtitle">Comments</div>
          <div className="card-value">{metric.comments.summary.total_count || 0}</div>
        </a>
      </div>
    ))}
  </div>
  {visibleCount < sortedData.length && (
    <button className="show-more" onClick={handleShowMore}>
      Show More
    </button>
  )}
</div>

        </>
      )}
    </div>
  );
};

export default PageEngagement;
