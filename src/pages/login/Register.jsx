import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    tenNguoiDung: '',
    sdt: '',
    email: '',
    matKhau: '',
    nhapLaiMatKhau: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!formData.tenNguoiDung || !formData.sdt || !formData.email || !formData.matKhau || !formData.nhapLaiMatKhau) {
      alert("Vui lòng nhập đầy đủ thông tin đăng ký.");
      return false;
    }

    if (formData.matKhau !== formData.nhapLaiMatKhau) {
      alert("Mật khẩu và nhập lại mật khẩu không khớp.");
      return false;
    }

    return true;
  };

  const sendOtp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/register/send-otp', {
        ten_nguoi_dung: formData.tenNguoiDung,
        mat_khau: formData.matKhau,
        email: formData.email,
        sdt: formData.sdt,
      });

      setIsOtpSent(true);
      alert(response.data?.message || "Mã OTP đã được gửi đến email của bạn.");
    } catch (error) {
      alert(error.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isOtpSent) {
      await sendOtp();
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      alert("Vui lòng nhập mã OTP gồm 6 số.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/register/verify-otp', {
        email: formData.email,
        otp: otp.trim(),
      });

      alert(response.data?.message || "Đăng ký tài khoản thành công!");
      setFormData({
        tenNguoiDung: '',
        sdt: '',
        email: '',
        matKhau: '',
        nhapLaiMatKhau: ''
      });
      setOtp('');
      setIsOtpSent(false);
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi trong quá trình xác thực OTP.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="modal-form auth-page register-page">
        <form className="form-login1" onSubmit={handleSubmit}>
          <h2 className="login__heading">Đăng kí tài khoản</h2>
          <p className="login__text">
            Nếu đã từng mua hàng trên Website trước đây, bạn có thể dùng tính năng{" "}
            <span>"Lấy mật khẩu"</span> để có thể truy cập vào tài khoản bằng email nhé.
          </p>
          <input
            type="text"
            placeholder="Tên của bạn"
            className="login__input"
            name="tenNguoiDung"
            value={formData.tenNguoiDung}
            onChange={handleChange}
            disabled={isOtpSent}
          />
          <input
            type="text"
            placeholder="SĐT của bạn"
            className="login__input"
            name="sdt"
            value={formData.sdt}
            onChange={handleChange}
            disabled={isOtpSent}
          />
          <input
            type="email"
            placeholder="Email của bạn"
            className="login__input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isOtpSent}
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="login__input"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
              disabled={isOtpSent}
            />
            <i
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="login__input"
              name="nhapLaiMatKhau"
              value={formData.nhapLaiMatKhau}
              onChange={handleChange}
              disabled={isOtpSent}
            />
            <i
              className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={toggleConfirmPasswordVisibility}
            ></i>
          </div>
          {isOtpSent && (
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Nhập mã OTP 6 số"
              className="login__input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          )}
          <button type="submit" className="btn btn--login1" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : isOtpSent ? "Xác thực OTP" : "Gửi mã OTP"}
          </button>
          {isOtpSent && (
            <button type="button" className="btn btn--login1" onClick={sendOtp} disabled={isLoading}>
              Gửi lại mã OTP
            </button>
          )}
          {/* <div className="login-separate">
            <span></span>
            Hoặc
            <span></span>
          </div> */}
          {/* <div className="btn btn--fb">
            <p>Đăng ký với Facebook</p>
            <img src="https://www.coolmate.me/images/facebook.svg" alt="Facebook" />
          </div>
          <div className="btn btn--google">
            <p>Đăng ký với Google</p>
            <img src="https://www.coolmate.me/images/google.svg" alt="Google" />
          </div> */}
          <div className="form-option">
            <Link to="/DangNhap">
              <span className="form-option__login1">Đăng nhập</span>
            </Link>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
