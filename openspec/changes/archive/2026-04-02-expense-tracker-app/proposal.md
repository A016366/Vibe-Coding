## Why

個人記帳是日常需求，但現有工具不是太複雜就是功能不足。需要一個簡潔好用的記帳工具，能快速新增、修改、刪除收支項目，按日期管理記錄，幫助使用者掌握自己的財務狀況。

## What Changes

- 建立全新的全端記帳應用程式（React + FastAPI + PostgreSQL）
- 提供收支項目的 CRUD 操作（新增、查看、修改、刪除）
- 支援日期篩選與分類管理
- 提供簡單的收支統計摘要
- 建立 GitHub Actions CI/CD 流程，git push 後自動部署
- 前端部署至 GitHub Pages，後端部署至 Render.com
- 提供可操作的線上網址

## Capabilities

### New Capabilities
- `expense-crud`: 收支項目的新增、修改、刪除、查詢功能，包含金額、分類、備註、日期等欄位
- `expense-categories`: 收支分類管理，預設分類與自訂分類支援
- `expense-summary`: 收支統計摘要，按日/週/月彙總，顯示收入、支出與結餘
- `cicd-deployment`: GitHub Actions CI/CD 自動化部署流程，前端部署 GitHub Pages、後端部署 Render.com，git push 即觸發

### Modified Capabilities

（無既有 capabilities 需修改）

## Impact

- **新增前端**：React SPA，包含項目清單頁面、新增/編輯表單、統計摘要頁面
- **新增後端**：FastAPI REST API，提供 CRUD 端點與統計查詢
- **新增資料庫**：PostgreSQL schema，包含 expenses 與 categories 資料表
- **依賴項**：React、FastAPI、SQLAlchemy、psycopg2、Alembic（資料庫遷移）
- **新增 CI/CD**：GitHub Actions workflows，自動建置測試與部署
- **託管服務**：GitHub Pages（前端靜態檔案）、Render.com（後端 API + PostgreSQL）
