import { toast } from 'react-hot-toast';
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartSheet = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            const orderData = {
                items: cart.map(item => ({
                    foodId: item._id, // Ensure this matches typical Mongo ID format
                    name: item.name,
                    price: item.price || 250,
                    quantity: item.quantity
                })),
                totalAmount: cartTotal
            };

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to place an order", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                return;
            }

            const response = await axios.post('https://krishka-kitchen-2.onrender.com/api/order', orderData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (response.status === 201) {
                toast.success("Order Placed Successfully! 🎉", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                clearCart();
                onClose();
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            toast.error("Failed to place order. Please try again.", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="cart-sheet-overlay" onClick={onClose}>
            <div className="cart-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Your Order</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <span style={{ fontSize: '3rem' }}>🛒</span>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price || 250}</p>
                                </div>
                                <div className="item-actions">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑️</button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                        <button className="clear-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSheet;
