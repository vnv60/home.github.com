import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeaturedRent.scss";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";

const FeaturedBuy = ({ posts }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // State kiểm soát xem tất cả

  // Gọi API để lấy dữ liệu bài đăng
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await apiRequest.get(`/posts`); // Đường dẫn API
        // Lọc các bài đăng type="rent"
        const filteredProperties = res.data.filter((property) => property.type === "buy" && property.buystatus );
        setProperties(filteredProperties); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching properties:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  // Số lượng item hiển thị (8 nếu chưa nhấn "Xem tất cả")
  const displayedProperties = showAll ? properties : properties.slice(0, 4);

  return (
    <div className="featured-properties-rent">
      <h2 className="section-title">Dự án bất động sản cho mua </h2>
      <div className="property-cards">
        {displayedProperties.length > 0 ? (
          displayedProperties.map((property) => (
            <div className="property-card" key={property.id}>
              <Link to={`/${property.id}`} className="image-container">
                <img
                  src={property.images[0] || "/images/default.jpg"}
                  alt={property.title || "Dự án bất động sản"}
                />
              </Link>
              <div className="property-info">
              <span
                  className={`status-label ${
                    property.buystatus === "raoban"
                      ? "approved"
                      : property.buystatus === "danggiaodich"
                      ? "pending"
                      : "look"
                  }`}
                >
                  {property.buystatus === "raoban"
                    ? "Rao bán "
                    : property.buystatus === "danggiaodich"
                    ? "Đang giao dịch "
                    : "Đã bán "}
                </span>
                <h3>{property.title || "Tên dự án chưa cập nhật"}</h3>
                <p className="price">
                  Giá: {new Intl.NumberFormat("vi-VN").format(property.price)} VNĐ
                </p>
                <p>Thành phố: {property.city || "Không xác định"}</p>
              </div>
            </div>
          ))
        ) : (
          <div>Không có dự án nào để hiển thị</div>
        )}
      </div>

      {/* Nút "Xem tất cả" */}
      {properties.length > 4  && (
        <div className="show-all-button">
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedBuy;
