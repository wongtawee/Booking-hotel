import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

// URL ของ API Backend (แนะนำใช้ .env ในโปรเจกต์จริง)
const API_URL = "http://localhost:5000/api/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || data.msg || "เข้าสู่ระบบไม่สำเร็จ");
      }

      localStorage.setItem("token", data.token);
      
      // Fetch user profile to get user data and profileImage
      try {
        const profileRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          // Backend returns { success: true, data: {...} }
          const userData = profileData.data || profileData;
          localStorage.setItem('user', JSON.stringify({
            name: userData.name,
            email: userData.email,
            userId: userData.userId
          }));
          localStorage.setItem('profileImage', userData.profileImage || '');
        }
      } catch (err) {
        console.log('Could not fetch profile');
      }
      
      navigate("/home");
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48 }}>🏨</span>
        </div>
        <h1 className={styles.title}>ยินดีต้อนรับกลับ</h1>

        {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="📧 อีเมล"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="🔒 รหัสผ่าน"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" className={styles.submitButton}>
            เข้าสู่ระบบ →
          </button>
        </form>

        <p className={styles.registerLink}>
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className={styles.link}>สมัครสมาชิกเลย</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
