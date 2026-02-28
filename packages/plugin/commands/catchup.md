---
description: Fill in missing time entries by reconstructing your work from calendar, email, Slack, and Harvest patterns
argument-hint: "[date range, e.g. 'this week', 'since Monday']"
---

# Catchup

Help me catch up on my timesheets. Reconstruct what I worked on and draft entries for me.

## CRITICAL: Identity first

**Call `get_me` first.** Use your user ID to filter ALL queries — Harvest returns all company data by default.

## Steps

1. **Get my identity**: Call `get_me`. Extract my user ID.

2. **Figure out the gap**: Check my recent time entries (filtered by my `user_id`) to find where I stopped logging. If I specify a date range, use that instead. Default: everything since my last logged entry up to today.

3. **Gather context from every available source** (in parallel if possible):

   **Harvest history (filtered by my user_id):**
   - My recent entries: which projects/tasks do I usually work on?
   - My typical patterns: do I usually split time between projects? How?

   **Google Calendar** (if available):
   - Pull events for each day in the gap.
   - Map meetings to projects by matching event titles to project names.
   - Note the gaps between meetings — that's where deep work happened.

   **Gmail** (if available):
   - Check email subjects and timestamps for project-related activity.
   - Don't read email bodies — just use metadata.

   **Slack** (if available):
   - Check channel activity and timestamps.
   - Map project channels to Harvest projects by name.

4. **Build a draft timesheet** for each day. Present it as a table:

   **Monday 2/24:**
   | Time | Project | Task | Hours | Source | Confidence |
   |------|---------|------|-------|--------|------------|
   | 9:00-9:30 | Project Alpha | Meetings | 0.5 | Calendar: "Alpha standup" | High |
   | 9:30-12:00 | Project Alpha | Development | 2.5 | Pattern + Slack activity | Medium |
   | 12:00-13:00 | — | Lunch | — | — | — |
   | 13:00-14:00 | Project Beta | Meetings | 1.0 | Calendar: "Beta sprint review" | High |
   | 14:00-17:00 | ? | ? | 3.0 | No data | Ask user |
   | **Total** | | | **7.0** | | |

5. **Ask about unknowns** — but efficiently:
   - Group unknowns together: "I couldn't figure out Monday afternoon (3h) and Wednesday morning (2h). What were those?"
   - Suggest most likely projects based on patterns.
   - Accept vague answers: "Probably Alpha" is enough.

6. **Create all entries** once confirmed. Show a final summary:
   - "Created 15 entries across 5 days. Total: 38.5h."
   - Don't ask "would you like to review?" — they already saw the draft.

## Important

- Present everything as a draft. Never create entries without showing them first.
- It's fine if hours don't add up to exactly 8 per day. Real life is messy.
- Don't comment on gaps or low hours. Just fill in what we know.
- If the user says "looks good" or "go ahead" — create everything immediately. No double-checking.

You MUST output the draft table. Do not end without showing results.
