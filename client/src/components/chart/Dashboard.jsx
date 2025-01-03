import React, { useState, useEffect } from "react";
import Chart from "./chart";
import apiRequest from "../../lib/apiRequest";

const Statistics = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    pendingUsers: 0,
    lockedUsers: 0,
    approvedUnlockedUsers: 0,
    roleStats: { quantri: 0, quanly: 0, nguoidung: 0 },
    postCount: 0,
  });

  const fetchStatistics = async () => {
    try {
      const userRes = await apiRequest.get("/users");
      const users = userRes.data.users;

      // Thống kê số liệu người dùng
      const pendingUsers = users.filter(user => user.userstatus === "choduyet").length;
      const lockedUsers = users.filter(user => user.userlook === "khoa").length;
      const approvedUnlockedUsers = users.filter(
        user => user.userstatus === "duyet" && user.userlook === "khongkhoa"
      ).length;

      const roleStats = {
        quantri: users.filter(user => user.role === "quantri").length,
        quanly: users.filter(user => user.role === "quanly").length,
        nguoidung: users.filter(user => user.role === "nguoidung").length,
      };

      setStats({
        userCount: users.length,
        pendingUsers,
        lockedUsers,
        approvedUnlockedUsers,
        roleStats,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div>
      <h2>Thống kê trạng thái và vai trò người dùng </h2>
      <Chart stats={stats} />
    </div>
  );
};

export default Statistics;
