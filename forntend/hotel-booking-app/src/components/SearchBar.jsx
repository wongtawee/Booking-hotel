import React from 'react';

const SearchBar = ({
    query,
    onQueryChange,
}) => {
    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <input
                    type="text"
                    placeholder="ค้นหาโรงแรมหรือสถานที่..."
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    style={styles.input}
                />
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto 20px',
        padding: '0 10px',
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
    },
    input: {
        flex: '1 1 250px',
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid #f6c90e', // ขอบสีเหลืองนวล
        borderRadius: '8px',
        minWidth: '200px',
        backgroundColor: '#fffef9',
        color: '#333333', // ข้อความสีเทาเข้ม
    },
};

export default SearchBar;
