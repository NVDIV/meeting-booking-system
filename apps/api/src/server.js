// ================= ІМПОРТИ ТА НАЛАШТУВАННЯ  =================
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream/promises');
const { logger } = require('./lib/logger'); // Переконайся, що logger.ts/js лежить тут
const helmet = require('@fastify/helmet');
const rateLimit = require('@fastify/rate-limit');
const { getCached, setCached, deleteCachedByPrefix } = require('./lib/cache.js');
const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');
const { openApiDocument } = require('./docs/openapi.js');


// Завантажуємо змінні оточення
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const { hashPassword, verifyPassword, createAccessToken, verifyAccessToken } = require('./lib/auth');

// 2. Налаштовуємо CORS, щоб React-додаток міг спілкуватися з бекендом
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Підключення Helmet для захисних HTTP-заголовків
fastify.register(helmet);

// ================= РЕЄСТРАЦІЯ SWAGGER (ВИПРАВЛЕНО) =================

// 1. Спочатку реєструємо сам Swagger із конфігурацією структури
fastify.register(swagger, {
  mode: 'static',
  specification: {
    document: openApiDocument,
  },
});


fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
});

// Підключення Rate Limiting (Макс 100 запитів на хвилину з однієї IP)
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});
// Реєстрація плагіна завантаження файлів з лімітом 5 МБ
fastify.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Створення локальної папки для файлів, якщо її немає
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Замір часу відповіді сервера для Winston логера
const requestStartTimes = new WeakMap();

fastify.addHook('onRequest', async (request) => {
  requestStartTimes.set(request, Date.now());
});

fastify.addHook('onResponse', async (request, reply) => {
  const startTime = requestStartTimes.get(request) || Date.now();
  const duration = Date.now() - startTime;

  // Запис у файл logs/app.log через Winston
  logger.info({
    message: 'HTTP Request Processed',
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    durationMs: duration,
  });
});

// 3. Ініціалізуємо Prisma через адаптер
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middleware для захисту приватних маршрутів API
async function requireAuth(request, reply) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Автентифікація обов’язкова. Токен відсутній.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return reply.status(401).send({ error: 'Токен недійсний або його термін дії вичерпано.' });
  }

  request.authUser = payload;
}

// ================= РОУТИ ЛАБОРАТОРНОЇ РОБОТИ №4 =================

// 1. Пагінація заявок (Tickets) з індексами
fastify.get('/api/tickets', async (request, reply) => {
  const page = parseInt(request.query.page) || 1;
  const limit = Math.min(parseInt(request.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [tickets, total] = await prisma.$transaction([
    prisma.booking.findMany({ // у твоїй схемі заявки/бронювання — це booking
      skip,
      take: limit,
      orderBy: { startTime: 'desc' }
    }),
    prisma.booking.count()
  ]);

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit), source: "database" },
    data: tickets
  };
});

// 2. Кешований маршрут категорій (Rooms як категорії/кімнати)
fastify.get('/api/categories', async (request, reply) => {
  const cacheKey = 'categories:list';
  const cachedData = getCached(cacheKey);

  if (cachedData) {
    reply.header('x-cache', 'HIT');
    return cachedData;
  }

  const rooms = await prisma.room.findMany();
  setCached(cacheKey, rooms);
  
  reply.header('x-cache', 'MISS');
  return rooms;
});

// 3. Імітація створення нової категорії (скидання кешу)
fastify.post('/api/categories', async (request, reply) => {
  deleteCachedByPrefix('categories:');
  return { status: 'success', message: 'Cache invalidated' };
});

// 1. Моніторинг продуктивності Node.js процесу
fastify.get('/api/status', async (request, reply) => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    timestamp: new Date().toISOString(),
  };
});

