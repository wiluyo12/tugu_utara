"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './VillageInfo.module.css';

export default function VillageInfo() {
    const images = [
        "/assets/desaBatuLayang.png",
        "/assets/telagaSaatPuncak.png",
        "/assets/riungGunung.png"
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent(prev => (prev + 1) % images.length);
    const prev = () => setCurrent(prev => (prev - 1 + images.length) % images.length);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <span className={styles.label}>Tentang Kami</span>
                    <h2 className={styles.title}>Permata Hijau di Jantung Puncak</h2>
                    <p className={styles.description}>
                        Desa Tugu Utara bukan sekadar destinasi wisata, melainkan sebuah warisan alam yang terjaga.
                        Terletak di ketinggian yang sejuk, desa kami menawarkan perpaduan sempurna antara
                        keindahan perkebunan teh yang membentang luas, hutan yang asri, dan keramahan penduduk lokal.
                    </p>
                    <p className={styles.description}>
                        Kami berkomitmen untuk melestarikan lingkungan sambil memberdayakan ekonomi lokal melalui
                        pariwisata berkelanjutan dan produk UMKM berkualitas.
                    </p>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <h4>1200+</h4>
                            <p>Meter DPL</p>
                        </div>
                        <div className={styles.statItem}>
                            <h4>15+</h4>
                            <p>Destinasi Wisata</p>
                        </div>
                        <div className={styles.statItem}>
                            <h4>100%</h4>
                            <p>Kearifan Lokal</p>
                        </div>
                    </div>
                </div>

                <div className={styles.carouselContainer}>
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`${styles.slide} ${index === current ? styles.active : ''}`}
                        >
                            <Link href="/sceneries">
                                <Image
                                    src={src}
                                    alt={`Tugu Utara View ${index + 1}`}
                                    fill
                                    className={styles.image}
                                />
                            </Link>
                        </div>
                    ))}

                    <div className={styles.indicators}>
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`${styles.dot} ${index === current ? styles.active : ''}`}
                                onClick={() => setCurrent(index)}
                            />
                        ))}
                    </div>

                    <div className={styles.controls}>
                        <button className={styles.btn} onClick={prev}>←</button>
                        <button className={styles.btn} onClick={next}>→</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
