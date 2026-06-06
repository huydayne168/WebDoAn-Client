import { Fragment, useEffect, useMemo, useState } from "react";
import Productt from "../../until/layoutauto";
import useProductFilter from "../../until/fillter";
import { Link, useSearchParams } from "react-router-dom";
import AddProduct from "../../until/cart";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./Product.css";

export default function Product() {
    Productt();
    useProductFilter();
    AddProduct();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [priceRange, setPriceRange] = useState(() => ({
        minPrice: parseInt(searchParams.get("minPrice")) || 0,
        maxPrice: parseInt(searchParams.get("maxPrice")) || 999999999,
    }));
    const [searchTermid, setSearchTermid] = useState(
        searchParams.get("category") || "",
    );
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || "",
    );
    const [sortType, setSortType] = useState(
        searchParams.get("sort") || "newest",
    );

    const itemsPageSize = 10;

    const loadData = async () => {
        try {
            const response = await axios.get(
                "/api/getallsp",
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await axios.get(
                    "/api/getalldm",
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục", error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (!searchParams.has("page")) {
            setSearchParams((params) => {
                params.set("page", 1);
                return params;
            });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
        setSearchTermid(searchParams.get("category") || "");
        setPriceRange({
            minPrice: parseInt(searchParams.get("minPrice")) || 0,
            maxPrice: parseInt(searchParams.get("maxPrice")) || 999999999,
        });
        setSortType(searchParams.get("sort") || "newest");
    }, [searchParams]);

    const handlePageClick = (event) => {
        setSearchParams((params) => {
            params.set("page", event.selected + 1);
            return params;
        });
    };

    const handleSearchname = (e) => {
        const searchTermValue = e.target.value;
        setSearchTerm(searchTermValue);

        setSearchParams((params) => {
            if (searchTermValue) params.set("search", searchTermValue);
            else params.delete("search");
            params.set("page", 1);
            return params;
        });
    };

    const handleSearchtype = (searchTermidValue) => {
        setSearchTermid(searchTermidValue);

        setSearchParams((params) => {
            if (searchTermidValue) params.set("category", searchTermidValue);
            else params.delete("category");
            params.set("page", 1);
            return params;
        });
    };

    const handlePriceFilterChange = (minPrice, maxPrice) => {
        setPriceRange({ minPrice, maxPrice });
        setSearchParams((params) => {
            params.set("minPrice", minPrice);
            params.set("maxPrice", maxPrice);
            params.set("page", 1);
            return params;
        });
    };

    const handleSortChange = (value) => {
        setSortType(value);
        setSearchParams((params) => {
            if (value) params.set("sort", value);
            else params.delete("sort");
            params.set("page", 1);
            return params;
        });
    };

    const selectedCategoryLabel =
        categories.find(
            (item) => String(item.ma_danh_muc) === String(searchTermid),
        )?.ten_danh_muc || "Tất cả danh mục";

    const selectedSortLabel =
        {
            newest: "Mới nhất",
            bestSeller: "Bán chạy",
            priceAsc: "Giá thấp đến cao",
            priceDesc: "Giá cao đến thấp",
            discount: "% Giảm nhiều nhất",
        }[sortType] || "Sắp xếp";

    const getDiscountPercent = (product) => {
        const originalPrice = Number(product.gia_goc || 0);
        const salePrice = Number(product.gia || 0);

        if (!originalPrice || !salePrice || originalPrice <= salePrice) {
            return 0;
        }

        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    };

    const normalizeText = (str) =>
        String(str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");

    const categoryOptions = [
        { ma_danh_muc: "", ten_danh_muc: "Tất cả danh mục" },
        ...categories,
    ];

    const filteredProducts = useMemo(() => {
        const searchLower = normalizeText(searchTerm).trim().toLowerCase();

        const matchedProducts = products.filter((item) => {
            const matchesSearch =
                !searchLower ||
                normalizeText(item.ten_san_pham)
                    .toLowerCase()
                    .includes(searchLower);
            const matchesCategory =
                !searchTermid ||
                String(item.ma_danh_muc) === String(searchTermid);
            const price = Number(item.gia || 0);
            const matchesPrice =
                price >= Number(priceRange.minPrice) &&
                price <= Number(priceRange.maxPrice);
            return matchesSearch && matchesCategory && matchesPrice;
        });

        return matchedProducts.sort((a, b) => {
            if (sortType === "priceAsc")
                return Number(a.gia || 0) - Number(b.gia || 0);
            if (sortType === "priceDesc")
                return Number(b.gia || 0) - Number(a.gia || 0);
            if (sortType === "bestSeller")
                return Number(b.soluong || 0) - Number(a.soluong || 0);
            if (sortType === "discount")
                return getDiscountPercent(b) - getDiscountPercent(a);
            return Number(b.ma_san_pham || 0) - Number(a.ma_san_pham || 0);
        });
    }, [products, searchTerm, searchTermid, priceRange, sortType]);

    const currentPage = Number(searchParams.get("page") || 1);
    const pageCount = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPageSize),
    );
    const startIndex = (currentPage - 1) * itemsPageSize;
    const displayedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPageSize,
    );

    const formatCurrency = (number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(number);

    return (
        <Fragment>
            <div
                className="all-product-container product-page"
                style={{ paddingBottom: "30px" }}
            >
                <div className="filter">
                    <h2>Sản phẩm</h2>
                    <div className="filter-search">
                        <input
                            onChange={handleSearchname}
                            value={searchTerm}
                            placeholder="Tìm kiếm sản phẩm..."
                            type="text"
                        />
                    </div>

                    <div className="filter-size filter-item">
                        <div className="filter-item__inner">
                            <span>Mức giá</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            <li
                                onClick={() =>
                                    handlePriceFilterChange(0, 1000000)
                                }
                            >
                                Hiển thị tất cả
                            </li>
                            <li
                                onClick={() =>
                                    handlePriceFilterChange(25000, 50000)
                                }
                            >
                                25.000đ - 50.000đ
                            </li>
                            <li
                                onClick={() =>
                                    handlePriceFilterChange(50000, 100000)
                                }
                            >
                                50.000đ - 100.000đ
                            </li>
                            <li
                                onClick={() =>
                                    handlePriceFilterChange(100000, 200000)
                                }
                            >
                                100.000đ - 200.000đ
                            </li>
                            <li
                                onClick={() =>
                                    handlePriceFilterChange(200000, 500000)
                                }
                            >
                                200.000đ - 500.000đ
                            </li>
                            <li
                                onClick={() =>
                                    handlePriceFilterChange(500000, 1000000)
                                }
                            >
                                500.000đ - 1.000.000đ
                            </li>
                        </ul>
                    </div>

                    <div className="filter-type filter-item">
                        <div className="filter-item__inner">
                            <span>{selectedCategoryLabel}</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            {categoryOptions.map((item) => (
                                <li
                                    key={item.ma_danh_muc}
                                    onClick={() =>
                                        handleSearchtype(item.ma_danh_muc)
                                    }
                                >
                                    {item.ten_danh_muc}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-sort filter-item">
                        <div className="filter-item__inner">
                            <span>{selectedSortLabel}</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            <li onClick={() => handleSortChange("newest")}>
                                Mới nhất
                            </li>
                            <li onClick={() => handleSortChange("bestSeller")}>
                                Bán chạy
                            </li>
                            <li onClick={() => handleSortChange("priceAsc")}>
                                Giá thấp đến cao
                            </li>
                            <li onClick={() => handleSortChange("priceDesc")}>
                                Giá cao đến thấp
                            </li>
                            <li onClick={() => handleSortChange("discount")}>
                                % Giảm nhiều nhất
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="container1">
                    <div className="product-type">
                        <div className="row">
                            {displayedProducts.map((item) => (
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
                                            style={{ marginBottom: "8px" }}
                                        >
                                            <Link
                                                to={`/detail/${item.ma_san_pham}`}
                                                className="product-img product-img--small"
                                            >
                                                <img
                                                    className="product-img-1"
                                                    src={item.anh_sanpham}
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
                                                    Thêm sản phẩm
                                                </div>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div
                                                style={{ display: "none" }}
                                                className="product-content__option "
                                            >
                                                <div className="product-content__option-item-wrap active">
                                                    <span
                                                        data={item.mau_sac}
                                                    ></span>
                                                    <span
                                                        data={item.soluong}
                                                    ></span>
                                                </div>
                                            </div>
                                            <div className="product-name">
                                                {item.ten_san_pham}
                                            </div>
                                            <div className="product-price-wrap">
                                                <div className="product-price">
                                                    {formatCurrency(item.gia)}
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
                                            { item.thongbao && (
                                                <div className="product-discount">
                                                    {item.thongbao}
                                                </div>
                                            )}
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
                </div>

                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Trang tiếp >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< Trước"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="active"
                />
            </div>
        </Fragment>
    );
}