// 2. Завантаження одного файлу (Зображення або PDF)
fastify.post('/api/upload', async (request, reply) => {
  const data = await request.file();
  if (!data) {
    return reply.status(400).send({ error: 'No file uploaded' });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedMimeTypes.includes(data.mimetype)) {
    // Фіксуємо помилку валідації в error.log
    logger.error({ 
      message: 'Validation error: Forbidden file type', 
      mimeType: data.mimetype,
      filename: data.filename 
    });
    return reply.status(400).send({ error: 'only jpg, png and pdf files are allowed' });
  }

  const filename = `${Date.now()}-${data.filename}`;
  const saveTo = path.join(uploadDir, filename);

  await pipeline(data.file, fs.createWriteStream(saveTo));

  return { status: 'success', filename };
});

// 3. Завантаження кількох файлів одночасно
fastify.post('/api/upload-multiple', async (request, reply) => {
  const parts = request.files();
  const savedFiles = [];

  for await (const part of parts) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(part.mimetype)) {
      logger.error({ message: 'Validation error in multiple upload', mimeType: part.mimetype });
      return reply.status(400).send({ error: 'only jpg, png and pdf files are allowed' });
    }

    const filename = `${Date.now()}-${part.filename}`;
    const saveTo = path.join(uploadDir, filename);
    
    await pipeline(part.file, fs.createWriteStream(saveTo));
    savedFiles.push(filename);
  }

  return { status: 'success', files: savedFiles };
});


// ================= ІСНУЮЧІ РОУТИ (ЕНДПОІНТИ) СИСТЕМИ =================

// Тестовий роут для перевірки працездатності сервера
fastify.get('/api/health', async (request, reply) => {
  return { status: 'OK', message: 'Сервер працює, база підключена!' };
});

// 1. Отримати всі переговорні кімнати
fastify.get('/api/rooms', async (request, reply) => {
  try {
    const rooms = await prisma.room.findMany();
    return rooms;
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Помилка при отриманні кімнат' });
  }
});

// 2. Отримати всіх користувачів
fastify.get('/api/users', async (request, reply) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { id: 'asc' }
    });
    return users;
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Помилка при отриманні списку користувачів' });
  }
});

// 3. Отримати конкретного користувача з його бронюваннями
fastify.get('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bookings: {
          include: {
            room: true
          },
          orderBy: { startTime: 'desc' }
        }
      }
    });

    if (!user) {
      return reply.status(404).send({ error: 'Користувача не знайдено' });
    }

    return user;
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Помилка при отриманні профілю користувача' });
  }
});

// 4. Отримати всі бронювання
fastify.get('/api/bookings', async (request, reply) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true, 
        user: {     
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return bookings;
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Помилка при отриманні бронювань' });
  }
});

// 5. Створити нове бронювання
fastify.post('/api/bookings', async (request, reply) => {
  try {
    const { title, description, roomId, userId, startTime, endTime } = request.body;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      return reply.status(400).send({ 
        error: 'Не можна забронювати кімнату на минулий час!' 
      });
    }

    if (start >= end) {
      return reply.status(400).send({ 
        error: 'Час початку не може бути більшим або рівним часу завершення!' 
      });
    }

    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    if (!room) {
      return reply.status(404).send({ error: 'Кімнату не знайдено' });
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId: Number(roomId),
        status: { in: ['CONFIRMED', 'PENDING'] }, 
        OR: [
          { startTime: { lte: start }, endTime: { gte: start } },
          { startTime: { lte: end }, endTime: { gte: end } },
          { startTime: { gte: start }, endTime: { lte: end } }
        ]
      }
    });

    if (overlappingBooking) {
      return reply.status(400).send({ 
        error: 'Ця кімната вже заброньована (або очікує підтвердження) на обраний час!' 
      });
    }

    const finalStatus = room.capacity < 10 ? 'CONFIRMED' : 'PENDING';

    const result = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          title,
          description,
          roomId: Number(roomId),
          userId: Number(userId),
          startTime: start,
          endTime: end,
          status: finalStatus
        }
      });

      await tx.bookingHistory.create({
        data: {
          bookingId: newBooking.id,
          status: finalStatus,
          changedBy: Number(userId)
        }
      });

      return newBooking;
    });

    return reply.status(201).send({
      message: 'Резервування успішно створено!',
      booking: result
    });

  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Помилка при створенні бронювання' });
  }
});

