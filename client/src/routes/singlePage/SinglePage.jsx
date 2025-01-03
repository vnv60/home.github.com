import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Footer from "../../components/Footer/footer";


function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="pageContainer">
      <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                {post.type === "rent" && (
                  <div className="price">
                  <span> {new Intl.NumberFormat('vi-VN').format(post.price)} VNĐ/ tháng </span>
                </div> 
                  
                )}
                {post.type === "buy" && (
                  <div className="price">
                  <span> {new Intl.NumberFormat('vi-VN').format(post.price)} VNĐ</span>
                </div> 
                  
                )}
                   
              </div>
              <div className="user">
                <Link to={`/user/${post.userId}`}>
                  <img src={post.user.avatar} alt="" />
                  <span>{post.user.username}</span>
                </Link>
              </div>
            </div>
            
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            >
              
            </div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">Tổng quan</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Tiện ích</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Chủ sở hữu chịu trách nhiệm</p>
                ) : (
                  <p>Người thuê nhà có trách nhiệm</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Chính sách thú cưng</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Cho phép nuôi</p>
                ) : (
                  <p>Không cho phép nuôi</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText" 
              
              >
                <span>Chính sách thu nhập</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Kích cỡ</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} m2</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} Phòng ngủ</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} Phòng tắm</span>
            </div>
          </div>
          <p className="title">Địa điểm lân cận</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>Trường học</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + " km"
                    : post.postDetail.school + " m"}{" "}
                  
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus-stop.png" alt="" />
              <div className="featureText">
                <span>Trạm xe Bus</span>
                <p>
                  {post.postDetail.bus > 999
                    ? post.postDetail.bus / 1000 + " km"
                    : post.postDetail.bus + " m"}{" "}
                  
                </p>
                
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="" />
              <div className="featureText">
                <span>Nhà hàng</span>
                <p>
                  {post.postDetail.restaurant > 999
                    ? post.postDetail.restaurant / 1000 + " km"
                    : post.postDetail.restaurant + " m"}{" "}
                  
                </p>
                
              </div>
            </div>
            <div className="feature">
              <img src="/maket.png" alt="" />
              <div className="featureText">
                <span>Chợ </span>
                <p>
                  {post.postDetail.maket > 999
                    ? post.postDetail.maket / 1000 + " km"
                    : post.postDetail.maket + " m"}{" "}
                  
                </p>
                
              </div>
            </div>
            <div className="feature">
              <img src="/supermaket.png" alt="" />
              <div className="featureText">
                <span>Siêu thị  </span>
                <p>
                  {post.postDetail.supermaket > 999
                    ? post.postDetail.supermaket / 1000 + " km"
                    : post.postDetail.supermaket + " m"}{" "}
                  
                </p>
                
              </div>
            </div>
            <div className="feature">
              <img src="/hospital.png " alt="" />
              <div className="featureText">
                <span>Bệnh viện </span>
                <p>
                  {post.postDetail.hospital > 999
                    ? post.postDetail.hospital / 1000 + " km"
                    : post.postDetail.hospital + " m"}{" "}
                  
                </p>
                
              </div>
            </div>
          </div>
          <p className="title">Vị trí</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Gửi tin nhắn
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Đã lưu" : "Lưu"}
            </button>
          </div>
          
        </div>
        
      </div>
     
    </div>
    <Footer />
    </div>
    
  );
}

export default SinglePage;
