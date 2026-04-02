## Purpose

收支統計摘要，按日/週/月彙總，顯示收入、支出與結餘。

## ADDED Requirements

### Requirement: 收支統計摘要
系統 SHALL 提供收支統計摘要 API，回傳指定期間的總收入、總支出、淨結餘，以及按分類的細項統計。

#### Scenario: 查詢本月摘要
- **WHEN** 使用者查詢 period=month（不指定日期，預設當月）
- **THEN** 系統回傳當月的 total_income、total_expense、balance（= total_income - total_expense），以及每個分類的加總

#### Scenario: 查詢自訂日期範圍摘要
- **WHEN** 使用者查詢 start_date=2026-01-01、end_date=2026-03-31
- **THEN** 系統回傳該期間的統計摘要

#### Scenario: 無資料時的摘要
- **WHEN** 查詢期間內沒有任何收支記錄
- **THEN** 系統回傳 total_income=0、total_expense=0、balance=0，分類細項為空陣列

### Requirement: 按分類統計
系統 SHALL 在摘要中提供每個分類的收支加總與佔比百分比。

#### Scenario: 分類佔比計算
- **WHEN** 使用者查詢期間有餐飲 3000、交通 1000、購物 2000
- **THEN** 系統回傳各分類的 amount 與 percentage（餐飲 50%、交通 16.67%、購物 33.33%）

### Requirement: 按時間維度統計
系統 SHALL 支援按日、週、月三種時間維度彙總收支趨勢資料。

#### Scenario: 按日彙總
- **WHEN** 使用者查詢 group_by=day、期間為 2026-04-01 至 2026-04-07
- **THEN** 系統回傳 7 天中每天的 income、expense、balance 資料點

#### Scenario: 按月彙總
- **WHEN** 使用者查詢 group_by=month、期間為 2026-01-01 至 2026-06-30
- **THEN** 系統回傳 6 個月中每月的 income、expense、balance 資料點
