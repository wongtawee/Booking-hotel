import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchHotels } from '../../services/hotelService';
import HotelCard from '../../components/hotel/HotelCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await searchHotels(query);
                setHotels(response.data || []);
            } catch (err) {
                setError(err.message || 'Failed to search hotels');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return <LoadingSpinner message="กำลังค้นหา..." />;
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                <h2>เกิดข้อผิดพลาด</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px' }}>
            <h1>ผลการค้นหา: "{query}"</h1>
            <p style={{ color: '#666', marginBottom: '24px' }}>
                พบ {hotels.length} โรงแรม
            </p>
            
            {hotels.length > 0 ? (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {hotels.map((hotel) => (
                        <HotelCard key={hotel._id} hotel={hotel} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '18px', color: '#666' }}>
                        ไม่พบโรงแรมที่ตรงกับคำค้นหา
                    </p>
                    <p style={{ marginTop: '12px', color: '#999' }}>
                        ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
