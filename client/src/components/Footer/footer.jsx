import './footer.scss'



function Footer(){
  return (
    <footer className="footer">
        <div className="footer-section">
          <h4>CÔNG TY CỔ PHẦN TNHHMMTV HOME ESTATE VIỆT NAM</h4>
          <p>
            <i className="fas fa-map-marker-alt"></i>69/68 Đặng Thùy Trâm, P. 13, Q. Bình Thạnh, TP. HCM
          </p>
          <p>
            <i className="fas fa-phone"></i> (024) 3562 5939 - (024) 3562 5940
          </p>
          
        </div>

        <div className="footer-section">
          <h4>HƯỚNG DẪN</h4>
          <ul>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Báo giá và hỗ trợ</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a href="#">Góp ý báo lỗi</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>QUY ĐỊNH</h4>
          <ul>
            <li><a href="#">Quy định đăng tin</a></li>
            <li><a href="#">Quy chế hoạt động</a></li>
            <li><a href="#">Điều khoản thỏa thuận</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Giải quyết khiếu nại</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>ĐĂNG KÝ NHẬN TIN</h4>
          <div className="newsletter">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="newsletter-input"
            />
            <button className="newsletter-button">
              <i src="/search.png" className="fas fa-paper-plane">Gửi</i>
            </button>
          </div>
          <h4>QUỐC GIA & NGÔN NGỮ</h4>
          <select className="language-selector">
            <option value="vn">Việt Nam</option>
            <option value="en">English</option>
          </select>
        </div>
      </footer>
  )
}

export default Footer

