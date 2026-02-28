---
name: harvest-conventions
description: Harvest API patterns, data model, and technical conventions. Activates when working with Harvest data to ensure correct API usage.
---

# Harvest Conventions

Technical patterns for working with the Harvest API correctly.

## Entity relationships

```
Client → has many → Projects
Project → has many → Task Assignments (project + task link)
Task → global, assigned to projects via Task Assignments
User → assigned to projects via User Assignments
Time Entry → belongs to: User, Project, Task, Client
```

- To find tasks on a project: `list_project_task_assignments` — not `list_tasks`.
- `list_tasks` returns all global tasks, not all are on every project.

## IDs

- All entity IDs are integers. Never guess — look them up.

## Dates and times

- Dates: `YYYY-MM-DD`
- Times: `HH:MM` (24h) or `h:mma` (12h)
- Timestamps: ISO 8601

## Approval workflow

- `unsubmitted` → `submitted` → `approved`
- Unsubmitted: freely editable.
- Submitted: pending approval, editing may be restricted.
- Approved: typically locked.

## Timers

- One timer at a time per user.
- Creating an entry without `hours` starts a timer.
- `is_running: true` = active timer.
- `restart_timer` to resume, `stop_timer` to stop.

## Pagination

- Default/max `per_page`: 2000.
- Response includes: `page`, `total_pages`, `total_entries`, `next_page`.

## Error handling

- 401: Bad token. 403: Insufficient permissions. 404: Not found.
- 422: Validation error (invalid project/task combo, missing fields).
- Rate limit: 100 req / 15 sec.

## Gotchas

- `hours: 0` creates a 0h entry. Omitting `hours` starts a timer. Different things.
- `rounded_hours` reflects account rounding settings, may differ from `hours`.
