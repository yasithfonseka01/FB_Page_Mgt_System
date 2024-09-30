import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./Residencies.css"; // Import your CSS for styling
import { PuffLoader } from "react-spinners";
import { ACCESS_TOKEN } from "../../config"; // Assuming your token is here

const Residencies = () => {
  const [feedData, setFeedData] = useState([]); // State to hold the posts data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isError, setIsError] = useState(false); // Error state

  // Fetch the Facebook posts data
  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await fetch(
          "https://graph.facebook.com/362276116978303/feed?fields=from,is_popular,id,full_picture,is_instagram_eligible,message,place,to,shares,is_spherical,targeting,reactions,comments,status_type,width,likes.summary(true)",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`, // Include Bearer with the token
            },
          }
        );

        const data = await response.json();
        if (data && data.data) {
          // Sort posts by likes and comments
          const sortedPosts = data.data.sort((a, b) => {
            const aLikes = a.likes?.summary?.total_count || 0;
            const bLikes = b.likes?.summary?.total_count || 0;
            const aComments = a.comments?.data.length || 0;
            const bComments = b.comments?.data.length || 0;

            // Sort by total engagement (likes + comments), higher engagement comes first
            return (bLikes + bComments) - (aLikes + aComments);
          });

          setFeedData(sortedPosts); // Store the sorted posts data in state
          setIsLoading(false); // Set loading to false after fetching data
        }
      } catch (error) {
        console.error("Error fetching feed data:", error);
        setIsError(true); // Set error state
        setIsLoading(false); // Set loading to false after error
      }
    };

    fetchFeedData();

    // Set up an interval to fetch the feed data every 5 seconds
    const intervalId = setInterval(fetchFeedData, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Handle error state
  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  // Define Swiper settings
  const sliderSettings = {
    spaceBetween: 30,
    slidesPerView: 3,
    loop: true,
    navigation: true,
    pagination: { clickable: true },
  };

  return (
    <div id="residencies" className="r-wrapper">
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head">
          <span className="orangeText">Best Choices</span>
          <span className="primaryText">Popular Posts</span>
        </div>

        <Swiper {...sliderSettings}>
          <SlideNextButton />
          {/* slider */}
          {feedData.slice(0, 8).map((post, i) => (
            <SwiperSlide key={i}>
              <PostCard post={post} /> {/* PostCard component to handle post data */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// PostCard component to handle Facebook post structure
const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Track if the message is expanded or not
  const maxLength = 100; // Limit to the first 100 characters initially

  // Function to toggle the "See More" state
  const toggleMessage = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine the content to display: full message if expanded, otherwise truncated message
  const displayMessage = isExpanded
    ? post.message // Full message
    : post.message?.slice(0, maxLength); // Truncated message

  return (
    <div className="post-card">
      {/* Display full picture if available */}
      {post.full_picture && (
        <img src={post.full_picture} alt="Feed" className="feed-image" />
      )}

      <div className="feed-content">
        {/* Post's from name */}
        <h2 className="feed-title">{post.from.name}</h2>

        {/* Message content with "See More"/"See Less" functionality */}
        <p className="feed-message">
          {displayMessage}
          {post.message && post.message.length > maxLength && (
            <span
              className="see-more-btn"
              onClick={toggleMessage}
              style={{ cursor: "pointer", color: "blue", marginLeft: "0.5rem" }}
            >
              {isExpanded ? "See Less" : "See More"}
            </span>
          )}
        </p>

        {/* Post details such as status type and likes */}
        <div className="feed-details">
          <span><strong>Status:</strong> {post.status_type}</span>
          {post.is_instagram_eligible && (
            <span className="eligible">- Eligible for Instagram</span>
          )}
          {post.likes && (
            <span className="likes-count">
              <strong>- Likes:</strong> {post.likes.summary.total_count}
            </span>
          )}
        </div>

        {/* Comments section */}
        {post.comments && post.comments.data.length > 0 && (
          <div className="comments">
            <p>
              <strong>Comments:</strong> {post.comments.data.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Slide navigation buttons for Swiper
const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter r-buttons">
      <button onClick={() => swiper.slidePrev()} className="r-prevButton">
        &lt;
      </button>
      <button onClick={() => swiper.slideNext()} className="r-nextButton">
        &gt;
      </button>
    </div>
  );
};

export default Residencies;
