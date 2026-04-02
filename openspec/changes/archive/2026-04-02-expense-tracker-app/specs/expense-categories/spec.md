## Purpose

收支分類管理，預設分類與自訂分類支援。

## ADDED Requirements

### Requirement: 預設分類
系統 SHALL 在初始化時自動建立預設收支分類，包含常見的支出分類（餐飲、交通、購物、娛樂、醫療、教育、居住）與收入分類（薪資、獎金、投資、其他收入）。預設分類不可刪除。

#### Scenario: 系統初始化載入預設分類
- **WHEN** 資料庫初次遷移完成
- **THEN** 系統自動建立上述預設分類，每個分類包含 name、type（income/expense）、icon、is_default=true

#### Scenario: 嘗試刪除預設分類
- **WHEN** 使用者嘗試刪除 is_default=true 的分類
- **THEN** 系統回傳 400 錯誤，說明預設分類不可刪除

### Requirement: 查詢所有分類
系統 SHALL 提供查詢所有分類的功能，可按 type（income/expense）篩選。

#### Scenario: 查詢所有分類
- **WHEN** 使用者不帶篩選條件查詢
- **THEN** 系統回傳所有分類（預設 + 自訂），按 type 分組

#### Scenario: 按類型篩選
- **WHEN** 使用者查詢 type=expense
- **THEN** 系統只回傳支出類型的分類

### Requirement: 新增自訂分類
系統 SHALL 允許使用者新增自訂分類，包含 name（必填）、type（必填）、icon（選填）。

#### Scenario: 成功新增自訂分類
- **WHEN** 使用者新增名稱為「寵物」、類型為「expense」的分類
- **THEN** 系統建立該分類，is_default=false，並回傳完整資料

#### Scenario: 分類名稱重複
- **WHEN** 使用者新增已存在的分類名稱（同 type 下）
- **THEN** 系統回傳 409 Conflict 錯誤

### Requirement: 修改分類
系統 SHALL 允許使用者修改自訂分類的 name 和 icon。預設分類不可修改。

#### Scenario: 成功修改自訂分類
- **WHEN** 使用者修改自訂分類的名稱
- **THEN** 系統更新並回傳更新後的資料

#### Scenario: 嘗試修改預設分類
- **WHEN** 使用者嘗試修改 is_default=true 的分類
- **THEN** 系統回傳 400 錯誤

### Requirement: 刪除自訂分類
系統 SHALL 允許使用者刪除自訂分類。若該分類下有關聯的收支記錄，SHALL 將這些記錄的分類改為「其他」。

#### Scenario: 刪除無關聯記錄的分類
- **WHEN** 使用者刪除沒有關聯收支記錄的自訂分類
- **THEN** 系統刪除該分類並回傳 204 No Content

#### Scenario: 刪除有關聯記錄的分類
- **WHEN** 使用者刪除有 5 筆關聯收支記錄的自訂分類
- **THEN** 系統將這 5 筆記錄的 category_id 改為「其他」分類的 id，然後刪除該分類
