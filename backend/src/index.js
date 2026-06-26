// 后端服务入口：启动 Express，挂载账号系统的接口

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const sleepRecordRoutes = require('./routes/sleepRecords');

const app = express();

// 允许前端（不同端口）跨域调用本后端
app.use(cors());
// 解析 JSON 请求体
app.use(express.json());

// 健康检查接口，方便确认服务有没有跑起来
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 账号系统接口，统一挂在 /api/auth 下
app.use('/api/auth', authRoutes);
// 睡眠记录接口，统一挂在 /api/sleep-records 下
app.use('/api/sleep-records', sleepRecordRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`后端服务已启动：http://localhost:${PORT}`);
});
