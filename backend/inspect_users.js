import prisma from './config/prismaClient.js';

async function main() {
  console.log("Fetching users from database...");
  const users = await prisma.user.findMany({
    include: {
      employeeProfile: true
    }
  });

  console.log("\n--- USER LIST ---");
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | Name: ${u.name || 'N/A'}`);
  });
  console.log("-----------------\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
