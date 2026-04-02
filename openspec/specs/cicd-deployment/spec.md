# cicd-deployment Specification

## Purpose
TBD - created by archiving change expense-tracker-app. Update Purpose after archive.
## Requirements
### Requirement: 前端自動建置與部署至 GitHub Pages
系統 SHALL 提供 GitHub Actions workflow，當 push 到 main branch 時自動建置 React 前端並部署至 GitHub Pages。

#### Scenario: push 到 main 觸發前端部署
- **WHEN** 開發者 push 程式碼到 main branch
- **THEN** GitHub Actions 自動執行 `npm ci && npm run build`，將 `dist/` 目錄部署到 GitHub Pages，部署完成後可透過 `https://<user>.github.io/<repo>` 存取

#### Scenario: 建置失敗不部署
- **WHEN** 前端建置過程中發生錯誤（如 TypeScript 編譯失敗）
- **THEN** workflow 中止，不執行部署步驟，GitHub Actions 顯示失敗狀態

### Requirement: 後端自動部署至 Render.com
系統 SHALL 在 push 到 main branch 時觸發 Render.com 自動部署後端 API 服務。

#### Scenario: push 到 main 觸發後端部署
- **WHEN** 開發者 push 程式碼到 main branch
- **THEN** Render.com 偵測到變更後自動重新部署 FastAPI 服務，部署完成後 API 可透過 `https://<app>.onrender.com` 存取

#### Scenario: Render Blueprint 定義服務
- **WHEN** 儲存庫根目錄存在 `render.yaml`
- **THEN** Render.com 根據 Blueprint 自動配置 web service（Python 環境）和 PostgreSQL 資料庫

### Requirement: 前端 SPA 路由支援
系統 SHALL 確保 GitHub Pages 上的 React SPA 路由正常運作（非根路徑不會 404）。

#### Scenario: 直接存取子路由
- **WHEN** 使用者直接在瀏覽器輸入 `https://<user>.github.io/<repo>/transactions`
- **THEN** GitHub Pages 透過 404.html 重導向機制，正確載入 React 應用並顯示 transactions 頁面

### Requirement: 環境變數管理
系統 SHALL 透過環境變數區分開發與生產環境的 API 位址。

#### Scenario: 開發環境
- **WHEN** 開發者在本地執行 `npm run dev`
- **THEN** 前端使用 `.env.development` 中的 `VITE_API_URL=http://localhost:8000` 連線本地後端

#### Scenario: 生產環境
- **WHEN** GitHub Actions 建置前端
- **THEN** 使用 `.env.production` 中的 `VITE_API_URL=https://<app>.onrender.com` 連線 Render 後端

### Requirement: 提供 render.yaml Blueprint
系統 SHALL 在儲存庫根目錄提供 `render.yaml` 檔案，定義 Render.com 的服務配置。

#### Scenario: Blueprint 包含 web service 和 database
- **WHEN** 使用者在 Render Dashboard 匯入儲存庫
- **THEN** Render 根據 `render.yaml` 自動建立 Python web service 和 PostgreSQL 資料庫，並連結 DATABASE_URL 環境變數

