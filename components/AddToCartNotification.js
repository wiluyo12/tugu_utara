"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AddToCartNotification.module.css';
import { useRouter } from 'next/navigation';

export default function AddToCartNotification({ product, visible, onClose }) {
    const router = useRouter();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto close after 5 seconds
            return () => clearTimeout(timer);
        } else {
            // Wait for animation to finish before unmounting (optional, simplified here)
            const timer = setTimeout(() => setShouldRender(false), 500);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible && !shouldRender) return null;

    if (!product) return null;

    return (
        <div className={styles.notificationContainer} style={{ animation: visible ? undefined : `${styles.slideOut} 0.5s ease-in forwards` }}>
            <div className={styles.card}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={product.image || product.image_url || '/assets/product-basket.png'}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className={styles.content}>
                    <p className={styles.message}>
                        <span>✓</span> masukan ke keranjang
                    </p>
                    <h4 className={styles.title}>{product.name}</h4>
                    <div className={styles.actions}>
                        <button
                            className={styles.cartBtn}
                            onClick={() => router.push('/cart')}
                        >
                            Lihat Keranjang
                        </button>
                        <button
                            className={styles.closeBtn}
                            onClick={onClose}
                        >
                            Lanjut Belanja
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
