import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Image from "next/image";

export default function ProductDetail({ params }) {
    // Mock data
    const product = {
        id: params.id,
        name: "Traditional Bamboo Basket",
        price: 75000,
        category: "Handicrafts",
        description: "Handwoven by local artisans of Tugu Utara using sustainably sourced bamboo. Perfect for home decor or storage. Each piece tells a story of tradition and craftsmanship.",
        images: ["/assets/product-basket.png", "/assets/product-basket.png", "/assets/product-basket.png"]
    };

    return (
        <main>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div className={styles.imageSection}>
                    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            style={{ objectFit: "cover", borderRadius: "12px" }}
                        />
                    </div>
                    <div className={styles.gallery} style={{ marginTop: '20px' }}>
                        {product.images.map((img, i) => (
                            <Image key={i} src={img} width={80} height={80} alt="thumb" className={styles.thumb} />
                        ))}
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.title}>{product.name}</h1>
                    <span className={styles.price}>Rp {product.price.toLocaleString('id-ID')}</span>
                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <button className={styles.qtyBtn}>-</button>
                            <input type="text" value="1" className={styles.qtyInput} readOnly />
                            <button className={styles.qtyBtn}>+</button>
                        </div>
                        <button className="btn-primary" style={{ padding: '12px 40px', fontSize: '1.1rem' }}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
