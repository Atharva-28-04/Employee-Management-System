import prisma from './config/prismaClient.js';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'aarnavyas495@gmail.com';
  const newPassword = 'Employee@123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      role: 'employee'
    }
  });

  console.log(`✅ User ${email} updated successfully!`);
  console.log(`🔑 New Password: ${newPassword}`);
  console.log(`🏷️ New Role: employee`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
