"use client";
import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';
import AddToCartNotification from './AddToCartNotification'; // Import notification logic
import { supabase } from '@/lib/supabaseClient';

import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [address, setAddress] = useState(''); // State for address/notes
    const [showNotification, setShowNotification] = useState(false); // State for notification
    const router = useRouter();

    const handleAddToCart = async () => {
        // Enforce Login
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        // Pass address along with product data
        addToCart({ ...product, address }, quantity);
        setIsAdded(true);
        setShowNotification(true); // Show notification instead of redirecting

        // Reset local state
        setQuantity(1);
        setAddress('');

        // Hide success overlay after a short delay (for the button effect)
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    const increaseQty = () => setQuantity(q => q + 1);
    const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

    const categoryMap = {
        'Handicrafts': 'Kerajinan Tangan',
        'Food': 'Makanan',
        'Agricultural': 'Pertanian',
        'Traditional': 'Tradisional' // Fallback/Extra
    };

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
                <span className={styles.category}>{categoryMap[product.category] || product.category}</span>
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
                        Beli Sekarang
                    </button>
                </div>
            </div>

            {/* Custom Notification */}
            <AddToCartNotification
                product={product}
                visible={showNotification}
                onClose={() => setShowNotification(false)}
            />
        </div>
    );
}
