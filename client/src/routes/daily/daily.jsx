import "./daily.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer/footer";

const FeaturedUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiRequest.get(`/users`); // Gọi API lấy danh sách người dùng
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

  // Lọc người dùng dựa trên searchTerm
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleUsers = showAll ? filteredUsers : filteredUsers.slice(0, 100);

  if (loading) return <div>Đang tải danh sách người dùng...</div>;

  return (
    <div className="pageContainer">
      <div className="featured-users-update">
      <h2 className="section-title">Danh sách người quản lý </h2>

      {/* Ô tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, số điện thoại, hoặc địa chỉ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-cards">
        {filteredUsers.length > 0 ? (
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
          <div>Không có người dùng nào để hiển thị</div>
        )}
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default FeaturedUser;
