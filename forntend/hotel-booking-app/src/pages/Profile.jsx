import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('โปรดเข้าสู่ระบบ');
      setLoading(false);
      navigate('/login');
      return;
    }

    axios
      .get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setAddress(res.data.address || '');
        setPhone(res.data.phone || '');
      })
      .catch((err) => {
        console.error(err);
        setError('ไม่สามารถดึงข้อมูลผู้ใช้');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleUpdateProfile = () => {
    const token = localStorage.getItem('token');
    const data = { name, address, phone };

    setIsSaving(true);
    axios
      .put('/api/auth/me', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setName(res.data.name);
        setAddress(res.data.address);
        setPhone(res.data.phone);
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setError('ไม่สามารถอัปเดตข้อมูลส่วนตัว');
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        <h2 className={styles.title}>ข้อมูลส่วนตัว</h2>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.userInfo}>
            <label className={styles.label}>
              ชื่อ:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              อีเมล:
              <input
                type="email"
                value={email}
                disabled
                className={styles.input}
                style={{ backgroundColor: '#f3f3f3', color: '#666' }}
              />
            </label>

            <label className={styles.label}>
              เบอร์โทรศัพท์:
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhone(value);
                  }
                }}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              ที่อยู่:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.input}
              />
            </label>

            <button
              className={styles.saveButton}
              onClick={handleUpdateProfile}
              disabled={isSaving}
              style={isSaving ? { backgroundColor: '#9e9e9e', cursor: 'not-allowed' } : {}}
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>

            {editSuccess && <p className={styles.successMessage}>บันทึกสำเร็จ!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
