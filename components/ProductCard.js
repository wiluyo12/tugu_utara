"use client";
import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';

import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        // Show animation briefly then redirect
        setTimeout(() => {
            setIsAdded(false);
            router.push('/cart');
        }, 500);
        setQuantity(1); // Reset quantity after adding
    };

    const increaseQty = () => setQuantity(q => q + 1);
    const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={product.image_url || product.image || '/assets/product-basket.png'}
                    alt={product.name}
                    width={400}
                    height={300}
                    className={styles.image}
                    style={{ objectFit: 'cover' }}
                />
                <div className={`${styles.overlay} ${isAdded ? styles.visible : ''}`}>
                    <div className={styles.checkIcon}>✓</div>
                    <span className={styles.successText}>Added to Cart!</span>
                </div>
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.title}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>Rp {Number(product.price).toLocaleString('id-ID')}</span>
                </div>

                <div className={styles.controls}>
                    <div className={styles.qtySelector}>
                        <button className={styles.qtyBtn} onClick={decreaseQty}>-</button>
                        <span className={styles.qtyValue}>{quantity}</span>
                        <button className={styles.qtyBtn} onClick={increaseQty}>+</button>
                    </div>
                    <button className={styles.btn} onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
