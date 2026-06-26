// JWT 验证中间件
// 给"需要登录才能访问"的接口用（比如获取当前用户信息）
// 它会检查请求头里的 token，验证通过就把用户 id 挂到 req.userId 上，否则返回 401

const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  // 约定：前端在请求头里带 Authorization: Bearer <token>
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: '缺少登录凭证（token）' });
  }

  try {
    // 用密钥验证 token，验证失败会抛异常
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // 把用户 id 存到 req 上，后面的接口直接用
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: '登录凭证无效或已过期，请重新登录' });
  }
}

module.exports = authRequired;
