# MindAnchor 后端（账号系统）

这是 MindAnchor 睡眠 app 的后端服务，目前只实现了**账号系统**：注册、登录、获取当前用户信息。

技术栈：Node.js + Express + Prisma + PostgreSQL(Supabase) + JWT + bcrypt。

---

## 一、安装

> 前提：电脑已装好 Node.js。

在 `backend` 文件夹里打开终端，执行：

```bash
npm install
```

如果安装 `bcrypt` 时报编译错误（Windows 偶发），告诉我，我可以换成纯 JS 版的 `bcryptjs`，用法一样。

## 二、配置环境变量

1. 把 `.env.example` 复制一份，改名为 `.env`：

   ```bash
   copy .env.example .env      # Windows
   # cp .env.example .env      # Mac/Linux
   ```

2. 打开 `.env`，填入你的真实信息：
   - `DATABASE_URL`：Supabase 的连接地址（带连接池的 **6543** 端口）
   - `DIRECT_URL`：Supabase 的直连地址（**5432** 端口，建表迁移用）
   - `JWT_SECRET`：随便写一段足够长的随机字符串
   - `PORT`：默认 4000，一般不用改

   > 在 Supabase 后台 → 项目 Settings → Database → Connection string，能找到这两个地址。

## 三、建数据库表（第一次必须做）

让 Prisma 根据 `prisma/schema.prisma` 在数据库里创建 `users` 表：

```bash
npx prisma migrate dev --name init
```

成功后数据库里就会有一张 `users` 表。

## 四、启动服务

```bash
npm run dev      # 开发模式，改代码自动重启
# 或
npm start        # 普通启动
```

看到 `后端服务已启动：http://localhost:4000` 就说明跑起来了。
可以先访问 http://localhost:4000/health ，返回 `{"status":"ok"}` 表示正常。

---

## 五、测试三个接口

下面用 `curl` 演示（也可以用 Postman / Apifox）。假设端口是 4000。

### 1. 注册

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"account\":\"test@example.com\",\"password\":\"123456\",\"nickname\":\"小明\"}"
```

成功返回（示例）：

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "xxxx-xxxx",
    "account": "test@example.com",
    "nickname": "小明",
    "createdAt": "2026-06-25T..."
  }
}
```

> 同一个 account 再注册一次会返回 409「该账号已被注册」。

### 2. 登录

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"account\":\"test@example.com\",\"password\":\"123456\"}"
```

成功会返回一个新的 `token`。把它复制下来，下一步要用。

### 3. 获取当前用户信息（需要带 token）

把下面的 `<TOKEN>` 换成上一步拿到的 token：

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

成功返回：

```json
{
  "user": {
    "id": "xxxx-xxxx",
    "account": "test@example.com",
    "nickname": "小明",
    "createdAt": "2026-06-25T..."
  }
}
```

> 不带 token 或 token 错误会返回 401。返回结果**永远不包含密码**。

---

## 六、接口一览

| 方法 | 路径 | 说明 | 是否需要 token |
|---|---|---|---|
| GET    | `/health`                | 健康检查          | 否 |
| POST   | `/api/auth/register`     | 注册              | 否 |
| POST   | `/api/auth/login`        | 登录，返回 token   | 否 |
| GET    | `/api/auth/me`           | 获取当前用户信息   | **是** |
| POST   | `/api/sleep-records`     | 新增一条睡眠记录   | **是** |
| GET    | `/api/sleep-records`     | 查自己的睡眠记录   | **是** |
| DELETE | `/api/sleep-records/:id` | 删除一条睡眠记录   | **是** |

> 说明：新增了 `sleep_records` 表后，需要再跑一次迁移把表建出来：
> `npx prisma migrate dev --name add_sleep_records`

## 七、目录结构

```
backend/
├── prisma/schema.prisma   # 数据库表设计（users + sleep_records）
├── src/
│   ├── index.js           # 服务入口
│   ├── lib/prisma.js      # 数据库连接实例
│   ├── middleware/auth.js # JWT 验证中间件
│   ├── routes/auth.js     # 注册/登录/获取用户 三个接口
│   └── routes/sleepRecords.js # 睡眠记录 增/查/删 三个接口
├── .env.example           # 环境变量模板
├── .gitignore
└── package.json
```
