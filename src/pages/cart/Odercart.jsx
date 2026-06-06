import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../until/userContext';
import "./Odercart.css";

// Loading component
const Loading = () => (
    <div className="loading">
        <p>Đang tải dữ liệu...</p>
    </div>
);

// Error component
const Error = ({ message }) => (
    <div className="error">
        <p style={{ color: 'red' }}>{message}</p>
    </div>
);

const getOrderStatusLabel = (status) => {
    const statusLabels = {
        1: "Đang đợi xác nhận",
        2: "Người gửi đang chuẩn bị sản phẩm",
        3: "Đang giao hàng",
        4: "Đã giao thành công",
    };

    return statusLabels[Number(status)] || "Không xác định";
};

// Main component
export default function OrderCart() {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load data from API
    const loadData = async (customerId) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`/api/orderDetailsByCustomer/${customerId}`);
            const sortedOrders = Array.isArray(response.data)
                ? response.data.sort((a, b) => {
                    const dateA = new Date(a.ngay_dat_hang || 0).getTime();
                    const dateB = new Date(b.ngay_dat_hang || 0).getTime();

                    if (dateA !== dateB) return dateB - dateA;
                    return Number(b.ma_don_hang) - Number(a.ma_don_hang);
                })
                : [];

            setOrders(sortedOrders);
        } catch (error) {
            if (error.response?.status === 404) {
                setOrders([]);
                setError('Hiện chưa có đơn hàng nào!');
            } else {
                setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    // Use effect to load data on component mount
    useEffect(() => {
        if (!user?.id) {
            setOrders([]);
            setLoading(false);
            setError('Vui lòng đăng nhập để xem đơn hàng.');
            return;
        }

        loadData(user.id);
    }, [user?.id]);

    return (
        <Fragment>
            <div className="container-cart order-cart-page">
                <h2>Thông tin đơn hàng</h2>
                
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Error message={error} />
                ) : (
                    <div className='layout-order'>
                        {orders.map((order) => (
                            <div key={order.ma_don_hang} className="order-section">
                                <div className="address-details">
                                    <h3><i className="fas fa-map-marker-alt"></i> Địa chỉ nhận hàng</h3>
                                    <div className="address-item">
                                        <label>Tên người nhận:</label>
                                        <span>{order.ten_khach}</span>
                                    </div>
                                    <div className="address-item">
                                        <label>Số điện thoại:</label>
                                        <span>{order.sdt}</span>
                                    </div>
                                    <div className="address-item">
                                        <label>Địa chỉ chi tiết:</label>
                                        <span>{order.dia_chi}</span>
                                    </div>
                                    <div className="address-item">
                                        <label>Trạng thái:</label>
                                        <span>{getOrderStatusLabel(order.trang_thai)}</span>
                                    </div>
                                </div>
                                
                                <div className="product-table">
                                    {order.orderDetails.length > 0 ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Tên Sản Phẩm</th>
                                                    <th>Ảnh Sản Phẩm</th>
                                                    <th>Số Lượng</th>
                                                    <th>Thành Tiền</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.orderDetails.map((item) => (
                                                    <tr key={item.ma_chi_tiet_don_hang}>
                                                        <td className="table-cart-1">{item.ten_san_pham}</td>
                                                        <td>
                                                            <img 
                                                                src={item.anh_sanpham} 
                                                                className="product-image" 
                                                                alt="Product" 
                                                                loading="lazy" // Lazy load image
                                                            />
                                                        </td>
                                                        <td>{item.so_luong}</td>
                                                        <td>{formatCurrency(order.thanh_tien)}</td>
                                                        
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="no-orders">
                                            <p>Không có đơn hàng nào được tìm thấy.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Fragment>
    );
}
