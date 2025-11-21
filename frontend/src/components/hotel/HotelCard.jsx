import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link 
            to={`/hotel/${hotel._id || hotel.id}`} 
            style={{
                ...styles.card,
                ...(isHovered ? styles.cardHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.imageContainer}>
                {!imageLoaded && (
                    <div style={styles.imagePlaceholder}>
                        <span style={styles.loadingIcon}>🏨</span>
                    </div>
                )}
                <img 
                    src={hotel.images?.[0] || 'https://via.placeholder.com/400x300?text=Hotel+Image'} 
                    alt={hotel.name} 
                    style={{
                        ...styles.image,
                        ...(imageLoaded ? styles.imageLoaded : styles.imageHidden)
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        setImageLoaded(true);
                    }}
                />
                <div style={styles.ratingBadge}>
                    <span style={styles.star}>⭐</span>
                    <span style={styles.ratingText}>{hotel.rating || '0.0'}</span>
                </div>
            </div>
            
            <div style={styles.content}>
                <h3 style={styles.title}>{hotel.name}</h3>
                <p style={styles.location}>
                    <span style={styles.locationIcon}>📍</span>
                    {hotel.location}
                </p>
                
                <p style={styles.description}>
                    {hotel.description?.length > 80 
                        ? `${hotel.description.substring(0, 80)}...` 
                        : hotel.description}
                </p>

                {hotel.amenities && hotel.amenities.length > 0 && (
                    <div style={styles.amenities}>
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} style={styles.amenityTag}>
                                {amenity}
                            </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                            <span style={styles.amenityMore}>
                                +{hotel.amenities.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div style={styles.footer}>
                    <div style={styles.priceSection}>
                        <span style={styles.priceLabel}>ราคาเริ่มต้น</span>
                        <div style={styles.priceContainer}>
                            <span style={styles.price}>
                                ฿1,000
                            </span>
                            <span style={styles.priceUnit}>/คืน</span>
                        </div>
                    </div>
                    <button style={styles.button}>
                        ดูรายละเอียด →
                    </button>
                </div>
            </div>
        </Link>
    );
};

const styles = {
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
    },
    cardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 240,
        overflow: 'hidden',
        backgroundColor: '#f7fafc',
    },
    imagePlaceholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    loadingIcon: {
        fontSize: 48,
        opacity: 0.5,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    },
    imageHidden: {
        opacity: 0,
    },
    imageLoaded: {
        opacity: 1,
    },
    ratingBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '8px 12px',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    star: {
        fontSize: 16,
    },
    ratingText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2d3748',
    },
    content: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#2d3748',
        lineHeight: 1.3,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    location: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: '#718096',
        marginBottom: 12,
        fontSize: 14,
    },
    locationIcon: {
        fontSize: 14,
    },
    description: {
        fontSize: 14,
        color: '#4a5568',
        lineHeight: 1.6,
        marginBottom: 16,
        flexGrow: 1,
    },
    amenities: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    amenityTag: {
        fontSize: 12,
        padding: '4px 10px',
        background: '#edf2f7',
        color: '#4a5568',
        borderRadius: 12,
        fontWeight: 500,
    },
    amenityMore: {
        fontSize: 12,
        padding: '4px 10px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: 12,
        fontWeight: 600,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTop: '1px solid #e2e8f0',
        marginTop: 'auto',
    },
    priceSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    priceLabel: {
        fontSize: 12,
        color: '#718096',
        fontWeight: 500,
    },
    priceContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    priceUnit: {
        fontSize: 14,
        color: '#718096',
        fontWeight: 500,
    },
    button: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
};

export default HotelCard;
