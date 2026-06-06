/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import "./footer.css";

export default function Footer() {
  return (
    <Fragment>
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-top-left">
              <ul>
                <li className="footer-top-left__heading"><a href="">Thực đơn nổi bật</a></li>
                <li><a href="">Gà rán giòn cay</a></li>
                <li><a href="">Pizza phô mai</a></li>
                <li><a href="">Pizza hải sản</a></li>
                <li><a href="">Mì Ý sốt bò bằm</a></li>
                <li><a href="">Mì Ý hải sản</a></li>
                <li><a href="">Combo ăn trưa</a></li>
                <li><a href="">Combo gia đình</a></li>
                <li><a href="">Đồ uống & tráng miệng</a></li>
              </ul>
              <ul>
                <li className="footer-top-left__heading"><a href="">Dịch vụ khách hàng</a></li>
                <li><a href="">Hỏi đáp - FAQs</a></li>
                <li><a href="">Chính sách đổi trả</a></li>
                <li><a href="">Liên hệ hỗ trợ</a></li>
                <li><a href="">Đặt tiệc sinh nhật</a></li>
                <li><a href="">Ưu đãi hội viên</a></li>
                <li><a href="">Chính sách giao hàng</a></li>
                <li><a href="">Chính sách bảo mật</a></li>
                <li className="footer-top-left__heading mg-top30"><a href="">Tin tức & Ẩm thực</a></li>
                <li><a href="">Câu chuyện thương hiệu</a></li>
                <li><a href="">Blog ẩm thực</a></li>
                <li><a href="">Cộng đồng yêu đồ ăn nhanh</a></li>
              </ul>
              <ul>
                <li className="footer-top-left__heading"><a href="">Tài liệu - Tuyển dụng</a></li>
                <li><a href="">Hướng dẫn đặt món online</a></li>
                <li><a href="">Tuyển dụng nhân viên</a></li>
                <li className="footer-top-left__heading mg-top30"><a href="">Về Chúng Tôi</a></li>
                <li><a href="">Giới thiệu thương hiệu</a></li>
                <li><a href="">Gia nhập đội ngũ</a></li>
                <li><a href="">Hỗ trợ cộng đồng</a></li>
                <li><a href="">Hệ thống cửa hàng</a></li>
              </ul>
              <ul>
                <li className="footer-top-left__heading"><a href="">Địa chỉ liên hệ</a></li>
                <li><a href="">Chi nhánh Hà Nội: Số 123, Đường Láng</a></li>
                <li><a href="">Đống Đa, Hà Nội</a></li>
                <li><a href="">Chi nhánh TP.HCM: Số 456</a></li>
                <li><a href="">Nguyễn Trãi, Quận 5</a></li>
                <li><a href="">TP. Hồ Chí Minh</a></li>
              </ul>
            </div>

            <div className="footer-top-right">
              <h3 className="footer-top-right__heading">Chúng tôi luôn lắng nghe bạn!</h3>
              <p className="footer-top-right__content">
                Chúng tôi luôn trân trọng mọi ý kiến đóng góp để mang đến trải nghiệm thưởng thức gà rán, pizza và mì Ý ngon hơn mỗi ngày.
              </p>
              <div className="btn btn--feedback">Gửi Ý Kiến</div>
              <div className="footer-contact">
                <div className="footer-contact__icon">
                  <img src="../Images/icon-hotline.svg" alt="" />
                </div>
                <a href="">
                  <p className="footer-conttact__body">
                    Hotline: 1900 1234
                  </p>
                </a>
              </div>
              <div className="footer-contact">
                <div className="footer-contact__icon">
                  <img src="../Images/icon-email.svg" alt="" />
                </div>
                <a href="">
                  <p className="footer-conttact__body">
                    Email: support@fastfood.vn
                  </p>
                </a>
              </div>
              <div className="footer-society">
                <a href=""><img src="../Images/icon-facebook.svg" alt="" /></a>
                <a href=""><img src="../Images/icon-instar.svg" alt="" /></a>
                <a href=""><img src="../Images/icon-youtube.svg" alt="" /></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              @ CÔNG TY TNHH FASTFOOD VIỆT NAM  
              Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 20/02/2019.
            </p>
            <div className="footer-certificate">
              <a href="">
                <img className="footer-certificate__img" src="../Images/handle_cert.png" alt="" />
              </a>
              <a href="">
                <img className="footer-certificate__img" src="../Images/dmca_protected_15_120.png" alt="" />
              </a>
              <a href="">
                <img className="footer-certificate__img" src="../Images/bep-info.png" alt="" />
              </a>
              <a href="">
                <img className="footer-certificate__img" src="../Images/logoSaleNoti.png" alt="" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}
