---
description: Start, stop, or check Harvest timer status
argument-hint: "[action, e.g. 'start on Alpha', 'stop', 'status']"
---

# Timer

Manage my Harvest timer. Figure out what I need based on context.

## CRITICAL: Identity first

**Call `get_me` first.** Use your user ID to filter all queries — Harvest returns all company data by default.

## If I say "start" or mention starting work on something:

1. Check for running timers — `list_time_entries` for today with my `user_id`, look for `is_running: true`.
2. If a timer is already running, show it and ask: "You have a timer running on [project/task] for [hours] hours. Stop it and start a new one?"
3. If confirmed (or no timer running), help me pick a project and task.
4. Create a time entry without `hours` to start the timer.
5. Confirm: "Timer started on [project] / [task]."

## If I say "stop":

1. Find the running timer (today's entries with my `user_id`, `is_running: true`).
2. Use `stop_timer` on it.
3. Show: "Timer stopped. [project] / [task]: [hours] hours."

## If I say "status" or just use the command with no context:

1. Find today's entries filtered by my `user_id`.
2. If a timer is running: "Timer running: [project] / [task] — [hours] hours since [timer_started_at time]."
3. If no timer: "No timer running. Today's total: [X] hours across [N] entries."
