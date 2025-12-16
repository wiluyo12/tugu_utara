"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabaseClient";

export default function Market() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            let { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) console.error("Error fetching products:", error);
            else setProducts(data || []);
            setLoading(false);
        }

        fetchProducts();
    }, []);

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <main>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Category</h3>
                        <label className={styles.filterLabel}>
                            <input
                                type="radio"
                                name="category"
                                checked={filter === 'All'}
                                onChange={() => setFilter('All')}
                            /> All
                        </label>
                        <label className={styles.filterLabel}>
                            <input
                                type="radio"
                                name="category"
                                checked={filter === 'Handicrafts'}
                                onChange={() => setFilter('Handicrafts')}
                            /> Handicrafts
                        </label>
                        <label className={styles.filterLabel}>
                            <input
                                type="radio"
                                name="category"
                                checked={filter === 'Food'}
                                onChange={() => setFilter('Food')}
                            /> Food
                        </label>
                    </div>
                </aside>

                <div className={styles.main}>
                    <div className={styles.header}>
                        <h2>Marketplace</h2>
                    </div>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : (
                        <div className={styles.grid}>
                            {filteredProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
