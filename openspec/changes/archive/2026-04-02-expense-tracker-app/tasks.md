## 1. 專案初始化與基礎架構

- [x] 1.1 建立 monorepo 目錄結構：`frontend/`（React）、`backend/`（FastAPI）
- [x] 1.2 初始化前端：`npm create vite@latest frontend -- --template react-ts`，安裝 React Router、Axios
- [x] 1.3 初始化後端：建立 `requirements.txt`（fastapi, uvicorn, sqlalchemy, alembic, psycopg2-binary, pydantic）
- [x] 1.4 建立 `docker-compose.yml` 提供本地 PostgreSQL 開發環境
- [x] 1.5 設定 Alembic 初始化（`alembic init`）與資料庫連線配置

## 2. 資料庫模型與遷移

- [x] 2.1 建立 SQLAlchemy models：`Category`（id, name, type, icon, is_default, created_at）
- [x] 2.2 建立 SQLAlchemy models：`Expense`（id, amount, type, category_id, date, note, created_at, updated_at）
- [x] 2.3 建立初始 Alembic migration，建立 categories 與 expenses 資料表
- [x] 2.4 建立 seed script 插入預設分類（餐飲、交通、購物、娛樂、醫療、教育、居住、薪資、獎金、投資、其他收入、其他支出）

## 3. 後端 API — 收支 CRUD

- [x] 3.1 建立 Pydantic schemas：ExpenseCreate、ExpenseUpdate、ExpenseResponse、PaginatedResponse
- [x] 3.2 實作 `POST /api/expenses` — 新增收支項目（含金額正數驗證）
- [x] 3.3 實作 `GET /api/expenses` — 查詢收支列表（分頁、日期範圍篩選、分類篩選）
- [x] 3.4 實作 `GET /api/expenses/{id}` — 取得單筆收支
- [x] 3.5 實作 `PUT /api/expenses/{id}` — 修改收支項目（自動更新 updated_at）
- [x] 3.6 實作 `DELETE /api/expenses/{id}` — 刪除收支項目（回傳 204）

## 4. 後端 API — 分類管理

- [x] 4.1 建立 Pydantic schemas：CategoryCreate、CategoryUpdate、CategoryResponse
- [x] 4.2 實作 `GET /api/categories` — 查詢所有分類（支援 type 篩選）
- [x] 4.3 實作 `POST /api/categories` — 新增自訂分類（含重複名稱檢查，回傳 409）
- [x] 4.4 實作 `PUT /api/categories/{id}` — 修改分類（阻擋預設分類修改，回傳 400）
- [x] 4.5 實作 `DELETE /api/categories/{id}` — 刪除分類（阻擋預設分類刪除；關聯記錄轉移至「其他」）

## 5. 後端 API — 統計摘要

- [x] 5.1 實作 `GET /api/expenses/summary` — 收支統計摘要（total_income, total_expense, balance, 分類細項含百分比）
- [x] 5.2 實作 summary 日期範圍篩選（start_date, end_date, 預設當月）
- [x] 5.3 實作 `GET /api/expenses/trend` — 按日/週/月維度彙總趨勢資料（group_by 參數）

## 6. 後端基礎設施

- [x] 6.1 設定 FastAPI CORS middleware（開發期允許 localhost:5173）
- [x] 6.2 建立統一錯誤處理（404、409、422 格式化回應）
- [x] 6.3 建立 database session 依賴注入（get_db）
- [x] 6.4 撰寫後端 API 單元測試（pytest + httpx）

## 7. 前端 — 頁面與元件

- [x] 7.1 設定 React Router 路由結構：Dashboard、Transactions、Categories
- [x] 7.2 建立 API 服務層（axios instance，base URL 從 VITE_API_URL 讀取）
- [x] 7.3 建立 Dashboard 頁面：本月摘要卡片（收入、支出、結餘）+ 最近交易列表
- [x] 7.4 建立 Transactions 頁面：完整列表、日期範圍篩選器、分類篩選、分頁
- [x] 7.5 建立新增/編輯收支 Modal 表單（金額、類型、分類下拉、日期選擇器、備註）
- [x] 7.6 建立刪除確認 Dialog
- [x] 7.7 建立 Categories 分類管理頁面：列表、新增、修改、刪除

## 8. 前端 — 樣式與 UX

- [x] 8.1 安裝 UI 框架（如 Ant Design 或 Tailwind CSS）
- [x] 8.2 建立共用 Layout 元件（Sidebar 導航 + 主內容區域）
- [x] 8.3 實作 loading 狀態與錯誤提示（Toast notification）

## 9. CI/CD 與部署

- [x] 9.1 建立 `.env.development`（VITE_API_URL=http://localhost:8000）和 `.env.production`（VITE_API_URL=https://<app>.onrender.com）
- [x] 9.2 建立 GitHub Actions workflow：`.github/workflows/deploy-frontend.yml`（build → deploy to GitHub Pages）
- [x] 9.3 建立 `public/404.html` SPA 路由重導向（GitHub Pages 支援）
- [x] 9.4 建立 `render.yaml` Blueprint（web service + PostgreSQL 定義）
- [x] 9.5 建立 `Dockerfile` 或 `Procfile` 供 Render.com 部署後端
- [x] 9.6 設定 Render.com 自動部署（連結 GitHub repo，push main 自動觸發）
- [x] 9.7 端對端驗證：確認前端可透過 GitHub Pages URL 存取，後端 API 可透過 Render URL 回應
