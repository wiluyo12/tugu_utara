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
            alert('Gambar berhasil diunggah!');
        } catch (error) {
            alert('Gagal mengunggah gambar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) {
            alert('Gagal menambah produk: ' + error.message);
        } else {
            alert('Produk berhasil ditambahkan!');
            setNewProduct({ name: '', category: 'Handicrafts', price: '', image_url: '', description: '' });
            fetchData(); // Refresh list
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Gagal menghapus produk');
        } else {
            fetchData();
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) return;

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Gagal memperbarui status: ' + error.message);
        } else {
            alert('Status berhasil diperbarui!');
            fetchData();
        }
    };

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Memuat Panel Admin...</div>;

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
                <h2 className={styles.sidebarTitle}>Panel Admin</h2>
                <nav>
                    <button
                        className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Dasbor
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Produk
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Pesanan
                    </button>

                    <button onClick={handleLogout} className={styles.navItem} style={{ marginTop: '20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'red' }}>
                        Keluar
                    </button>
                    <Link href="/" className={styles.navItem}>Kembali ke Situs</Link>
                </nav>
            </aside>

            <main className={styles.main}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>{
                        activeTab === 'dashboard' ? 'Dasbor' :
                            activeTab === 'products' ? 'Produk' :
                                activeTab === 'orders' ? 'Pesanan' : activeTab
                    }</h1>
                </header>

                {activeTab === 'dashboard' && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{orders.filter(o => o.status === 'pending').length}</div>
                            <div className={styles.statLabel}>Pesanan Tertunda</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{products.length}</div>
                            <div className={styles.statLabel}>Total Produk</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{orders.length}</div>
                            <div className={styles.statLabel}>Total Pesanan</div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className={styles.section}>
                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h3>Tambah Produk Baru</h3>
                            <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
                                <div className={styles.formGrid}>
                                    <input
                                        placeholder="Nama Produk"
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
                                        <option value="Handicrafts">Kerajinan Tangan</option>
                                        <option value="Food">Makanan</option>
                                        <option value="Agricultural">Pertanian</option>
                                    </select>
                                </div>
                                <div className={styles.formGrid}>
                                    <input
                                        type="number"
                                        placeholder="Harga (Rp)"
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
                                        {uploading && <span style={{ fontSize: '0.8rem', color: 'blue' }}>Mengunggah...</span>}
                                        {newProduct.image_url && <span style={{ fontSize: '0.8rem', color: 'green' }}> ✓ Gambar Siap</span>}
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Deskripsi"
                                    className={styles.input}
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    style={{ minHeight: '80px', fontFamily: 'inherit' }}
                                />
                                <button type="submit" className="btn-primary" disabled={uploading} style={{ justifySelf: 'start', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                                    {uploading ? 'Mengunggah...' : 'Simpan Produk'}
                                </button>
                            </form>
                        </div>

                        <h3>Daftar Produk</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '10px' }}>Nama</th>
                                        <th style={{ padding: '10px' }}>Kategori</th>
                                        <th style={{ padding: '10px' }}>Harga</th>
                                        <th style={{ padding: '10px' }}>Aksi</th>
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
                                                    Hapus
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
                        <h3>Semua Pesanan</h3>
                        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '10px' }}>ID</th>
                                    <th style={{ padding: '10px' }}>Pelanggan</th>
                                    <th style={{ padding: '10px' }}>Alamat</th>
                                    <th style={{ padding: '10px' }}>Total</th>
                                    <th style={{ padding: '10px' }}>Bukti</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Aksi</th>
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
                                            {order.payment_proof_url ? (
                                                <a
                                                    href={order.payment_proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'blue', textDecoration: 'underline', fontSize: '0.9rem' }}
                                                >
                                                    Lihat Bukti
                                                </a>
                                            ) : (
                                                <span style={{ color: '#ccc', fontSize: '0.9rem' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <span style={{
                                                color: order.status === 'completed' ? 'green' : (order.status === 'verifying' ? 'blue' : (order.status === 'shipped' ? 'purple' : 'orange')),
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 10px' }}>
                                            {order.status === 'verifying' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                >
                                                    Terima & Kirim
                                                </button>
                                            )}
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                                    style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                >
                                                    Kirim
                                                </button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                    style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                >
                                                    Selesai
                                                </button>
                                            )}
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
