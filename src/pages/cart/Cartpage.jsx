/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from 'react'
import ActiveCart, { LoadData, SetActiveVoucher } from '../../until/cartactive';
import axios from "axios";
import { useUser } from '../../until/userContext';
import "./Cartpage.css";

const EMPTY_VOUCHER = {
    coupon_name: "novoucher",
    discount_type: "money",
    discount_amount: 0,
    value: 0,
};

const isExpiredVoucher = (voucher) => {
    if (!voucher.expiry_date) return false;
    const expiryDate = new Date(voucher.expiry_date);
    expiryDate.setHours(23, 59, 59, 999);
    return expiryDate < new Date();
};

const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("vi-VN");
};

const PROVINCES_API_BASE = "https://provinces.open-api.vn/api/v1";

export default function Cartpage() {

    ActiveCart();

    var list = JSON.parse(localStorage.getItem("cart")) || [];

    const { user } = useUser();
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(EMPTY_VOUCHER);
    const [selectedVoucherCode, setSelectedVoucherCode] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [updateTotalTrigger, setUpdateTotalTrigger] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState("BuyLate");
    const [formErrors, setFormErrors] = useState({});
    const [locationCodes, setLocationCodes] = useState({
        province: "",
        district: "",
    });
    const [locationOptions, setLocationOptions] = useState({
        provinces: [],
        districts: [],
        wards: [],
        isLoadingProvinces: false,
        isLoadingDistricts: false,
        isLoadingWards: false,
    });

    const [state, setState] = useState({
        
        ten_khach_hang: '',
        sdt: '',
        dia_chi: '',
        tinh_thanh: '',
        quan_huyen: '',
        phuong_xa: '',
        ghi_chu: '',
        tong_tien:0
    });
         
    const { ten_khach_hang, sdt, dia_chi, tinh_thanh, quan_huyen, phuong_xa, ghi_chu,tong_tien } = state;

    const getCartSubtotal = (cartItems = JSON.parse(localStorage.getItem("cart")) || []) => {
      return cartItems.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
    };

    const getVoucherDiscount = (subtotal) => {
      const voucher = selectedVoucher;
      const minimumOrder = Number(voucher.value) || 0;
      const discountAmount = Number(voucher.discount_amount) || 0;

      if (!voucher.coupon_name || voucher.coupon_name === "novoucher" || subtotal < minimumOrder) {
        return 0;
      }

      const discount = voucher.discount_type === "percent"
        ? Math.floor((subtotal * discountAmount) / 100)
        : discountAmount;

      return Math.min(discount, subtotal);
    };

    const getPayableTotal = (cartItems = JSON.parse(localStorage.getItem("cart")) || []) => {
      const subtotal = getCartSubtotal(cartItems);
      return subtotal - getVoucherDiscount(subtotal);
    };
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setState({ ...state, [name]: value });
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const validateShippingInfo = (cartItems = JSON.parse(localStorage.getItem("cart")) || []) => {
      const nextErrors = {};
      const phoneValue = sdt.trim();
      const vietnamPhoneRegex = /^(0[35789][0-9]{8}|\+84[35789][0-9]{8})$/;

      if (!cartItems.length) {
        nextErrors.cart = "Giỏ hàng đang trống.";
      }

      if (!ten_khach_hang.trim()) {
        nextErrors.ten_khach_hang = "Vui lòng nhập họ tên.";
      } else if (ten_khach_hang.trim().length < 2) {
        nextErrors.ten_khach_hang = "Họ tên phải có ít nhất 2 ký tự.";
      }

      if (!phoneValue) {
        nextErrors.sdt = "Vui lòng nhập số điện thoại.";
      } else if (!vietnamPhoneRegex.test(phoneValue)) {
        nextErrors.sdt = "Số điện thoại Việt Nam không hợp lệ.";
      }

      if (!dia_chi.trim()) {
        nextErrors.dia_chi = "Vui lòng nhập địa chỉ cụ thể.";
      }

      if (!tinh_thanh) {
        nextErrors.tinh_thanh = "Vui lòng chọn Tỉnh/Thành phố.";
      }

      if (!quan_huyen) {
        nextErrors.quan_huyen = "Vui lòng chọn Quận/Huyện.";
      }

      if (!phuong_xa) {
        nextErrors.phuong_xa = "Vui lòng chọn Phường/Xã.";
      }

      setFormErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    };

    const handleProvinceChange = async (e) => {
      const provinceCode = e.target.value;
      const provinceName = e.target.options[e.target.selectedIndex]?.dataset.name || "";

      setLocationCodes({ province: provinceCode, district: "" });
      setState({
        ...state,
        tinh_thanh: provinceName,
        quan_huyen: "",
        phuong_xa: "",
      });
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        tinh_thanh: "",
        quan_huyen: "",
        phuong_xa: "",
      }));
      setLocationOptions((prevOptions) => ({
        ...prevOptions,
        districts: [],
        wards: [],
      }));

      if (!provinceCode) return;

      setLocationOptions((prevOptions) => ({
        ...prevOptions,
        isLoadingDistricts: true,
      }));

      try {
        const response = await axios.get(`${PROVINCES_API_BASE}/p/${provinceCode}?depth=2`);
        setLocationOptions((prevOptions) => ({
          ...prevOptions,
          districts: response.data?.districts || [],
          wards: [],
          isLoadingDistricts: false,
        }));
      } catch (error) {
        console.error(error);
        setLocationOptions((prevOptions) => ({
          ...prevOptions,
          districts: [],
          wards: [],
          isLoadingDistricts: false,
        }));
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          quan_huyen: "Không tải được danh sách Quận/Huyện.",
        }));
      }
    };

    const handleDistrictChange = async (e) => {
      const districtCode = e.target.value;
      const districtName = e.target.options[e.target.selectedIndex]?.dataset.name || "";

      setLocationCodes((prevCodes) => ({
        ...prevCodes,
        district: districtCode,
      }));
      setState({
        ...state,
        quan_huyen: districtName,
        phuong_xa: "",
      });
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        quan_huyen: "",
        phuong_xa: "",
      }));
      setLocationOptions((prevOptions) => ({
        ...prevOptions,
        wards: [],
      }));

      if (!districtCode) return;

      setLocationOptions((prevOptions) => ({
        ...prevOptions,
        isLoadingWards: true,
      }));

      try {
        const response = await axios.get(`${PROVINCES_API_BASE}/d/${districtCode}?depth=2`);
        setLocationOptions((prevOptions) => ({
          ...prevOptions,
          wards: response.data?.wards || [],
          isLoadingWards: false,
        }));
      } catch (error) {
        console.error(error);
        setLocationOptions((prevOptions) => ({
          ...prevOptions,
          wards: [],
          isLoadingWards: false,
        }));
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          phuong_xa: "Không tải được danh sách Phường/Xã.",
        }));
      }
    };

    const handleWardChange = (e) => {
      const wardName = e.target.options[e.target.selectedIndex]?.dataset.name || "";
      setState({ ...state, phuong_xa: wardName });
      setFormErrors((prevErrors) => ({ ...prevErrors, phuong_xa: "" }));
    };

    const handlePayment = (e) =>{
        e.preventDefault();

           if (!user) {
            alert("Vui lòng đăng nhập để đặt dịch vụ!");
            return; // Dừng thực thi hàm nếu chưa đăng nhập
        }

    const paymentMethod = selectedPayment;
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (!validateShippingInfo(cartItems)) {
        return;
    }

    if(window.confirm("Xác nhận lại thông tin đơn hàng , xác nhận đặt hàng ?")){
    const finalTotal = getPayableTotal(cartItems);
    if(paymentMethod === "BuyLate"){
        const orderData = {
            ma_khach_hang: user.id, // Thay đổi giá trị này thành ID của khách hàng
            ngay_dat_hang: new Date().toISOString().slice(0, 10), // Lấy ngày hiện tại
            tong_tien: finalTotal, // Tổng tiền
            id_voucher: selectedVoucher.id_voucher || null,
            trang_thai: 1,
            ten_khach: ten_khach_hang,
            dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
            ghi_chu: ghi_chu,
            sdt: sdt,
            loai_thanh_toan:paymentMethod,
            trang_thai_thanh_toan:1,
        
            chi_tiet_don_hang: cartItems.map(item => ({
              ma_san_pham: Number(item.id),
              ten_san_pham: item.name, 
              so_luong: item.quantity,
              gia: item.price,
              anh_sanpham:item.img
            }))
        }
        console.log(orderData)
        axios.post("/api/addOrder", orderData)
        .then( () => {setState({ten_khach_hang :"",sdt:"",dia_chi:"",tinh_thanh:"",phuong_xa:"",quan_huyen:"",ghi_chu:""})
            setLocationCodes({ province: "", district: "" });
            setLocationOptions((prevOptions) => ({
                ...prevOptions,
                districts: [],
                wards: [],
            }));
            setFormErrors({});
            list = [];
            localStorage.setItem("cart", JSON.stringify(list));
            setSelectedVoucherCode("");
            setVoucherCode("");
            setSelectedVoucher(EMPTY_VOUCHER);
            SetActiveVoucher(EMPTY_VOUCHER);
            LoadData();
          alert("Bạn đã đặt hàng thành công");

        })
        .catch(error => {
          console.error(error);
          alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
        });
    }

    else if(paymentMethod === "VnPay"){
        console.log('ok')
        const orderData = {
            ma_khach_hang: user.id, // Thay đổi giá trị này thành ID của khách hàng
            ngay_dat_hang: new Date().toISOString().slice(0, 10), // Lấy ngày hiện tại
            tong_tien: finalTotal, // Tổng tiền
            id_voucher: selectedVoucher.id_voucher || null,
            trang_thai: 1,
            ten_khach: ten_khach_hang,
            dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
            ghi_chu: ghi_chu,
            sdt: sdt,
            loai_thanh_toan:paymentMethod,
            trang_thai_thanh_toan:2,
        
            chi_tiet_don_hang: cartItems.map(item => ({
              ma_san_pham: Number(item.id),
              ten_san_pham: item.name, 
              so_luong: item.quantity,
              gia: item.price,
              anh_sanpham:item.img
            }))
        }

        //Lưu tạm đơn hàng vào localStorage
                localStorage.setItem("pending_order", JSON.stringify(orderData));

                //Tạo link thanh toán VNPay
                axios.post('/api/create_payment_url', {
                    amount: finalTotal,
                    language: "vn"
                })
                .then(res => {
                    const paymentUrl = res.data.url;
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                    } else {
                        alert('Không tạo được link thanh toán VNPay');
                    }
                })
                .catch(error => {
                    console.error(error);
                    const message = error.response?.data?.error || error.response?.data?.message || 'Lỗi khi gọi API thanh toán VNPay';
                    alert(message);
                });

                setSelectedVoucherCode("");
                setVoucherCode("");
                setSelectedVoucher(EMPTY_VOUCHER);
                SetActiveVoucher(EMPTY_VOUCHER);
                LoadData();
    }
  }
}    
    useEffect(() => {
        const tongTienElement = document.querySelector('.btn-pay--price');
        if (tongTienElement) {
          const value = tongTienElement.innerText || tongTienElement.textContent;
          const numberValue = parseInt(value.replace(/[^\d]/g, ''), 10); // Loại bỏ các ký tự không phải số và chuyển đổi sang số nguyên
          setState((prevState) => ({ ...prevState, tong_tien: numberValue }));
        }
    }, [updateTotalTrigger]);
    console.log(tong_tien)


    useEffect(() => {
        const loadProvinces = async () => {
            setLocationOptions((prevOptions) => ({
                ...prevOptions,
                isLoadingProvinces: true,
            }));

            try {
                const response = await axios.get(`${PROVINCES_API_BASE}/p`);
                setLocationOptions((prevOptions) => ({
                    ...prevOptions,
                    provinces: Array.isArray(response.data) ? response.data : [],
                    isLoadingProvinces: false,
                }));
            } catch (error) {
                console.error(error);
                setLocationOptions((prevOptions) => ({
                    ...prevOptions,
                    provinces: [],
                    isLoadingProvinces: false,
                }));
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    tinh_thanh: "Không tải được danh sách Tỉnh/Thành phố.",
                }));
            }
        };

        loadProvinces();
    }, []);


    useEffect(() => {
        const loadVouchers = async () => {
            try {
                const response = await axios.get("/api/getallvoucher");
                const dbVouchers = Array.isArray(response.data) ? response.data : [];
                const activeVouchers = dbVouchers.filter(
                    (voucher) =>
                        Number(voucher.remaining_count) > 0 &&
                        !isExpiredVoucher(voucher),
                );
                console.log(activeVouchers, dbVouchers);
                setVouchers(activeVouchers);
                setSelectedVoucher(EMPTY_VOUCHER);
                setSelectedVoucherCode("");
                setVoucherCode("");
                SetActiveVoucher(EMPTY_VOUCHER);
            } catch (error) {
                console.error(error);
                setVouchers([]);
                setSelectedVoucher(EMPTY_VOUCHER);
                SetActiveVoucher(EMPTY_VOUCHER);
            } finally {
                LoadData();
            }
        };

        loadVouchers();
    }, []);
    
    const handleSelectVoucher = (voucher) => {
        if (Number(voucher.remaining_count) <= 0 || isExpiredVoucher(voucher)) {
            alert("Voucher này đã hết hạn hoặc hết số lượng.");
            return;
        }

        const subtotal = getCartSubtotal();
        const minimumOrder = Number(voucher.value) || 0;

        if (subtotal < minimumOrder) {
            alert(`Đơn hàng cần tối thiểu ${minimumOrder.toLocaleString("vi-VN")}đ để dùng voucher này.`);
            return;
        }

        const voucherData = {
            id_voucher: voucher.id_voucher,
            coupon_name: voucher.coupon_name,
            discount_type: voucher.discount_type,
            discount_amount: voucher.discount_amount,
            value: voucher.value,
        };
        setSelectedVoucher(voucherData);
        SetActiveVoucher(voucherData);
        setSelectedVoucherCode(voucher.coupon_name);
        setVoucherCode(voucher.coupon_name);
        LoadData();
        setUpdateTotalTrigger(prev => prev + 1);
    };

    const handleApplyVoucherCode = () => {
        const code = voucherCode.trim().toLowerCase();
        const voucher = vouchers.find(
            (item) => item.coupon_name.toLowerCase() === code,
        );

        if (!voucher) {
            alert("Mã voucher không tồn tại, đã hết hạn hoặc đã hết số lượng.");
            return;
        }

        handleSelectVoucher(voucher);
    };

    const handleRemoveVoucher = () => {
        setSelectedVoucher(EMPTY_VOUCHER);
        SetActiveVoucher(EMPTY_VOUCHER);
        setSelectedVoucherCode("");
        setVoucherCode("");
        LoadData();
        setUpdateTotalTrigger(prev => prev + 1);
    };
    
    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value); // Cập nhật giá trị state
    };

    const handlePaymentSelect = (paymentMethod) => {
        setSelectedPayment(paymentMethod);
    };

  return (
    <Fragment>
        <div className="main cart-page">

                {/* <!-- Phần container --> */}
                <div className="cartPage-container">
                    <form className="info">
                        <div className="info-header">
                            <h2>Thông tin vận chuyển</h2>
                        </div>
                        <div className="row info-body">
                            <div className="col p-6">
                                <input className="input-name"name="ten_khach_hang" onChange={handleInputChange} value={ten_khach_hang} placeholder="Họ tên" type="text" />
                                {formErrors.ten_khach_hang && <p className="form-error">{formErrors.ten_khach_hang}</p>}
                            </div>
                            <div className="col p-6">
                                <input className="input-phone" name="sdt" onChange={handleInputChange} value={sdt} placeholder="Số điện thoại" type="text"/>
                                {formErrors.sdt && <p className="form-error">{formErrors.sdt}</p>}
                            </div>
                            <div className="col p-12">
                                <input className="input-adress" name="dia_chi" onChange={handleInputChange} value={dia_chi} placeholder="Địa chỉ" type="text"/>
                                {formErrors.dia_chi && <p className="form-error">{formErrors.dia_chi}</p>}
                            </div>
                            <div className="adress col p-4">
                                <select
                                    onChange={handleProvinceChange}
                                    value={locationCodes.province}
                                    name="tinh_thanh"
                                    disabled={locationOptions.isLoadingProvinces}
                                >
                                    <option value="">
                                        {locationOptions.isLoadingProvinces ? "Đang tải Tỉnh/Thành phố..." : "Chọn Tỉnh/Thành Phố"}
                                    </option>
                                    {locationOptions.provinces.map((province) => (
                                        <option
                                            key={province.code}
                                            value={province.code}
                                            data-name={province.name}
                                        >
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.tinh_thanh && <p className="form-error">{formErrors.tinh_thanh}</p>}
                                </div>

                                <div className="adress col p-4">
                                <select
                                    onChange={handleDistrictChange}
                                    value={locationCodes.district}
                                    name="quan_huyen"
                                    disabled={!locationCodes.province || locationOptions.isLoadingDistricts}
                                >
                                    <option value="">
                                        {locationOptions.isLoadingDistricts ? "Đang tải Quận/Huyện..." : "Chọn Quận/Huyện"}
                                    </option>
                                    {locationOptions.districts.map((district) => (
                                        <option
                                            key={district.code}
                                            value={district.code}
                                            data-name={district.name}
                                        >
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.quan_huyen && <p className="form-error">{formErrors.quan_huyen}</p>}
                                </div>

                                <div className="adress col p-4">
                                <select
                                    onChange={handleWardChange}
                                    value={phuong_xa}
                                    name="phuong_xa"
                                    disabled={!locationCodes.district || locationOptions.isLoadingWards}
                                >
                                    <option value="">
                                        {locationOptions.isLoadingWards ? "Đang tải Phường/Xã..." : "Chọn Phường/Xã"}
                                    </option>
                                    {locationOptions.wards.map((ward) => (
                                        <option
                                            key={ward.code}
                                            value={ward.name}
                                            data-name={ward.name}
                                        >
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.phuong_xa && <p className="form-error">{formErrors.phuong_xa}</p>}
                                </div>

                            <div className="col p-12">
                                <input onChange={handleInputChange} value={ghi_chu} name="ghi_chu" className="input-adress" placeholder="Ghi chú thêm" type="text"/>
                            </div>
                        </div>
                        <div className="payments">
                            <h2 className="payments">Hình thức thanh toán
                            </h2>
                            <div
                                className={`payments-item ${(selectedPayment === "BuyLate") ? "active" : ""}`}
                                onClick={() => handlePaymentSelect("BuyLate")}
                            >
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name cho các radio
                                    value="BuyLate"
                                    checked={selectedPayment === "BuyLate"}
                                    onChange={handlePaymentChange}
                                    />
                                    <img style={{height:'25px',width:'25px',marginRight:"60px"}} src="https://sohala.vn/upload/news/thanh-toan-khi-nhan-hang-6272.jpg" alt="" />
                                    <p className="payments-item__text">Thanh toán sau</p>
                                </div>

                                {/* VNPay */}
                                <div
                                    className={`payments-item ${(selectedPayment === "VnPay") ? "active" : ""}`}
                                    onClick={() => handlePaymentSelect("VnPay")}
                                >
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name phải giống nhau
                                    value="VnPay"
                                    checked={selectedPayment === "VnPay"}
                                    onChange={handlePaymentChange}
                                    />
                                    <img
                                    style={{ width: "25px" }}
                                    src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
                                    alt=""
                                    />
                                    <div className="payments-item__text">
                                    <p>Thẻ ATM / Internet Banking</p>
                                    <p>Thẻ tín dụng (Credit card) / Thẻ ghi nợ (Debit card) VNPay QR</p>
                                    </div>
                            </div>
                            <p style={{paddingLeft: '5px'}}>Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. Tìm hiểu thêm <a style={{fontWeight:'700'}} href="">tại đây</a>.</p>
                            {formErrors.cart && <p className="form-error form-error--payment">{formErrors.cart}</p>}
                            <button type="submit" onClick={handlePayment} className="btn-pay">
                                Thanh toán <span className="btn-pay--price"></span>
                                (<span className="type-payment">{selectedPayment === "VnPay" ? "VnPay" : "Thanh toán sau"}</span>)
                            </button>
                        </div>
                    </form>

                    {/* <!-- tạo khuôn đổ dữ liệu --> */}
                    <div className="list-product">
                        <div className="list-product__inner">
                            <h2>Giỏ hàng</h2>
                            <div className="list-product__item">
                                    <div className="list-product__item-img">
                                    <img src="https://media.coolmate.me/uploads/March2022/tshirtxcool-4-copy_160x181.jpg" alt=""/>
                                    </div>

                                    <div className="list-product__item-content">
                                    <div className="list-product__item-name">Áo thun cổ tròn Excool</div>
                                    <div className="list-product__item-type">Đen/L</div>
                                    <div style={{display:'flex', justifyContent: 'flex-start', margin: '28px 0 6px'}} className="">
                                        <div className="single-product-color single-product-select">
                                            <span>Đen</span>
                                            <i className="fa-solid fa-angle-down"></i>
                                        </div>
                                        <div className="single-product-size single-product-select">
                                            <span>L</span>
                                            <i className="fa-solid fa-angle-down"></i>
                                        </div >                          
                                    </div>
                                    <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center'}}>  
                                        <div className="quantity-product">
                                            <button>
                                                <svg data-v-0d8807a2="" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g data-v-0d8807a2=""><line data-v-0d8807a2="" stroke-width="1.5" id="svg_6" y2="8" x2="10" y1="8" x1="5" stroke="#000000" fill="none"></line></g></svg>
                                            </button>
                                            <span>1</span>
                                            <button>
                                                <svg data-v-0d8807a2="" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g data-v-0d8807a2=""><line data-v-0d8807a2="" stroke-width="1.5" y2="8" x2="12.9695" y1="8" x1="3.0305" stroke="#000000" fill="none"></line> <line data-v-0d8807a2="" stroke-width="1.5" transform="rotate(90, 8, 8)" y2="8" x2="13" y1="8" x1="3" stroke="#000000" fill="none"></line></g></svg>
                                            </button>
                                        </div>
                                        <div className="product-price">
                                            <div className="product-new-price">254.000đ</div>
                                            <div className="product-old-price">299.000đ</div>
                                        </div>
                                    </div>
                                    <div className="list-product__close">
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                </div>
                                
                                
                            </div>   
                        {/* <div className='cart-viewing-users mgt--10'>
                            <i>
                                <span>Có </span>
                                <b>5</b>
                                <span> người đang thêm cùng sản phẩm giống bạn vào giỏ hàng.</span>
                            </i>
                        </div> */}
                          <div className='discount-block'>
                             <div className="coupon-container">
                             {vouchers.map((voucher) => (
                                <div className="coupon-card" key={voucher.id_voucher || voucher.coupon_name}>
                                    <div className="coupon-header">
                                        <span className="coupon-code">{voucher.coupon_name}</span>
                                        <span className="coupon-remaining">(Còn {voucher.remaining_count})</span>
                                    </div>
                                    <div className="coupon-description">
                                        <p>{voucher.description}</p>
                                        <p>Giảm {voucher.discount_type === "percent" ? `${voucher.discount_amount}%` : `${Number(voucher.discount_amount).toLocaleString("vi-VN")}đ`}</p>
                                    </div>
                                    <div className="coupon-footer">
                                        <span>HSD: {formatDate(voucher.expiry_date)}</span>
                                        <span className="coupon-conditions">Đơn tối thiểu {Number(voucher.value || 0).toLocaleString("vi-VN")}đ</span>
                                    </div>
                                    <div className="coupon-radio">
                                        <input
                                            onChange={() => handleSelectVoucher(voucher)}
                                            checked={selectedVoucherCode === voucher.coupon_name}
                                            type="radio"
                                            name="coupon-select"
                                        />   
                                    </div>
                                </div>
                            ))}
                            </div>  
                              <div className='discount-box'>
                                    <input
                                        data-v-48bbe076
                                        type="text"
                                        placeholder='Nhập mã giảm giá'
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                    />
                                    <button data-v-48bbe076 type="button" onClick={handleApplyVoucherCode}> Áp dụng</button>
                                    {selectedVoucherCode && (
                                        <button data-v-48bbe076 type="button" onClick={handleRemoveVoucher}> Bỏ mã</button>
                                    )}
                              </div>
                              <div className='discount-block'>
                                <p className='discount-heading mb-4'>
                                    Sử dụng Voucher

                                    <span>
                                        <img src="https://mcdn.coolmate.me/image/April2023/mceclip0_92.png" alt="" />
                                        <button className='text-gray-light cursor-pointer btn-gray'>Nhập mã</button>
                                    </span>
                                </p>
                              </div>
                              
                        </div>
                        <div style={{    marginTop: '10px'}} className="cost-detail">
                            <span>Tạm tính</span>
                            <span className="tamTinh"></span>
                        </div>
                        <div className="cost-detail">
                            <span>Giảm giá</span>
                            <span className="sale-off">0đ</span>
                        </div>
                        <div className="cost-detail">
                            <span>Phí giao hàng</span>
                            <span className="delever-cost">Miễn phí</span>
                        </div>
                        <div className="total">
                            <span>Tổng</span>
                            <span className="total__price"></span>
                        </div>        
                        </div>
                       
                    </div>
                    
                </div>
    </Fragment>
  );
}
