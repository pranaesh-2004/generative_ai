import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function SubjectBarChart({ subjects = [], counts = [] }) {
  const data = {
    labels: subjects,
    datasets: [
      {
        label: "Feedback Count",
        data: counts,
        backgroundColor: "#2563eb",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Subject-wise Feedback Count</h3>
      <div className="chart-box">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default SubjectBarChart;