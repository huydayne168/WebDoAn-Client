import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../until/userContext";
import { LoadData } from "../../until/cartactive";
import "./navbar.css";

export default function Navbar() {
    const { user, logoutUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const focusHomeSearch = () => {
        const searchSection = document.getElementById("homepage-search");
        const searchInput = document.getElementById("homepage-search-input");

        if (searchSection) {
            searchSection.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }

        if (searchInput) {
            window.setTimeout(() => searchInput.focus(), 300);
        }
    };

    const handleHeaderSearch = () => {
        if (location.pathname === "/") {
            focusHomeSearch();
            return;
        }

        navigate("/");
        window.setTimeout(focusHomeSearch, 120);
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/");
        var list = JSON.parse(localStorage.getItem("cart")) || [];
        list = [];
        localStorage.setItem("cart", JSON.stringify(list));
        LoadData();
    };
    return (
        <Fragment>
            <header className="site-header">
                <div className="topbar" style={{ display: "block" }}>
                    <span style={{ cursor: "pointer" }}>
                        Ưu đãi giảm 20% khi đặt comboo đồ ăn từ 200k{" "}
                    </span>
                    <Link to="/product" style={{ textDecoration: "none" }}>
                        {" "}
                        " Mua ngay "
                    </Link>
                </div>
                <div className="header">
                    <div className="header-inner">
                        <div className="header__logo">
                            <Link to="/">
                                <img
                                    src="../Images/logoquanan.png"
                                    alt="logo-coolmate"
                                />
                            </Link>
                        </div>
                        <div className="header__navbar hide-on-mobile-tablet">
                            <ul className="header__navbar-list">
                                <li className="header__navbar-item">
                                    <Link
                                        to="/product?page=1"
                                        className="header__navbar-link"
                                    >
                                        Menu
                                    </Link>
                                </li>

                                <li className="header__navbar-item navbar-item--about-coolmate">
                                    <Link
                                        to="/about"
                                        className="header__navbar-link"
                                    >
                                        Về chúng tôi{" "}
                                        <i
                                            className="fas fa-chevron-down"
                                            style={{ marginLeft: "4px" }}
                                        ></i>
                                    </Link>
                                    <div className="navbar-item--about-coolmate__menu-wrap">
                                        <div className="about-coolmate__menu-inner">
                                            <Link
                                                to="/"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    display: "block",
                                                }}
                                            >
                                                Ẩm Thực Gà & Món Âu
                                            </Link>
                                            <div className="row">
                                                <div className="col p-3">
                                                    <span
                                                        className="about-motorbike__menu-inner-item"
                                                        style={{
                                                            cursor: "pointer",
                                                            display: "block",
                                                        }}
                                                    >
                                                        <p className="about-motorbike__menu-item-name">
                                                            Món Gà Ngon
                                                        </p>
                                                        <p className="about-motorbike__menu-item-content">
                                                            Thưởng thức các món
                                                            gà hấp dẫn: gà rán
                                                            giòn tan, gà nướng
                                                            mật ong, gà sốt cay
                                                            Hàn Quốc.
                                                        </p>
                                                    </span>
                                                </div>
                                                <div className="col p-3">
                                                    <span
                                                        className="about-motorbike__menu-inner-item"
                                                        style={{
                                                            cursor: "pointer",
                                                            display: "block",
                                                        }}
                                                    >
                                                        <p className="about-motorbike__menu-item-name">
                                                            Pizza
                                                        </p>
                                                        <p className="about-motorbike__menu-item-content">
                                                            Đa dạng hương vị
                                                            pizza Ý: phô mai bốn
                                                            loại, hải sản, thịt
                                                            nguội và pizza gà
                                                            BBQ đặc biệt.
                                                        </p>
                                                    </span>
                                                </div>
                                                <div className="col p-3">
                                                    <span
                                                        className="about-motorbike__menu-inner-item"
                                                        style={{
                                                            cursor: "pointer",
                                                            display: "block",
                                                        }}
                                                    >
                                                        <p className="about-motorbike__menu-item-name">
                                                            Mì Ý
                                                        </p>
                                                        <p className="about-motorbike__menu-item-content">
                                                            Các loại pasta trứ
                                                            danh: spaghetti sốt
                                                            bò bằm, mì Ý hải
                                                            sản, fettuccine gà
                                                            sốt kem nấm.
                                                        </p>
                                                    </span>
                                                </div>
                                                <div className="col p-3">
                                                    <span
                                                        className="about-motorbike__menu-inner-item"
                                                        style={{
                                                            cursor: "pointer",
                                                            display: "block",
                                                        }}
                                                    >
                                                        <p className="about-motorbike__menu-item-name">
                                                            Combo Ưu Đãi
                                                        </p>
                                                        <p className="about-motorbike__menu-item-content">
                                                            Combo gà + pizza +
                                                            mì Ý dành cho gia
                                                            đình, tiệc sinh nhật
                                                            và những buổi tụ họp
                                                            bạn bè.
                                                        </p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                <li className="header__navbar-item">
                                    <Link
                                        to="/chatai"
                                        className="header__navbar-link"
                                    >
                                        AI Chat
                                    </Link>
                                </li>
                                <li className="header__navbar-item">
                                    <Link
                                        to="/promotion"
                                        className="header__navbar-link"
                                    >
                                        Khuyến Mãi Mới
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="header__actions">
                            <div className="header__actions-search">
                                <button
                                    type="button"
                                    className="header__actions-link"
                                    onClick={handleHeaderSearch}
                                    aria-label="Tìm kiếm"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                                </button>
                            </div>
                            <div className="header__actions-account">
                                <Link
                                    to="/DangNhap"
                                    className="header__actions-link"
                                >
                                    <i className="fa-solid fa-user fa-xl"></i>
                                </Link>
                                <div className="dropdown-menu">
                                    {/* Hiển thị thông tin người dùng hoặc "Tên tài khoản" nếu không có người dùng */}
                                    {user ? (
                                        <>
                                            <span
                                                className="dropdown-item"
                                                style={{
                                                    cursor: "pointer",
                                                    display: "block",
                                                }}
                                            >
                                                <i className="fas fa-user"></i>{" "}
                                                {user.name}
                                            </span>
                                            <Link
                                                to="/donhang"
                                                className="dropdown-item"
                                            >
                                                <i className="fas fa-shopping-bag"></i>{" "}
                                                Đơn hàng
                                            </Link>
                                            <button
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                    width: "100%",
                                                }}
                                            >
                                                <i className="fas fa-sign-out-alt"></i>{" "}
                                                Đăng xuất
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/DangNhap"
                                                className="dropdown-item"
                                            >
                                                <i className="fas fa-sign-in-alt"></i>{" "}
                                                Đăng nhập
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="header__actions-cart-icon">
                                <span className="header__actions-cart-notify">
                                    0
                                </span>
                                <Link
                                    to="/cart"
                                    className="header__actions-link"
                                >
                                    <i className="fa-solid fa-bag-shopping fa-xl"></i>
                                </Link>
                                <div className="mini-cart-wrap">
                                    <div className="mini-cart">
                                        <div className="mini-cart-head">
                                            <span>
                                                <span className="added-product"></span>{" "}
                                                sản phẩm
                                            </span>
                                            <Link to="/cart">Xem tất cả</Link>
                                        </div>
                                        <ul className="mini-cart__list"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="search" style={{ display: "none" }}>
                        <div className="search__inner">
                            <input
                                placeholder="Tìm kiếm sản phẩm..."
                                className="search__input"
                                type="text"
                            />
                            <img
                                className="search__img"
                                style={{ width: "20px" }}
                                src="/Images/icon-search.svg"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </header>
        </Fragment>
    );
}
