import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const Chart = ({ stats }) => {
  // Biểu đồ cột cho người dùng theo trạng thái
  const userStatusData = {
    labels: ["Chờ duyệt", "Đã duyệt và không khóa", "Bị khóa"],
    datasets: [
      {
        label: "Số lượng người dùng",
        data: [stats.pendingUsers, stats.approvedUnlockedUsers, stats.lockedUsers],
        backgroundColor: ["#f39c12", "#27ae60", "#e74c3c"],
      },
    ],
  };

  // Biểu đồ tròn cho vai trò người dùng
  const roleData = {
    labels: ["Quản trị", "Quản lý", "Người dùng"],
    datasets: [
      {
        label: "Vai trò người dùng",
        data: [stats.roleStats.quantri, stats.roleStats.quanly, stats.roleStats.nguoidung],
        backgroundColor: ["#3498db", "#9b59b6", "#2ecc71"],
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "20px" }}>
      {/* Biểu đồ cột */}
      <div style={{ width: "55%", margin: "20px" }}>
        <h3>Thống kê người dùng theo trạng thái</h3>
        <Bar data={userStatusData} options={{ responsive: true }} />
      </div>

      {/* Biểu đồ tròn */}
      <div style={{ width: "55%", margin: "20px" }}>
        <h3>Thống kê vai trò người dùng</h3>
        <Pie data={roleData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Chart;
