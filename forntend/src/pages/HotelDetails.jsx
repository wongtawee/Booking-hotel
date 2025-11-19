import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockHotels from '../data/mockHotels';
import Slider from 'react-slick';
import styles from "./HotelDetails.module.css";

const HotelDetails = () => {
    const { id } = useParams();
    const hotel = mockHotels.find((hotel) => hotel.id === id);
    const navigate = useNavigate();  // ใช้ useNavigate สำหรับการย้อนกลับ

    if (!hotel) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>ไม่พบโรงแรม</h2>
            </div>
        );
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const amenities = ['Wi-Fi ฟรี', 'ที่จอดรถ', 'สระว่ายน้ำ', 'เครื่องปรับอากาศ', 'อาหารเช้า', 'ทีวี', 'บริการรูมเซอร์วิส'];

 
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.mainContent}>
          {/* สไลเดอร์รูปภาพ */}
          <div className={styles.sliderSection}>
            <Slider {...settings}>
              {hotel.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`${hotel.name} ${index}`}
                    className={styles.image}
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* รายละเอียดโรงแรม */}
          <div className={styles.details}>
            <h1 className={styles.title}>
              {hotel.name}
              <span className={styles.ratingBadge}>⭐ {hotel.rating}</span>
            </h1>
            <p className={styles.location}>{hotel.location}</p>
            <hr className={styles.divider} />
            <p className={styles.description}>{hotel.description}</p>
            <p className={styles.price}>
              ราคา: {hotel.price.toLocaleString()} บาท / คืน
            </p>
            <button
              onClick={() => navigate(`/booking/${hotel.id}`)}
              className={styles.button}
            >
              จองเลย
            </button>

            {/* สิ่งอำนวยความสะดวก */}
            <div className={styles.amenitiesSection}>
              <h3 className={styles.subTitle}>สิ่งอำนวยความสะดวก</h3>
              <ul className={styles.amenitiesList}>
                {amenities.map((item, i) => (
                  <li key={i} className={styles.amenityItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* แผนที่ */}
            <div className={styles.mapSection}>
              <h2 className={styles.subTitle}>แผนที่ที่ตั้ง</h2>
              <iframe
                title="Google Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  hotel.location
                )}&output=embed`}
                className={styles.map}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default HotelDetails;
