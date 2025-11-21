import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/constants";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (value) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return 'กรุณากรอกอีเมล';
    
    // Check for Thai characters or other non-ASCII characters
    if (/[ก-๙]/.test(value)) return 'อีเมลต้องเป็นภาษาอังกฤษเท่านั้น';
    // eslint-disable-next-line no-control-regex
    if (/[^\x00-\x7F]/.test(value)) return 'อีเมลต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น';
    
    // Basic email format - strict validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return 'รูปแบบอีเมลไม่ถูกต้อง (ใช้ a-z, 0-9, ., _, - เท่านั้น)';
    
    // Check for valid domain
    const parts = trimmed.split('@');
    if (parts.length !== 2) return 'รูปแบบอีเมลไม่ถูกต้อง';
    
    const domain = parts[1];
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      return 'โดเมนอีเมลไม่ถูกต้อง';
    }
    
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'กรุณากรอกรหัสผ่าน';
    return '';
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    let error = '';
    if (field === 'email') error = validateEmail(email);
    if (field === 'password') error = validatePassword(password);
    
    setErrors({ ...errors, [field]: error });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      setTouched({ email: true, password: true });
      return;
    }

    setErrors({});

    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || data.msg || "เข้าสู่ระบบไม่สำเร็จ" });
        return;
      }

      localStorage.setItem("token", data.token);
      
      // Fetch user profile to get user data and profileImage
      try {
        const profileRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          // Backend returns { success: true, data: {...} }
          const userData = profileData.data || profileData;
          const profileImage = userData.profileImage || '';
          
          localStorage.setItem('user', JSON.stringify({
            name: userData.name,
            email: userData.email,
            userId: userData.userId,
            profileImage: profileImage
          }));
          localStorage.setItem('profileImage', profileImage);
          
          // Trigger event for Navbar to update
          window.dispatchEvent(new Event('profileUpdated'));
        }
      } catch (error) {
        // Silent fail - user data will be fetched on profile page
      }
      
      navigate("/home");
    } catch {
      setErrors({ general: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏨</div>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 4
          }}>
            PakStay
          </div>
        </div>
        <h1 className={styles.title}>ยินดีต้อนรับกลับ</h1>

        {errors.general && <div className={styles.errorMessage}>⚠️ {errors.general}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              placeholder="📧 อีเมล"
              className={`${styles.inputField} ${touched.email && errors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors({ ...errors, email: validateEmail(e.target.value) });
                }
              }}
              onBlur={() => handleBlur('email')}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <div className={styles.fieldError}>⚠️ {errors.email}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="🔒 รหัสผ่าน"
                className={`${styles.inputField} ${touched.password && errors.password ? styles.inputError : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    setErrors({ ...errors, password: validatePassword(e.target.value) });
                  }
                }}
                onBlur={() => handleBlur('password')}
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {touched.password && errors.password && (
              <div className={styles.fieldError}>⚠️ {errors.password}</div>
            )}
          </div>

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
