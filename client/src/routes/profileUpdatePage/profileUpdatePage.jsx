import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { username, email, address, password, info, phone } = Object.fromEntries(formData);

    let newError = {};
    if (!username) newError.username = "Tên người dùng là bắt buộc.";
    if (!email) newError.email = "Email là bắt buộc.";
    if (currentUser.role !== "nguoidung" && !address) newError.address = "Địa chỉ là bắt buộc.";
    if (currentUser.role === "quanly" && !info) newError.info = "Giới thiệu là bắt buộc.";
    if (currentUser.role === "quanly" && !phone) newError.phone = "Số điện thoại là bắt buộc.";

    setError(newError);
    if (Object.keys(newError).length > 0) return;

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        ...(currentUser.role !== "nguoidung" && { address }),
        password,
        avatar: avatar[0],
        info,
        phone,
      });
      updateUser(res.data);
      // Hiển thị thông báo cập nhật thành công
      alert("Cập nhật hồ sơ thành công!");

      // Điều hướng dựa trên vai trò
      if (currentUser.role === "quantri") {
        navigate("/profile/admin/profile");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.log(err);
      alert("Cập nhật hồ sơ thất bại!");
      setError({ form: err.response.data.message || "Đã xảy ra lỗi."});
    }
  };

  const handleInputChange = (field) => {
    setError((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Cập nhật hồ sơ</h1>
          <div className="item">
            <label htmlFor="username">
              Tên người dùng <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
              onChange={() => handleInputChange("username")}
            />
            {error.username && <span className="error"style={{color: "red"}}>{error.username}</span>}
          </div>
          <div className="item">
            <label htmlFor="email">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
              onChange={() => handleInputChange("email")}
            />
            {error.email && <span className="error"style={{color: "red"}}>{error.email}</span>}
          </div>
          {currentUser.role !== "nguoidung" && (
            <div className="item">
              <label htmlFor="address">
                Địa chỉ <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={currentUser.address}
                onChange={() => handleInputChange("address")}
              />
              {error.address && <span className="error"style={{color: "red"}}>{error.address}</span>}
            </div>
          )}
          {currentUser.role === "quanly" && (
            <div className="item">
              <label htmlFor="info">
                Giới thiệu <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                id="info"
                name="info"
                type="text"
                defaultValue={currentUser.info}
                onChange={() => handleInputChange("info")}
              />
              {error.info && <span className="error"style={{color: "red"}}>{error.info}</span>}
            </div>
          )}
          {currentUser.role === "quanly" && (
            <div className="item">
              <label htmlFor="phone">
                Số điện thoại <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                defaultValue={currentUser.phone}
                onChange={() => handleInputChange("phone")}
              />
              {error.phone && <span className="error"style={{color: "red"}}>{error.phone}</span>}
            </div>
          )}

          <div className="item">
            <label htmlFor="password">Mật khẩu</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Cập nhật</button>
          {error.form && <span className="error"style={{color: "red"}}>{error.form}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <div className="avatarContainer">
          <img
            src={avatar[0] || currentUser.avatar || "/noavatar.png"}
            alt="Avatar"
            className="avatar"
          />
        </div>
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

export default ProfileUpdatePage;
