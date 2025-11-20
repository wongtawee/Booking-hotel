import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>เกี่ยวกับ LuxeStay</h1>
          <p className={styles.heroSubtitle}>
            แพลตฟอร์มจองโรงแรมออนไลน์ที่คุณไว้วางใจ
          </p>
        </div>

        {/* About Content */}
        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.iconBox}>🏨</div>
            <h2 className={styles.sectionTitle}>เราคือใคร</h2>
            <p className={styles.text}>
              LuxeStay เป็นแพลตฟอร์มจองโรงแรมออนไลน์ที่ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะทำให้การจองที่พักเป็นเรื่องง่ายและสะดวกสบายที่สุด 
              เราคัดสรรโรงแรมคุณภาพจากทั่วประเทศไทย พร้อมให้บริการด้วยระบบที่ทันสมัยและปลอดภัย
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.iconBox}>🎯</div>
            <h2 className={styles.sectionTitle}>วิสัยทัศน์</h2>
            <p className={styles.text}>
              เราต้องการเป็นแพลตฟอร์มจองโรงแรมอันดับหนึ่งที่ทุกคนเลือกใช้ เมื่อต้องการวางแผนการเดินทางและพักผ่อน 
              ด้วยการนำเสนอตัวเลือกที่หลากหลาย ราคาที่เป็นธรรม และบริการที่เหนือความคาดหมาย
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.iconBox}>💎</div>
            <h2 className={styles.sectionTitle}>ทำไมต้องเลือกเรา</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <div>
                  <h3 className={styles.featureTitle}>ราคาดีที่สุด</h3>
                  <p className={styles.featureText}>รับประกันราคาที่ดีที่สุด หากพบราคาที่ถูกกว่า เรายินดีคืนส่วนต่าง</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <div>
                  <h3 className={styles.featureTitle}>จองง่าย ปลอดภัย</h3>
                  <p className={styles.featureText}>ระบบจองที่ใช้งานง่าย พร้อมการชำระเงินที่ปลอดภัยด้วย Stripe</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <div>
                  <h3 className={styles.featureTitle}>ยกเลิกฟรี</h3>
                  <p className={styles.featureText}>ยกเลิกการจองได้ฟรีก่อน 24 ชั่วโมง ไม่มีค่าธรรมเนียมแอบแฝง</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <div>
                  <h3 className={styles.featureTitle}>บริการ 24/7</h3>
                  <p className={styles.featureText}>ทีมงานพร้อมให้บริการและช่วยเหลือคุณตลอด 24 ชั่วโมง</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.iconBox}>📊</div>
            <h2 className={styles.sectionTitle}>ตัวเลขที่น่าประทับใจ</h2>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>โรงแรมพันธมิตร</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>10,000+</div>
                <div className={styles.statLabel}>ลูกค้าที่พึงพอใจ</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50,000+</div>
                <div className={styles.statLabel}>การจองสำเร็จ</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>4.8/5</div>
                <div className={styles.statLabel}>คะแนนความพึงพอใจ</div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.iconBox}>📞</div>
            <h2 className={styles.sectionTitle}>ติดต่อเรา</h2>
            <div className={styles.contact}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <div>
                  <strong>อีเมล:</strong> support@luxestay.com
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📱</span>
                <div>
                  <strong>โทรศัพท์:</strong> 02-123-4567
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🏢</span>
                <div>
                  <strong>ที่อยู่:</strong> 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
