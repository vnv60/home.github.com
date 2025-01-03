import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./userStatusAdmin.scss";

function UserStatusAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
    address: "",
    info: "",
    phone: "",
    userstatus: "", // Trạng thái người dùng (choduyet hoặc duyet)
  });
  const [avatar, setAvatar] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (currentUser.id !== id && currentUser.role !== "quantri") {
          setError("Bạn không có quyền truy cập!");
          setIsLoading(false);
          return;
        }

        const res = await apiRequest.get(`/users/search/${id}`);
        setUser(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin người dùng.");
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  const handleStatusToggle = async () => {
    const action = user.userstatus === "choduyet" ? "Duyệt" : "Hủy Duyệt";
    const confirm = window.confirm(`Bạn có chắc chắn muốn ${action.toLowerCase()} người dùng này không?`);

    if (!confirm) return;

    try {
      const newStatus = user.userstatus === "choduyet" ? "duyet" : "choduyet";
      const res = await apiRequest.patch(`/users/status/${id}`, {
        userstatus: newStatus,
      });

      setUser((prevUser) => ({
        ...prevUser,
        userstatus: newStatus,
      }));

      alert(`${action} người dùng thành công!`);
    } catch (err) {
      console.error("Không thể cập nhật trạng thái:", err);
      alert(`${action} người dùng thất bại!`);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="editUserPage">
      <div className="formContainer">
        <form>
          <h1>Duyệt người dùng</h1>

          {error && <div style={{ color: "red" }}>{error}</div>}

          <div className="item">
            <label htmlFor="username">Tên người dùng</label>
            <input
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              disabled
            />
          </div>

          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled
            />
          </div>

          {currentUser.role === "quantri" && (
            <div className="item">
              <label htmlFor="role">Vai trò</label>
              <select
                id="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                disabled
              >
                <option value="nguoidung">Người dùng</option>
                <option value="quanly">Quản lý</option>
                <option value="quantri">Quản trị</option>
              </select>
            </div>
          )}

          {user.role !== "nguoidung" && (
            <div className="item">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                disabled
              />
            </div>
          )}

{user.role === "quanly" && (
            <div className="item">
              <label htmlFor="info">Giới thiệu </label>
              <input
                id="info"
                type="text"
                value={user.info}
                onChange={(e) => setUser({ ...user, info: e.target.value })}
              />
            </div>
          )}
          {user.role === "quanly" && (
            <div className="item">
              <label htmlFor="phone">Số điện thoại </label>
              <input
                id="phone"
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>
          )}


        </form>

        <Link to="/profile/admin/user" className="profileAdmin">
                                          
                  <button
                    className="quaylai"
                    
                  >
                    Quay lại 
                  </button>
                  </Link>


                  <button
                    className="approveButton"
                    onClick={handleStatusToggle}
                  >
                    {user.userstatus === "choduyet" ? "Duyệt" : "Hủy Duyệt"}
                  </button>
        
      </div>

      <div className="sideContainer">
        <img
          src={avatar[0] || user.avatar || "/noavatar.png"}
          alt="Avatar"
          className="avatar"
        />
        
        
      </div>
    </div>
  );
}

export default UserStatusAdmin;
