import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Profile.module.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/constants';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    memberSince: null
  });
  const navigate = useNavigate();

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('โปรดเข้าสู่ระบบ');
      setLoading(false);
      navigate('/login');
      return;
    }

    // Fetch user profile
    axios
      .get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Backend now returns { success: true, data: { ... } }
        const userData = res.data.data || res.data;
        setName(userData.name || '');
        setEmail(userData.email || '');
        setAddress(userData.address || '');
        setPhone(userData.phone || '');
        setProfileImage(userData.profileImage || '');
        setImagePreview(userData.profileImage || '');
        setUserStats({
          memberSince: userData.createdAt,
          totalBookings: 0,
          totalSpent: 0
        });
      })
      .catch(() => {
        setError('ไม่สามารถดึงข้อมูลผู้ใช้');
      });

    // Fetch user bookings for stats
    axios
      .get(`${API_BASE_URL}${API_ENDPOINTS.BOOKINGS.MY_BOOKINGS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Backend returns { success: true, data: [...] }
        const bookings = res.data.data || res.data || [];
        const totalSpent = bookings
          .filter(b => b.status === 'paid')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        
        setUserStats(prev => ({
          ...prev,
          totalBookings: bookings.length,
          totalSpent: totalSpent
        }));
      })
      .catch(() => {
        // Silent fail - stats are optional
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // Validate file size (max 500KB for better performance)
      if (file.size > 500 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 500KB');
        return;
      }

      // Convert to base64 with compression
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with lower quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedBase64);
          setProfileImage(compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    const token = localStorage.getItem('token');
    const data = { name, address, phone, profileImage };

    setIsSaving(true);
    setError('');
    axios
      .put(`${API_BASE_URL}${API_ENDPOINTS.AUTH.UPDATE_PROFILE}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Backend returns { success: true, data: { ... } }
        const userData = res.data.data || res.data;
        setName(userData.name || '');
        setAddress(userData.address || '');
        setPhone(userData.phone || '');
        
        // Always update profile image
        const newProfileImage = userData.profileImage || '';
        setProfileImage(newProfileImage);
        setImagePreview(newProfileImage);
        
        // Update localStorage
        localStorage.setItem('profileImage', newProfileImage);
        
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          name: userData.name,
          profileImage: newProfileImage
        }));
        
        // Trigger multiple events to ensure Navbar updates
        window.dispatchEvent(new Event('profileUpdated'));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'profileImage',
          newValue: newProfileImage
        }));
        
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 3000);
      })
      .catch(() => {
        setError('ไม่สามารถอัปเดตข้อมูลส่วนตัว');
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        {loading ? (
          <div className={styles.loading}>
            กำลังโหลดข้อมูล...
          </div>
        ) : error ? (
          <p className={styles.errorMessage}>⚠️ {error}</p>
        ) : (
          <>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className={styles.avatarImage} />
                    ) : (
                      <span className={styles.avatarInitials}>{getInitials(name)}</span>
                    )}
                  </div>
                  <label className={styles.avatarUpload}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                    />
                    <span className={styles.uploadIcon}>📷</span>
                  </label>
                </div>
                <div className={styles.headerInfo}>
                  <h1 className={styles.userName}>{name || 'ผู้ใช้'}</h1>
                  <p className={styles.userEmail}>{email}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{userStats.totalBookings}</div>
                  <div className={styles.statLabel}>การจองทั้งหมด</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>฿{userStats.totalSpent.toLocaleString()}</div>
                  <div className={styles.statLabel}>ยอดใช้จ่ายทั้งหมด</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h3 className={styles.sectionTitle}>เมนูด่วน</h3>
              <div className={styles.actionGrid}>
                <Link to="/bookings" className={styles.actionCard}>
                  <span className={styles.actionIcon}>📋</span>
                  <span className={styles.actionText}>การจองของฉัน</span>
                  <span className={styles.actionArrow}>→</span>
                </Link>
                <Link to="/" className={styles.actionCard}>
                  <span className={styles.actionIcon}>🏨</span>
                  <span className={styles.actionText}>ค้นหาโรงแรม</span>
                  <span className={styles.actionArrow}>→</span>
                </Link>
              </div>
            </div>

            {/* Profile Form */}
            <div className={styles.profileForm}>
              <h3 className={styles.sectionTitle}>ข้อมูลส่วนตัว</h3>
              
              <div className={styles.formGrid}>
                <label className={styles.label}>
                  <span className={styles.labelText}>👤 ชื่อ-นามสกุล</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>📧 อีเมล</span>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className={styles.input}
                    title="ไม่สามารถแก้ไขอีเมลได้"
                  />
                  <small className={styles.helpText}>
                    * ไม่สามารถแก้ไขอีเมลได้
                  </small>
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>📱 เบอร์โทรศัพท์</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        setPhone(value);
                      }
                    }}
                    className={styles.input}
                    placeholder="0812345678"
                    maxLength="10"
                  />
                </label>

                <label className={styles.label}>
                  <span className={styles.labelText}>🏠 ที่อยู่</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={styles.input}
                    placeholder="กรอกที่อยู่ของคุณ"
                  />
                </label>
              </div>

              <button
                className={styles.saveButton}
                onClick={handleUpdateProfile}
                disabled={isSaving}
              >
                {isSaving ? '⏳ กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>

              {editSuccess && <p className={styles.successMessage}>✅ บันทึกข้อมูลสำเร็จ!</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
