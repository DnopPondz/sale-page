// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // สร้าง admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
      status: 'active'
    }
  });

  // สร้าง category เริ่มต้น
  await prisma.category.createMany({
    data: [
      { name_en: 'Electronics', name_th: 'อิเล็กทรอนิกส์', slug: 'electronics' },
      { name_en: 'Clothes', name_th: 'เสื้อผ้า', slug: 'clothes' }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
