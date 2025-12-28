"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/';

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpLogin, setIsOtpLogin] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // OTP Login
        if (isOtpLogin) {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}${redirectTo}`,
                },
            });

            if (error) {
                alert("Error sending OTP: " + error.message);
            } else {
                alert("Kode OTP (Magic Link) telah dikirim ke email Anda!");
            }
            setLoading(false);
            return;
        }

        // Email+Password Login
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Login Failed: " + error.message);
            setLoading(false);
        } else {
            router.push(redirectTo);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}${redirectTo}`,
            },
        });
        if (error) {
            alert("Google Login Error: " + error.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Side - Image */}
            <div className={styles.imageSection}>
                <Image
                    src="/assets/scenery-waterfall.png"
                    alt="Nature Scenery"
                    fill
                    className={styles.image}
                    priority
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <h1 className={styles.heading}>{isOtpLogin ? 'Masuk dengan Email' : 'Masuk Akun'}</h1>

                    <form onSubmit={handleLogin}>

                        <div>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className={styles.input}
                                placeholder="nama@email.com"
                            />
                        </div>

                        {!isOtpLogin && (
                            <div style={{ position: 'relative' }}>
                                <label className={styles.label}>Kata Sandi</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required={!isOtpLogin}
                                    className={styles.input}
                                    placeholder="********"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '38px', // Adjusted alignment
                                        background: 'none',
                                        border: 'none',
                                        padding: '5px',
                                        cursor: 'pointer',
                                        color: '#666',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title={showPassword ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {showPassword ? (
                                        // Eye Off Icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        // Eye Icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Memproses...' : (isOtpLogin ? 'Kirim Kode Masuk' : 'Masuk')}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                            <span style={{ color: '#888', fontSize: '0.8rem' }}>ATAU</span>
                            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                        </div>

                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'white',
                                color: '#333',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                marginBottom: '10px'
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238501)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                            Masuk dengan Google
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOtpLogin(!isOtpLogin)}
                            className={styles.link}
                            style={{ background: 'none', border: 'none', width: '100%', marginTop: '5px', cursor: 'pointer', outline: 'none' }}
                        >
                            {isOtpLogin ? 'Gunakan Kata Sandi' : 'Masuk tanpa Kata Sandi (OTP)'}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                            Belum punya akun? <Link href="/register" className={styles.link}>Daftar di sini</Link>
                        </p>

                        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                            <Link href="/" style={{ textDecoration: 'none' }}>← Kembali ke Beranda</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
