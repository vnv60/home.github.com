import React, { useState, useEffect, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./adminPage.scss";
import * as XLSX from "xlsx";


import { Bar,Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Statistics from "../../components/chart/Dashboard";
import UserStatsChart from "../../components/chart/UserStatsChart";
import Dashboard from "./Dashboard";
import UserStatsChartLine from "../../components/chart/UserStatsChartLine";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminPage() {

  
  const [stats, setStats] = useState({ userCount: 0, postCount: 0 });
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("thongke");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "nguoidung",
    address: "",
  });
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [error, setError] = useState("");

  
  

  // Phân trang
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!currentUser || currentUser.role !== "quantri") {
      navigate("/");
      return;
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser?.role === "quantri") {
      if (selectedTab === "thongke") {
        fetchUsers();
        fetchPosts();
      } else if (selectedTab === "nguoidung") {
        fetchUsers();
      } else if (selectedTab === "baidang") {
        fetchPosts();
      }
    }
  }, [selectedTab, currentUser]);

  const fetchStatistics = async () => {
  try {
    const userRes = await apiRequest.get("/users");
    const postRes = await apiRequest.get("/posts");

    const posts = postRes.data;

    

    setStats({
      userCount: userRes.data.users.length,
      postCount: posts.length,
     
    });
  } catch (err) {
    console.error("Fetch error:", err);
  }
};


  const fetchUsers = async () => {
    try {
      const res = await apiRequest.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await apiRequest.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const paginateData = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  

  

  
  
  


  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái lưu từ khóa tìm kiếm

const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};

// Lọc bài đăng dựa trên từ khóa

const [postApprovalFilter, setPostApprovalFilter] = useState(""); 
const [postPropertyFilter, setPostPropertyFilter] = useState(""); // Trạng thái duyệt

// Lọc bài đăng dựa trên từ khóa và bộ lọc trạng thái duyệt
const filteredPosts = posts.filter((post) => {
  const matchesSearchTerm =
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.address.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesApprovalFilter =
    postApprovalFilter === "" || post.type === postApprovalFilter;

    const matchesPropertyFilter =
    postPropertyFilter === "" || post.property === postPropertyFilter;

  return matchesSearchTerm && matchesApprovalFilter && matchesPropertyFilter;
});


const [searchTermUser, setSearchTermUser] = useState("");
const handleSearchUser = (e) => {
  setSearchTermUser(e.target.value);
};

// Lọc người dùng dựa trên từ khóa
const [userLockFilter, setUserLockFilter] = useState(""); // Lọc trạng thái khóa
const [userApprovalFilter, setUserApprovalFilter] = useState(""); // Lọc trạng thái duyệt

// Lọc người dùng dựa trên từ khóa và bộ lọc
const filteredUsers = users.filter((user) => {
  const matchesSearchTerm =
    user.username.toLowerCase().includes(searchTermUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTermUser.toLowerCase()) ||
    user.userstatus.toLowerCase().includes(searchTermUser.toLowerCase()) ||
    user.userlook.toLowerCase().includes(searchTermUser.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTermUser.toLowerCase());

  const matchesLockFilter =
    userLockFilter === "" || user.userlook === userLockFilter;

  const matchesApprovalFilter =
    userApprovalFilter === "" || user.userstatus === userApprovalFilter;

  return matchesSearchTerm && matchesLockFilter && matchesApprovalFilter;
});



// khóa người dùng

const handleToggleUserLock = async (userId, currentLook) => {
  const isLocking = currentLook === "khongkhoa";
  const confirmationMessage = isLocking
    ? "Bạn có chắc chắn muốn hủy khóa người dùng này?"
    : "Bạn có chắc chắn muốn khóa người dùng này?";

  if (!window.confirm(confirmationMessage)) return;

  try {
    const res = await apiRequest.patch(`/users/search/${userId}`, {
      userlook: isLocking ? "khoa" : "khongkhoa",
    });

    alert(res.data.message); // Hiển thị thông báo từ server
    fetchUsers(); // Tải lại danh sách người dùng sau khi cập nhật
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message ||
      "Đã xảy ra lỗi khi thay đổi trạng thái khóa của người dùng."
    );
  }
};
// thong ke xuat bai dang
const [loading, setLoading] = useState(false);
const exportToExcels = async () => {
  try {
    setLoading(true);

    const [postsResponse, usersResponse] = await Promise.all([
      apiRequest.get("/posts"),
      apiRequest.get("/users"),
    ]);

    const postsData = postsResponse.data;
    const usersData = usersResponse.data.users;

    const postsSheet = XLSX.utils.json_to_sheet(postsData);
    const usersSheet = XLSX.utils.json_to_sheet(usersData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, postsSheet, "Bài Đăng");
    XLSX.utils.book_append_sheet(workbook, usersSheet, "Người Dùng");

    XLSX.writeFile(workbook, "Danh sách người dùng và bài đăng.xlsx");
    alert("Xuất file Excel thành công!");
  } catch (error) {
    console.error("Lỗi khi xuất file Excel:", error);
    alert("Xuất file Excel thất bại!");
  } finally {
    setLoading(false);
  }
};

