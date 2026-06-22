// Завантажуємо .env
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);

// 1. Створюємо стандартне підключення pg
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/booking_system?schema=public";
const pool = new Pool({ connectionString });

// 2. Створюємо адаптер для Prisma
const adapter = new PrismaPg(pool);

// 3. Передаємо адаптер в конструктор
const prisma = new PrismaClient({ adapter });

// Допоміжна функція хешування паролів, щоб адмін та інші юзери могли залогінитися через UI сторінку
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  console.log('Початок очищення та наповнення бази даних...');

  // Очищення таблиць
  await prisma.$executeRaw`TRUNCATE TABLE booking_histories, bookings, rooms, users RESTART IDENTITY CASCADE;`;

  // Хешуємо паролі перед вставкою в БД
  const adminPasswordHash = await hashPassword('super_secret_password_123');
  const managerPasswordHash = await hashPassword('password_manager');
  const devPasswordHash = await hashPassword('dev_password');

  // Створення користувачів (передаємо хеш в поле 'password', як вимагає твоя Prisma-схема)
  const admin = await prisma.user.create({
    data: {
      name: 'Олександр Степанов',
      email: 'admin@company.com',
      password: adminPasswordHash, // Змінено з passwordHash на password
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Ірина Менеджер',
      email: 'manager@company.com',
      password: managerPasswordHash, // Змінено з passwordHash на password
      role: 'MANAGER',
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Іван Розробник',
      email: 'dev@company.com',
      password: devPasswordHash, // Змінено з passwordHash на password
      role: 'USER',
    },
  });

  console.log('✅ Користувачі створені (паролі захешовано)');

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
      description: 'Будь ласка, принесіть додаткові стільці для нових колег.',
      userId: employee.id,
      roomId: room1.id,
      startTime: new Date('2026-06-22T10:00:00Z'),
      endTime: new Date('2026-06-22T11:00:00Z'),
      status: 'CONFIRMED',
    },
  });

  // Додаємо історію (Лог створення)
  await prisma.bookingHistory.create({
    data: {
      bookingId: booking.id,
      changedBy: employee.id,
      status: 'PENDING',
    },
  });

  // Додаємо історію (Лог підтвердження менеджером)
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
    await pool.end();
  });