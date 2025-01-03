import React, { useState, useEffect, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./user.scss";

function AdminPageTableUser() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // States
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Kiểm tra quyền truy cập
    if (!currentUser || currentUser.role !== "quantri") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await apiRequest.get("/users");
      console.log("API Response:", res.data); // Xem dữ liệu trả về từ API
      // Đảm bảo gán mảng hoặc mảng rỗng nếu không có dữ liệu
      setUsers(Array.isArray(res.data.users) ? res.data.users: []);
    } catch (err) {
      console.error("Lỗi khi gọi API /users:", err);
      setUsers([]); // Gán mảng rỗng nếu có lỗi
    }
  };

  // Lọc và phân trang dữ liệu
  const filteredUsers = users
    .filter((user) =>
      user.name ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
    .filter((user) => (statusFilter ? user.userstatus === statusFilter : true));

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="adminPage">
      <h1>Quản lý người dùng</h1>

      {/* Search and Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="choduyet">Chờ duyệt</option>
          <option value="duyet">Đã duyệt</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="userTable">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userstatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &laquo; Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Sau &raquo;
        </button>
      </div>
    </div>
  );
}

export default AdminPageTableUser;
