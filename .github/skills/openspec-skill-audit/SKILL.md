---
name: openspec-skill-audit
description: Audit and display which skills have been invoked in the current conversation. Use this skill whenever the user asks "which skills were used?", "show me skill usage", "was the right skill triggered?", "did the skill get called?", "skill audit", "skill history", "show skill invocations", or anything about verifying, checking, or reviewing which OpenSpec (or other) skills were activated during the session. Also trigger when the user seems frustrated that a skill may not have fired correctly.
license: MIT
metadata:
  author: openspec
  version: "1.0"
---

Audit the current conversation and report all skill invocations — what was called, how many times, and in what context. Then print the summary to the terminal.

---

## Steps

### 1. Scan the conversation history

Look through the entire conversation (from the very beginning up to now) for every instance where the `skill` tool was called. For each invocation, note:

- **Skill name** — the value passed to the `skill` tool
- **Turn context** — a brief description of what the user was asking for at that point (1 sentence max)
- **Outcome** — whether the skill result indicated success or an error

If you find no skill invocations, that's valid — report it clearly.

### 2. Build the audit report

Organize findings into this structure:

```
╔══════════════════════════════════════════════╗
║           SKILL INVOCATION AUDIT             ║
╚══════════════════════════════════════════════╝

Session summary: <N> skill(s) invoked, <M> unique skill(s)

┌─────────────────────────────────────────────────────────────────┐
│ #  │ Skill Name              │ Times │ Last Context             │
├─────────────────────────────────────────────────────────────────┤
│ 1  │ openspec-new-change     │   1   │ User created a new change│
│ 2  │ openspec-skill-audit    │   1   │ Current audit request    │
└─────────────────────────────────────────────────────────────────┘

Details:
  [1] openspec-new-change
      → Context: "User asked to create a new change called add-auth"
      → Status: ✓ Loaded successfully

  [2] openspec-skill-audit
      → Context: "User asked which skills were used"
      → Status: ✓ Loaded successfully (this run)
```

If no skills were invoked:
```
╔══════════════════════════════════════════════╗
║           SKILL INVOCATION AUDIT             ║
╚══════════════════════════════════════════════╝

No skills were invoked in this session.

This may mean:
  • Requests were handled directly without needing a skill
  • Skills exist but their descriptions didn't match the prompts
  • The skill tool was not available in this session
```

### 3. Print to the terminal

Run a PowerShell command to echo the audit summary to the terminal with colour highlighting, so the user can see it outside of the chat UI:

```powershell
Write-Host "`n╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           SKILL INVOCATION AUDIT             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# For each skill found, output one line like:
Write-Host "  ✓ openspec-new-change" -ForegroundColor Green -NoNewline
Write-Host "  (1x) — User asked to create a new change" -ForegroundColor Gray

# If none found:
Write-Host "  ⚠ No skills were invoked in this session." -ForegroundColor Yellow
```

Adapt the output to match the actual findings — don't hardcode the skill names; generate the commands dynamically based on what you found in step 1.

### 4. Present in-chat summary

After the terminal output, present the full formatted audit report in the conversation (as shown in step 2). End with an observation note:

- If skills fired as expected → "✓ Skills are triggering correctly."
- If a skill the user expected was NOT found → "⚠ `<skill-name>` was not triggered. This could mean the description didn't match the user's phrasing, or the tool wasn't invoked. Consider rephrasing the request or checking the skill's description."
- If the same skill was invoked many times unexpectedly → note it as a potential loop or duplicate trigger.

---

## Guardrails

- **Don't guess** — only report skills that actually appear in the conversation history as `skill` tool calls. Don't infer from context alone.
- **Include yourself** — this audit skill itself counts as an invocation; include it in the list.
- **Be factual** — if the conversation history is ambiguous or you can't see early turns, say so.
- **No false positives** — a skill being *mentioned* in text is not the same as being *invoked* via the tool.
