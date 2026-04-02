## Context

這是一個全新的記帳應用程式專案。目標是建立一個前後端分離的全端應用，前端使用 React，後端使用 Python FastAPI，資料庫使用 PostgreSQL。目前專案尚無任何程式碼，從零開始搭建。

使用者需要一個簡潔的記帳工具，能夠快速記錄日常收支、按分類和日期管理帳目，並查看統計摘要。

## Goals / Non-Goals

**Goals:**
- 提供完整的收支 CRUD API（RESTful 設計）
- 前端 SPA 提供流暢的使用體驗
- 支援收支分類管理（預設 + 自訂）
- 按日期範圍篩選與統計摘要
- 使用 Alembic 管理資料庫遷移
- 前後端獨立部署
- GitHub Actions CI/CD 自動化，git push 自動部署
- 提供可存取的線上 URL

**Non-Goals:**
- 多使用者系統與身份驗證（第一版為單人使用）
- 匯出 CSV / PDF 報表
- 行動裝置 App
- 多幣別支援
- 預算規劃功能

## Decisions

### 1. 前端框架：React + Vite

**選擇**：使用 Vite 作為建置工具搭配 React  
**理由**：Vite 開發體驗快速，HMR 即時生效；相比 CRA 已過時，Vite 是社群主流  
**替代方案**：Next.js — 功能強大但對純 SPA 來說過重

### 2. 後端框架：FastAPI

**選擇**：FastAPI + Pydantic + SQLAlchemy  
**理由**：自動產生 OpenAPI 文件、型別安全、async 支援、效能優秀  
**替代方案**：Flask — 更簡單但缺少自動文件和型別驗證

### 3. ORM：SQLAlchemy 2.0

**選擇**：SQLAlchemy 2.0 搭配 Alembic 遷移  
**理由**：Python 生態最成熟的 ORM，2.0 支援新式 mapped_column 語法  
**替代方案**：Tortoise ORM — async 原生但社群較小

### 4. 資料模型設計

```
┌─────────────────────┐       ┌─────────────────────┐
│     categories      │       │      expenses        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │──┐    │ id (PK)             │
│ name                │  │    │ amount              │
│ type (income/expense│  │    │ type (income/expense)│
│ icon                │  └───▶│ category_id (FK)    │
│ is_default          │       │ date                │
│ created_at          │       │ note                │
└─────────────────────┘       │ created_at          │
                              │ updated_at          │
                              └─────────────────────┘
```

### 5. API 路由設計

```
GET    /api/expenses          # 查詢（支援日期、分類篩選與分頁）
POST   /api/expenses          # 新增
GET    /api/expenses/{id}     # 取得單筆
PUT    /api/expenses/{id}     # 修改
DELETE /api/expenses/{id}     # 刪除
GET    /api/expenses/summary  # 統計摘要

GET    /api/categories        # 查詢所有分類
POST   /api/categories        # 新增自訂分類
PUT    /api/categories/{id}   # 修改分類
DELETE /api/categories/{id}   # 刪除自訂分類
```

### 6. 前端頁面結構

- **首頁（Dashboard）**：本月摘要 + 最近交易
- **交易清單頁**：完整列表、篩選、搜尋
- **新增/編輯表單**：Modal 或獨立頁面
- **分類管理頁**：分類 CRUD

### 7. CI/CD 與部署架構

**部署拓撲**：
```
┌──────────────────┐     git push      ┌─────────────────────┐
│   Developer PC   │──────────────────▶│   GitHub Actions     │
└──────────────────┘                   ├─────────────────────┤
                                       │  ┌───────────────┐  │
                                       │  │ Build Frontend│  │
                                       │  │ (npm build)   │──┼──▶ GitHub Pages
                                       │  └───────────────┘  │    https://<user>.github.io/<repo>
                                       │  ┌───────────────┐  │
                                       │  │ Deploy Backend│  │
                                       │  │ (Render Hook) │──┼──▶ Render.com
                                       │  └───────────────┘  │    https://<app>.onrender.com
                                       └─────────────────────┘
                                                                   │
                                                              Render PostgreSQL
```

**前端部署（GitHub Pages）**：
- Workflow：push to `main` → `npm run build` → deploy `dist/` to `gh-pages` branch
- 使用 `peaceiris/actions-gh-pages` action
- 前端透過環境變數 `VITE_API_URL` 指向 Render 後端

**後端部署（Render.com）**：
- Render 支援自動偵測 `main` branch push 部署（原生 Git 整合）
- GitHub Actions 也可透過 Render Deploy Hook URL 觸發
- 提供 `render.yaml`（Blueprint）定義 web service + PostgreSQL
- 免費方案：512MB RAM, auto-sleep after 15min idle

**Render Blueprint (`render.yaml`)**：
```yaml
services:
  - type: web
    name: expense-tracker-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: expense-tracker-db
          property: connectionURI

databases:
  - name: expense-tracker-db
    plan: free
```

## Risks / Trade-offs

- **[PostgreSQL 設定複雜度]** → 提供 docker-compose.yml 一鍵啟動資料庫環境
- **[單人使用無認證]** → 第一版限定本地使用，未來可加入 JWT 認證
- **[前後端分離 CORS]** → FastAPI 設定 CORS middleware，開發期允許 localhost
- **[資料庫遷移管理]** → 使用 Alembic auto-generate 減少手動維護成本
- **[Render 免費方案冷啟動]** → 15 分鐘無活動後服務休眠，首次請求需等待 ~30 秒喚醒；可接受用於個人工具
- **[GitHub Pages SPA 路由]** → 需要 404.html 重導向處理，確保 React Router 正常運作
- **[API URL 環境切換]** → 使用 Vite 環境變數 `VITE_API_URL` 區分開發與生產環境
