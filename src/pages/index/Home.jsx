/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from "react";
import Silde from "../../components/slider/silde";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AddProduct from "../../until/cart";
import { useUser } from "../../until/userContext";
import "./Home.css";

export default function Home() {
    AddProduct();
    const [categoryProducts, setCategoryProducts] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [copiedCode, setCopiedCode] = useState(null);
    const [coupons, setCoupons] = useState([]);

    const handleCopyCoupon = (code) => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(code).catch(() => {});
        }
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleSaveCoupon = (coupon) => {
        console.log("đã click");
        if (!user) {
            console.log("ko lưu đk");
            toast.error(`Hãy đăng nhập để lưu mã giảm giá!`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            if (coupon.remaining_count === 0) {
                toast.error(`Mã giảm giá này đã hết số lượng!`, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }
            const savedCoupons =
                JSON.parse(localStorage.getItem("coupons")) || [];
            const isSaved = savedCoupons.some(
                (savedCoupon) =>
                    String(savedCoupon.coupon_name) ===
                        String(coupon.coupon_name) &&
                    String(savedCoupon.id_user) === String(user.id),
            );

            if (isSaved) {
                toast.info(`Mã giảm giá "${coupon.coupon_name}" đã được lưu trước đó!`, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            savedCoupons.push({ ...coupon, id_user: user.id });
            localStorage.setItem("coupons", JSON.stringify(savedCoupons));
            toast.success(`Mã giảm giá "${coupon.coupon_name}" đã được lưu!`, {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const loadData = async () => {
        const [productsResponse, categoriesResponse, vouchersResponse] = await Promise.all([
            axios.get("/api/getallsp"),
            axios.get("/api/getalldm"),
            axios.get("/api/getallvoucher"),
        ]);

        const products = Array.isArray(productsResponse.data)
            ? productsResponse.data
            : [];
        const categories = Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : [];
        const vouchers = Array.isArray(vouchersResponse.data)
            ? vouchersResponse.data
            : [];

        const groupedTopFive = categories
            .map((category) => {
                const items = products
                    .filter(
                        (product) =>
                            String(product.ma_danh_muc) ===
                            String(category.ma_danh_muc),
                    )
                    .slice(0, 5);

                return {
                    ma_danh_muc: category.ma_danh_muc,
                    ten_danh_muc: category.ten_danh_muc,
                    items,
                };
            })
            .filter((group) => group.items.length > 0);

        setCategoryProducts(groupedTopFive);
        setCoupons(vouchers);
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(number);
    };

    const getDiscountPercent = (product) => {
        const originalPrice = Number(product.gia_goc || 0);
        const salePrice = Number(product.gia || 0);

        if (!originalPrice || !salePrice || originalPrice <= salePrice) {
            return 0;
        }

        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    };

    const formatDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString("vi-VN");
    };

    return (
        <Fragment>
            <div className="main home-page">
                <Silde />

                <section className="section discount">
                    <h2 className="title">Mã giảm giá hôm nay</h2>

                    <div className="couponsGrid">
                        {coupons.map((coupon) => (
                            <div key={coupon.id_voucher || coupon.coupon_name} className="couponCard">
                                <div className="couponCode">
                                    <span>{coupon.coupon_name}</span>
                                    <button
                                        className={`copyButton ${
                                            copiedCode === coupon.coupon_name
                                                ? "copied"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleCopyCoupon(coupon.coupon_name)
                                        }
                                    >
                                        {copiedCode === coupon.coupon_name
                                            ? "Đã copy"
                                            : "Copy"}
                                    </button>
                                </div>

                                <p className="couponDescription">
                                    {coupon.description}
                                </p>

                                <div className="couponFooter">
                                    <span className="remainingCount">
                                        Còn {coupon.remaining_count}
                                    </span>
                                    <span className="expiryDate">
                                        Hết {formatDate(coupon.expiry_date)}
                                    </span>
                                </div>

                                <button
                                    className="saveButton"
                                    onClick={() => handleSaveCoupon(coupon)}
                                    disabled={coupon.remaining_count === 0}
                                >
                                    Lưu mã
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
                <section id="homepage-search" className="homepage-search">
                    <div className="container-medium">
                        <div className="homepage-search-wrapper">
                            <h2 className="homepage-search-heading">
                                {" "}
                                Bạn tìm gì hôm nay?{" "}
                            </h2>
                            <div className="homepage-search-inner">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const q = (keyword || "").trim();
                                        if (q)
                                            navigate(
                                                `/product?search=${encodeURIComponent(
                                                    q,
                                                )}&page=1`,
                                            );
                                        else navigate(`/product?page=1`);
                                    }}
                                >
                                    <input
                                        id="homepage-search-input"
                                        type="text"
                                        name="keyword"
                                        value={keyword}
                                        onChange={(e) =>
                                            setKeyword(e.target.value)
                                        }
                                        placeholder="Hãy thử bắt đầu với gà rán ?"
                                        className="homepage-search-control"
                                    />
                                    <button
                                        type="submit"
                                        className="homepage-search-submit"
                                    >
                                        <i className="fa-solid fa-magnifying-glass fa-2xl"></i>
                                    </button>
                                </form>
                            </div>
                            <div className="homepage-search-content">
                                <p className="home-search-description">
                                    {" "}
                                    Từ khóa nổi bật ngày hôm nay
                                </p>
                                <div className="homepage-search-buttons">
                                    <Link
                                        to="/product?search=G%C3%A0%20r%C3%A1n&page=1"
                                        className="homepage-search-button"
                                    >
                                        Gà rán
                                    </Link>
                                    <Link
                                        to="/product?search=Pizza&page=1"
                                        className="homepage-search-button"
                                    >
                                        Pizza
                                    </Link>
                                    <Link
                                        to="/product?search=M%E1%BB%B3%20%C3%BD&page=1"
                                        className="homepage-search-button"
                                    >
                                        Mỳ ý
                                    </Link>
                                    <Link
                                        to="/product?search=Hamburger&page=1"
                                        className="homepage-search-button"
                                    >
                                        Hamburger
                                    </Link>
                                    <Link
                                        to="/product?search=N%C6%B0%E1%BB%9Bc%20cam&page=1"
                                        className="homepage-search-button"
                                    >
                                        Nước cam
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="container1">
                        {categoryProducts.map((group) => (
                            <div
                                key={group.ma_danh_muc}
                                className="product-type"
                                style={{ marginBottom: "24px" }}
                            >
                                <h3
                                    style={{ marginBottom: "12px" }}
                                    className="homepage-product__heading"
                                >
                                    {group.ten_danh_muc}
                                </h3>
                                <div className="row">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.ma_san_pham}
                                            className="col p-2-4"
                                        >
                                            <div
                                                id={`${item.ma_san_pham}`}
                                                className="product"
                                            >
                                                <div
                                                    className="product-img-wrap"
                                                    style={{
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <Link
                                                        to={`/detail/${item.ma_san_pham}`}
                                                        className="product-img product-img--small"
                                                    >
                                                        <img
                                                            className="product-img-1"
                                                            src={
                                                                item.anh_sanpham
                                                            }
                                                            alt=""
                                                        />
                                                        <img
                                                            className="product-img-2"
                                                            src={item.anhhover1}
                                                            alt=""
                                                        />
                                                    </Link>
                                                    <div className="product-size">
                                                        
                                                        <div className="btn btn--size">
                                                            Thêm vào giỏ hàng
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-grid__reviews">
                                                    <div className="reviews-rating">
                                                        <div className="reviews-rating__vote">
                                                            5.0
                                                        </div>
                                                        <div className="reviews-rating__star"></div>
                                                        <div className="reviews-rating__number">
                                                            {item.total_quantity
                                                                ? `(${item.total_quantity})`
                                                                : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-content">
                                                    <div
                                                        style={{
                                                            display: "none",
                                                        }}
                                                        className="product-content__option "
                                                    >
                                                        <div className="product-content__option-item-wrap active">
                                                            <span
                                                                data={
                                                                    item.mau_sac
                                                                }
                                                            ></span>
                                                        </div>
                                                    </div>
                                                    <a className="product-name">
                                                        {item.ten_san_pham}
                                                    </a>
                                                    <div className="product-price-wrap">
                                                        <div className="product-price">
                                                            {formatCurrency(
                                                                item.gia,
                                                            )}
                                                        </div>
                                                        {Number(item.gia_goc) >
                                                            Number(item.gia) && (
                                                            <div className="product-original-price">
                                                                {formatCurrency(
                                                                    item.gia_goc,
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="product-discount">
                                                        {item.thongbao}
                                                    </div>
                                                    {getDiscountPercent(item) > 0 && (
                                                        <div className="sale-tag product-tag">
                                                            -{getDiscountPercent(item)}%
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="homepage-basic">
                    <div className="homepage-basic__wrapper">
                        <div className="homepage-basic__content">
                            <h2>Đặt đồ ăn nhanh nhận ngàn ưu đãi</h2>

                            <a href="#" className="btn-primary">
                                {" "}
                                Mua ngay
                            </a>
                        </div>
                        <div className="homepage-basic__image">
                            <a href="#">
                                <picture style={{ width: "100%" }}>
                                    <img
                                        style={{ width: "100%" }}
                                        src="../Images/voucher.jpg"
                                        alt=""
                                    />
                                </picture>
                            </a>
                        </div>
                    </div>
                </section>

                <section className="homepage-promo">
                    <div className="promoContainer">
                        <div className="content">
                            <h2 className="title">
                                Đặt đồ ăn nhanh
                                <br />
                                Nhận ngàn ưu đãi
                            </h2>

                            <p className="description">
                                Thỏa mãn mọi cơn đói với những món ăn tươi ngon,
                                bổ dưỡng. Phục vụ nhanh chóng với ưu đãi tuyệt
                                vời mỗi ngày.
                            </p>

                            <button className="button">Mua ngay →</button>

                            <div className="statsGrid">
                                <div className="stat">
                                    <span className="statNumber">5M+</span>
                                    <span className="statLabel">
                                        Khách hàng
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="statNumber">24/7</span>
                                    <span className="statLabel">Dịch vụ</span>
                                </div>
                                <div className="stat">
                                    <span className="statNumber">30 min</span>
                                    <span className="statLabel">Giao hàng</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: "6rem", textAlign: "center" }}>
                            🍗
                        </div>
                    </div>
                </section>

                <section className="homepage-hashtag">
                    <div className="container--full">
                        <div className="homepage-hashtag__inner">
                            <p className="homepage-hashtag__left">
                                Các món ăn nhanh ngon miệng, tiện lợi, từ gà rán
                                giòn rụm đến mì Ý chuẩn vị!
                                <br />
                                Phục vụ nhanh chóng – Hơn 5 triệu khách hàng đã
                                đặt và yêu thích!
                            </p>
                            <p className="homepage-hashtag__title">
                                #DoAnNhanh
                            </p>
                            <p className="homepage-hashtag__right">
                                Đặt món dễ dàng chỉ với vài cú click
                                <br />
                                Thỏa mãn mọi cơn đói với gà rán, pizza, mì Ý,
                                burger và nhiều món khác
                            </p>
                        </div>
                    </div>
                </section>

                <section className="homepage-service">
                    <div className="container--full">
                        <div className="homepage-service__grid">
                            <div className="homepage-service__item">
                                <div className="infomation-card">
                                    <a href="#" className="infomation-card">
                                        <div className="infomation-card__thumbnail">
                                            <img
                                                src="../Images/bepranga.jpg"
                                                alt=""
                                            />
                                        </div>
                                        <div className="infomation-card__buttons">
                                            <span className="infomation-card__title">
                                                Câu chuyện về chúng tôi{" "}
                                            </span>
                                            <span className="infomation-card__button">
                                                <i className="fa-solid fa-arrow-up fa-rotate-45"></i>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="homepage-service__item">
                                <div className="infomation-card">
                                    <a href="#" className="infomation-card">
                                        <div className="infomation-card__thumbnail">
                                            <img
                                                src="../Images/dichvuhailong100.png"
                                                alt=""
                                            />
                                        </div>
                                        <div className="infomation-card__buttons">
                                            <span className="infomation-card__title">
                                                Dịch vụ hài lòng 100%{" "}
                                            </span>
                                            <span className="infomation-card__button">
                                                <i className="fa-solid fa-arrow-up fa-rotate-45"></i>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="homepage-service__list">
                            <div className="homepage-service__card">
                                <p className="homepage-service__text">
                                    Giao hàng tận nơi
                                    <br />
                                    nhanh chóng chỉ trong 30 phút
                                </p>
                            </div>
                            <div className="homepage-service__card">
                                <p className="homepage-service__text">
                                    Thực đơn đa dạng
                                    <br />
                                    gà rán, mì Ý, pizza, burger...
                                </p>
                            </div>
                            <div className="homepage-service__card">
                                <p className="homepage-service__text">
                                    Ưu đãi hấp dẫn
                                    <br />
                                    freeship và giảm giá hằng ngày
                                </p>
                            </div>
                            <div className="homepage-service__card">
                                <p className="homepage-service__text">
                                    Nguyên liệu đảm bảo
                                    <br />
                                    an toàn & chất lượng cao
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Fragment>
    );
}
