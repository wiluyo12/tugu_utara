import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                <div className={styles.column}>
                    <h3>Tugu Utara</h3>
                    <p>
                        Promosikan keindahan dan produk lokal Desa Tugu Utara.
                    </p>
                </div>
                <div className={styles.column}>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Beranda</a></li>
                        <li><a href="/products">Pasar</a></li>
                        <li><a href="/sceneries">Wisata</a></li>

                        <li><a href="/cart">Keranjang</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Contact</h3>
                    <p>Jl. Raya Puncak No. 779 Desa Tugu Utara Kecamatan Cisarua Kabupaten Bogor</p>
                    {/* <p>Email: contact@tuguutara.id</p> */}
                </div>
            </div>
            <div className={styles.bottom}>
                &copy; {new Date().getFullYear()} Tugu Utara. All rights reserved.
            </div>
        </footer>
    );
}
