import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/constants";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Validation functions
  const validateName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'กรุณากรอกชื่อ';
    if (trimmed.length < 2) return 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    if (trimmed.length > 50) return 'ชื่อต้องไม่เกิน 50 ตัวอักษร';
    if (!/^[a-zA-Zก-๙\s]+$/.test(trimmed)) return 'ชื่อต้องเป็นตัวอักษรเท่านั้น';
    return '';
  };

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
    
    // Check for valid domain extension (at least 2 characters)
    const parts = trimmed.split('@');
    if (parts.length !== 2) return 'รูปแบบอีเมลไม่ถูกต้อง';
    
    const domain = parts[1];
    const domainParts = domain.split('.');
    
    // Check domain has at least 2 parts and last part is at least 2 chars
    if (domainParts.length < 2) return 'โดเมนอีเมลไม่ถูกต้อง';
    if (domainParts[domainParts.length - 1].length < 2) return 'โดเมนอีเมลไม่ถูกต้อง';
    
    // Check for common typos in popular domains
    const typos = {
      'gmai.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmaill.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com'
    };
    
    if (typos[domain]) {
      return `คุณหมายถึง ${parts[0]}@${typos[domain]} ใช่ไหม?`;
    }
    
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'กรุณากรอกรหัสผ่าน';
    if (value.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    if (value.length > 128) return 'รหัสผ่านต้องไม่เกิน 128 ตัวอักษร';
    if (!/(?=.*[0-9])/.test(value)) return 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว';
    if (!/(?=.*[a-zA-Z])/.test(value)) return 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 1 ตัว';
    return '';
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    let error = '';
    if (field === 'name') error = validateName(name);
    if (field === 'email') error = validateEmail(email);
    if (field === 'password') error = validatePassword(password);
    
    setErrors({ ...errors, [field]: error });
  };

  // ฟังก์ชันสำหรับการลงทะเบียน
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError
      });
      setTouched({ name: true, email: true, password: true });
      return;
    }

    setErrors({});

    try {
      // ส่งข้อมูลไปที่ Backend
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      // รับข้อมูลกลับจาก Backend
      const data = await res.json();

      // ตรวจสอบผลลัพธ์จากการสมัคร
      if (!res.ok) {
        // Handle specific errors
        if (data.message?.includes('อีเมลนี้มีอยู่ในระบบแล้ว')) {
          setErrors({ email: 'อีเมลนี้มีอยู่ในระบบแล้ว' });
        } else {
          setErrors({ general: data.message || "สมัครสมาชิกไม่สำเร็จ" });
        }
        return;
      }

      // ถ้าสมัครสำเร็จ เก็บ token ลงใน localStorage
      localStorage.setItem("token", data.token);

      // Fetch user profile to get user data
      try {
        const profileRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
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

      // นำทางไปหน้า Profile หลังจากสมัครสมาชิกสำเร็จ
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
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 4
          }}>
            PakStay
          </div>
        </div>
        <h1 className={styles.title}>สร้างบัญชีใหม่</h1>

        {errors.general && <div className={styles.errorMessage}>⚠️ {errors.general}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="👤 ชื่อ-นามสกุล"
              className={`${styles.inputField} ${touched.name && errors.name ? styles.inputError : ''}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) {
                  setErrors({ ...errors, name: validateName(e.target.value) });
                }
              }}
              onBlur={() => handleBlur('name')}
              autoComplete="name"
            />
            {touched.name && errors.name && (
              <div className={styles.fieldError}>⚠️ {errors.name}</div>
            )}
          </div>

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
                placeholder="🔒 รหัสผ่าน (อย่างน้อย 6 ตัว มีตัวเลข)"
                className={`${styles.inputField} ${touched.password && errors.password ? styles.inputError : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    setErrors({ ...errors, password: validatePassword(e.target.value) });
                  }
                }}
                onBlur={() => handleBlur('password')}
                autoComplete="new-password"
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
            {touched.password && !errors.password && password && (
              <div className={styles.successMessage}>✅ รหัสผ่านแข็งแรง</div>
            )}
          </div>

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
