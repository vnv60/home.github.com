import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";




export const getUserStats = async (req, res) => {
  try {
    const { filter } = req.query; // Lấy filter từ query params (day, week, month, year)

    let startDate;
    const endDate = new Date(); // Ngày hiện tại

    // Xác định khoảng thời gian theo bộ lọc
    switch (filter) {
      case "day":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Đầu ngày hôm đó
        break;

      case "week":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // 7 ngày trước
        startDate.setHours(0, 0, 0, 0);
        break;

      case "month":
        startDate = new Date();
        startDate.setDate(1); // Ngày đầu tiên của tháng
        startDate.setHours(0, 0, 0, 0);
        break;

      case "year":
        startDate = new Date();
        startDate.setMonth(0, 1); // Ngày đầu tiên của năm
        startDate.setHours(0, 0, 0, 0);
        break;

      default:
        return res.status(400).json({ error: "Invalid filter value" });
    }

    // Truy vấn Prisma: lấy thống kê nhóm theo ngày
    const userStats = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        createdAt: {
          gte: startDate, // Thời gian bắt đầu
          lte: endDate,   // Thời gian kết thúc (hiện tại)
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Xử lý dữ liệu: định dạng createdAt cho dễ đọc
    const formattedData = userStats.map((stat) => ({
      date: new Date(stat.createdAt).toLocaleDateString(),
      count: stat._count.id,
    }));

    res.status(200).json({ userStats: formattedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getUsers = async (req, res) => {
  try {
    // Lấy toàn bộ danh sách người dùng
    const users = await prisma.user.findMany();

    // Trả về danh sách người dùng
    res.status(200).json({
      users,
      totalUsers: users.length, // Tổng số người dùng
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};




export const getUser = async (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL

  try {
    // Tìm người dùng với ID được cung cấp
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Loại bỏ mật khẩu trước khi trả về
    const { password, ...userInfo } = user;
    res.status(200).json(userInfo);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user!" });
  }
};


export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming this is added in the authentication middleware
  const { password, avatar,info, phone, ...inputs } = req.body;

  try {
    // Check if the user is updating their own profile or is an admin
    if (id !== tokenUserId && tokenUserRole !== 'quantri') {
      return res.status(403).json({ message: "Không được phép!" });
    }

    // Find the user to check their current role
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true } // Only select the role to minimize data retrieval
    });

    // Prevent non-admin users from changing an admin's role
    if (tokenUserRole !== 'quantri' && inputs.role && existingUser.role === 'quantri') {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi vai trò quản trị!" });
    }

    let updatedPassword = null;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
        ...(info && { info }),
        ...(phone && { phone }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Không cập nhật được người dùng!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming this is added in the authentication middleware

  try {
    // Check if the user is deleting their own profile or is an admin
    if (id !== tokenUserId && tokenUserRole !== 'quantri') {
      return res.status(403).json({ message: "Không được phép!" });
    }

    // Find the user to check their current role
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true } // Only select the role to minimize data retrieval
    });

    // Prevent non-admin users from deleting an admin user
    if (existingUser.role === 'quantri' && tokenUserRole !== 'quantri') {
      return res.status(403).json({ message: "Bạn không có quyền xóa tài khoản quản trị!" });
    }

    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Không thể xóa người dùng!" });
  }
};

// khóa tài khoản người dùng

export const updateUserLook = async (req, res) => {
  const id = req.params.id;
  const { userlook } = req.body; // Expecting "khoa" or "khongkhoa" in the request body
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Only admins can lock/unlock a user
    if (tokenUserRole !== "quantri") {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái khóa người dùng!" });
    }

    // Validate the new userlook value
    if (!["khoa", "khongkhoa"].includes(userlook)) {
      return res.status(400).json({ message: "Giá trị userlook không hợp lệ!" });
    }

    // Update the user's userlook field
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        userlook,
      },
    });

    res.status(200).json({
      message: `Người dùng đã được ${userlook === "khoa" ? "khóa" : "mở khóa"} thành công!`,
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái userlook không thành công", error: err.message });
  }
};

// duyệt người dùng

export const updateUserStatus = async (req, res) => {
  const id = req.params.id;
  const { userstatus } = req.body; // Giá trị userstatus từ yêu cầu
  const tokenUserRole = req.userRole; // Giả sử middleware đã thêm userRole vào req

  try {
    // Kiểm tra người dùng có tồn tại
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Kiểm tra quyền: chỉ cho phép role "quantri" thay đổi trạng thái
    if (tokenUserRole !== "quantri") {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái userstatus!" });
    }

    // Kiểm tra giá trị userstatus có hợp lệ không
    if (!["choduyet", "duyet"].includes(userstatus)) {
      return res.status(400).json({ message: "Trạng thái userstatus không hợp lệ!" });
    }

    // Cập nhật trạng thái userstatus
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        userstatus,
      },
    });

    res.status(200).json({
      message: `Trạng thái của người dùng đã được cập nhật thành công: ${userstatus}`,
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Cập nhật trạng thái userstatus không thành công", 
      error: err.message 
    });
  }
};




// lưu bài đăng
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    // Kiểm tra xem bài viết đã được lưu chưa
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      // Xóa bài viết khỏi danh sách lưu nếu đã tồn tại
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      return res.status(200).json({ message: "Post removed from saved list" });
    } else {
      // Thêm bài viết vào danh sách lưu nếu chưa tồn tại
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      return res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to save or unsave post." });
  }
};


export const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};


// phân quyền tài khoản người dùng

export const updateUserRole = async (req, res) => {
  const id = req.params.id;
  const { role } = req.body; // Expecting "khoa" or "khongkhoa" in the request body
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Only admins can lock/unlock a user
    if (tokenUserRole !== "quantri") {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái quyền người dùng!" });
    }

    // Validate the new userlook value
    if (!["nguoidung", "quanly", "quantri"].includes(role)) {
      return res.status(400).json({ message: "Giá trị userlook không hợp lệ!" });
    }

    // Update the user's userlook field
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
      },
    });

    res.status(200).json({
      message: `Người dùng đã được phân quyền thành công!`,
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái phân quyền không thành công", error: err.message });
  }
};
