import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Payment from '../../until/detail';
import AddProduct from '../../until/cart';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../until/userContext';
import "./Details.css";

export default function Details() {
    Payment();
    AddProduct();
    const { user } = useUser();

    const [sanpham ,setData] = useState({});
    const [allsanPhamSoSanh, setallSanPhamSoSanh] = useState(null);
    const [sanPhamSoSanh, setSanPhamSoSanh] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [quantityError, setQuantityError] = useState("");
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState({
        totalReviews: 0,
        averageRating: 0,
    });
    const [reviewForm, setReviewForm] = useState({
        so_sao: 5,
        noi_dung: "",
    });
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    
    console.log(sanPhamSoSanh)


    const{ma_san_pham} = useParams();

    useEffect(()=>{
        axios.get(`/api/getsp/${ma_san_pham}`)
        .then((resp) => setData({...resp.data[0]}));
    },[ma_san_pham]);

    const loadReviews = useCallback(async () => {
        try {
            const response = await axios.get(
                `/api/reviews/product/${ma_san_pham}`,
            );
            setReviews(Array.isArray(response.data.reviews) ? response.data.reviews : []);
            setReviewSummary({
                totalReviews: Number(response.data.summary?.totalReviews || 0),
                averageRating: Number(response.data.summary?.averageRating || 0),
            });
        } catch (error) {
            setReviews([]);
            setReviewSummary({ totalReviews: 0, averageRating: 0 });
        }
    }, [ma_san_pham]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const productImages = useMemo(() => {
        const imageFields = Object.keys(sanpham)
            .filter((key) => /^anhhover\d*$/.test(key))
            .sort((a, b) => {
                const indexA = Number(a.replace("anhhover", "")) || 0;
                const indexB = Number(b.replace("anhhover", "")) || 0;
                return indexA - indexB;
            });

        return [sanpham.anh_sanpham, ...imageFields.map((key) => sanpham[key])]
            .filter((image) => typeof image === "string" && image.trim())
            .filter((image, index, images) => images.indexOf(image) === index);
    }, [sanpham]);

    const visibleProductImages = useMemo(
        () => productImages.slice(0, 2),
        [productImages],
    );

    useEffect(() => {
        setSelectedImage(productImages[0] || "");
    }, [productImages]);

    const remainingQuantity = Number(
        sanpham.so_luong ?? sanpham.soluong ?? sanpham.total_quantity ?? 0,
    );

    useEffect(() => {
        setQuantity(remainingQuantity > 0 ? 1 : 0);
        setQuantityError("");
    }, [ma_san_pham, remainingQuantity]);

    const handleQuantityChange = (value) => {
        const nextQuantity = Number(value);

        if (remainingQuantity <= 0) {
            setQuantity(0);
            setQuantityError("Món này đã hết hàng.");
            return;
        }

        if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
            setQuantity(1);
            setQuantityError("");
            return;
        }

        if (remainingQuantity > 0 && nextQuantity > remainingQuantity) {
            setQuantity(remainingQuantity);
            setQuantityError(
                `Chỉ còn ${remainingQuantity} món, bạn không thể chọn nhiều hơn.`,
            );
            return;
        }

        setQuantity(nextQuantity);
        setQuantityError("");
    };

    const increaseQuantity = () => {
        handleQuantityChange(quantity + 1);
    };

    const decreaseQuantity = () => {
        handleQuantityChange(quantity - 1);
    };

    const loadData = async() =>{
        const response = await axios.get("/api/getallsp");
        setallSanPhamSoSanh(response.data);
    };

    useEffect(()=>{
        loadData();
    },[]);


    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  

    const formatReviewDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString("vi-VN");
    };

    const renderStars = (rating) => {
        const currentRating = Number(rating || 0);
        return Array.from({ length: 5 }, (_, index) => (
            <i
                key={index}
                className={`fa-solid fa-star ${
                    index >= currentRating ? "disabled" : ""
                }`}
            ></i>
        ));
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        setReviewMessage("");

        if (!user) {
            setReviewMessage("Vui lòng đăng nhập để đánh giá sản phẩm.");
            return;
        }

        if (!reviewForm.noi_dung.trim()) {
            setReviewMessage("Vui lòng nhập nội dung đánh giá.");
            return;
        }

        setReviewSubmitting(true);

        try {
            await axios.post(
                `/api/reviews/product/${ma_san_pham}`,
                {
                    ma_tai_khoan: user.id,
                    ten_nguoi_dung: user.name || user.username || "Khách hàng",
                    so_sao: reviewForm.so_sao,
                    noi_dung: reviewForm.noi_dung,
                },
            );
            setReviewForm({ so_sao: 5, noi_dung: "" });
            setReviewMessage("Cảm ơn bạn đã đánh giá sản phẩm.");
            loadReviews();
        } catch (error) {
            setReviewMessage(
                error.response?.data || "Không thể gửi đánh giá, vui lòng thử lại.",
            );
        } finally {
            setReviewSubmitting(false);
        }
    };

  return (
    <Fragment>
        <main className="detail-page">
            <div class="container1">
            <div class="container-product-single">
                    <div class="imgs">
                        <div class="link-page">
                            <a href="./index.html" class="link-page__homepage">Trang chủ</a>
                            <span>/</span>
                            <a href="./product-detail.html" class="link-page__currentPage">Sản phẩm</a>
                        </div>
                        <div class="index-img">
                            {visibleProductImages.map((image) => (
                                <div
                                    key={image}
                                    className={`index-img__item ${
                                        selectedImage === image ? "active" : ""
                                    }`}
                                ></div>
                            ))}
                        </div>
                        <div class="product-single-img">
                            <img class="product-img__main" src={selectedImage} alt={sanpham.ten_san_pham || ""}/>
                            <div class="product-img__option">
                                {visibleProductImages.map((image, index) => (
                                    <div
                                        key={image}
                                        className={`product-img__option-item ${
                                            selectedImage === image ? "active" : ""
                                        }`}
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img
                                            src={image}
                                            alt={`${sanpham.ten_san_pham || "Sản phẩm"} ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <h1 class="content__heading">{sanpham.ten_san_pham}</h1>
                        <div class="review-rating">
                            <p class="review-label">
                                {reviewSummary.totalReviews > 0
                                    ? `${reviewSummary.averageRating} / 5 (${reviewSummary.totalReviews} đánh giá)`
                                    : "Chưa có đánh giá"}
                            </p>  
                                              
                        </div>

                        <p class="content__price">{formatCurrency(sanpham.gia)}</p>
                        {sanpham.gia_goc &&
                            Number(sanpham.gia_goc) > Number(sanpham.gia) && (
                                <p className="content__original-price">
                                    Giá gốc: {formatCurrency(sanpham.gia_goc)}
                                </p>
                            )}
                        <p className="content__stock">
                            Số lượng còn lại: <b>{remainingQuantity}</b>
                        </p>
                        <div class="content__discount">{sanpham.thongbao}</div>
                       
                        <div class="content__size">

                            <div class="product-single__actions">
                                <div class="quantity" data-stock={remainingQuantity}>
                                    
                                    <button class="btn-decrease" onClick={decreaseQuantity} type="button">-</button>
                                    <input
                                        className="quantity-input"
                                        type="number"
                                        min={remainingQuantity > 0 ? "1" : "0"}
                                        max={remainingQuantity || undefined}
                                        value={quantity}
                                        disabled={remainingQuantity <= 0}
                                        onChange={(event) =>
                                            handleQuantityChange(event.target.value)
                                        }
                                    />
                                    <button class="btn-increase" onClick={increaseQuantity} type="button">+</button>
                                </div>
                                <div
                                    class={`btn btn-addCart ${
                                        remainingQuantity <= 0 ? "is-disabled" : ""
                                    }`}
                                    data-stock={remainingQuantity}
                                    data-quantity={quantity}
                                >
                                    Thêm vào giỏ hàng
                                </div>
                            </div>
                            {quantityError && (
                                <p className="quantity-error">{quantityError}</p>
                            )}
                        </div>
                        <div class="product-single__policy">
                            <div class="product-policy__item">
                              <div class="product-policy__icon">
                                
                              </div>
                              <p>Đặt món cực nhanh chỉ với số điện thoại</p>
                            </div>
                            <div class="product-policy__item">
                              <div class="product-policy__icon">
                                
                              </div>
                              <p>Miễn phí giao hàng cho đơn trên 200k</p>
                            </div>
                            <div class="product-policy__item">
                              <div class="product-policy__icon">
                                
                              </div>
                              <p>Được đổi món khác nếu không vừa ý</p>
                            </div>
                            <div class="product-policy__item">
                              <div class="product-policy__icon">
                                
                              </div>
                              <p>Hotline 1900.xxx.xxx hỗ trợ 9h - 22h hàng ngày</p>
                            </div>
                            <div class="product-policy__item">
                              <div class="product-policy__icon">
                                
                              </div>
                              <p>Hoàn tiền 100% nếu món ăn bị hỏng/nguội</p>
                            </div>
                            <div class="product-policy__item">
                              <div class="product-policy__icon">
                                
                              </div>
                              <p>Giao hàng trong 30-45 phút (tùy khu vực)</p>
                            </div>
                          </div>
                    </div>
                </div>
<div className="feedback">
  <div className="review-title">
    <p className="quantity-review">{reviewSummary.totalReviews} Đánh giá</p>
    <div className="quantity-star">
      <span>{reviewSummary.averageRating || 0} / 5</span>
      <i className="fa-solid fa-star"></i>
    </div>
  </div>

  <form className="review-form" onSubmit={handleReviewSubmit}>
    <div className="review-form__header">
      <h3>Viết đánh giá của bạn</h3>
      <p>{user ? `Đang đánh giá với tên ${user.name}` : "Bạn cần đăng nhập để gửi đánh giá."}</p>
    </div>
    <div className="review-form__rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= Number(reviewForm.so_sao) ? "active" : ""}
          onClick={() =>
            setReviewForm((prev) => ({ ...prev, so_sao: star }))
          }
          aria-label={`${star} sao`}
        >
          <i className="fa-solid fa-star"></i>
        </button>
      ))}
    </div>
    <textarea
      value={reviewForm.noi_dung}
      onChange={(event) =>
        setReviewForm((prev) => ({
          ...prev,
          noi_dung: event.target.value,
        }))
      }
      placeholder="Món ăn này có ngon không? Giao hàng, đóng gói, khẩu vị thế nào?"
      rows="4"
      disabled={!user || reviewSubmitting}
    ></textarea>
    {reviewMessage && <p className="review-form__message">{reviewMessage}</p>}
    <button
      type="submit"
      className="review-form__submit"
      disabled={!user || reviewSubmitting}
    >
      {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
    </button>
  </form>

  <div className="feedback-content">
    {reviews.length === 0 ? (
      <div className="feedback-empty">
        Chưa có đánh giá nào cho sản phẩm này.
      </div>
    ) : (
      reviews.map((review) => (
        <div className="feedback-item" key={review.id_danh_gia}>
          <div className="feedback-item__rating">
            {renderStars(review.so_sao)}
          </div>
          <div className="feedback-item__body">
            <b className="feedback-userName">{review.ten_nguoi_dung}</b>
            <i className="feedback-product-type">{sanpham.ten_san_pham}</i>
            <p className="feedback-of-custom">{review.noi_dung}</p>
            <p className="feedback-time">{formatReviewDate(review.ngay_tao)}</p>
          </div>
        </div>
      ))
    )}
  </div>
</div>


            </div>
        </main>
    </Fragment>
  );
}
