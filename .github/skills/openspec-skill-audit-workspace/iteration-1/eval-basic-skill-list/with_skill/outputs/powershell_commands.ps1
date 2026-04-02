Write-Host "`n╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           SKILL INVOCATION AUDIT             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "  Session summary: 3 skill(s) invoked, 3 unique skill(s)`n" -ForegroundColor White

Write-Host "  ✓ openspec-new-change" -ForegroundColor Green -NoNewline
Write-Host "  (1x) — 使用者要求建立名為 add-user-auth 的新變更" -ForegroundColor Gray

Write-Host "  ✓ openspec-explore" -ForegroundColor Green -NoNewline
Write-Host "  (1x) — 使用者想要探索程式庫架構" -ForegroundColor Gray

Write-Host "  ✓ openspec-skill-audit" -ForegroundColor Green -NoNewline
Write-Host "  (1x) — 使用者詢問本次對話使用了哪些 skill" -ForegroundColor Gray

Write-Host "`n  ✓ Skills are triggering correctly.`n" -ForegroundColor Green
