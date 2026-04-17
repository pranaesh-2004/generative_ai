import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function SentimentChart({ positive = 0, negative = 0, neutral = 0 }) {
  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [positive, negative, neutral],
        backgroundColor: ["#22c55e", "#ef4444", "#94a3b8"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Sentiment Distribution</h3>
      <div className="chart-box">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default SentimentChart;