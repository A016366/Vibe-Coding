## Purpose

收支項目的新增、修改、刪除、查詢功能，包含金額、分類、備註、日期等欄位。

## ADDED Requirements

### Requirement: 新增收支項目
系統 SHALL 允許使用者新增一筆收支記錄，包含金額（必填）、類型（收入/支出，必填）、分類（必填）、日期（必填，預設為今天）、備註（選填）。

#### Scenario: 成功新增一筆支出
- **WHEN** 使用者填寫金額 500、類型「支出」、分類「餐飲」、日期 2026-04-01 並提交
- **THEN** 系統建立該筆記錄並回傳完整的記錄資料（含自動產生的 id 與 created_at）

#### Scenario: 缺少必填欄位
- **WHEN** 使用者提交時未填寫金額
- **THEN** 系統回傳 422 驗證錯誤，說明缺少必填欄位

#### Scenario: 金額為負數
- **WHEN** 使用者填寫金額 -100
- **THEN** 系統回傳 422 驗證錯誤，金額 SHALL 為正數

### Requirement: 查詢收支項目
系統 SHALL 提供查詢收支記錄的功能，支援分頁、日期範圍篩選、分類篩選，預設按日期降序排列。

#### Scenario: 查詢所有記錄（預設分頁）
- **WHEN** 使用者不帶任何篩選條件查詢
- **THEN** 系統回傳第一頁的記錄清單（預設每頁 20 筆），按日期降序排列，並附帶分頁資訊（total, page, page_size）

#### Scenario: 按日期範圍篩選
- **WHEN** 使用者查詢 start_date=2026-03-01 至 end_date=2026-03-31
- **THEN** 系統只回傳該日期範圍內的記錄

#### Scenario: 按分類篩選
- **WHEN** 使用者查詢 category_id=3
- **THEN** 系統只回傳屬於該分類的記錄

### Requirement: 取得單筆收支項目
系統 SHALL 允許使用者透過 id 取得單筆收支記錄的完整資料。

#### Scenario: 成功取得
- **WHEN** 使用者查詢存在的 id
- **THEN** 系統回傳該筆記錄的完整資料

#### Scenario: 記錄不存在
- **WHEN** 使用者查詢不存在的 id
- **THEN** 系統回傳 404 錯誤

### Requirement: 修改收支項目
系統 SHALL 允許使用者修改既有收支記錄的任何欄位，並自動更新 updated_at 時間戳記。

#### Scenario: 成功修改金額
- **WHEN** 使用者將 id=1 的金額從 500 修改為 600
- **THEN** 系統更新該筆記錄並回傳更新後的完整資料，updated_at 已更新

#### Scenario: 修改不存在的記錄
- **WHEN** 使用者嘗試修改不存在的 id
- **THEN** 系統回傳 404 錯誤

### Requirement: 刪除收支項目
系統 SHALL 允許使用者刪除指定的收支記錄。

#### Scenario: 成功刪除
- **WHEN** 使用者刪除 id=1 的記錄
- **THEN** 系統刪除該筆記錄並回傳 204 No Content

#### Scenario: 刪除不存在的記錄
- **WHEN** 使用者嘗試刪除不存在的 id
- **THEN** 系統回傳 404 錯誤
