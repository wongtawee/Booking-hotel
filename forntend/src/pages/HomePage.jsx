import React, { useState, useEffect } from 'react';
import mockHotels from '../data/mockHotels';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import styles from "./HomePage.module.css";

const HomePage = () => {
    const [query, setQuery] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [filteredHotels, setFilteredHotels] = useState(mockHotels);


    // ทำให้กรองข้อมูลใหม่ทุกครั้งที่ query เปลี่ยน
    useEffect(() => {
        const result = mockHotels.filter(
            (hotel) =>
                hotel.name.toLowerCase().includes(query.toLowerCase()) ||
                hotel.location.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredHotels(result);
    }, [query]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>ค้นหาโรงแรม</h1>

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

      <div className={styles.hotelList}>
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
        ) : (
          <p>ไม่พบโรงแรมที่ค้นหา</p>
        )}
      </div>
    </div>
  );
};


export default HomePage;