const [viewMode, setViewMode] = useState("chart"); // "chart" hoặc "user"

const handleViewModeChange = (event) => {
  setViewMode(event.target.value);
};
  // Nếu không phải admin thì không được truy cập
  if (!currentUser || currentUser.role !== 'quantri') {
    return null;
  }


  return (
    <div className="adminPage">
      <div className="adminSidebar">
          <Link to={"/profile/admin/dashboard"}>
            <button
              onClick={() => setSelectedTab("trangdieukhien")}
              className={selectedTab === "trangdieukhien" ? "active" : ""}
            >
              Bảng điều khiển 
            </button>
          </Link>
          <Link to={"/profile/admin"}>
            <button
              onClick={() => setSelectedTab("thongke")}
              className={selectedTab === "thongke" ? "active" : ""}
            >
              Thống kê
            </button>
          </Link>
          <Link to={"/profile/admin/user"}>
            <button
              onClick={() => setSelectedTab("nguoidung")}
              className={selectedTab === "nguoidung" ? "active" : ""}
            >
              Người dùng
            </button>
          </Link>
          <Link to={"/profile/admin/post"}>
            <button
              onClick={() => setSelectedTab("baidang")}
              className={selectedTab === "baidang" ? "active" : ""}
            >
              Bài đăng
            </button>
          </Link>
          <Link to={"/profile/admin/profile"}>
            <button
              onClick={() => setSelectedTab("thongtincanhan")}
              className={selectedTab === "thongtincanhan" ? "active" : ""}
            >
              Thông tin cá nhân
            </button>
          </Link>

          
</div>
      <div className="adminContent">
      {selectedTab === "trangdieukhien" && (
        <Dashboard />
      )}
      {selectedTab === "thongke" && (
          <div className="statistics">
            <h2>Chế độ hiển thị</h2>
            <div className="viewModeToggle" >
              <label style={{ margin: "20px" }}>
                <input
                  type="radio"
                  value="chart"
                  checked={viewMode === "chart"}
                  onChange={handleViewModeChange}
                  style={{ marginRight: "5px" }}
                />
                Bảng biểu
              </label>
              <label style={{ margin: "20px" }}>
                <input
                  type="radio"
                  value="user"
                  checked={viewMode === "user"}
                  onChange={handleViewModeChange}
                  style={{ marginRight: "5px" }}
                />
                Người dùng
              </label>
              <label style={{ margin: "20px" }}>
                <input
                  type="radio"
                  value="posts"
                  checked={viewMode === "posts"}
                  onChange={() => setViewMode("posts")}
                  style={{ marginRight: "5px" }}
                />
                Bài đăng
              </label>
            </div>

            {viewMode === "chart" && (
              <div className="chartContainer">
                
                <Statistics />
                <UserStatsChart />
              </div>
            )}
             {viewMode === "user" &&(
              <div>
                <h2>Danh sách người dùng</h2>
                {/* Giữ nguyên mã hiển thị danh sách người dùng */}
                <div className="searchContainer">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo email, tên hoặc vai trò..."
                    value={searchTermUser}
                    onChange={handleSearchUser}
                    className="searchInput"
                  />
                  {/* (giữ nguyên bộ lọc và danh sách người dùng) */}
                  <div className="filterContainer">
                       <label>
                         Trạng thái khóa:
                         <select
                           value={userLockFilter}
                           onChange={(e) => setUserLockFilter(e.target.value)}
                         >
                           <option value="">Tất cả</option>
                           <option value="khoa">Khóa</option>
                           <option value="khongkhoa">Hủy khóa</option>
                         </select>
                       </label>
                       <label>
                         Trạng thái duyệt:
                         <select
                           value={userApprovalFilter}
                           onChange={(e) => setUserApprovalFilter(e.target.value)}
                         >
                           <option value="">Tất cả</option>
                           <option value="choduyet">Chờ duyệt</option>
                           <option value="daduyet">Đã duyệt</option>
                         </select>
                       </label>
                       <label>
                       <button 
                          onClick={exportToExcels} 
                          className="xuatfile "
                          disabled={!stats.userCount || !stats.postCount} // Vô hiệu hóa nút nếu không có dữ liệu
                        >
                          Xuất File 
                        </button>
                       </label>
                     </div>

                </div>
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên người dùng</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Trạng thái khóa</th>
                      <th>Trạng thái duyệt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginateData(filteredUsers, userPage).map((user, index) => (
                      <tr key={user.id}>
                        <td>{(userPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.userlook === "khoa" ? "Khóa" : "Không khóa"}</td>
                        <td>{user.userstatus === "duyet" ? "Duyệt" : "Chờ duyệt"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <button
                    disabled={userPage === 1}
                    onClick={() => setUserPage(userPage - 1)}
                  >
                    Trước
                  </button>
                  <span>Trang {userPage}</span>
                  <button
                    disabled={userPage * itemsPerPage >= filteredUsers.length}
                    onClick={() => setUserPage(userPage + 1)}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
            {viewMode === "posts" &&(
              <div>
                  <h2>Danh sách bài đăng</h2>
                  {/* Khung tìm kiếm */}
                  <div className="searchContainer">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tiêu đề hoặc địa chỉ..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="searchInput"
                    />
                    {/* (giữ nguyên bộ lọc và danh sách bài đăng) */}
                  <div className="filterContainer">
                       <label>
                         Loại:
                         <select
                           value={postApprovalFilter}
                           onChange={(e) => setPostApprovalFilter(e.target.value)}
                         >
                           <option value="">Tất cả</option>
                           <option value="buy">Mua</option>
                           <option value="rent">Thuê</option>
                         </select>
                       </label>
                       <label>
                         Bất động sản 
                         <select
                           value={postPropertyFilter}
                           onChange={(e) => setPostPropertyFilter(e.target.value)}
                         >
                           <option value="">Tất cả</option>
                           <option value="apartment">Căn hộ</option>
                           <option value="house">Nhà</option>
                           <option value="condo">Chung cư</option>
                           <option value="land">Đất</option>
                         </select>
                       </label>
                       <label>
                       <button 
                          onClick={exportToExcels} 
                          className="xuatfilePost "
                          disabled={!stats.userCount || !stats.postCount} // Vô hiệu hóa nút nếu không có dữ liệu
                        >
                          Xuất File 
                        </button>
                       </label>
                     </div>
                  </div>
                  
                  
              
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Địa chỉ</th>
                        {/*<th>Trạng thái</th>*/}
                        <th>Loại</th>
                        <th>Bất động sản</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(filteredPosts, postPage).map((post, index) => (
                        <tr key={post.id}>
                          <td>{(postPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{post.title}</td>
                          <td>{post.address}</td>
                          <td>{post.type=== "buy" ? "Mua" : "Thuê"}</td>
                          <td>
                            {(() => {
                              const propertyMap = {
                                apartment: "Căn hộ",
                                house: "Nhà",
                                condo: "Chung cư",
                                land: "Đất",
                              };
                              return propertyMap[post.property] || "Không xác định"; // "Không xác định" cho trường hợp không khớp
                            })()}
                          </td>
                          
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
              
                  <div className="pagination">
                    <button
                      disabled={postPage === 1}
                      onClick={() => setPostPage(postPage - 1)}
                    >
                      Trước
                    </button>
                    <span>Trang {postPage}</span>
                    <button
                      disabled={postPage * itemsPerPage >= filteredPosts.length}
                      onClick={() => setPostPage(postPage + 1)}
                    >
                      Sau
                    </button>
                  </div>
                </div>
            )
            }
          </div>
        )}
       

      </div>
      
    </div>
  );
}

export default AdminPage;
