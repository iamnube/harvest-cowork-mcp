---
description: Log a time entry in Harvest, using context to minimize questions
argument-hint: "[description, e.g. '2h on Project Alpha']"
---

# Log Time

Help me log a time entry in Harvest. Be smart about it — minimize questions by using context.

## CRITICAL: Identity first

**Call `get_me` first.** Use your user ID for all queries.

## Steps

1. **Get my identity**: Call `get_me`. Remember the user ID.

2. **Use context to pre-fill**:
   - Check my recent Harvest entries — what projects/tasks have I been working on?
   - If I mention a project name, match it immediately. Don't show me a list if you already know.

3. **Only ask what you can't figure out.** Ideal interaction:
   - "Logged 1.5h to Project Alpha / Development for this afternoon. Sound right?" → "yes" → Done.
   - NOT: "Which project?" → "Which task?" → "What date?" → "How many hours?" → "Any notes?" → "Confirm?"

4. **Create the entry** and confirm in one line: "Done — 1.5h on Alpha / Development, today."

5. If anything goes wrong (locked entry, invalid combo), explain briefly and fix it.

## Accept imprecision

- "About 2 hours on Alpha" → log 2h. Don't ask for exact minutes.
- "This morning on Beta" → log 4h (half day). Don't ask for start/end times.
- "Put the rest of the day on Alpha" → calculate remaining hours from other entries, log the difference.
