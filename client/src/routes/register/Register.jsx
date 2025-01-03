import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [role, setRole] = useState("nguoidung");
    const [address, setAddress] = useState("");
    const [acceptResponsibility, setAcceptResponsibility] = useState(false);
    const navigate = useNavigate();

    const validate = (formData) => {
        const newErrors = {};
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!username) newErrors.username = "Tên người dùng là bắt buộc.";
        if (!email) newErrors.email = "Email là bắt buộc.";
        if (!password) newErrors.password = "Mật khẩu là bắt buộc.";
        if (role === "quanly" && !address) newErrors.address = "Địa chỉ là bắt buộc.";
        if (role === "quanly" && !acceptResponsibility) {
            newErrors.acceptResponsibility = "Bạn cần đồng ý chịu trách nhiệm.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInput = (e) => {
        const { name } = e.target;
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        const formData = new FormData(e.target);
        if (!validate(formData)) {
            setIsLoading(false);
            return;
        }

        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await apiRequest.post("/auth/register", {
                username,
                email,
                password,
                role,
                ...(role === "quanly" && { address }),
            });
            alert("Đăng ký thành công! ");
            //setSuccessMessage("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Đã xảy ra lỗi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registerPage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Đăng ký tài khoản</h1>
                    <div className="item">
                        <label htmlFor="username">
                            Tên người dùng <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Nhập tên người dùng"
                            onInput={handleInput}
                        />
                        {errors.username && <span className="inputError"style={{color: "red"}}>{errors.username}</span>}
                    </div>
                    <div className="item">
                        <label htmlFor="email">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Nhập email"
                            onInput={handleInput}
                        />
                        {errors.email && <span className="inputError"style={{color: "red"}}>{errors.email}</span>}
                    </div>
                    <div className="item">
                        <label htmlFor="password">
                            Mật khẩu <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            onInput={handleInput}
                        />
                        {errors.password && <span className="inputError"style={{color: "red"}}>{errors.password}</span>}
                    </div>
                    <div className="roleSelection">
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="nguoidung"
                                checked={role === "nguoidung"}
                                onChange={() => setRole("nguoidung")}
                            />
                            Người dùng
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="quanly"
                                checked={role === "quanly"}
                                onChange={() => setRole("quanly")}
                            />
                            Quản lý
                        </label>
                    </div>
                    {role === "quanly" && (
                        <div className="item">
                            <label htmlFor="address">
                                Địa chỉ <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="Nhập địa chỉ"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    handleInput(e);
                                }}
                            />
                            {errors.address && <span className="inputError"style={{color: "red"}}>{errors.address}</span>}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={acceptResponsibility}
                                    onChange={(e) => {
                                        setAcceptResponsibility(e.target.checked);
                                        handleInput(e);
                                    }}
                                    name="acceptResponsibility"
                                />
                                
                                <div className="registerRedirects">
                                Tôi đồng ý chịu trách nhiệm về mọi hành vi của mình theo <Link to="/rule">Điều khoản quy định</Link>.
                                <span style={{ color: "red" }}>*</span>
                    </div>
                            </label>
                            {errors.acceptResponsibility && (
                                <span className="inputError"style={{color: "red"}}>{errors.acceptResponsibility}</span>
                            )}
                        </div>
                    )}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                    {error && <span className="error">{error}</span>}
                    {successMessage && <span className="success">{successMessage}</span>}
                    <div className="registerRedirect">
                        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </div>
                </form>
            </div>
            <div className="sideContainer">
                <img src="/bg.png" alt="Background" />
            </div>
        </div>
    );
}

export default Register;
