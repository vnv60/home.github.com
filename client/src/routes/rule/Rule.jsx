// JSX Component for Rules
import React from 'react';
import './Rule.scss';
import Footer from '../../components/Footer/footer';

const Rules = () => {
    return (
        <div className='pageContainer'>
            <div className="rules-container">
            <h1 className="rules-title">Chào mừng bạn đến với Home Estate!</h1>
            <p>
                Để đảm bảo một môi trường giao dịch an toàn, tiện lợi và hiệu quả, chúng tôi xin đề nghị bạn tuân thủ các quy định sử dụng sau:
            </p>

            <div className="rule-section">
                <h2>1 - Đăng ký và sử dụng tài khoản:</h2>
                <ul>
                    <li>Người dùng phải đăng ký tài khoản cá nhân trước khi đăng tin, tìm kiếm và giao dịch bất động sản trên Home Estate.</li>
                    <li>Mỗi người dùng chỉ được phép đăng ký và sử dụng một tài khoản.</li>
                    <li>Người dùng phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản.</li>
                    <li>Tài khoản và mật khẩu đăng nhập là trách nhiệm của người dùng và không được phép chia sẻ, mượn hoặc cho thuê cho người khác.</li>
                </ul>
            </div>

            <div className="rule-section">
                <h2>2 - Đăng tin bất động sản:</h2>
                <ul>
                    <li>Tin đăng phải liên quan đến bất động sản và tuân thủ các quy định của pháp luật Việt Nam.</li>
                    <li>Mô tả bất động sản phải chính xác, rõ ràng, không lừa đảo, lạm dụng hoặc gây nhầm lẫn.</li>
                    <li>Hình ảnh đăng tin phải thể hiện rõ ràng bất động sản và không vi phạm bản quyền, quyền riêng tư hoặc pháp luật.</li>
                    <li>Không đăng tin quảng cáo, spam, tin đồn hoặc thông tin không chính xác.</li>
                    <li>Không sử dụng ngôn ngữ thiếu văn hóa, xúc phạm, kích động hoặc phân biệt đối xử.</li>
                </ul>
            </div>

            <div className="rule-section">
                <h2>3 - Giao dịch và liên lạc:</h2>
                <ul>
                    <li>Giao dịch và liên lạc giữa người mua, người bán, người cho thuê và người thuê phải diễn ra trên tinh thần hợp tác, thân thiện và tôn trọng.</li>
                    <li>Không gây áp lực, lừa đảo hoặc gây thiệt hại cho bên kia trong quá trình giao dịch.</li>
                    <li>Không sử dụng thông tin liên lạc của người dùng để gửi tin nhắn rác, quảng cáo hoặc vi phạm quyền riêng tư của người dùng.</li>
                </ul>
            </div>

            <div className="rule-section">
                <h2>4 - Bảo mật thông tin:</h2>
                <ul>
                    <li>Home Estate cam kết bảo vệ thông tin cá nhân của người dùng theo Chính sách bảo mật công bố trên trang website.</li>
                    <li>Người dùng không được phép chia sẻ, sử dụng hoặc tiết lộ thông tin cá nhân của người dùng khác mà không được sự đồng ý của họ.</li>
                    <li>Người dùng phải bảo vệ thông tin đăng nhập và mật khẩu của mình, tránh để lộ hoặc cung cấp cho người khác.</li>
                </ul>
            </div>

            <div className="rule-section">
                <h2>5 - Trách nhiệm của người dùng:</h2>
                <ul>
                    <li>Người dùng có trách nhiệm đảm bảo tính chính xác, hợp pháp và trung thực của nội dung đăng tin và thông tin cá nhân.</li>
                    <li>Người dùng phải chịu trách nhiệm về mọi hành vi, giao dịch và kết quả phát sinh từ việc sử dụng tài khoản của mình.</li>
                    <li>Người dùng có trách nhiệm báo cáo cho Home Estate nếu phát hiện hành vi vi phạm quy định sử dụng hoặc pháp luật.</li>
                </ul>
            </div>

            <div className="rule-section">
                <h2>6 - Quyền và trách nhiệm của Home Estate:</h2>
                <ul>
                    <li>Home Estate có quyền kiểm duyệt, sửa đổi, từ chối hoặc xóa bất kỳ tin đăng nào vi phạm quy định sử dụng hoặc pháp luật mà không cần thông báo trước.</li>
                    <li>Home Estate có quyền cấm, khóa hoặc xóa tài khoản của người dùng nếu phát hiện hành vi vi phạm quy định sử dụng hoặc pháp luật.</li>
                    <li>Home Estate không chịu trách nhiệm về nội dung đăng tin, thông tin cá nhân và hành vi của người dùng trên trang web, cũng như kết quả của các giao dịch giữa người dùng.</li>
                    <li>Home Estate không chịu trách nhiệm về mọi thiệt hại, tổn thất hoặc khiếu nại phát sinh từ việc sử dụng trang web, dịch vụ và thông tin trên Home Estate.</li>
                </ul>
            </div>

            <p>
                Khi sử dụng Home Estate, bạn đồng ý tuân thủ và chấp hành các quy định sử dụng trên. Chúng tôi mong bạn có những trải nghiệm tuyệt vời và thành công trong việc tìm kiếm, đăng tin và liên lạc bất động sản tại Home Estate.
            </p>
        </div>
        <Footer/>
        </div>
    );
};

export default Rules;
