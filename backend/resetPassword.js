import bcrypt from 'bcryptjs';
import prisma from './config/prismaClient.js';

async function resetPassword() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.update({
    where: {
      email: 'aarna@gmail.com'
    },
    data: {
      password: hashedPassword,
      role: 'admin'
    }
  });

  console.log('Password reset successfully!');
  await prisma.$disconnect();
}

resetPassword();