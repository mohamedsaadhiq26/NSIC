import bcrypt from 'bcryptjs';
import prisma from './prismaClient.js';

async function seed() {
  console.log('🌱 Seeding SQLite database for FoundIt? (STUDENT & ADMIN only)...');

  // 1. Password Hashes
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 2. Clean existing records if any
  await prisma.claim.deleteMany({});
  await prisma.foundItem.deleteMany({});
  await prisma.user.deleteMany({});

  // 3. Create Verified Users
  const student = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'student@campus.edu',
      passwordHash: studentPassword,
      role: 'STUDENT',
      studentId: 'STU-940218',
      department: 'Computer Science & Engineering',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Dean Eleanor Wright',
      email: 'admin@campus.edu',
      passwordHash: adminPassword,
      role: 'ADMIN',
      studentId: 'ADM-001',
      department: 'Campus Safety & Administration',
    },
  });

  console.log('✅ Accounts seeded:');
  console.log('   - student@campus.edu / student123 (STUDENT)');
  console.log('   - admin@campus.edu   / admin123   (ADMIN)');

  // 4. Create Found Items (Uploaded by Admin)
  const item1 = await prisma.foundItem.create({
    data: {
      title: 'Sony WH-1000XM4 Noise-Canceling Headphones',
      category: 'Electronics',
      location: 'Engineering Hall, Study Room 302',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      finderId: admin.id,
    },
  });

  const item2 = await prisma.foundItem.create({
    data: {
      title: 'Brown Leather Bi-fold Wallet with College ID',
      category: 'ID & Wallets',
      location: 'Campus Dining Hall, Booth 12',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      status: 'pending',
      finderId: admin.id,
    },
  });

  const item3 = await prisma.foundItem.create({
    data: {
      title: 'Hydro Flask 32oz Water Bottle (Cobalt Blue)',
      category: 'Accessories',
      location: 'Recreation Center, Basketball Court Bleachers',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      finderId: admin.id,
    },
  });

  const item4 = await prisma.foundItem.create({
    data: {
      title: 'TI-84 Plus CE Graphing Calculator',
      category: 'Electronics',
      location: 'Math Building, Room 104 Row 3',
      imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      finderId: admin.id,
    },
  });

  // 5. Seed Official Student Claim for item2
  await prisma.claim.create({
    data: {
      itemId: item2.id,
      claimerId: student.id,
      studentName: 'Alex Rivera',
      registrationNumber: 'REG-2024-8849',
      department: 'Computer Science & Engineering',
      status: 'pending',
    },
  });

  console.log('✅ Found Items & Official Student Claims seeded!');
  console.log('🎉 Seeding successfully finished!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
