// RateChart.jsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RateChart = ({ fromCurrency, toCurrency }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalRates = async () => {
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        const days = 3; // Change this value to show more days
        let labels = [];
        let data = [];

        // Loop through the past 'days' to simulate rate changes
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          labels.unshift(date.toISOString().split('T')[0]); // Format date for labels

          // Fetch historical data (or make multiple API calls)
          const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/history/${fromCurrency}/${date.toISOString().split('T')[0]}`
          );

          data.unshift(response.data.conversion_rates[toCurrency]);
        }

        // Set up chart data
        setChartData({
          labels,
          datasets: [
            {
              label: `Exchange Rate (${fromCurrency} to ${toCurrency})`,
              data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalRates();
  }, [fromCurrency, toCurrency]);

  if (loading) return <div>Loading chart...</div>;

  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Exchange Rate Trend',
            },
          },
        }}
      />
    </div>
  );
};

export default RateChart;
