import { useState } from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  const features = [
    {
      icon: '🛏️',
      title: 'ห้องพักสะอาด สะดวกสบาย',
      description: 'ห้องพักที่ออกแบบเรียบง่าย ครบครันด้วยสิ่งอำนวยความสะดวกที่จำเป็น',
      color: '#667eea'
    },
    {
      icon: '📍',
      title: 'ทำเลสะดวก',
      description: 'ตั้งอยู่ใกล้แหล่งท่องเที่ยว ห้างสรรพสินค้า และสถานีขนส่ง',
      color: '#48bb78'
    },
    {
      icon: '💁',
      title: 'บริการเป็นมิตร',
      description: 'ทีมงานที่อบอุ่นและเป็นมิตร พร้อมให้บริการตลอด 24 ชั่วโมง',
      color: '#ed8936'
    },
    {
      icon: '📶',
      title: 'สิ่งอำนวยความสะดวกครบครัน',
      description: 'Wi-Fi ฟรี ที่จอดรถ ห้องอาหาร และฟิตเนส',
      color: '#9f7aea'
    },
    {
      icon: '💰',
      title: 'ราคาคุ้มค่า',
      description: 'ราคาที่เหมาะสมกับคุณภาพ ไม่มีค่าใช้จ่ายแอบแฝง',
      color: '#f56565'
    },
    {
      icon: '✅',
      title: 'จองง่าย ยกเลิกฟรี',
      description: 'ระบบจองออนไลน์ง่ายๆ ยกเลิกฟรีก่อน 24 ชั่วโมง',
      color: '#38b2ac'
    }
  ];

  const stats = [
    { number: '20+', label: 'โรงแรมในเครือ', icon: '🏨' },
    { number: '10+', label: 'ปีของประสบการณ์', icon: '⭐' },
    { number: '50K+', label: 'แขกที่พึงพอใจ', icon: '😊' },
    { number: '4.5/5', label: 'คะแนนรีวิว', icon: '⭐' }
  ];

  const locations = [
    { city: 'กรุงเทพฯ', count: 5, icon: '🏙️' },
    { city: 'เชียงใหม่', count: 3, icon: '⛰️' },
    { city: 'ภูเก็ต', count: 4, icon: '🏖️' },
    { city: 'พัทยา', count: 2, icon: '🌊' },
    { city: 'หัวหิน', count: 2, icon: '🏝️' },
    { city: 'เกาะสมุย', count: 2, icon: '🥥' },
    { city: 'ขอนแก่น', count: 1, icon: '🌾' },
    { city: 'อุดรธานี', count: 1, icon: '🏛️' }
  ];

  const team = [
    {
      name: 'ทีมบริการลูกค้า',
      description: 'พร้อมให้คำปรึกษาและช่วยเหลือตลอด 24 ชั่วโมง',
      icon: '👥',
      color: '#667eea'
    },
    {
      name: 'ทีมแม่บ้าน',
      description: 'ดูแลความสะอาดและความเป็นระเบียบของห้องพัก',
      icon: '🧹',
      color: '#48bb78'
    },
    {
      name: 'ทีมรักษาความปลอดภัย',
      description: 'คอยดูแลความปลอดภัยของแขกตลอด 24 ชั่วโมง',
      icon: '🛡️',
      color: '#ed8936'
    },
    {
      name: 'ทีมอาหารและเครื่องดื่ม',
      description: 'มอบประสบการณ์อาหารที่อร่อยและหลากหลาย',
      icon: '🍽️',
      color: '#9f7aea'
    }
  ];

  return (
    <div className={styles.wrapper}>
      {/* Hero Section with Parallax Effect */}
      <div className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroPattern}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>🏨</div>
          <h1 className={styles.heroTitle}>
            ยินดีต้อนรับสู่ <span className={styles.brandName}>PakStay</span>
          </h1>
          <p className={styles.heroSubtitle}>
            เครือโรงแรมคุณภาพดี ราคาเป็นมิตร<br/>
            พร้อมมอบประสบการณ์พักผ่อนที่อบอุ่นและสะดวกสบาย
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton} onClick={() => window.location.href = '/'}>
              <span className={styles.buttonIcon}>🔍</span>
              เริ่มค้นหาโรงแรม
            </button>
            <button className={styles.secondaryButton} onClick={() => setActiveTab('contact')}>
              <span className={styles.buttonIcon}>📞</span>
              ติดต่อเรา
            </button>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className={styles.container}>
        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span className={styles.tabIcon}>ℹ️</span>
            เกี่ยวกับเรา
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'features' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('features')}
          >
            <span className={styles.tabIcon}>✨</span>
            จุดเด่น
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'locations' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            <span className={styles.tabIcon}>📍</span>
            สาขา
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'team' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <span className={styles.tabIcon}>👥</span>
            ทีมงาน
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'contact' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className={styles.tabIcon}>📞</span>
            ติดต่อ
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className={styles.aboutContent}>
              <div className={styles.contentCard}>
                <div className={styles.cardIcon}>🏨</div>
                <h2 className={styles.cardTitle}>เราคือใคร</h2>
                <p className={styles.cardText}>
                  PakStay เป็นเครือโรงแรมระดับ 3-4 ดาว ที่ก่อตั้งขึ้นด้วยความตั้งใจที่จะมอบที่พักคุณภาพดี 
                  ในราคาที่คุ้มค่า เหมาะสำหรับทั้งนักท่องเที่ยวและนักธุรกิจ ด้วยโรงแรมในเครือที่กระจายอยู่ทั่วประเทศไทย 
                  เราพร้อมให้บริการด้วยมาตรฐานที่ดี สิ่งอำนวยความสะดวกครบครัน และทีมงานที่เป็นมิตรพร้อมดูแลคุณตลอด 24 ชั่วโมง
                </p>
              </div>

              <div className={styles.contentCard}>
                <div className={styles.cardIcon}>🎯</div>
                <h2 className={styles.cardTitle}>ปรัชญาของเรา</h2>
                <div className={styles.philosophyBox}>
                  <div className={styles.philosophyQuote}>"พักดี ราคาดี ใจดี"</div>
                  <p className={styles.cardText}>
                    เราเชื่อว่าการเดินทางที่ดีไม่จำเป็นต้องแพง PakStay มุ่งมั่นที่จะเป็นตัวเลือกที่ดีที่สุด
                    สำหรับผู้ที่ต้องการที่พักคุณภาพในราคาที่เข้าถึงได้ ไม่ว่าจะเป็นการเดินทางท่องเที่ยว ทำงาน 
                    หรือพักผ่อนกับครอบครัว เราพร้อมมอบที่พักที่สะอาด สะดวกสบาย และบริการที่เป็นกันเอง
                  </p>
                </div>
              </div>

              <div className={styles.contentCard}>
                <div className={styles.cardIcon}>🌟</div>
                <h2 className={styles.cardTitle}>ทำไมต้อง PakStay?</h2>
                <p className={styles.cardText}>
                  เราเข้าใจดีว่าการเดินทางแต่ละครั้งมีความสำคัญ ไม่ว่าจะเป็นทริปท่องเที่ยวกับครอบครัว 
                  การเดินทางเพื่อธุรกิจ หรือการพักผ่อนช่วงวันหยุด PakStay มอบที่พักที่สะอาด สะดวกสบาย 
                  พร้อมสิ่งอำนวยความสะดวกที่จำเป็น ในราคาที่ไม่ทำให้คุณต้องกังวล 
                  เพราะเราเชื่อว่าทุกคนควรได้พักผ่อนอย่างมีคุณภาพโดยไม่ต้องจ่ายแพง
                </p>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className={styles.featuresContent}>
              <h2 className={styles.sectionTitle}>จุดเด่นของเรา</h2>
              <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureIconBox} style={{ background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)` }}>
                      <span className={styles.featureIconLarge}>{feature.icon}</span>
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div className={styles.locationsContent}>
              <h2 className={styles.sectionTitle}>สาขาของเรา</h2>
              <p className={styles.sectionDescription}>
                โรงแรมในเครือ PakStay กระจายอยู่ทั่วประเทศไทย ครอบคลุมจังหวัดท่องเที่ยวยอดนิยม
              </p>
              <div className={styles.locationsGrid}>
                {locations.map((location, index) => (
                  <div key={index} className={styles.locationCard}>
                    <div className={styles.locationIcon}>{location.icon}</div>
                    <div className={styles.locationInfo}>
                      <h3 className={styles.locationCity}>{location.city}</h3>
                      <p className={styles.locationCount}>{location.count} โรงแรม</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className={styles.teamContent}>
              <h2 className={styles.sectionTitle}>ทีมงานของเรา</h2>
              <p className={styles.sectionDescription}>
                ทีมงานมืออาชีพที่พร้อมมอบบริการและประสบการณ์ที่ดีที่สุดให้กับคุณ
              </p>
              <div className={styles.teamGrid}>
                {team.map((member, index) => (
                  <div key={index} className={styles.teamCard}>
                    <div className={styles.teamIconBox} style={{ background: member.color }}>
                      <span className={styles.teamIcon}>{member.icon}</span>
                    </div>
                    <h3 className={styles.teamName}>{member.name}</h3>
                    <p className={styles.teamDescription}>{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className={styles.contactContent}>
              <h2 className={styles.sectionTitle}>ติดต่อเรา</h2>
              <p className={styles.sectionDescription}>
                เรายินดีให้บริการและตอบคำถามของคุณตลอด 24 ชั่วโมง
              </p>
              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <div className={styles.contactIconBox}>
                    <span className={styles.contactIcon}>📧</span>
                  </div>
                  <h3 className={styles.contactTitle}>อีเมล</h3>
                  <p className={styles.contactDetail}>info@pakstay.com</p>
                  <a href="mailto:info@pakstay.com" className={styles.contactButton}>ส่งอีเมล</a>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIconBox}>
                    <span className={styles.contactIcon}>📱</span>
                  </div>
                  <h3 className={styles.contactTitle}>โทรศัพท์</h3>
                  <p className={styles.contactDetail}>081-234-5678</p>
                  <a href="tel:0812345678" className={styles.contactButton}>โทรเลย</a>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIconBox}>
                    <span className={styles.contactIcon}>🏢</span>
                  </div>
                  <h3 className={styles.contactTitle}>สำนักงานใหญ่</h3>
                  <p className={styles.contactDetail}>กรุงเทพมหานคร<br/>ประเทศไทย</p>
                  <button className={styles.contactButton}>ดูแผนที่</button>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIconBox}>
                    <span className={styles.contactIcon}>⏰</span>
                  </div>
                  <h3 className={styles.contactTitle}>เวลาทำการ</h3>
                  <p className={styles.contactDetail}>บริการตลอด 24 ชั่วโมง<br/>ทุกวัน</p>
                  <button className={styles.contactButton}>จองเลย</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
