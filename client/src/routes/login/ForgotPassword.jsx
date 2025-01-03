import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./forgotPassword.scss";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      await apiRequest.post("/auth/forgotPassword", { email });
      setMessage("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư!");
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgotPassword">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Quên mật khẩu</h1>
          <input
            type="email"
            placeholder="Nhập địa chỉ email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={isLoading}>Gửi yêu cầu</button>
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

export default ForgotPassword;
