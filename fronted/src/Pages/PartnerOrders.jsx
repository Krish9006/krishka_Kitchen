import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PartnerOrders.css'; // We'll create this next

const PartnerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://krishka-kitchen-2.onrender.com/api/order/partner', {
                    withCredentials: true // Important for cookies
                });
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="partner-orders-container">Loading orders...</div>;
    if (error) return <div className="partner-orders-container error">{error}</div>;

    return (
        <div className="partner-orders-container">
            <h2>Incoming Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders">No orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order #{order._id.slice(-6)}</span>
                                <span className={`order-status ${order.status}`}>{order.status}</span>
                            </div>
                            <div className="order-user">
                                <strong>Customer:</strong> {order.user ? order.user.name : "Unknown User"}
                                <br />
                                <small>{order.user ? order.user.email : ""}</small>
                            </div>
                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item-row">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <span>Total Bill</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                            <div className="order-actions">
                                {order.status === 'pending' && (
                                    <>
                                        <button className="btn-accept">Accept</button>
                                        <button className="btn-reject">Reject</button>
                                    </>
                                )}
                                {order.status === 'accepted' && (
                                    <button className="btn-complete">Mark Ready</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartnerOrders;
