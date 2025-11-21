import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";

// API URL ที่เชื่อมต่อกับ Backend (ใช้ .env สำหรับโปรเจกต์จริง)
const API_URL = "http://localhost:5000/api/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการลงทะเบียน
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // ล้างข้อความผิดพลาด

    try {
      // ส่งข้อมูลไปที่ Backend
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // รับข้อมูลกลับจาก Backend
      const data = await res.json();

      // ตรวจสอบผลลัพธ์จากการสมัคร
      if (!res.ok) {
        return setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
      }

      // ถ้าสมัครสำเร็จ เก็บ token ลงใน localStorage
      localStorage.setItem("token", data.token);

      // นำทางไปหน้า Profile หลังจากสมัครสมาชิกสำเร็จ
      navigate("/home");
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

   return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 48 }}>✨</span>
        </div>
        <h1 className={styles.title}>สร้างบัญชีใหม่</h1>

        {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="👤 ชื่อ-นามสกุล"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
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
            placeholder="🔒 รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            autoComplete="new-password"
          />
          <button type="submit" className={styles.submitButton}>
            สมัครสมาชิก →
          </button>
        </form>

        <p className={styles.loginLink}>
          มีบัญชีอยู่แล้ว?{" "}
          <a href="/login" className={styles.link}>
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  );
};


export default RegisterPage;
