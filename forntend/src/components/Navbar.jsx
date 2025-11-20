import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Safely parse user from localStorage
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr || userStr === "undefined") return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };
  
  const user = getUserFromStorage();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [scrolled, setScrolled] = useState(false);
  
  const profileRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      ...styles.navbar,
      ...(scrolled ? styles.navbarScrolled : {})
    }}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏨</span>
            <span style={styles.logoText}>LuxeStay</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        {!isMobile && (
          <ul style={styles.menu}>
            <li>
              <Link 
                to="/" 
                style={{
                  ...styles.link,
                  ...(isActive('/') ? styles.linkActive : {})
                }}
              >
                <span style={styles.linkIcon}>🏠</span>
                หน้าแรก
              </Link>
            </li>
            {token && (
              <li>
                <Link 
                  to="/bookings" 
                  style={{
                    ...styles.link,
                    ...(isActive('/bookings') ? styles.linkActive : {})
                  }}
                >
                  <span style={styles.linkIcon}>📅</span>
                  การจองของฉัน
                </Link>
              </li>
            )}
            <li>
              <Link 
                to="/about" 
                style={{
                  ...styles.link,
                  ...(isActive('/about') ? styles.linkActive : {})
                }}
              >
                <span style={styles.linkIcon}>ℹ️</span>
                เกี่ยวกับเรา
              </Link>
            </li>
          </ul>
        )}

        {/* Right Side */}
        <div style={styles.rightSection}>
          {token ? (
            // Profile Dropdown
            <div style={styles.profileContainer} ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={styles.profileButton}
              >
                <div style={styles.avatar}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <span style={styles.profileName}>{user?.name || 'User'}</span>
                <span style={styles.dropdownArrow}>▼</span>
              </button>

              {profileOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.avatarLarge}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                    <div>
                      <div style={styles.dropdownName}>{user?.name || 'User'}</div>
                      <div style={styles.dropdownEmail}>{user?.email || ''}</div>
                    </div>
                  </div>
                  <div style={styles.dropdownDivider}></div>
                  <Link 
                    to="/profile" 
                    style={styles.dropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <span>👤</span> โปรไฟล์
                  </Link>
                  <Link 
                    to="/bookings" 
                    style={styles.dropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <span>📅</span> การจองของฉัน
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      style={styles.dropdownItem}
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>⚙️</span> จัดการระบบ
                    </Link>
                  )}
                  <div style={styles.dropdownDivider}></div>
                  <button 
                    onClick={handleLogout}
                    style={styles.dropdownItemButton}
                  >
                    <span>🚪</span> ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginButton}>
                เข้าสู่ระบบ
              </Link>
              <Link to="/register" style={styles.registerButton}>
                สมัครสมาชิก
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={styles.hamburger}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <Link 
            to="/" 
            style={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            <span>🏠</span> หน้าแรก
          </Link>
          {token && (
            <Link 
              to="/bookings" 
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              <span>📅</span> การจองของฉัน
            </Link>
          )}
          <Link 
            to="/about" 
            style={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            <span>ℹ️</span> เกี่ยวกับเรา
          </Link>
          {token && (
            <>
              <div style={styles.mobileDivider}></div>
              <Link 
                to="/profile" 
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                <span>👤</span> โปรไฟล์
              </Link>
              <button 
                onClick={handleLogout}
                style={styles.mobileLogoutButton}
              >
                <span>🚪</span> ออกจากระบบ
              </button>
            </>
          )}
        </div>
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
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
    padding: "0",
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
  navbarScrolled: {
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.12)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoLink: {
    textDecoration: "none",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
  },
  logoIcon: {
    fontSize: 32,
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
    gap: 8,
    alignItems: "center",
  },
  link: {
    color: "#4a5568",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    padding: "10px 20px",
    borderRadius: 8,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  linkIcon: {
    fontSize: 18,
  },
  linkActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  profileContainer: {
    position: "relative",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 16px",
    background: "#f7fafc",
    border: "2px solid #e2e8f0",
    borderRadius: 50,
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: 15,
    fontWeight: 600,
    color: "#2d3748",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  profileName: {
    maxWidth: 120,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dropdownArrow: {
    fontSize: 10,
    color: "#718096",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    minWidth: 280,
    padding: 8,
    zIndex: 1001,
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  dropdownName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3748",
  },
  dropdownEmail: {
    fontSize: 13,
    color: "#718096",
    marginTop: 2,
  },
  dropdownDivider: {
    height: 1,
    background: "#e2e8f0",
    margin: "8px 0",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    color: "#4a5568",
    textDecoration: "none",
    borderRadius: 8,
    transition: "all 0.2s ease",
    fontSize: 15,
    fontWeight: 500,
  },
  dropdownItemButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    color: "#e53e3e",
    background: "none",
    border: "none",
    borderRadius: 8,
    transition: "all 0.2s ease",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
  },
  authButtons: {
    display: "flex",
    gap: 12,
  },
  loginButton: {
    padding: "10px 24px",
    background: "transparent",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.3s ease",
    display: "inline-block",
  },
  registerButton: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.3s ease",
    display: "inline-block",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  hamburger: {
    fontSize: 28,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#2d3748",
    padding: 8,
  },
  mobileMenu: {
    background: "#fff",
    borderTop: "1px solid #e2e8f0",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    color: "#4a5568",
    textDecoration: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  mobileDivider: {
    height: 1,
    background: "#e2e8f0",
    margin: "8px 0",
  },
  mobileLogoutButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    color: "#e53e3e",
    background: "none",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
};

export default Navbar;
