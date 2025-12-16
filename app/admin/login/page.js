"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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

    // === STYLE ===
    const inputStyle = {
        width: "100%",
        height: "44px",
        padding: "10px 44px 10px 10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        boxSizing: "border-box",
        fontSize: "14px",
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    padding: "30px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    width: "100%",
                    maxWidth: "400px",
                }}
            >
                <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
                    Admin Login
                </h1>

                {/* EMAIL */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                {/* PASSWORD */}
                <div style={{ marginBottom: "25px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                        Password
                    </label>

                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                            placeholder="Enter your password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                color: "#666",
                            }}
                            aria-label="Toggle password"
                        >
                            {showPassword ? (
                                // Eye Off
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M3 3l18 18" />
                                    <path d="M10.6 10.6a3 3 0 004.2 4.2" />
                                    <path d="M9.9 4.2A10.4 10.4 0 0112 4.5c4.6 0 8.6 3 10 7.5a10.5 10.5 0 01-4.3 5.8" />
                                    <path d="M6.2 6.2A10.5 10.5 0 002 12c1.4 4.5 5.4 7.5 10 7.5" />
                                </svg>
                            ) : (
                                // Eye
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M2 12s4-7.5 10-7.5S22 12 22 12s-4 7.5-10 7.5S2 12 2 12z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* INFO LOGIN */}
                <p style={{ marginBottom: "25px", fontSize: "14px", color: "#555" }}>
                    email : admin1@admin.com <br />
                    password : admin
                </p>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
