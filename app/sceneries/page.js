import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Image from "next/image";

export default function Sceneries() {
    const spots = [
        { id: 1, name: "", location: "Desa wisata Batulayang, Anda dapat melihat kolam renang alami dengan aliran sungai dan air terjun/curug di tengah suasana pedesaan yang sejuk, serta area camping ground.", image: "/assets/desaBatuLayang.png", href: "https://www.youtube.com/watch?v=aw7t85-72oE" },
        { id: 2, name: "", location: "Puncak Pass Bogor-Cianjur,Ini adalah titik tertinggi dan landmark yang menghubungkan Bogor dan Cianjur..", image: "/assets/puncakPasCianjur.png" }, // New generated image
        { id: 3, name: "", location: "Talaga Saat Puncak, Danau cantik seluas 1,5 hektare yang dikelilingi oleh hamparan kebun teh yang hijau, sering diselimuti kabut tebal, memberikan suasana yang sangat sejuk dan damai.", image: "/assets/telagaSaatPuncak.png" }, // Reusing hero
        { id: 4, name: "", location: "Riung Gunung,Area kebun teh yang berada di puncak bukit, terkenal sebagai spot foto dengan dek pandang yang menjorok, menyajikan panorama lembah dan pegunungan yang sangat luas.", image: "/assets/riungGunung.png" }, // Reusing waterfall
    ];

    return (
        <main>
            <Navbar />
            <div className="container" style={{ paddingTop: '40px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Jelajahi Tugu Utara</h1>
                <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px', color: 'var(--color-text-soft)' }}>
                    Temukan permata tersembunyi dan pemandangan menakjubkan yang membuat desa kami unik.
                </p>

                <div className={styles.grid}>
                    {spots.map(spot => (
                        <div key={spot.id} className={styles.card}>
                            <Image
                                src={spot.image}
                                alt={spot.name}
                                fill
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <h3 className={styles.title}>{spot.name}<a href={spot.href}></a></h3>
                                <span className={styles.location}><a href={spot.href}>📍 {spot.location}</a></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
