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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const nextErrors = {};
    const nameValue = formData.tenNguoiDung.trim();
    const phoneValue = formData.sdt.trim();
    const emailValue = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const vietnamPhoneRegex = /^0(3|5|7|8|9)\d{8}$/;

    if (!nameValue) {
      nextErrors.tenNguoiDung = "Vui lòng nhập tên của bạn.";
    } else if (nameValue.length < 2) {
      nextErrors.tenNguoiDung = "Tên phải có ít nhất 2 ký tự.";
    }

    if (!phoneValue) {
      nextErrors.sdt = "Vui lòng nhập số điện thoại.";
    } else if (!vietnamPhoneRegex.test(phoneValue)) {
      nextErrors.sdt = "Số điện thoại Việt Nam phải gồm 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09.";
    }

    if (!emailValue) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(emailValue)) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (!formData.matKhau) {
      nextErrors.matKhau = "Vui lòng nhập mật khẩu.";
    } else if (formData.matKhau.length < 6) {
      nextErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự.";
    } else if (/\s/.test(formData.matKhau)) {
      nextErrors.matKhau = "Mật khẩu không được chứa khoảng trắng.";
    }

    if (!formData.nhapLaiMatKhau) {
      nextErrors.nhapLaiMatKhau = "Vui lòng nhập lại mật khẩu.";
    } else if (formData.matKhau !== formData.nhapLaiMatKhau) {
      nextErrors.nhapLaiMatKhau = "Mật khẩu và nhập lại mật khẩu không khớp.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
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
        ten_nguoi_dung: formData.tenNguoiDung.trim(),
        mat_khau: formData.matKhau,
        email: formData.email.trim(),
        sdt: formData.sdt.trim(),
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
      setErrors({ otp: "Vui lòng nhập mã OTP gồm 6 số." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/register/verify-otp', {
        email: formData.email.trim(),
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
            autoComplete="name"
          />
          {errors.tenNguoiDung && <p className="auth-field-error">{errors.tenNguoiDung}</p>}
          <input
            type="tel"
            placeholder="SĐT của bạn"
            className="login__input"
            name="sdt"
            value={formData.sdt}
            onChange={handleChange}
            disabled={isOtpSent}
            inputMode="tel"
            autoComplete="tel"
          />
          {errors.sdt && <p className="auth-field-error">{errors.sdt}</p>}
          <input
            type="email"
            placeholder="Email của bạn"
            className="login__input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isOtpSent}
            autoComplete="email"
          />
          {errors.email && <p className="auth-field-error">{errors.email}</p>}
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="login__input"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
              disabled={isOtpSent}
              autoComplete="new-password"
            />
            <i
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          {errors.matKhau && <p className="auth-field-error">{errors.matKhau}</p>}
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="login__input"
              name="nhapLaiMatKhau"
              value={formData.nhapLaiMatKhau}
              onChange={handleChange}
              disabled={isOtpSent}
              autoComplete="new-password"
            />
            <i
              className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={toggleConfirmPasswordVisibility}
            ></i>
          </div>
          {errors.nhapLaiMatKhau && <p className="auth-field-error">{errors.nhapLaiMatKhau}</p>}
          {isOtpSent && (
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Nhập mã OTP 6 số"
              className="login__input"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setErrors((prev) => ({ ...prev, otp: "" }));
              }}
            />
          )}
          {errors.otp && <p className="auth-field-error">{errors.otp}</p>}
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
