// 睡眠记录接口：新增、查询（自己的）、删除
// 三个接口都需要登录（带 token）

const express = require('express');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();

// 这一组接口全部需要登录，统一加验证中间件
router.use(authRequired);

// ---------- 1. 新增一条睡眠记录 ----------
// POST /api/sleep-records
// body: { durationMinutes, completed?, note? }
router.post('/', async (req, res) => {
  try {
    const { durationMinutes, completed, note } = req.body || {};

    // durationMinutes 必填且为正整数
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      return res.status(400).json({ error: 'durationMinutes 必须是正整数' });
    }

    const record = await prisma.sleepRecord.create({
      data: {
        userId: req.userId,
        durationMinutes,
        completed: Boolean(completed),
        note: note || null,
      },
    });

    return res.status(201).json({ record });
  } catch (err) {
    console.error('新增睡眠记录失败:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// ---------- 2. 查询当前用户的睡眠记录 ----------
// GET /api/sleep-records
// 只返回登录用户自己的记录，按时间倒序
router.get('/', async (req, res) => {
  try {
    const records = await prisma.sleepRecord.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ records });
  } catch (err) {
    console.error('查询睡眠记录失败:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// ---------- 3. 删除一条睡眠记录 ----------
// DELETE /api/sleep-records/:id
// 只能删自己的记录
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 先确认这条记录存在且属于当前用户
    const record = await prisma.sleepRecord.findUnique({ where: { id } });
    if (!record || record.userId !== req.userId) {
      // 不存在或不属于本人，统一返回 404，避免泄露他人记录是否存在
      return res.status(404).json({ error: '记录不存在' });
    }

    await prisma.sleepRecord.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    console.error('删除睡眠记录失败:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
