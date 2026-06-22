module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Додаємо команду запуску сиду за правилами Prisma 7
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    url: "postgresql://postgres:admin@localhost:5432/booking_system?schema=public",
  },
};