import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import FeaturedProperties from "../../components/card/FeaturedProperties";
import FeaturedUser from "../../components/card/FeaturedUser";
import Featured from "../../components/Featured/Featured";
import FeaturedRent from "../../components/card/FeaturedRent";
import Footer from "../../components/Footer/footer";
import FeaturedBuy from "../../components/card/FeaturedBuy";


function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="pageContainer">
      <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Tìm bất động sản và có được nơi mơ ước của bạn</h1>
          <p>
          Dịch vụ rao bán bất động sản trực tuyến ngày càng trở thành xu hướng phổ biến, giúp kết nối người mua và người bán một cách nhanh chóng và hiệu quả. Nhờ vào nền tảng kỹ thuật số, thông tin về bất động sản, như vị trí, giá cả, và tình trạng pháp lý, được công khai minh bạch, tạo điều kiện cho các bên dễ dàng đưa ra quyết định.
          </p>
          <SearchBar />


          
          {/*
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Số năm kinh nghiệm</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Giải thưởng đạt được</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Bất động sản hiện có</h2>
            </div>
          </div>
          */}
        </div>
      </div>

      


      {/* Phần Bất Động Sản Nổi Bật */}

      <FeaturedRent />

      <FeaturedBuy />

      <FeaturedProperties />

      <Featured />

     {/* 
      <FeaturedUser />
     */}
      
      
      

    </div>
    <Footer />
    </div>
  );
}

export default HomePage;
