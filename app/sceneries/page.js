import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Image from "next/image";

import SceneryCard from "@/components/SceneryCard";

export default function Sceneries() {
    const spots = [
        {
            id: 1,
            name: "Desa Wisata Batulayang",
            shortLocation: "Batulayang, Cisarua",
            location: "Nikmati kesegaran alami kolam renang sungai dan air terjun menawan. Tempat sempurna untuk camping di tengah udara pegunungan yang sejuk.",
            image: "/assets/desaBatuLayang.png",
            features: ["🏞️ Nature Pool", "⛺ Camping", "🌊 Waterfall"]
        },

        {
            id: 2,
            name: "Telaga Saat",
            shortLocation: "Tugu Utara, Cisarua",
            location: "Danau eksotis seluas 1,5 hektare yang tersembunyi di balik perkebunan teh. Suasana tenang dengan kabut magis yang sering turun menyapa.",
            image: "/assets/telagaSaatPuncak.png",
            features: ["🛶 Boating", "🌲 Hidden Gem", "🌫️ Foggy View"]
        },
        {
            id: 3,
            name: "Riung Gunung",
            shortLocation: "Jl. Raya Puncak",
            location: "Spot legendaris dengan jembatan gantung dan pemandangan lembah teh 360 derajat. Destinasi wajib bagi pemburu foto estetik.",
            image: "/assets/riungGunung.png",
            features: ["🌉 Suspension Bridge", "🌄 Panorama", "🚶‍♂️ Trekking"]
        },
    ];

    return (
        <main>
            <Navbar />
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Jelajahi Tugu Utara</h1>
                    <p className={styles.pageSubtitle}>
                        Temukan keindahan tersembunyi. Dari danau berkabut hingga puncak tertinggi.
                    </p>
                </div>

                <div className={styles.grid}>
                    {spots.map(spot => (
                        <SceneryCard key={spot.id} spot={spot} />
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
