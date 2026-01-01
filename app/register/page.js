"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        placeOfBirth: '',
        dateOfBirth: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Sign Up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            // Check if email confirmation is required
            if (authData?.user && !authData.session) {
                alert("Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun sebelum login.");
                router.push('/login');
                return;
            }

            if (authData?.user) {
                // 2. Insert Profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            full_name: formData.fullName,
                            place_of_birth: formData.placeOfBirth,
                            date_of_birth: formData.dateOfBirth,
                            address: formData.address,
                            role: 'user'
                        }
                    ]);

                // Even if profile fails, user is created. But ideally it succeeds.
                if (profileError) {
                    console.error("Profile creation error:", profileError);
                }

                alert("Registrasi berhasil! Silakan masuk.");
                router.push('/login');
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                {/* Left Side - Image */}
                <div className={styles.imageSection}>
                    <Image
                        src="/assets/loginImage.jpg"
                        alt="Village Scenery"
                        fill
                        className={styles.image}
                        priority
                    />

                </div>

                {/* Right Side - Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        <h1 className={styles.heading}>Daftar Akun</h1>
                        <p className={styles.subHeading}>Bergabunglah bersama kami</p>

                        <form onSubmit={handleRegister}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nama Lengkap</label>
                                <input name="fullName" type="text" required onChange={handleChange} className={styles.input} placeholder="Masukan nama anda" />
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tempat Lahir</label>
                                    <input name="placeOfBirth" type="text" required onChange={handleChange} className={styles.input} placeholder="Masukan tempat lahir anda" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tanggal Lahir</label>
                                    <input name="dateOfBirth" type="date" required onChange={handleChange} className={styles.input} placeholder="Masukan tanggal lahir anda" />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Alamat Lengkap</label>
                                <textarea name="address" required onChange={handleChange} className={styles.textarea} placeholder="Masukan alamat lengkap anda" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input name="email" type="email" required onChange={handleChange} className={styles.input} placeholder="Masukan email anda" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kata Sandi</label>
                                <input name="password" type="password" required onChange={handleChange} className={styles.input} placeholder="Masukan password anda" />
                            </div>

                            <button type="submit" disabled={loading} className={styles.submitBtn}>
                                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.8rem', color: '#666' }}>
                                Sudah punya akun? <Link href="/login" className={styles.link}>Masuk di sini</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
