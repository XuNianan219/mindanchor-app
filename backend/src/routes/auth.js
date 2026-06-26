// 账号系统的三个接口：注册、登录、获取当前用户信息

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();

// bcrypt 加密强度，10 是常用且安全的默认值
const SALT_ROUNDS = 10;

// 生成 JWT token：把用户 id 放进 sub 字段
function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// ---------- 1. 注册 ----------
// POST /api/auth/register
// body: { account, password, nickname? }
router.post('/register', async (req, res) => {
  try {
    const { account, password, nickname } = req.body || {};

    // 基本校验：account 和 password 必填
    if (!account || !password) {
      return res.status(400).json({ error: 'account 和 password 不能为空' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: '密码至少 6 位' });
    }

    // 检查账号是否已存在
    const existing = await prisma.user.findUnique({ where: { account } });
    if (existing) {
      return res.status(409).json({ error: '该账号已被注册' });
    }

    // 用 bcrypt 加密密码后再存
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        account,
        passwordHash,
        nickname: nickname || null,
      },
    });

    // 注册成功直接返回一个 token，前端可以免去再登录一次
    const token = signToken(user.id);

    // 注意：绝不返回 passwordHash
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        account: user.account,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('注册失败:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// ---------- 2. 登录 ----------
// POST /api/auth/login
// body: { account, password }
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body || {};

    if (!account || !password) {
      return res.status(400).json({ error: 'account 和 password 不能为空' });
    }

    const user = await prisma.user.findUnique({ where: { account } });
    // 账号不存在 或 密码错误，都返回同样的模糊提示（避免泄露账号是否存在）
    if (!user) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const token = signToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        account: user.account,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('登录失败:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// ---------- 3. 获取当前用户信息 ----------
// GET /api/auth/me
// 需要在请求头带 Authorization: Bearer <token>
router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      // 只选需要的字段，天然不包含 passwordHash
      select: {
        id: true,
        account: true,
        nickname: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('获取用户信息失败:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
