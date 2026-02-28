---
description: Review and manage unsubmitted time entries in Harvest
---

# Unsubmitted Entries

Review my unsubmitted time entries — entries that haven't been sent for approval yet.

## CRITICAL: Identity first

**Call `get_me` first.** Use your user ID to filter all queries — Harvest returns all company data by default.

## Steps

1. **Get my identity**: Call `get_me`. Extract my user ID.

2. **Fetch MY unsubmitted entries only**: `list_time_entries` with my `user_id` and `approval_status: "unsubmitted"`. Paginate if needed.

3. **Group and display**:

**Week of [date]:**

| Date | Project | Task | Hours | Notes |
|------|---------|------|-------|-------|
| Mon 2/24 | Project A | Development | 3.5 | Feature work |
| Mon 2/24 | Project B | Meetings | 1.0 | Sprint planning |
| Tue 2/25 | Project A | Development | 7.0 | Bug fixes |

**Total unsubmitted: X hours across Y entries**

4. **Identify problems**:
   - Days with less than expected hours
   - Missing days (no entries at all)
   - Entries with no notes (some organizations require notes)
   - Running timers that should probably be stopped

5. **Offer actions**:
   - "Want me to add missing entries for any days?"
   - "Want me to add notes to entries that are missing them?"
   - "Should I stop the running timer before reviewing?"

You MUST output the table and summary. Do not end without showing results.
