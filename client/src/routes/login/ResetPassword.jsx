import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./resetPassword.scss";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      await apiRequest.post("/auth/resetPassword", { token, password });
      setMessage("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.");
      setTimeout(() => navigate("/login"), 3000); // Chuyển hướng về trang đăng nhập sau 3 giây
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resetPassword">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Đặt lại mật khẩu</h1>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button disabled={isLoading}>Đặt lại mật khẩu</button>
          {message && <span className="success">{message}</span>}
          {error && <span className="error">{error}</span>}
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default ResetPassword;
