import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiRequest from "../../lib/apiRequest";

// Đăng ký các thành phần cần thiết cho biểu đồ đường
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserStatsChartLine = () => {
  const [labels, setLabels] = useState([]); // Nhãn trục x
  const [dataValues, setDataValues] = useState([]); // Dữ liệu trục y
  const [filter, setFilter] = useState("month"); // Bộ lọc mặc định là "day"

  useEffect(() => {
    fetchUserStats(filter);
  }, [filter]);

  const fetchUserStats = async (selectedFilter) => {
    try {
      const response = await apiRequest.get(`/users/stats/users?filter=${selectedFilter}`);
      const stats = response.data.userStats;

      const now = new Date();
      let labels = [];
      let dataMap = {};

      switch (selectedFilter) {
        case "day":
          labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
          dataMap = stats.reduce((acc, item) => {
            const hour = new Date(item.date).getHours();
            acc[hour] = (acc[hour] || 0) + item.count;
            return acc;
          }, {});
          break;

        case "week":
          labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(now.getDate() - i);
            return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit" });
          }).reverse();
          dataMap = stats.reduce((acc, item) => {
            const day = new Date(item.date).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit" });
            acc[day] = (acc[day] || 0) + item.count;
            return acc;
          }, {});
          break;

        case "month":
          // eslint-disable-next-line no-case-declarations
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
          dataMap = stats.reduce((acc, item) => {
            const day = new Date(item.date).getDate();
            acc[day] = (acc[day] || 0) + item.count;
            return acc;
          }, {});
          break;

        case "year":
          labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
          dataMap = stats.reduce((acc, item) => {
            const month = new Date(item.date).getMonth() + 1;
            acc[month] = (acc[month] || 0) + item.count;
            return acc;
          }, {});
          break;

        default:
          break;
      }

      const values = labels.map((_, index) => dataMap[index + 1] || 0);

      setLabels(labels);
      setDataValues(values);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLabels([]);
      setDataValues([]);
    }
  };

  const getFilterLabel = (filter) => {
    switch (filter) {
      case "month":
        return "tháng";
      case "year":
        return "năm";
      default:
        return filter;
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: `Người dùng đăng ký (${getFilterLabel(filter)})`,
        data: dataValues,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#4caf50",
        pointBorderColor: "#4caf50",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      //title: {
        //display: true,
        //text: "Thống kê số người dùng đăng ký",
      //},
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <h2>Số lượng tài khoản đã đăng ký</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Lọc theo: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      {dataValues.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p style={{ textAlign: "center" }}>Không có dữ liệu để hiển thị</p>
      )}
    </div>
  );
};

export default UserStatsChartLine;
