import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ตรวจจับการ resize เพื่อสลับโหมด mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false); // ปิดเมนูถ้า desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🏨</span>
        <h1 style={styles.logoText}>HotelBooking</h1>
      </div>

      {isMobile && (
        <div style={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') toggleMenu() }}>
          ☰
        </div>
      )}

      {/* เมนู */}
      {(!isMobile || menuOpen) && (
        <ul style={{ ...styles.menu, ...(isMobile ? styles.menuMobile : {}) }}>
          <li style={styles.menuItem}>
            <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>
              หน้าหลัก
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/profile" style={styles.link} onClick={() => setMenuOpen(false)}>
              โปรไฟล์
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/booking-details" style={styles.link} onClick={() => setMenuOpen(false)}>
              การจองของฉัน
            </Link>
          </li>

          {token ? (
            <li style={styles.menuItem}>
              <button onClick={handleLogout} style={styles.logoutButton}>
                ออกจากระบบ
              </button>
            </li>
          ) : (
            <li style={styles.menuItem}>
              <Link to="/login" style={styles.link} onClick={() => setMenuOpen(false)}>
                เข้าสู่ระบบ
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(90deg, #f6c90e, #fceea7)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    boxSizing: "border-box",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    margin: 0,
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    userSelect: "none",
  },
  hamburger: {
    fontSize: 28,
    cursor: "pointer",
    userSelect: "none",
    color: "#333",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
    gap: 16,
    alignItems: "center",
  },
  menuMobile: {
    position: "absolute",
    top: 56,
    right: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    minWidth: 180,
  },
  menuItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
    padding: "8px 12px",
    borderRadius: 6,
    transition: "background-color 0.3s ease",
    userSelect: "none",
  },
  logoutButton: {
    backgroundColor: "#f6c90e",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    userSelect: "none",
  },
};

export default Navbar;
