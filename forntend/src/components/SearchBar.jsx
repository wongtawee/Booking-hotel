import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({
    query,
    onQueryChange,
}) => {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
                <div className={styles.searchIcon}>🔍</div>
                <input
                    type="text"
                    placeholder="ค้นหาโรงแรมหรือสถานที่..."
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className={styles.searchInput}
                />
                {query && (
                    <button 
                        className={styles.clearButton}
                        onClick={() => onQueryChange('')}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
