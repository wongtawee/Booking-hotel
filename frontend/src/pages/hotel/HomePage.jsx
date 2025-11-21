import React, { useState, useEffect } from 'react';
import HotelCard from '../../components/hotel/HotelCard';
import SearchBar from '../../components/hotel/SearchBar';
import { getAllHotels } from '../../services/hotelService';
import styles from "./HomePage.module.css";

const HomePage = () => {
    const [query, setQuery] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch hotels from API
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllHotels({ page, limit: 10, search: query });
                setHotels(response.data);
                setFilteredHotels(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.pages);
                }
            } catch (err) {
                setError(err.message || 'Failed to load hotels');
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [page, query]);

    // Filter hotels based on query
    useEffect(() => {
        if (query) {
            const result = hotels.filter(
                (hotel) =>
                    hotel.name.toLowerCase().includes(query.toLowerCase()) ||
                    hotel.location.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredHotels(result);
        } else {
            setFilteredHotels(hotels);
        }
    }, [query, hotels]);

  return (
    <div className={styles.container}>
      {/* Hero Section with Search */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>ค้นหาที่พักในฝันของคุณ</h1>
          <p className={styles.heroSubtitle}>
            เลือกจากโรงแรมหลากหลายสไตล์ ราคาดีที่สุด พร้อมบริการตลอด 24 ชั่วโมง
          </p>
          
          {/* Search Bar integrated in Hero */}
          <div className={styles.searchWrapper}>
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              children={children}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>โรงแรมแนะนำ</h2>
          {filteredHotels.length > 0 && (
            <button className={styles.viewAllButton}>
              ดูทั้งหมด ({filteredHotels.length})
            </button>
          )}
        </div>

        {loading && (
          <div className={styles.loading}>
            กำลังโหลดโรงแรม
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠️ เกิดข้อผิดพลาด: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredHotels.length > 0 ? (
              <div className={styles.hotelList}>
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>🔍 ไม่พบโรงแรมที่ค้นหา</h3>
                <p>ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← ก่อนหน้า
                </button>
                <span>หน้า {page} / {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ถัดไป →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default HomePage;
