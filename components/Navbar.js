"use client";

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                TUGU UTARA
            </Link>

            {/* Desktop Links */}
            <div className={styles.navLinks}>
                <Link href="/" className={styles.link}>Beranda</Link>
                <Link href="/products" className={styles.link}>Pasar</Link>
                <Link href="/sceneries" className={styles.link}>Wisata</Link>
                <Link href="/about" className={styles.link}>Tentang Kami</Link>
            </div>

            <div className={styles.actions}>
                <Link href="/admin" className={`${styles.link} ${styles.adminLink}`}>Admin</Link>
                <Link href="/cart" className={styles.cartLink}><span className={styles.cartIcon}>🛒</span></Link>

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
                <Link href="/about" className={styles.link} onClick={toggleMenu}>Tentang Kami</Link>
            </div>
        </nav>
    );
}
