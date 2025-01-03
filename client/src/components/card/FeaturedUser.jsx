//import React, { useEffect, useState } from "react";
//import axios from "axios";
import "./FeaturedUser.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { useEffect, useState } from "react";

const FeaturedUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiRequest.get(`/users`);// Gọi API lấy danh sách người dùng
        // Lọc người dùng có role="quanly"
        const filteredUsers = res.data.users.filter(user => user.role === "quanly" && user.userstatus==="duyet" && user.userlook==="khongkhoa");
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
 
  const visibleUsers = showAll ? users : users.slice(0, 8);

  if (loading) return <div>Đang tải danh sách người quản lý...</div>;

  return (
    <div className="featured-users">
      <h2 className="section-title-quanly">Danh sách người quản lý</h2>
      <div className="user-cards">
        {users.length > 0 ? (
          visibleUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <Link to={`/user/${user.id}`} className="avatar-container">
                <img
                  src={user.avatar || "/images/default-avatar.png"}
                  alt={user.username || "Tên người dùng"}
                />
              </Link>
              <div className="user-info">
                <h3>{user.username || "Chưa cập nhật tên"}</h3>
                <p>Email: {user.email || "Chưa cập nhật"}</p>
                <p>Số điện thoại: {user.phone || "Chưa cập nhật"}</p>
              </div>
            </div>
          ))
        ) : (
          <div>Không có người quản lý nào để hiển thị</div>
        )}
      </div>
      {users.length > 8 && (
        <div className="show-more">
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedUser;
