import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./EditUserPage.scss";

function EditUserPage() {
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
  });
  const [avatar, setAvatar] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (currentUser.id !== id && currentUser.role !== "quantri") {
          setErrors({ general: "Bạn không có quyền truy cập!" });
          setIsLoading(false);
          return;
        }

        const res = await apiRequest.get(`/users/search/${id}`);
        setUser(res.data);
        setIsLoading(false);
      } catch (err) {
        setErrors({ general: "Không thể tải thông tin người dùng." });
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  const validateFields = () => {
    const newErrors = {};

    if (!user.username) newErrors.username = "Tên người dùng là bắt buộc.";
    if (!user.email) newErrors.email = "Email là bắt buộc.";
    if (user.role !== "nguoidung" && !user.address) newErrors.address = "Địa chỉ là bắt buộc.";
    if (user.role === "quanly" && !user.info) newErrors.info = "Giới thiệu là bắt buộc.";
    if (user.role === "quanly" && !user.phone) newErrors.phone = "Số điện thoại là bắt buộc.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const updateData = {
        username: user.username,
        email: user.email,
        info: user.info,
        phone: user.phone,
        ...(currentUser.role === "quantri" && { role: user.role }),
        ...(user.role !== "nguoidung" && { address: user.address }),
      };

      if (user.password) {
        updateData.password = user.password;
      }

      if (avatar[0]) {
        updateData.avatar = avatar[0];
      }

      const res = await apiRequest.put(`/users/${id}`, updateData);
      alert("Cập nhật người dùng thành công!");

      if (currentUser.role === "quantri") {
        navigate("/profile/admin/user");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Không thể cập nhật người dùng." });
    }
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (errors.general) return <div style={{ color: "red" }}>{errors.general}</div>;

  return (
    <div className="editUserPage">
      <div className="formContainer">
        <form onSubmit={handleUpdateUser}>
          <h1>Cập nhật người dùng</h1>

          <div className="item">
            <label htmlFor="username">Tên người dùng</label>
            <input
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => {
                setUser({ ...user, username: e.target.value });
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
            />
            {errors.username && <span className="error"style={{color: "red"}}>{errors.username}</span>}
          </div>

          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && <span className="error"style={{color: "red"}}>{errors.email}</span>}
          </div>

          {currentUser.role === "quantri" && (
            <div className="item">
              <label htmlFor="role">Vai trò</label>
              <select
                id="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
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
                onChange={(e) => {
                  setUser({ ...user, address: e.target.value });
                  setErrors((prev) => ({ ...prev, address: "" }));
                }}
              />
              {errors.address && <span className="error"style={{color: "red"}}>{errors.address}</span>}
            </div>
          )}

          {user.role === "quanly" && (
            <div className="item">
              <label htmlFor="info">Giới thiệu</label>
              <input
                id="info"
                type="text"
                value={user.info}
                onChange={(e) => {
                  setUser({ ...user, info: e.target.value });
                  setErrors((prev) => ({ ...prev, info: "" }));
                }}
              />
              {errors.info && <span className="error"style={{color: "red"}}>{errors.info}</span>}
            </div>
          )}

          {user.role === "quanly" && (
            <div className="item">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="text"
                value={user.phone}
                onChange={(e) => {
                  setUser({ ...user, phone: e.target.value });
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }}
              />
              {errors.phone && <span className="error"style={{color: "red"}}>{errors.phone}</span>}
            </div>
          )}

          <div className="item">
            <label htmlFor="password">Mật khẩu mới (để trống nếu không đổi)</label>
            <input
              id="password"
              type="password"
              value={user.password || ""}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <button type="submit">Cập nhật</button>
        </form>
      </div>

      <div className="sideContainer">
        <img
          src={avatar[0] || user.avatar || "/noavatar.png"}
          alt="Avatar"
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "huynhhuunhan",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default EditUserPage;
