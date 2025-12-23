import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VillageInfo from "@/components/VillageInfo";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  const featuredProducts = [
    { id: 1, name: "Traditional Bamboo Basket", category: "Handicrafts", price: 75000, image: "/assets/product-basket.png" },
    { id: 2, name: "Organic Tugu Green Tea", category: "Agricultural", price: 45000, image: "/assets/product-basket.png" }, // Reusing image for demo
    { id: 3, name: "Gula Aren Asli (Palm Sugar)", category: "Food", price: 30000, image: "/assets/product-basket.png" },

  ];

  return (
    <main>
      <Navbar />
      <Hero />
      <VillageInfo />

      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Produk Unggulan</h2>
        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className={styles.exploreLink}>
          <Link href="/products">Lihat Semua Produk &rarr;</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
