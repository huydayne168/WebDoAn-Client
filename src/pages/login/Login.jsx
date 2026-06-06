import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../until/userContext';
import "./Login.css";

const Login = () => {

  const { updateUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username.trim())) {
      setMessage('Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        email: username,
        mat_khau: password,
      });

      if (response.data && response.data.user) {

        const user = response.data.user;
        updateUser({ id: user.id_tai_khoan, name: user.ten_nguoi_dung, username: user.email });
        alert(`Xin chào ${user.ten_nguoi_dung}!`);
        navigate('/');

      } else {
        setMessage('Thông tin tài khoản hoặc mật khẩu không chính xác!');
      }
      
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra trong quá trình đăng nhập.');
    }
  };

  return (
    <div className="modal-form auth-page">
      <div className="form-login">
        <h2 className="login__heading">Đăng nhập</h2>
        {/* <p className="login__text">
          Nếu đã từng mua hàng trên Website trước đây, bạn có thể dùng tính năng{' '}
          <a href="#">"Lấy mật khẩu"</a> để có thể truy cập vào tài khoản bằng email nhé.
        </p> */}

        <input
          type="text"
          id="username"
          placeholder="Email/SĐT của bạn"
          className="login__input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          id="password"
          placeholder="Mật khẩu"
          className="login__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p style={{ marginBottom: '15px', color: 'red' }} className="login__message">{message}</p>}

        <div className="btn btn--login" onClick={handleLogin}>
          Đăng nhập
        </div>

        <div className="login-separate">
          <span></span>
          Hoặc
          <span></span>
        </div>
        {/* <div className="btn btn--fb">
          <p>Đăng nhập với Facebook</p>
          <img src="https://n7media.coolmate.me/image/September2023/mceclip0_86.png?aio=w-26" alt="" />
        </div>
        <div className="btn btn--google">
          <p>Đăng nhập với Google</p>
          <img src="https://n7media.coolmate.me/image/September2023/mceclip1_21.png?aio=w-26" alt="" />
        </div> */}

        <div className="form-option">
          <Link to="/DangKy">
            <span className="form-option__login">Đăng ký tài khoản mới</span>
          </Link>
          <span>Quên mật khẩu</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
