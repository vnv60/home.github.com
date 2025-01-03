import { useEffect, useState } from "react";
import List from "../../components/list/List";
import "./profilePage.scss";
import Chat from "../../components/chat/Chat";
import apiRequest from "../../lib/apiRequest";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Footer from "../../components/Footer/footer";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

   // State
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const postsPerPage = 10;


   useEffect(() => {
    if (currentUser?.role === "quantri") {
      navigate("/profile/admin");
    }
  }, [currentUser, navigate]);

  // Fetch bài viết của người dùng hiện tại
  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      //const postsRes = await apiRequest.get(`/posts/user/${currentUser.id}`);
      const postsRes = await apiRequest.get(`/posts`);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Lỗi lấy bài viết của người dùng:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentUser.id]);
  
  // Điều hướng nếu vai trò là "quantri"
  useEffect(() => {
    if (currentUser?.role === "quantri") {
      navigate("/profile/admin/dashboard");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleExport = async () => {
    try {
      const postResponse = await data.postResponse;
      const posts = postResponse.data.userPosts;

      if (!posts || posts.length === 0) {
        alert("Không có bài đăng để xuất!");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(posts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");
      XLSX.writeFile(workbook, "DanhSachBaiDang.xlsx");
    } catch (error) {
      console.error("Lỗi xuất file:", error);
      alert("Đã xảy ra lỗi khi xuất file Excel.");
    }
  };


  
    const [editingPost, setEditingPost] = useState(null);
  
    const handleStatusChange = async (post, newStatus) => {
      if (window.confirm(`Bạn có chắc muốn thay đổi trạng thái từ "${post.type === "buy" ? post.buystatus : post.rentstatus}" sang "${newStatus}"?`)) {
        try {
          const response = await apiRequest.patch(`/posts/type/${post.id}`, {
            type: post.type,
            status: newStatus,
          });
          alert("Cập nhật trạng thái thành công!");
          window.location.reload(); // Hoặc cập nhật lại danh sách bài viết
        } catch (err) {
          console.error("Lỗi cập nhật trạng thái:", err);
          alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
        }
      }
    };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  return (
    <div className="pageContainer">
      <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Thông tin người dùng</h1>
            <Link to="/profile/update">
              <button>Cập nhật hồ sơ</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Ảnh đại diện:
              <img src={currentUser.avatar || "noavatar.png"} alt="Avatar" />
            </span>
            <span>Tên người dùng: <b>{currentUser.username}</b></span>
            <span>E-mail: <b>{currentUser.email}</b></span>
            {currentUser.role === "quanly" && (
              <span>Địa chỉ: <b>{currentUser.address}</b></span>
            )}
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>

          {currentUser.role !== "nguoidung" && (
            <>
              <div className="title">
                <h1>Danh sách của tôi</h1>
                <Link to="/add">
                  <button>Tạo bài đăng</button>
                </Link>
                {/*
                <button onClick={handleExport} style={{ backgroundColor: "teal", color: "white" }}>
                  Xuất danh sách
                </button>
                 */}
              </div>

              <div className="searchContainer">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề hoặc địa chỉ..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="searchInput"
                />
              </div>

              <Suspense fallback={<p>Đang tải dữ liệu</p>}>
              <Await
                  resolve={data.postResponse}
                  errorElement={<p>Lỗi tải lên</p>}
                >
                  {(postResponse) => {
                    const posts = postResponse.data.userPosts;

                    // Lọc bài đăng theo điều kiện user.id === post.userId
                    const filteredByUser = posts.filter(
                      (post) => post.userId === currentUser.id
                    );

                    // Tiếp tục lọc bài đăng theo từ khóa tìm kiếm
                    const filteredPosts = filteredByUser.filter(
                      (post) =>
                        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.address.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    // Pagination logic
                    const indexOfLastPost = currentPage * postsPerPage;
                    const indexOfFirstPost = indexOfLastPost - postsPerPage;
                    const currentPosts = filteredPosts.slice(
                      indexOfFirstPost,
                      indexOfLastPost
                    );
                    const totalPages = Math.ceil(
                      filteredPosts.length / postsPerPage
                    );

                    return (
                      <div className="myPosts">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Tên</th>
                              <th>Địa chỉ</th>
                              <th>Trạng thái</th>
                              <th>Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentPosts.map((post, index) => (
                              <tr key={post.id}>
                                <td>{indexOfFirstPost + index + 1}</td>
                                <td>{post.title}</td>
                                <td className="address">{post.address}</td>
                                <td>
                                <select
                                  className={`selectStatus ${
                                    post.type === "buy" ? post.buystatus : post.rentstatus
                                  }`}
                                  value={post.type === "buy" ? post.buystatus : post.rentstatus}
                                  onChange={(e) => handleStatusChange(post, e.target.value)}
                                >
                                  {post.type === "buy" ? (
                                    <>
                                      <option value="raoban">Rao bán</option>
                                      <option value="danggiaodich">Đang giao dịch</option>
                                      <option value="daban">Đã bán</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="raoban">Rao bán</option>
                                      <option value="danggiaodich">Đang giao dịch</option>
                                      <option value="dachothue">Đã cho thuê</option>
                                    </>
                                  )}
                                </select>

                                </td>
                                <td>
                                  <Link to={`/profile/edit/${post.id}`}>
                                    <button className="edit">Chỉnh sửa</button>
                                  </Link>
                                  <button
                                    className="delete"
                                    onClick={async () => {
                                      if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
                                        try {
                                          await apiRequest.delete(`/posts/${post.id}`);
                                          alert("Xóa bài viết thành công!");
                                          navigate(0);
                                        } catch (err) {
                                          console.error("Lỗi xóa bài viết:", err);
                                          alert("Đã xảy ra lỗi khi xóa bài viết.");
                                        }
                                      }
                                    }}
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="pagination">
                          {[...Array(totalPages)].map((_, pageIndex) => (
                            <button
                              key={pageIndex}
                              onClick={() => setCurrentPage(pageIndex + 1)}
                              style={{
                                padding: "8px 16px",
                                margin: "5px",
                                backgroundColor:
                                  currentPage === pageIndex + 1 ? "#4caf50" : "#f4f4f4",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              {pageIndex + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                </Await>

              </Suspense>
            </>
          )}

          {currentUser.role !== "quanly" && (
            <>
              <div className="title">
                <h1>Danh sách yêu thích</h1>
              </div>
              <Suspense fallback={<p>Đang tải dữ liệu...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Lỗi tải lên</p>}
                >
                  {(postResponse) => <List posts={postResponse.data.savedPosts} />}
                </Await>
              </Suspense>
            </>
          )}
        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Đang tải dữ liệu...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Lỗi tải lên</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
      
    </div>
   
    </div>
  );
}

export default ProfilePage;
