import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';

// ==========================================
// REGISTER
// ==========================================
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      designation
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let departmentId = null;

    if (department) {
      const existingDepartment =
        await prisma.department.findFirst({
          where: {
            department_name: department
          }
        });

      if (existingDepartment) {
        departmentId = existingDepartment.id;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'employee',

        employeeProfile: {
          create: {
            first_name: firstName || '',
            last_name: lastName || '',
            designation: designation || '',
            department_id: departmentId
          }
        }
      },
      include: {
        employeeProfile: true
      }
    });

    return res.status(201).json({
      message: 'Account created successfully',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Registration Error:', error);

    return res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employeeProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '15m'
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      {
        expiresIn: '7d'
      }
    );

    const profile = user.employeeProfile;

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId: profile?.id || null,
        name: profile
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : user.email
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
};

export { register, login };