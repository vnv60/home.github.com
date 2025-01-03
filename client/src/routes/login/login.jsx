import { useContext, useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { updateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const validate = (username, password) => {
        const newErrors = {};
        if (!username) newErrors.username = "Tên người dùng là bắt buộc.";
        if (!password) newErrors.password = "Mật khẩu là bắt buộc.";
        setErrors(newErrors);

        {/*
            // Xóa lỗi sau 30 giây
        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => setErrors({}), 5000); // Xóa lỗi sau 30 giây
        }
            */}
        return Object.keys(newErrors).length === 0; // Trả về `true` nếu không có lỗi
    };

    const handleInput = (e) => {
        const { name } = e.target;

        // Xóa lỗi khi người dùng nhập vào trường input
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        if (!validate(username, password)) {
            setIsLoading(false);
            return; // Ngừng xử lý nếu có lỗi
        }

        try {
            const res = await apiRequest.post("/auth/login", {
                username,
                password,
            });

            const { userlook, userstatus } = res.data;

            // Kiểm tra trạng thái tài khoản
            if (userlook === "khoa") {
                alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.");
                //setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.");
                return;
            }

            if (userstatus === "choduyet") {
                //setError("Tài khoản của bạn đang chờ được duyệt. Vui lòng quay lại sau.");
                alert("Tài khoản của bạn đang chờ được duyệt. Vui lòng quay lại sau.");
                return;
            }

            // Nếu không bị khóa và được duyệt, cập nhật người dùng và điều hướng
            updateUser(res.data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="formContainer">
                <form onSubmit={handleSubmit} className="loginForm">
                    <h1>Chào mừng trở lại</h1>

                    <label htmlFor="username">
                        Tên người dùng <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        name="username"
                        type="text"
                        placeholder="Nhập tên người dùng"
                        onInput={handleInput}
                    />
                    {errors.username && <span className="inputError"style={{color: "red"}}>{errors.username}</span>}

                    <label htmlFor="password">
                        Mật khẩu <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        onInput={handleInput}
                    />
                    {errors.password && <span className="inputError" style={{color: "red"}}>{errors.password}</span>}

                    <Link to="/forgot-password" className="forgotLink">
                        Quên mật khẩu?
                    </Link>

                    <button disabled={isLoading} className="submitButton">
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                    {error && <span className="errorMessage">{error}</span>}

                    <div className="registerRedirect">
                        Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </div>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="Login Illustration" />
            </div>
        </div>
    );
}

export default Login;
