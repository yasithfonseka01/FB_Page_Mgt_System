import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaCommentAlt, FaFileAlt } from 'react-icons/fa'; // Import FontAwesome icons
import { ACCESS_TOKEN } from '../config';

const Card = () => {
    const [totalLikes, setTotalLikes] = useState(0); // State to hold the total likes
    const [totalComments, setTotalComments] = useState(0); // State to hold the total comments
    const [totalPosts, setTotalPosts] = useState(0); // State to hold the total post count

    useEffect(() => {
        // Function to fetch the API data
        const fetchData = async () => {
          try {
            const response = await fetch(
              'https://graph.facebook.com/362276116978303/feed?fields=likes.summary(true),comments.summary(true)',
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${ACCESS_TOKEN}`, // Include Bearer with the token
                },
              }
            );
            
            const data = await response.json();
            
            if (data && data.data) {
              // Set the total post count
              setTotalPosts(data.data.length);

              // Calculate total likes
              const totalLikeCount = data.data.reduce((acc, item) => {
                return acc + (item.likes?.summary?.total_count || 0);
              }, 0);

              // Calculate total comments
              const totalCommentCount = data.data.reduce((acc, item) => {
                return acc + (item.comments?.summary?.total_count || 0);
              }, 0);
    
              // Set the total likes and comments to the state
              setTotalLikes(totalLikeCount);
              setTotalComments(totalCommentCount);
            } else {
              console.error("No data found in response");
            }
            
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        // First invocation of the fetch function
        fetchData();

        // Set interval to update the data every 30 seconds
        const intervalId = setInterval(fetchData, 30000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
        
    }, []); // Empty dependency array so it runs on mount and sets up the interval

    const renderCard = (icon, title, count) => (
        <div className='card'>
            <div className="card--cover">{icon}</div>
            <div className='card--title'>
                <h2>{title}</h2>
                <p>{count}</p>
            </div>
        </div>
    );

    return ( 
        <div className="card--container">
            {renderCard(<FaThumbsUp />, 'Total Likes', totalLikes)}    {/* FaThumbsUp for Likes */}
            {renderCard(<FaCommentAlt />, 'Total Comments', totalComments)}  {/* FaCommentAlt for Comments */}
            {renderCard(<FaFileAlt />, 'Total Posts', totalPosts)}  {/* FaFileAlt for Total Posts */}
        </div>
    );
}

export default Card;
