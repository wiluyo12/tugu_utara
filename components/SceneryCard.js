"use client";
import Image from 'next/image';
import styles from './SceneryCard.module.css';

export default function SceneryCard({ spot }) {
    return (
        <div className={styles.card}>
            <Image
                src={spot.image}
                alt={spot.name}
                fill
                className={styles.image}
            />
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <h3 className={styles.title}>{spot.name}</h3>
                    <div className={styles.location}>
                        <span>📍</span> {spot.shortLocation || "Tugu Utara, Bogor"}
                    </div>

                    <div className={styles.divider}></div>

                    <p className={styles.description}>
                        {spot.location}
                    </p>

                    <div className={styles.features}>
                        {spot.features && spot.features.map((feature, index) => (
                            <span key={index} className={styles.badge}>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
