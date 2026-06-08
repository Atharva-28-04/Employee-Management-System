import 'dotenv/config'; // 👈 This makes sure DATABASE_URL is loaded perfectly!
import prisma from './config/prismaClient.js';

async function main() {
  console.log('🌱 Seeding database with assignment data...');

  // Insert Assignment Departments [cite: 11, 12]
  await prisma.department.createMany({
    data: [
      { department_name: 'IT' },
      { department_name: 'HR' },
      { department_name: 'Finance' },
      { department_name: 'Marketing' }
    ],
    skipDuplicates: true
  });

  // Insert Assignment Skills [cite: 20, 21]
  await prisma.skill.createMany({
    data: [
      { skill_name: 'React' },
      { skill_name: 'NodeJS' },
      { skill_name: 'PostgreSQL' },
      { skill_name: 'Python' },
      { skill_name: 'Java' }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });