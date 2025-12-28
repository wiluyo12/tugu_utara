"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const isHomepage = pathname === '/';

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        // Optional: Listen for auth state changes to update UI immediately
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Close dropdown when clicking outside
        const closeDropdown = (e) => {
            if (!e.target.closest(`.${styles.dropdownContainer}`)) {
                setLoginDropdownOpen(false);
            }
        };
        document.addEventListener('click', closeDropdown);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('click', closeDropdown);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh(); // Refresh to ensure state is clear
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleLoginDropdown = (e) => {
        e.preventDefault();
        setLoginDropdownOpen(!loginDropdownOpen);
    };

    return (
        <nav className={`${styles.navbar} ${isHomepage ? styles.fixed : ''}`}>
            <Link href="/" className={styles.logo}>
                Tugu Utara
            </Link>

            {/* Desktop Links*/}
            <div className={styles.navLinks}>
                <Link href="/" className={styles.link}>Beranda</Link>
                <Link href="/products" className={styles.link}>Pasar</Link>
                <Link href="/sceneries" className={styles.link}>Wisata</Link>
                <Link href="/cart" className={styles.link}>Keranjang</Link>

                {user ? (
                    <>
                        <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                    </>
                ) : (
                    <div className={styles.dropdownContainer}>
                        <span
                            className={styles.link}
                            onClick={toggleLoginDropdown}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            Masuk ▾
                        </span>
                        <div className={`${styles.dropdownMenu} ${loginDropdownOpen ? styles.show : ''}`}>
                            <Link href="/login" className={styles.dropdownItem}>Pengguna</Link>
                            <Link href="/admin/login" className={styles.dropdownItem}>Admin</Link>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                {/* Hamburger Icon */}
                <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
                    <span className={styles.bar} style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                    <span className={styles.bar} style={{ opacity: isMenuOpen ? 0 : 1 }}></span>
                    <span className={styles.bar} style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }}></span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <Link href="/" className={styles.link} onClick={toggleMenu}>Beranda</Link>
                <Link href="/products" className={styles.link} onClick={toggleMenu}>Pasar</Link>
                <Link href="/sceneries" className={styles.link} onClick={toggleMenu}>Wisata</Link>
                <Link href="/cart" className={styles.link} onClick={toggleMenu}>Keranjang</Link>
                {user ? (
                    <>
                        <Link href="/dashboard" className={styles.link} onClick={toggleMenu}>Dashboard</Link>
                        <span className={styles.link} onClick={() => { handleLogout(); toggleMenu(); }} style={{ cursor: 'pointer', color: '#ff4d4d' }}>Keluar</span>
                    </>
                ) : (
                    <div className={styles.dropdownContainer}>
                        <span className={styles.link} onClick={(e) => { e.stopPropagation(); toggleLoginDropdown(e); }} style={{ cursor: 'pointer' }}>
                            Masuk ▾
                        </span>
                        <div className={`${styles.dropdownMenu} ${loginDropdownOpen ? styles.show : ''}`}>
                            <Link href="/login" className={styles.dropdownItem} onClick={toggleMenu}>Pengguna</Link>
                            <Link href="/admin/login" className={styles.dropdownItem} onClick={toggleMenu}>Admin</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
