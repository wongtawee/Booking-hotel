const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. ตรวจสอบข้อมูลครบถ้วน
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      });
    }

    // 2. ตรวจสอบรูปแบบอีเมล
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check for Thai or non-ASCII characters
    if (/[ก-๙]/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลต้องเป็นภาษาอังกฤษเท่านั้น'
      });
    }
    
    // Check for any non-ASCII characters
    // eslint-disable-next-line no-control-regex
    if (/[^\x00-\x7F]/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น'
      });
    }
    
    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'รูปแบบอีเมลไม่ถูกต้อง (ใช้ a-z, 0-9, ., _, - เท่านั้น)'
      });
    }

    // Check domain validity
    const emailParts = trimmedEmail.split('@');
    if (emailParts.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'รูปแบบอีเมลไม่ถูกต้อง'
      });
    }

    const domain = emailParts[1];
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      return res.status(400).json({
        success: false,
        message: 'โดเมนอีเมลไม่ถูกต้อง'
      });
    }

    // 3. ค้นหาผู้ใช้
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // 4. ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // 5. สร้าง token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      success: true, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' 
    });
  }
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. ตรวจสอบข้อมูลครบถ้วน
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // 2. ตรวจสอบชื่อ
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'
      });
    }
    if (trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อต้องไม่เกิน 50 ตัวอักษร'
      });
    }

    // 3. ตรวจสอบรูปแบบอีเมล
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check for Thai or non-ASCII characters
    if (/[ก-๙]/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลต้องเป็นภาษาอังกฤษเท่านั้น'
      });
    }
    
    // Check for any non-ASCII characters
    // eslint-disable-next-line no-control-regex
    if (/[^\x00-\x7F]/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น'
      });
    }
    
    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'รูปแบบอีเมลไม่ถูกต้อง (ใช้ a-z, 0-9, ., _, - เท่านั้น)'
      });
    }

    // Check domain validity
    const emailParts = trimmedEmail.split('@');
    if (emailParts.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'รูปแบบอีเมลไม่ถูกต้อง'
      });
    }

    const domain = emailParts[1];
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      return res.status(400).json({
        success: false,
        message: 'โดเมนอีเมลไม่ถูกต้อง'
      });
    }

    // 4. ตรวจสอบรหัสผ่าน
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      });
    }
    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องไม่เกิน 128 ตัวอักษร'
      });
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'
      });
    }
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 1 ตัว'
      });
    }

    // 5. ตรวจสอบอีเมลซ้ำ
    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลนี้มีอยู่ในระบบแล้ว' 
      });
    }

    // 6. สร้างผู้ใช้ใหม่
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: trimmedEmail,
      password: hashedPassword,
      name: trimmedName,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      success: true, 
      token 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง' 
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบข้อมูลผู้ใช้' 
      });
    }

    // ส่งข้อมูลผู้ใช้ที่ค้นหามา
    res.status(200).json({
      success: true,
      data: {
        userId: user._id,   
        name: user.name,      
        email: user.email,
        address: user.address, 
        phone: user.phone,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' 
    });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, address, phone, profileImage } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบผู้ใช้' 
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'ข้อมูลผู้ใช้ถูกอัปเดตแล้ว',
      data: {
        name: user.name,
        address: user.address,
        phone: user.phone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' 
    });
  }
};
