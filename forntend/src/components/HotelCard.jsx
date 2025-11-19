import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
    return (
        <div style={styles.card}>
            {/* แสดงแค่ภาพแรกจากอาร์เรย์ images */}
            <img src={hotel.images[0]} alt={hotel.name} style={styles.image} />
            <div style={styles.content}>
                <h2 style={styles.title}>{hotel.name}</h2>
                <p style={styles.location}>{hotel.location}</p>
                <p>⭐ {hotel.rating} | ฿{hotel.price}/คืน</p>
                <p style={styles.description}>{hotel.description}</p>
                
                {/* ปุ่มดูรายละเอียด */}
                <div style={styles.buttonContainer}>
                    <Link to={`/hotel/${hotel.id}`} style={styles.button}>
                        ดูรายละเอียด
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#fffef9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
        margin: '30px',
        width: '280px', // กำหนดขนาดการ์ด
        display: 'flex',
        flexDirection: 'column', // ใช้ flex เพื่อให้การจัดตำแหน่งเรียงในแนวตั้ง
        justifyContent: 'space-between', // จัดเนื้อหาต่างๆ ให้มีระยะห่างเท่ากัน


    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderBottom: '2px solid #fceea7',
    },
    content: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',  // ใช้ flex ให้ทุกอย่างเรียงในแนวตั้ง
        flexGrow: 1,  // ทำให้เนื้อหาค่อยๆ เติบโตในกรณีที่มีเนื้อหายาว
    },
    title: {
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#333',
    },
    location: {
        color: '#888',
        marginBottom: '4px',
        fontSize: '0.95rem',
    },
    description: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '12px',
        flexGrow: 1,  // ทำให้พื้นที่สำหรับคำอธิบายเติบโตและไม่บีบเนื้อหาด้านล่าง
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',  // จัดปุ่มให้ตรงกลาง
        marginTop: 'auto',  // ใช้ margin-top:auto เพื่อให้ปุ่มอยู่ด้านล่างสุด
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#f6c90e',
        color: '#fff',
        textDecoration: 'none',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'background-color 0.3s ease',
        display: 'inline-block',
        textAlign: 'center',
    },
};

export default HotelCard;
