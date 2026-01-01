"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Checkout() {
    const { cart, total, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('transfer');
    const [proofFile, setProofFile] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: ''
    });

    const shippingCost = 15000;
    const finalTotal = total + shippingCost;

    // Load orders from localStorage
    // Load orders from Supabase (User specific)
    useEffect(() => {
        const fetchMyOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (data) setMyOrders(data);
            } else {
                setMyOrders([]); // Clear orders if not logged in
            }
        };

        fetchMyOrders();
    }, []);

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };

    const handleCheckout = async () => {
        if (!formData.fullName || !formData.address) {
            alert("harap masukan nama dan alamat");
            return;
        }

        if (paymentMethod === 'transfer' && !proofFile) {
            alert("harap upload bukti pembayaran");
            return;
        }

        setLoading(true);

        let proofUrl = null;

        // Upload Proof if exists
        if (proofFile) {
            const fileName = `${Date.now()}_${formData.fullName.replace(/\s+/g, '_')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('payment_proofs')
                .upload(fileName, proofFile);

            if (uploadError) {
                alert("gagal mengunggah bukti pembayaran: " + uploadError.message);
                setLoading(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('payment_proofs')
                .getPublicUrl(fileName);

            proofUrl = publicUrlData.publicUrl;
        }

        // Get Current User
        const { data: { user } } = await supabase.auth.getUser();

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_name: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    total: finalTotal,
                    status: 'verifying', // Set to verifying for manual check
                    payment_proof_url: proofUrl,
                    user_id: user ? user.id : null // Link order to user if logged in
                }
            ])
            .select()
            .single();

        if (orderError) {
            alert("Order gagal: " + orderError.message);
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
            console.error("gagal membuat item:", itemsError);
        }

        // SAVE ORDER ID TO LOCAL STORAGE (Optional/Removed for strict user scoping)
        // const existingOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
        // const updatedOrders = [order.id, ...existingOrders];
        // localStorage.setItem('my_orders', JSON.stringify(updatedOrders));

        setLoading(false);
        clearCart();
        alert("Order berhasil! Kami akan memverifikasi pembayaran Anda segera.");
        // We stay on the page to show the status
        window.location.reload();
    };

    // Helper to format status
    const getStatusLabel = (status) => {
        switch (status) {
            case 'verifying': return 'Menunggu Verifikasi';
            case 'shipped': return 'Terverifikasi'; // As requested
            case 'completed': return 'Selesai';
            default: return 'Pending';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verifying': return 'orange';
            case 'shipped': return 'green';
            case 'completed': return 'teal';
            default: return 'gray';
        }
    };

    return (
        <main>
            <Navbar />
            <div className={`container ${styles.container}`} style={{ flexDirection: 'column', gap: '40px' }}>

                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <h2 style={{ color: 'black' }}>Keranjangmu masih kosong</h2>
                        <Link href="/products" style={{ color: 'black', textDecoration: 'underline' }}>
                            Belanja di pasar sekarang
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <div className={styles.cartList} style={{ flex: 2 }}>
                            <h2 className={styles.sectionTitle} style={{ color: 'black' }}>Keranjangmu ({cart.length} items)</h2>

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
                                            {item.description && (
                                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', maxWidth: '300px' }}>
                                                    {item.description}
                                                </p>
                                            )}
                                            {item.address && (
                                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
                                                    Note: {item.address}
                                                </p>
                                            )}
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
                                    <label>Nama Lengkap</label>
                                    <input
                                        name="fullName"
                                        type="text"
                                        className={styles.input}
                                        placeholder="masukan nama anda"
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Alamat</label>
                                    <input
                                        name="address"
                                        type="text"
                                        className={styles.input}
                                        placeholder="masukan alamat lengkap"
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Kota</label>
                                    <input
                                        name="city"
                                        type="text"
                                        className={styles.input}
                                        placeholder="masukan nama kota"
                                        onChange={handleInput}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.summary} style={{ flex: 1 }}>
                            <h2 className={styles.sectionTitle} style={{ color: 'black' }}>Rincian Pesanan anda</h2>
                            <div style={{ marginBottom: '20px' }}>
                                <div className="flex justify-between mb-2">
                                    <span>Total Harga</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Biaya Pengiriman (JNE)</span>
                                    <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total Harga</span>
                                <span>Rp {finalTotal.toLocaleString('id-ID')}</span>
                            </div>

                            <div className={styles.itemGroup}>
                                <h3 style={{ color: 'black' }}>Metode Pembayaran</h3>

                                <div className={styles.transferInfo}>
                                    <p className={styles.bankDetail}>
                                        <strong>Untuk saat ini. Pembayaran hanya dapat dilakukan melalui transfer bank. </strong><br />
                                        <strong>a/n. Desa Wisata Tugu Utara</strong><br />
                                        <strong>BCA: 1234-5678-90</strong><br />
                                        <strong>Mandiri: 9876-5432-10</strong><br />
                                    </p>
                                    <div className={styles.uploadBox}>
                                        <label>Upload bukti pembayaran anda</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className={styles.fileInput}
                                        />
                                        {proofFile && <span className={styles.fileName}>{proofFile.name}</span>}
                                    </div>
                                </div>

                            </div>

                            <button
                                className={styles.checkoutBtn}
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                {loading ? 'memproses...' : 'pesan'}
                            </button>
                        </div>
                    </div>
                )}

                {/* MY ORDERS SECTION */}
                {myOrders.length > 0 && (
                    <div style={{ width: '100%', borderTop: '2px solid #eee', paddingTop: '30px' }}>
                        <h2 className={styles.sectionTitle} style={{ color: 'black' }}>Status Pesanan Anda</h2>
                        <div style={{ overflowX: 'auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                        <th style={{ padding: '15px' }}>Order ID</th>
                                        <th style={{ padding: '15px' }}>Date</th>
                                        <th style={{ padding: '15px' }}>Total</th>
                                        <th style={{ padding: '15px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '15px' }}>#{order.id}</td>
                                            <td style={{ padding: '15px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: '15px' }}>Rp {Number(order.total).toLocaleString('id-ID')}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{
                                                    color: 'white',
                                                    backgroundColor: getStatusColor(order.status),
                                                    padding: '5px 15px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block'
                                                }}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
