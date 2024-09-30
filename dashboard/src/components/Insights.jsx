import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ACCESS_TOKEN } from '../config'; // Ensure your access token is properly set
import '../styles/insights.css'; // Import the CSS file for styling

// Register chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Insights = () => {
  const [dailyData, setDailyData] = useState(null); // Daily engagement chart data
  const [weeklyData, setWeeklyData] = useState(null); // Weekly engagement chart data
  const [monthlyData, setMonthlyData] = useState(null); // Monthly engagement chart data

  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        // Fetch daily insights (page impressions)
        const responseDaily = await fetch(
          'https://graph.facebook.com/362276116978303/insights/page_impressions_unique?period=day',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const dailyDataResponse = await responseDaily.json();

        // Fetch weekly insights (page impressions)
        const responseWeekly = await fetch(
          'https://graph.facebook.com/362276116978303/insights/page_impressions_unique?period=week',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const weeklyDataResponse = await responseWeekly.json();

        // Fetch monthly (28 days) insights (page impressions)
        const responseMonthly = await fetch(
          'https://graph.facebook.com/362276116978303/insights/page_impressions_unique?period=days_28',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const monthlyDataResponse = await responseMonthly.json();

        if (dailyDataResponse?.data && weeklyDataResponse?.data && monthlyDataResponse?.data) {
          // Prepare daily chart data
          const dailyValues = dailyDataResponse.data[0].values;
          const dailyLabels = dailyValues.map(item => new Date(item.end_time).toLocaleDateString());
          const dailyChartValues = dailyValues.map(item => item.value);
          setDailyData({
            labels: dailyLabels,
            datasets: [
              {
                label: 'Daily Page Impressions',
                data: dailyChartValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1,
              },
            ],
          });

          // Prepare weekly chart data
          const weeklyValues = weeklyDataResponse.data[0].values;
          const weeklyLabels = weeklyValues.map(item => new Date(item.end_time).toLocaleDateString());
          const weeklyChartValues = weeklyValues.map(item => item.value);
          setWeeklyData({
            labels: weeklyLabels,
            datasets: [
              {
                label: 'Weekly Page Impressions',
                data: weeklyChartValues,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                tension: 0.1,
              },
            ],
          });

          // Prepare monthly (28-day) chart data
          const monthlyValues = monthlyDataResponse.data[0].values;
          const monthlyLabels = monthlyValues.map(item => new Date(item.end_time).toLocaleDateString());
          const monthlyChartValues = monthlyValues.map(item => item.value);
          setMonthlyData({
            labels: monthlyLabels,
            datasets: [
              {
                label: 'Monthly Page Impressions',
                data: monthlyChartValues,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
                tension: 0.1,
              },
            ],
          });
        } else {
          console.error('No data found in response');
        }
      } catch (error) {
        console.error('Error fetching insights data:', error);
      }
    };

    fetchInsightsData();

    // Set up an interval to fetch the data every 5 seconds (optional)
    const intervalId = setInterval(fetchInsightsData, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="insights-page">
      <h1 className="insights-title">Page Reach Insights</h1>

      {/* Daily Chart */}
      <div className="chart-container">
        <h2>Daily Page Impressions Over Time</h2>
        {dailyData ? (
          <Line data={dailyData} />
        ) : (
          <p>Loading daily chart data...</p>
        )}
      </div>

      {/* Weekly Chart */}
      <div className="chart-container">
        <h2>Weekly Page Impressions Over Time</h2>
        {weeklyData ? (
          <Line data={weeklyData} />
        ) : (
          <p>Loading weekly chart data...</p>
        )}
      </div>

      {/* Monthly (28-day) Chart */}
      <div className="chart-container">
        <h2>Monthly Page Impressions Over Time</h2>
        {monthlyData ? (
          <Line data={monthlyData} />
        ) : (
          <p>Loading monthly chart data...</p>
        )}
      </div>

      {/* API Details Section */}
      <div className="api-details">
        <h2>API Details</h2>
        <p>Below are the API calls made to fetch insights data:</p>
        <h3>Daily Impressions</h3>
        <pre>
          <code>
            GET https://graph.facebook.com/362276116978303/insights/page_impressions_unique?period=day
          </code>
        </pre>

        <h3>Weekly Impressions</h3>
        <pre>
          <code>
            GET https://graph.facebook.com/362276116978303/insights/page_impressions_unique?period=week
          </code>
        </pre>

        <h3>Monthly (28 Days) Impressions</h3>
        <pre>
          <code>
            GET https://graph.facebook.com/362276116978303/insights/page_impressions_unique?period=days_28
          </code>
        </pre>

        <h3>Headers</h3>
        <pre>
          <code>
            Authorization: Bearer
          </code>
        </pre>

        <p>These API calls return insights data which is then used to populate the charts above.</p>
      </div>
    </div>
  );
};

export default Insights;
