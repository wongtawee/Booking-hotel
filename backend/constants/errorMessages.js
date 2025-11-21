// Standard error messages in Thai
const ERROR_MESSAGES = {
  // Authentication errors
  UNAUTHORIZED: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ',
  FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
  INVALID_CREDENTIALS: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  EMAIL_ALREADY_EXISTS: 'อีเมลนี้ถูกใช้งานแล้ว',
  INVALID_TOKEN: 'Token ไม่ถูกต้องหรือหมดอายุ',
  TOKEN_EXPIRED: 'Token หมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่',

  // Resource not found
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  USER_NOT_FOUND: 'ไม่พบผู้ใช้งาน',
  HOTEL_NOT_FOUND: 'ไม่พบโรงแรม',
  ROOM_NOT_FOUND: 'ไม่พบห้องพัก',
  BOOKING_NOT_FOUND: 'ไม่พบข้อมูลการจอง',

  // Validation errors
  VALIDATION_ERROR: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
  REQUIRED_FIELDS: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  INVALID_EMAIL: 'รูปแบบอีเมลไม่ถูกต้อง',
  INVALID_DATE: 'วันที่ไม่ถูกต้อง',
  INVALID_DATE_RANGE: 'วันที่เช็คเอาต์ต้องมาหลังวันที่เช็คอิน',
  INVALID_GUEST_COUNT: 'จำนวนผู้เข้าพักไม่ถูกต้อง',

  // Booking errors
  BOOKING_EXPIRED: 'การจองหมดอายุแล้ว กรุณาทำการจองใหม่',
  ROOM_UNAVAILABLE: 'ห้องพักไม่ว่างในช่วงเวลาที่เลือก',
  BOOKING_ALREADY_CANCELLED: 'การจองนี้ถูกยกเลิกแล้ว',
  BOOKING_ALREADY_PAID: 'การจองนี้ชำระเงินแล้ว',
  CANNOT_CANCEL_PAID_BOOKING: 'ไม่สามารถยกเลิกการจองที่ชำระเงินแล้ว',
  CANNOT_UPDATE_CANCELLED_BOOKING: 'ไม่สามารถแก้ไขการจองที่ถูกยกเลิกแล้ว',

  // Payment errors
  PAYMENT_FAILED: 'การชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง',
  PAYMENT_ALREADY_PROCESSED: 'การชำระเงินนี้ดำเนินการแล้ว',
  INVALID_PAYMENT_AMOUNT: 'จำนวนเงินไม่ถูกต้อง',

  // Rate limiting
  TOO_MANY_REQUESTS: 'มีการเรียกใช้งานมากเกินไป กรุณารอสักครู่',
  TOO_MANY_LOGIN_ATTEMPTS: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง',

  // Server errors
  SERVER_ERROR: 'เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่ภายหลัง',
  DATABASE_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
  
  // Admin errors
  ADMIN_ONLY: 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงได้',
  CANNOT_DELETE_HOTEL_WITH_BOOKINGS: 'ไม่สามารถลบโรงแรมที่มีการจองอยู่',
  CANNOT_DELETE_ROOM_WITH_BOOKINGS: 'ไม่สามารถลบห้องพักที่มีการจองอยู่'
};

module.exports = ERROR_MESSAGES;
