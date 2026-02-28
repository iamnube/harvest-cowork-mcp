---
description: Generate a weekly time tracking summary from Harvest
argument-hint: "[week offset, e.g. 'last week']"
---

# Weekly Time Report

Generate MY weekly time report from Harvest.

## CRITICAL: This is a personal report

**You MUST call `get_me` first to get your user ID, then filter ALL queries by that user_id.** Harvest returns the entire company's entries by default. Never show other people's hours.

## Steps

1. **Get my identity**: Call `get_me`. Extract my `id` — this is the user_id for ALL subsequent queries.

2. **Determine the week**: Default to current week (Monday through today). If the user says "last week", use the previous Monday–Friday.

3. **Fetch MY entries only**: `list_time_entries` with `user_id` set to MY id and the date range (`from` and `to`). Paginate if `total_pages > 1`.

4. **Build and OUTPUT this table**:

**Weekly Time Report: [Mon date] – [Fri/today date]**

| Project | Client | Mon | Tue | Wed | Thu | Fri | Total |
|---------|--------|-----|-----|-----|-----|-----|-------|
| Alpha | Client X | 3.0 | 4.0 | — | 2.0 | 3.5 | 12.5 |
| Beta | Client Y | 5.0 | 4.0 | 8.0 | 6.0 | 4.5 | 27.5 |
| **Total** | | **8.0** | **8.0** | **8.0** | **8.0** | **8.0** | **40.0** |

5. **Flag issues** (briefly, not judgmentally):
   - Days under 7h
   - Days with zero entries
   - Running timers that should probably be stopped

6. **Summary**: Total hours, billable vs non-billable, project count. One paragraph max.

You MUST output the table and summary. Do not end without showing results.
