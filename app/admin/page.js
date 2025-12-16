"use client";
import styles from "./page.module.css";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); // Default to products for quick access
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    // Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '', category: 'Handicrafts', price: '', image_url: '', description: ''
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        checkUser();
        fetchData();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/admin/login');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        // Fetch Products
        const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (productsData) setProducts(productsData);

        // Fetch Orders
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersData) setOrders(ordersData);

        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);

            setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
            alert('Image uploaded successfully!');
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) {
            alert('Error adding product: ' + error.message);
        } else {
            alert('Product added successfully!');
            setNewProduct({ name: '', category: 'Handicrafts', price: '', image_url: '', description: '' });
            fetchData(); // Refresh list
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Error deleting product');
        } else {
            fetchData();
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Loading Admin Panel...</div>;

    return (
        <div className={styles.container}>
            {/* Mobile Hamburger */}
            <button
                className={styles.hamburger}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                ☰
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
                <h2 className={styles.sidebarTitle}>Admin Panel</h2>
                <nav>
                    <button
                        className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Products
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Orders
                    </button>

                    <button onClick={handleLogout} className={styles.navItem} style={{ marginTop: '20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'red' }}>
                        Logout
                    </button>
                    <Link href="/" className={styles.navItem}>Back to Site</Link>
                </nav>
            </aside>

            <main className={styles.main}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                </header>

                {activeTab === 'dashboard' && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{orders.filter(o => o.status === 'pending').length}</div>
                            <div className={styles.statLabel}>Pending Orders</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{products.length}</div>
                            <div className={styles.statLabel}>Total Products</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{orders.length}</div>
                            <div className={styles.statLabel}>Total Orders</div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className={styles.section}>
                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h3>Add New Product</h3>
                            <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
                                <div className={styles.formGrid}>
                                    <input
                                        placeholder="Product Name"
                                        className={styles.input}
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                    <select
                                        className={styles.input}
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="Handicrafts">Handicrafts</option>
                                        <option value="Food">Food</option>
                                        <option value="Agriculture">Agriculture</option>
                                    </select>
                                </div>
                                <div className={styles.formGrid}>
                                    <input
                                        type="number"
                                        placeholder="Price (Rp)"
                                        className={styles.input}
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                    <div className={styles.fileInputWrapper}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className={styles.input}
                                            style={{ paddingTop: '10px' }}
                                        />
                                        {uploading && <span style={{ fontSize: '0.8rem', color: 'blue' }}>Uploading...</span>}
                                        {newProduct.image_url && <span style={{ fontSize: '0.8rem', color: 'green' }}> ✓ Image Ready</span>}
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Description"
                                    className={styles.input}
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    style={{ minHeight: '80px', fontFamily: 'inherit' }}
                                />
                                <button type="submit" className="btn-primary" disabled={uploading} style={{ justifySelf: 'start', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                                    {uploading ? 'Uploading Image...' : 'Save Product'}
                                </button>
                            </form>
                        </div>

                        <h3>Product List</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '10px' }}>Name</th>
                                        <th style={{ padding: '10px' }}>Category</th>
                                        <th style={{ padding: '10px' }}>Price</th>
                                        <th style={{ padding: '10px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{p.name}</td>
                                            <td style={{ padding: '10px' }}>{p.category}</td>
                                            <td style={{ padding: '10px' }}>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button
                                                    onClick={() => handleDeleteProduct(p.id)}
                                                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className={styles.section}>
                        <h3>All Orders</h3>
                        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '10px' }}>ID</th>
                                    <th style={{ padding: '10px' }}>Customer</th>
                                    <th style={{ padding: '10px' }}>Address</th>
                                    <th style={{ padding: '10px' }}>Total</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 10px' }}>#{order.id}</td>
                                        <td style={{ padding: '15px 10px' }}>{order.customer_name}</td>
                                        <td style={{ padding: '15px 10px' }}>{order.city}</td>
                                        <td style={{ padding: '15px 10px' }}>Rp {Number(order.total).toLocaleString('id-ID')}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <span style={{
                                                color: order.status === 'completed' ? 'green' : 'orange',
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
