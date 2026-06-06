import React, { Fragment, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./silde.css";

const BANNER_SLIDES = [
    {
        image_url: "../Images/bannergaran1.jpg",
        title: "Gà rán nóng giòn",
        subtitle: "Combo hấp dẫn, giao nhanh trong 30 phút",
        link_url: "/product?page=1",
    },
    {
        image_url: "../Images/bannergaran2.jpg",
        title: "Bữa ngon cho cả nhà",
        subtitle: "Ưu đãi mỗi ngày cho các món bán chạy",
        link_url: "/product?page=1",
    },
    {
        image_url: "../Images/bannerhamburger1.jpg",
        title: "Burger đầy đặn",
        subtitle: "Thịt nướng thơm, rau tươi, sốt đậm vị",
        link_url: "/product?page=1",
    },
    {
        image_url: "../Images/bannerpiza1.jpg",
        title: "Pizza phô mai kéo sợi",
        subtitle: "Nướng mới mỗi ngày, topping phủ đầy",
        link_url: "/product?page=1",
    },
];

export default function Silde() {
    const [banners, setBanners] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const slides = useMemo(
        () => (banners.length > 0 ? banners : BANNER_SLIDES),
        [banners],
    );

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const response = await axios.get(
                    "/api/getactivebanner",
                );
                const activeBanners = Array.isArray(response.data)
                    ? response.data.filter((banner) => banner.image_url)
                    : [];
                setBanners(activeBanners);
            } catch (error) {
                console.error(error);
                setBanners([]);
            }
        };

        loadBanners();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        setActiveSlide(0);
    }, [slides.length]);

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    const goPrev = () => {
        setActiveSlide((current) =>
            current === 0 ? slides.length - 1 : current - 1,
        );
    };

    const goNext = () => {
        setActiveSlide((current) => (current + 1) % slides.length);
    };

    return (
        <Fragment>
            <section className="homepage-banner">
                <div className="banner-slide">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id_banner || slide.image_url}
                            className={`slide-panel ${
                                activeSlide === index ? "active" : ""
                            }`}
                        >
                            <img
                                className="slide-img"
                                src={slide.image_url}
                                alt={slide.title || "Banner"}
                            />
                            <div className="slide-overlay"></div>
                            <div className="slide-content">
                                <p className="slide-eyebrow">FastFood</p>
                                <h1>{slide.title || "Món ngon giao tận nơi"}</h1>
                                <p>
                                    {slide.subtitle ||
                                        "Đặt món nhanh, nhận ưu đãi mỗi ngày."}
                                </p>
                                <a
                                    className="slide-button"
                                    href={slide.link_url || "/product?page=1"}
                                >
                                    Mua ngay
                                </a>
                            </div>
                        </div>
                    ))}

                    <button
                        className="slide-nav slide-nav--prev"
                        type="button"
                        onClick={goPrev}
                        aria-label="Banner trước"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        className="slide-nav slide-nav--next"
                        type="button"
                        onClick={goNext}
                        aria-label="Banner tiếp theo"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    <div className="slide-dots">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id_banner || `${slide.image_url}-dot`}
                                className={activeSlide === index ? "active" : ""}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`Chọn banner ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </section>
        </Fragment>
    );
}
