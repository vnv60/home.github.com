import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.scss";
import UserStatsChartLine from "../../components/chart/UserStatsChartLine";
import * as XLSX from "xlsx";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    postCount: 0,
    approvedPosts: 0,
    pendingPosts: 0,
    lockedPosts: 0,
    unlockedPosts: 0,
    buyStats: { raoban: 0, danggiaodich: 0, daban: 0 },
    rentStats: { raoban: 0, danggiaodich: 0, dachothue: 0 },
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const userRes = await apiRequest.get("/users");
      const postRes = await apiRequest.get("/posts");
      const posts = postRes.data;

      const approvedPosts = posts.filter((post) => post.status === "duyet").length;
      const pendingPosts = posts.filter((post) => post.status === "choduyet").length;
      const lockedPosts = posts.filter((post) => post.look === "khoa").length;
      const unlockedPosts = posts.filter((post) => post.look === "khongkhoa").length;

      const buyStats = { raoban: 0, danggiaodich: 0, daban: 0 };
      const rentStats = { raoban: 0, danggiaodich: 0, dachothue: 0 };

      posts.forEach((post) => {
        if (post.buystatus && buyStats[post.buystatus] !== undefined) {
          buyStats[post.buystatus]++;
        }
        if (post.rentstatus && rentStats[post.rentstatus] !== undefined) {
          rentStats[post.rentstatus]++;
        }
      });

      setStats({
        userCount: userRes.data.users.length,
        postCount: posts.length,
        approvedPosts,
        pendingPosts,
        lockedPosts,
        unlockedPosts,
        buyStats,
        rentStats,
      });
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  
  

  return (
    <div className="dashboard">
      <h2>Trang tổng hợp</h2>
      <div className="statistics-summary">
        <div className="stat-item">
          <h3>Người dùng</h3>
          <p>{stats.userCount}</p>
        </div>
        <div className="stat-item">
          <h3>Bài đăng</h3>
          <p>{stats.postCount}</p>
        </div>
      </div>
      <div className="charts">
        {
          /*
          <div className="chart1">
          <h3>Số lượng người dùng và bài đăng</h3>
          <Bar
            data={{
              labels: ["Người dùng", "Bài đăng"],
              datasets: [
                {
                  label: "Số lượng",
                  data: [stats.userCount, stats.postCount],
                  backgroundColor: ["#4caf50", "#2196f3"],
                  borderColor: ["#388e3c", "#1976d2"],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                //title: { display: true, text: "Thống kê số lượng người dùng và bài đăng" },
              },
            }}
          />
        </div>
          */
        }
        
        <div className="chart2">
          <h3>Trạng thái Mua </h3>
          <Bar
            data={{
              labels: ["Tổng bất động sản", "Đang giao dịch", "Đã bán"],
              datasets: [
                {
                  label: "Số lượng",
                  data: [
                    stats.buyStats.raoban,
                    stats.buyStats.danggiaodich,
                    stats.buyStats.daban,
                  ],
                  backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
                  borderColor: ["#388e3c", "#f57c00", "#d32f2f"],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                //title: { display: true, text: "Thống kê trạng thái Mua " },
              },
            }}
          />
        </div>
        <div className="chart3">
          <h3>Trạng thái Thuê</h3>
          <Bar
            data={{
              labels: ["Tổng bất động sản ", "Đang giao dịch", "Đã cho thuê"],
              datasets: [
                {
                  label: "Số lượng",
                  data: [
                    stats.rentStats.raoban,
                    stats.rentStats.danggiaodich,
                    stats.rentStats.dachothue,
                  ],
                  backgroundColor: ["#4caf50", "#ff9800", "#8bc34a"],
                  borderColor: ["#388e3c", "#f57c00", "#689f38"],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                //title: { display: true, text: "Thống kê trạng thái Thuê " },
              },
            }}
          />
        </div>
        <UserStatsChartLine />
      </div>
    </div>
  );
};

export default Dashboard;
