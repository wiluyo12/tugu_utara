import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VillageInfo from "@/components/VillageInfo";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  const featuredProducts = [
    { id: 1, name: "Asinan Bogor", category: "Food", price: 15000, image: "/assets/asinanBogor.jpg" },
    { id: 2, name: "Celengan Rotan", category: "Handcraft", price: 25000, image: "/assets/celenganRotan.png" }, // Reusing image for demo
    { id: 3, name: "Kopi Liong", category: "Agricultural", price: 20000, image: "/assets/kopiLiong.png" },
    { id: 4, name: "Keripik Singkong", category: "Food", price: 10000, image: "/assets/keripikSingkong.png" },

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
