"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Checkout() {
    const { cart, total, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: ''
    });

    const shippingCost = 15000;
    const finalTotal = total + shippingCost;

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (!formData.fullName || !formData.address) {
            alert("Please fill in shipping details");
            return;
        }

        setLoading(true);

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_name: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    total: finalTotal,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (orderError) {
            alert("Order failed: " + orderError.message);
            setLoading(false);
            return;
        }

        const orderItems = cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error("Error creating items:", itemsError);
        }

        setLoading(false);
        clearCart();
        alert("Order placed successfully!");
        router.push('/');
    };

    if (cart.length === 0) {
        return (
            <main>
                <Navbar />
                <div className={`container ${styles.container}`} style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Your cart is empty</h2>
                    <p>Go to the market to add some products.</p>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div className={styles.cartList}>
                    <h2 className={styles.sectionTitle}>Shopping Cart ({cart.length} items)</h2>

                    {cart.map(item => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <div style={{ position: 'relative', width: 60, height: 60 }}>
                                    <Image
                                        src={item.image_url || item.image || '/assets/product-basket.png'}
                                        fill
                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                        alt={item.name}
                                    />
                                </div>
                                <div>
                                    <h4>{item.name}</h4>
                                    <span className="text-secondary">
                                        Rp {Number(item.price).toLocaleString('id-ID')} x {item.quantity}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span>Rp {Number(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className={styles.itemGroup}>
                        <h3>Shipping Details</h3>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                className={styles.input}
                                placeholder="John Doe"
                                onChange={handleInput}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Address</label>
                            <input
                                name="address"
                                type="text"
                                className={styles.input}
                                placeholder="Jl. Raya Tugu..."
                                onChange={handleInput}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>City</label>
                            <input
                                name="city"
                                type="text"
                                className={styles.input}
                                placeholder="Bogor"
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.summary}>
                    <h2 className={styles.sectionTitle}>Order Summary</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping (JNE)</span>
                            <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>Rp {finalTotal.toLocaleString('id-ID')}</span>
                    </div>

                    <div className={styles.itemGroup}>
                        <h3>Payment Method</h3>
                        <div className={styles.paymentMethods}>
                            <button className={`${styles.paymentBtn} ${styles.active}`}>cod</button>
                            <button className={styles.paymentBtn}>transfer</button>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '30px' }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Complete Order'}
                    </button>
                </div>
            </div>
            <Footer />
        </main>
    );
}
