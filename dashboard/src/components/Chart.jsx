import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ACCESS_TOKEN } from '../config';

// Register chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LikesCommentsChart = () => {
  const [chartData, setChartData] = useState(null); // State to hold the chart data

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/362276116978303/feed?fields=created_time,likes.summary(true),comments.summary(true)',
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );

        const data = await response.json();

        if (data && data.data) {
          // Prepare labels and data for the chart
          const labels = data.data.map((post) => new Date(post.created_time).toLocaleDateString()); // Extract post dates
          const likesData = data.data.map((post) => post.likes?.summary?.total_count || 0); // Extract like counts
          const commentsData = data.data.map((post) => post.comments?.summary?.total_count || 0); // Extract comment counts

          setChartData({
            labels, // X-axis labels (post dates)
            datasets: [
              {
                label: 'Likes',
                data: likesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1,
              },
              {
                label: 'Comments',
                data: commentsData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                tension: 0.1,
              },
            ],
          });
        } else {
          console.error("No data found in response");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchChartData(); // Fetch data on mount

  }, []); // Only run once when the component mounts

  return (
    <div className="chart-container">
      <h2>Likes and Comments Over Time</h2>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default LikesCommentsChart;
