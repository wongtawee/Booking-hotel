// src/services/authService.js
import axios from 'axios';

    // กำหนด URL ของ API สำหรับติดต่อกับ Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

// ฟังก์ชัน login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;

    // เก็บ JWT token ใน localStorage
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
  console.error('Error:', error);  // ใช้ 'error' เพื่อแสดงใน console
  throw error;  // ทำการ throw error เพื่อให้ไปจับที่ส่วนอื่นของโปรแกรม
}

};

// ฟังก์ชัน register
export const registerUser = async (email, password, name) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, name });
    console.log('response :>> ', response);
    const { token } = response.data;

    // เก็บ JWT token ใน localStorage
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
  console.error('Error:', error);  // ใช้ 'error' เพื่อแสดงใน console
  throw error;  // ทำการ throw error เพื่อให้ไปจับที่ส่วนอื่นของโปรแกรม
}

};
