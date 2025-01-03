import { useState, useEffect } from "react";
import "./adminEditPost.scss";
import apiRequest from "../../lib/apiRequest";
import { Link, useParams } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import ReactQuill from "react-quill";

function AdminEditPost() {
  const [postData, setPostData] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Thêm thông báo thành công
  const [images, setImages] = useState([]);

  const { id } = useParams();

  // Fetch post data when the component mounts
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        setPostData(res.data);
        setPostDetail(res.data.postDetail);
        setImages(res.data.images || []); 
      } catch (err) {
        console.log(err);
        setError("Không thể tải bài viết.");
      }
    };
    fetchPostData();
  }, [id]);

  const handleToggleApprovePost = async () => {
    const newStatus = postData.status === "duyet" ? "choduyet" : "duyet";
  const action = newStatus === "duyet" ? "Duyệt bài đăng" : "Hủy duyệt bài đăng";

  // Hiển thị hộp thoại xác nhận
  const isConfirmed = window.confirm(`Bạn có chắc chắn muốn ${action.toLowerCase()} này không?`);

  if (!isConfirmed) return; // Nếu không xác nhận, dừng lại
    try {
      const res = await apiRequest.patch(`/posts/${id}`, { status: newStatus });

      if (res.status === 200) {
        setPostData((prevData) => ({ ...prevData, status: newStatus }));
        setSuccessMessage(
          newStatus === "duyet" ? "Bài đăng đã được duyệt thành công!" : "Bài đăng đã được chuyển về chờ duyệt!"
        );
      } else {
        setError(res.data?.message || "Không thể cập nhật trạng thái bài đăng.");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  if (!postData || !postDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="updatePostPage">
      <div className="formContainer">
        <h1>Xem bài đăng</h1>
        <div className="wrapper">
          <form>
            <div className="item">
                          <label htmlFor="title">Tiêu đề</label>
                          <input id="title" name="title" type="text" defaultValue={postData.title} disabled />
                        </div>
                        <div className="item">
                          <label htmlFor="price">Giá</label>
                          <input id="price" name="price" type="number" defaultValue={postData.price} disabled />
                        </div>
                        <div className="item address">
                          <label htmlFor="address">Địa chỉ</label>
                          <input id="address" name="address" type="text" defaultValue={postData.address} disabled />
                        </div>
                        <div className="item description">
                          <label htmlFor="desc">Mô tả</label>
                          <ReactQuill
                                          theme="snow"
                                          
                                          value={postDetail.desc}
                                          disabled
                        />
                        </div>
                        <div className="item">
                          <label htmlFor="city">Thành phố</label>
                          <input id="city" name="city" type="text" defaultValue={postData.city} disabled />
                        </div>
                        <div className="item">
                          <label htmlFor="bedroom">Số phòng ngủ</label>
                          <input min={1} id="bedroom" name="bedroom" type="number" defaultValue={postData.bedroom} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="bathroom">Só phòng tắm</label>
                          <input min={1} id="bathroom" name="bathroom" type="number" defaultValue={postData.bathroom} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="latitude">Vĩ độ</label>
                          <input id="latitude" name="latitude" type="text" defaultValue={postData.latitude} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="longitude">Kinh độ</label>
                          <input id="longitude" name="longitude" type="text" defaultValue={postData.longitude} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="type">Loại</label>
                          <select name="type" defaultValue={postData.type} disabled>
                            <option value="rent">Thuê</option>
                            <option value="buy">Mua</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="property">Bất động sản</label>
                          <select name="property" defaultValue={postData.property} disabled>
                            <option value="apartment">Căn hộ</option>
                            <option value="house">Nhà</option>
                            <option value="condo">Chung cư</option>
                            <option value="land">Đất</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="utilities">Chính sách tiện ích</label>
                          <select name="utilities" defaultValue={postDetail.utilities} disabled>
                            <option value="owner">Chủ sở hữu chịu trách nhiệm</option>
                            <option value="tenant">Người thuê nhà có trách nhiệm</option>
                            <option value="shared">Chia sẻ</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="pet">Chính sách thú cưng</label>
                          <select name="pet" defaultValue={postDetail.pet} disabled>
                            <option value="allowed">Cho phép</option>
                            <option value="not-allowed">Không cho phép</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="income">Chính sách thu nhập</label>
                          <input id="income" name="income" type="text" defaultValue={postDetail.income} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="size">Tổng kích thước (m2)</label>
                          <input min={0} id="size" name="size" type="number" defaultValue={postDetail.size} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="school">Trường học</label>
                          <input min={0} id="school" name="school" type="number" defaultValue={postDetail.school} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="bus">Xe bus</label>
                          <input min={0} id="bus" name="bus" type="number" defaultValue={postDetail.bus} disabled/>
                        </div>
                        <div className="item">
                          <label htmlFor="restaurant">Nhà hàng</label>
                          <input min={0} id="restaurant" name="restaurant" type="number" defaultValue={postDetail.restaurant} disabled/>
                        </div>
                        <div className="item">
              <label htmlFor="maket">Chợ </label>
              <input min={0} id="maket" name="maket" type="number" defaultValue={postData.postDetail.maket}disabled/>
              
            </div>
            <div className="item">
              <label htmlFor="supermaket">Siêu thị </label>
              <input min={0} id="supermaket" name="supermaket" type="number" defaultValue={postData.postDetail.supermaket}disabled />
              
            </div>
            <div className="item">
              <label htmlFor="hospital">Bệnh viện </label>
              <input min={0} id="hospital" name="hospital" type="number" defaultValue={postData.postDetail.hospital} disabled/>
              
            </div>
          </form>
          {/* Nút duyệt/hủy duyệt */}
          <Link to="/profile/admin/post" className="profileAdmin">
                                  
          <button
            className="quaylai"
            
          >
            Quay lại 
          </button>
          </Link>

          {/*
          <button
            className="approveButton"
            onClick={handleToggleApprovePost}
          >
            {postData.status === "duyet" ? "Hủy duyệt" : "Duyệt"}
          </button>
          */}

          
          
          {/* Thông báo thành công */}
          {successMessage && <span className="success">{successMessage}</span>}

          {/* Thông báo lỗi */}
          {error && <span className="error">{error}</span>}
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="Uploaded" />
        ))}
        
          
        
      </div>
    </div>
  );
}

export default AdminEditPost;
