import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <h1 className={styles.title}>Tugu Utara</h1>
            <p className={styles.subtitle}>
                Benamkan diri Anda dalam pemandangan yang menakjubkan dan dukung perekonomian lokal dengan berbelanja produk desa asli.
            </p>
            <div className={styles.ctaContainer}>
                <Link href="/products">
                    <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
                        Jelajahi Pasar
                    </button>
                </Link>
            </div>
        </section>
    );
}