// 6. Оновити статус бронювання
fastify.patch('/api/bookings/:id/status', { preHandler: requireAuth }, async (request, reply) => {
  try {
    const { id } = request.params;
    const { status } = request.body;
    
    const operatorId = request.authUser.sub;
    const operatorRole = request.authUser.role;

    if (operatorRole !== 'ADMIN' && operatorRole !== 'MANAGER') {
      return reply.status(403).send({ error: 'Доступ заборонено. Модерація дозволена лише менеджерам або адміністраторам.' });
    }

    if (!['CONFIRMED', 'CANCELLED', 'PENDING'].includes(status)) {
      return reply.status(400).send({ error: 'Некоректний статус для встановлення.' });
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: Number(id) },
        data: { status }
      });

      await tx.bookingHistory.create({
        data: {
          bookingId: booking.id,
          status: status,
          changedBy: Number(operatorId)
        }
      });

      return booking;
    });

    return reply.send({
      message: 'Статус транзакції успішно змінено та зафіксовано в логах журналу.',
      booking: updatedBooking
    });
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Не вдалося оновити статус бронювання.' });
  }
});

// 2.1 Оновити роль користувача
fastify.patch('/api/users/:id/role', { preHandler: requireAuth }, async (request, reply) => {
  try {
    const { id } = request.params;
    const { role } = request.body;

    if (request.authUser.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Доступ заборонено. Потрібні права адміністратора.' });
    }

    if (!['USER', 'MANAGER', 'ADMIN'].includes(role)) {
      return reply.status(400).send({ error: 'Некоректна системна роль.' });
    }

    if (Number(id) === request.authUser.sub) {
      return reply.status(400).send({ error: 'Ви не можете змінити роль власному обліковому запису.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    return reply.send({
      message: `Роль користувача ${updatedUser.name} успішно змінено на ${role}.`,
      user: updatedUser
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Не вдалося оновити статус прав користувача.' });
  }
});

// ================= МОДУЛЬ АВТЕНТИФІКАЦІЇ =================

fastify.post('/api/auth/register', async (request, reply) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password || password.length < 6) {
      return reply.status(400).send({ error: 'Ім’я, емейл та пароль (мін. 6 символів) є обов’язковими.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return reply.status(409).send({ error: 'Користувач з таким Email вже зареєстрований у системі.' });
    }

    const securePasswordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: securePasswordHash,
        role: 'USER'
      }
    });

    const accessToken = createAccessToken(newUser);

    return reply.status(201).send({
      message: 'Обліковий запис успішно ініціалізовано.',
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Помилка на сервері під час реєстрації.' });
  }
});

fastify.post('/api/auth/login', async (request, reply) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send({ error: 'Емейл та пароль обов’язкові для входу.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return reply.status(401).send({ error: 'Неправильна комбінація емейлу та пароля.' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Неправильна комбінація емейлу та пароля.' });
    }

    const accessToken = createAccessToken(user);

    return reply.send({
      message: 'Вхід успішний.',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Помилка на сервері під час входу.' });
  }
});

fastify.get('/api/auth/me', { preHandler: requireAuth }, async (request, reply) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.authUser.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bookings: {
          include: { room: true },
          orderBy: { startTime: 'desc' }
        }
      }
    });

    if (!user) {
      return reply.status(404).send({ error: 'Користувача не знайдено в системі.' });
    }

    return reply.send(user);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Не вдалося отримати дані сесії.' });
  }
});

// ================= ЗАПУСК СЕРВЕРА =================

const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: '0.0.0.0' });
    console.log('🚀 Сервер успішно запущено на http://localhost:5000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});

start();