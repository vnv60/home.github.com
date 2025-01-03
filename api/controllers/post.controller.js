import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";




// Lấy danh sách bài đăng của một người dùng
export const getUserPosts = async (req, res) => {
  const userId = req.params.userId; // Lấy userId từ tham số URL
  const tokenUserId = req.userId; // Lấy userId từ token đã được middleware xử lý
  const tokenUserRole = req.userRole; // Lấy userRole từ token

  try {
    // Kiểm tra quyền truy cập: Người dùng chỉ được phép xem bài đăng của chính mình
    if (userId !== tokenUserId && tokenUserRole !== "quantri" ) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập danh sách bài đăng của người dùng này!" });
    }

    // Điều kiện lọc bài đăng
    let whereConditions = {
      userId: userId, // Chỉ lọc các bài đăng của user có id trùng khớp
    };

    // Nếu không phải admin/manager, lọc bài đăng đã bị khóa hoặc đang chờ duyệt
    if (tokenUserRole !== "quantri" && tokenUserRole !== "quanly") {
      whereConditions = {
        ...whereConditions,
        NOT: {
          OR: [
            { status: "choduyet" }, // Loại bỏ các bài đăng đang chờ duyệt
          ],
        },
      };
    }

    // Lấy danh sách bài đăng từ Prisma
    const posts = await prisma.post.findMany({
      where: whereConditions,
      orderBy: { createdAt: "desc" },
      include: {
        postDetail: true,
        savedPosts: true, // Để hiển thị thông tin bài viết đã được lưu
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Lỗi tìm nạp bài viết của người dùng:", err);
    res.status(500).json({ message: "Không thể lấy danh sách bài đăng của người dùng", error: err.message });
  }
};

export const getFilterPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
        // Loại bỏ các trường hợp có look = "khoa" và status = "choduyet"
        NOT: {
          OR: [
            
            { status: "choduyet" }
          ]
        }
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Không thể nhận được bài viết" });
  }
};


export const getPosts = async (req, res) => {
  const query = req.query;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Parse and validate query parameters
    const bedroom = query.bedroom ? parseInt(query.bedroom) : undefined;
    const minPrice = query.minPrice ? parseInt(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : undefined;

    let whereConditions = {
      city: query.city || undefined,
      type: query.type || undefined,
      property: query.property || undefined,
      bedroom: bedroom !== NaN ? bedroom : undefined,
      price: {
        ...(minPrice !== NaN && { gte: minPrice }),
        ...(maxPrice !== NaN && { lte: maxPrice }),
      },
    };

    // Role-based filtering
    if (tokenUserRole === 'quantri') {
      // quantri can see all posts, no additional filtering
    } else if (['nguoidung', 'quanly'].includes(tokenUserRole)) {
      // For nguoidung and quanly, exclude locked or pending posts
      whereConditions = {
        ...whereConditions,
        NOT: {
          OR: [
            { look: "khoa" },
            { status: "choduyet" },
          ],
        },
      };
    }

    // Fetch posts
    const posts = await prisma.post.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' }, // Optional: Order by most recent
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Lỗi tìm nạp bài viết:", err);
    res.status(500).json({ message: "Không thể nhận được bài viết", error: err.message });
  }
};




