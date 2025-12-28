"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 1. Get Session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    router.push('/login?redirectTo=/dashboard');
                    return;
                }

                setUser(session.user);

                // 2. Get Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                setProfile(profileData);

                // 3. Get Orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (ordersError) console.error("Error fetching orders:", ordersError);
                if (ordersData) setOrders(ordersData);

            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verifying': return '#F59E0B'; // Orange
            case 'shipped': return '#10B981'; // Green
            case 'completed': return '#14B8A6'; // Teal
            default: return '#6B7280'; // Gray
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'verifying': return 'Menunggu Verifikasi';
            case 'shipped': return 'Terverifikasi';
            case 'completed': return 'Selesai';
            default: return status;
        }
    };

    if (loading) {
        return (
            <main>
                <Navbar />
                <div className={styles.loader}>Memuat Data Pengguna...</div>
            </main>
        );
    }

    return (
        <main>
            <Navbar />
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1 className={styles.heading}>Dashboard Saya</h1>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Keluar
                    </button>
                </div>

                {/* Profile Section */}
                <div className={styles.profileSection}>
                    <div className={styles.avatarPlaceholder}>
                        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.profileInfo}>
                        <h2>{profile?.full_name || "Pengguna"}</h2>
                        <p>{user?.email}</p>
                        {profile?.address && <p style={{ marginTop: '5px', fontSize: '0.9rem' }}>{profile.address}</p>}
                    </div>
                </div>

                {/* Orders Section */}
                <h2 className={styles.sectionTitle}>Riwayat Pesanan</h2>
                <div className={styles.ordersTableContainer}>
                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Anda belum memiliki riwayat pesanan.</p>
                            <Link href="/products" style={{ color: 'var(--color-moss-green)', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Tanggal</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                        <td>Rp {Number(order.total).toLocaleString('id-ID')}</td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(order.status) }}
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
            <Footer />
        </main>
    );
}
