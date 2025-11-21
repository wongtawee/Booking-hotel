const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'ไม่พบผู้ใช้งานในระบบ' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      success: true, 
      token 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' 
    });
  }
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลนี้มีอยู่ในระบบแล้ว' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      success: true, 
      token 
    });
  } catch (error) {
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