export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    let userId;
    const token= req.cookies?.token;
    if(!token) {
      userId =null;
    }else{
      jwt.verify(token, process.env.JWT_SECRET_KEY,async(err,payload)=>{
        if(err) {
          userId = null;
        }else{
          userId = payload.id;
        }
      })
    }

    const saved= await prisma.savedPost.findUnique({
      where: {
        userId_postId:{
          postId:id,
          userId,
        }
      }
    })
    
    res.status(200).json({ ...post, isSaved: saved ? true : false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Không thể nhận được bài viết" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        status: body.postData?.status || "choduyet", // Gán giá trị mặc định nếu không có
        look: body.postData?.look || "khongkhoa", // Gán giá trị mặc định nếu không có
        buystatus: body.postData?.buystatus || "raoban", // Gán giá trị mặc định nếu không có
        rentstatus: body.postData?.rentstatus || "raoban", // Gán giá trị mặc định nếu không có
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Tạo bài đăng không thành công" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // First, check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check if the user is authorized to update the post
    if (post.userId !== tokenUserId && !["quantri", "quanly"].includes(tokenUserRole)) {
      return res.status(403).json({ message: "Không được phép!" });
    }

    // Check if the update includes status change
    if (body.postData?.status && post.userId !== tokenUserId) {
      if (!["quantri", "quanly"].includes(tokenUserRole)) {
        return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái bài đăng!" });
      }

      if (!["choduyet", "duyet"].includes(body.postData.status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
      }
    }

    

    // Update the post and its details
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...body.postData,
        postDetail: {
          update: body.postDetail,
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Cập nhật bài đăng không thành công" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    // First, check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check user authorization
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Không được phép! Bạn chỉ có thể xóa bài đăng của chính mình" });
    }

    // Delete related records first (if necessary)
    // For example, if there are related saved posts or post details
    await prisma.savedPost.deleteMany({
      where: { postId: id }
    });

    await prisma.postDetail.deleteMany({
      where: { postId: id }
    });

    // Then delete the main post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Bài đăng đã xóa thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể xóa bài đăng", error: err.message });
  }
};


export const updatePostStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body; // Expecting status in the request body
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check if the user is authorized to update the status
    if (post.userId !== tokenUserId && !["quantri", "quanly"].includes(tokenUserRole)) {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái bài đăng!" });
    }

    // Validate the new status
    if (!["choduyet", "duyet"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Update the post status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái bài đăng không thành công" });
  }
};

// buyStatus

export const updatePostBuyStatus = async (req, res) => {
  const id = req.params.id;
  const { buystatus } = req.body; // Expecting status in the request body
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check if the user is authorized to update the status
    if (post.userId !== tokenUserId && !["quantri", "quanly"].includes(tokenUserRole)) {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái bài đăng!" });
    }

    // Validate the new status
    if (!["raoban", "danggiaodich", "daban"].includes(buystatus)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Update the post status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        buystatus,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái bài đăng không thành công" });
  }
};

// rentStatus

export const updatePostRentStatus = async (req, res) => {
  const id = req.params.id;
  const { rentstatus } = req.body; // Expecting status in the request body
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check if the user is authorized to update the status
    if (post.userId !== tokenUserId && !["quantri", "quanly"].includes(tokenUserRole)) {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái bài đăng!" });
    }

    // Validate the new status
    if (!["raoban", "danggiaodich", "dachothue"].includes(rentstatus)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Update the post status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        rentstatus,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái bài đăng không thành công" });
  }
};


export const updatePostLook = async (req, res) => {
  const id = req.params.id;
  const { look } = req.body; // Expecting "khoa" or "khongkhoa" in the request body
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check if the user is authorized to update the look field
    if (post.userId !== tokenUserId && tokenUserRole !== "quantri") {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái khóa bài đăng!" });
    }

    // Validate the new look value
    if (!["khoa", "khongkhoa"].includes(look)) {
      return res.status(400).json({ message: "Giá trị khóa không hợp lệ!" });
    }

    // Update the post's look field
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        look,
      },
    });

    res.status(200).json({ message: `Bài đăng đã được ${look === "khoa" ? "khóa" : "mở khóa"} thành công!`, updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái khóa không thành công", error: err.message });
  }
};


export const updatePostBuyRentStatus = async (req, res) => {
  const id = req.params.id;
  const { type, status } = req.body; // Expecting type (buy/rent) and status in the request body
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole; // Assuming userRole is added via middleware

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Check if the user is authorized to update the status
    if (post.userId !== tokenUserId && !["quantri", "quanly"].includes(tokenUserRole)) {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái bài đăng!" });
    }

    // Validate the type and status
    if (type === "buy") {
      if (!["raoban", "danggiaodich", "daban"].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ cho loại Mua!" });
      }
    } else if (type === "rent") {
      if (!["raoban", "danggiaodich", "dachothue"].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ cho loại Thuê!" });
      }
    } else {
      return res.status(400).json({ message: "Loại bài đăng không hợp lệ!" });
    }

    // Update the post status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: type === "buy" ? { buystatus: status } : { rentstatus: status },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái bài đăng không thành công" });
  }
};

