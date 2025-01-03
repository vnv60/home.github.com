import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./quanly.scss";

import apiRequest from "../../lib/apiRequest";
import Footer from "../../components/Footer/footer";

const SingleUser = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    property: "",
    bedroom: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      // Gọi API để lấy danh sách bài viết của người dùng
      const postsRes = await apiRequest.get(`/posts/user/${id}`, {
        params: filters, // Gửi bộ lọc qua query string
      });

      // Lọc các bài viết chỉ thỏa mãn điều kiện user.id === post.id
      const filteredPosts = postsRes.data.filter((post) => post.userId === id);
      setPosts(filteredPosts);

      // Gọi API để lấy thông tin người dùng
      const userRes = await apiRequest.get(`/users/search/${id}`);
      setUser(userRes.data);
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [id, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchUserPosts();
  };

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng</div>;

  return (
    <div className="single-user">
      <div className="user-header">
        <img
          src={user.avatar || "/images/default-avatar.png"}
          alt={user.username || "Tên người dùng"}
          className="user-avatar"
        />
        <div className="user-details">
          <h2>{user.username || "Chưa cập nhật tên"}</h2>
          <p>Email: {user.email || "Chưa cập nhật"}</p>
          <p>Địa chỉ: {user.address || "Chưa cập nhật"}</p>
          <p>Thông tin: {user.info || "Chưa cập nhật"}</p>

          <button
            className="phone-button"
            onClick={() => alert(`Số điện thoại: ${user.phone || "Không khả dụng"}`)}
          >
            Xem số điện thoại
          </button>
        </div>
      </div>

      

      <div className="user-posts">
        <h3>Bài viết của {user.username || "người dùng"}</h3>
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <Link to={`/${post.id}`}>
                  <img
                    src={post.images[0] || "/images/default-post.png"}
                    alt={post.title || "Bài viết"}
                    className="post-image"
                  />
                  <h4>{post.title}</h4>
                  <p>Giá: {post.price} VND</p>
                  <p>Địa chỉ: {post.address || "Chưa cập nhật"}</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div>Không có bài viết nào phù hợp.</div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default SingleUser;
