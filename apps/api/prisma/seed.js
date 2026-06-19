// Завантажуємо .env
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Створюємо стандартне підключення pg
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/booking_system?schema=public";
const pool = new Pool({ connectionString });

// 2. Створюємо адаптер для Prisma 7
const adapter = new PrismaPg(pool);

// 3. Передаємо адаптер в конструктор
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Початок очищення та наповнення бази даних...');

  // Очищення таблиць
  await prisma.$executeRaw`TRUNCATE TABLE booking_histories, booking_comments, bookings, rooms, users RESTART IDENTITY CASCADE;`;

  // Створення користувачів
  const admin = await prisma.user.create({
    data: {
      name: 'Олександр Степанов',
      email: 'admin@company.com',
      password: 'super_secret_password_123',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Ірина Менеджер',
      email: 'manager@company.com',
      password: 'password_manager',
      role: 'MANAGER',
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Іван Розробник',
      email: 'dev@company.com',
      password: 'dev_password',
      role: 'USER',
    },
  });

  console.log('✅ Користувачі створені');

  // Створення кімнат
  const room1 = await prisma.room.create({
    data: {
      name: 'Green Room',
      capacity: 6,
      equipment: 'Телевізор, Фліпчарт, Маркери',
      location: '2 поверх, кабінет 204',
    },
  });

  await prisma.room.create({
    data: {
      name: 'Skyline Lounge',
      capacity: 15,
      equipment: 'Проектор, Спікерфон, Кондиціонер',
      location: '5 поверх, великий зал',
    },
  });

  console.log('✅ Переговорні кімнати створені');

  // Створення бронювання
  const booking = await prisma.booking.create({
    data: {
      title: 'Daily Standup & Architecture Sync',
      userId: employee.id,
      roomId: room1.id,
      startTime: new Date('2026-06-22T10:00:00Z'),
      endTime: new Date('2026-06-22T11:00:00Z'),
      status: 'CONFIRMED',
    },
  });

  // Додаємо коментар
  await prisma.bookingComment.create({
    data: {
      bookingId: booking.id,
      userId: employee.id,
      message: 'Будь ласка, принесіть додатковий стілець для нового колеги.',
    },
  });

  // Додаємо історію
  await prisma.bookingHistory.create({
    data: {
      bookingId: booking.id,
      changedBy: manager.id,
      status: 'CONFIRMED',
    },
  });

  console.log('✅ Тестові дані успішно додані!');
}

main()
  .catch((e) => {
    console.error('Помилка під час сидингу:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Закриваємо пул підключень pg
  });