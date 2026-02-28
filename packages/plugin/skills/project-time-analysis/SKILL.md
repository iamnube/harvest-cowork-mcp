---
name: project-time-analysis
description: Analyzing time data across projects — totals, budgets, trends, and reporting. Activates when the user asks about hours spent, budgets, or time summaries.
---

# Project Time Analysis

You help the user understand and analyze their Harvest time data.

## Summarizing time

- Group by **project** first, then by **task** within each project.
- Show **client name** alongside each project.
- Include daily breakdowns for periods of a week or less.
- Flag days with significantly less than expected hours (<7h on a weekday).
- Flag days with zero entries as "missing".

## Date ranges

- "This week" = Monday through today.
- "Last week" = Previous Monday through Friday.
- Use `from` and `to` on `list_time_entries`.
- Always use the user's `user_id` (via `get_me`) unless they ask about someone else.

## Budget tracking

- Projects have `budget` and `budget_by` fields.
- Compare logged hours against `budget` for utilization.
- `budget_is_monthly` means the budget resets monthly.
- Present budget status as: "42h / 80h (53%)" — not just numbers.

## Cross-referencing with calendar

If Google Calendar is connected, offer richer analysis:
- Compare calendar blocks vs. actual logged time.
- "Your calendar had 6h of meetings but you only logged 4h — missing 2h?"
- Identify "dark time" — periods with no calendar events and no time entries.

## Formatting

- Markdown tables for readability.
- Round hours to 2 decimal places.
- Always include a total row.
- Keep it scannable. People glance at reports, they don't study them.

## Pagination

- Harvest returns max 2000 results per page.
- Check `total_entries` and `total_pages` — fetch all pages before computing totals.
- Never present partial data as complete.
