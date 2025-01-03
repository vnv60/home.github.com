import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";


// đăng ký
export const register = async (req, res) => {
  const { username, email, address, password, role, info, phone } = req.body;

  try {
    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine default userstatus based on role
    const userRole = role || "nguoidung"; // Default role is "nguoidung"
    const userStatus = userRole === "quanly" ? "choduyet" : "duyet"; // Set userstatus based on role

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        address,
        password: hashedPassword,
        role: userRole,
        phone,
        info,
        userstatus: userStatus, // Set the initial userstatus
      },
    });

    console.log(newUser);
    res.status(201).json({ message: "Tạo tài khoản thành công", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo tài khoản không thành công!", error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ!" });

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role, // Đưa role vào token để sử dụng khi cần phân quyền
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đăng nhập không thành công!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Đăng xuất thành công" });
};





export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Tìm người dùng theo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // Token có thời hạn 1 giờ
    );

    // Cấu hình Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu email
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Gửi email
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h1>Yêu cầu đặt lại mật khẩu</h1>
        <p>Chào ${user.username},</p>
        <p>Vui lòng nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
      `,
    });

    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình gửi email." });
  }
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu mới trong cơ sở dữ liệu
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};
