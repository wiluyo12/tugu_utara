"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Side - Image */}
            <div className={styles.imageSection}>
                <Image
                    src="/assets/riungGunung.png"
                    alt="Tugu Utara Scenery"
                    fill
                    className={styles.image}
                    priority
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Right Side - Login Form */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <h1 className={styles.heading}>Welcome Back</h1>
                    <p className={styles.subHeading}>Sign in to manage your dashboard</p>

                    <form onSubmit={handleLogin}>
                        {/* EMAIL */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.toggleBtn}
                                    aria-label="Toggle password"
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a3 3 0 004.2 4.2" />
                                            <path d="M9.9 4.2A10.4 10.4 0 0112 4.5c4.6 0 8.6 3 10 7.5a10.5 10.5 0 01-4.3 5.8" />
                                            <path d="M6.2 6.2A10.5 10.5 0 002 12c1.4 4.5 5.4 7.5 10 7.5" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M2 12s4-7.5 10-7.5S22 12 22 12s-4 7.5-10 7.5S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* INFO LOGIN */}
                        <div className={styles.infoBox}>
                            <strong>Demo Credentials:</strong><br />
                            Email: admin1@admin.com<br />
                            Pass: admin
                        </div>

                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
