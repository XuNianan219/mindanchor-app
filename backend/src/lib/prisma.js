// 共享的 Prisma 数据库连接实例
// 整个后端只创建一个 PrismaClient，所有地方都从这里导入，避免重复连接

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
