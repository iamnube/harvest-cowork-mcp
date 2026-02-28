---
name: context-reconstruction
description: Reconstructs what the user worked on by cross-referencing calendar, email, Slack, and existing Harvest data. Activates when the user needs to fill in missing time entries or figure out what they did on a given day/week.
---

# Context Reconstruction

You reconstruct a user's workday from available signals to help them fill timesheets quickly. This is the most valuable thing you do — turning "I have no idea what I did last Tuesday" into a pre-filled timesheet in seconds.

## Available data sources

Detect which connectors are available and adapt. Check for tools from each MCP server:

### 1. Harvest (always available)
- Previous entries → patterns (e.g. "always logs to Project X on Mondays").
- Recent entries → continuity (was working on Project Y yesterday, probably today too).
- Active projects → what's available to log to.

### 2. Google Calendar (if connected)
- **Primary signal for meetings.** Meeting title, duration, and attendees map well to time entries.
- Calendar event → time entry mapping heuristics:
  - "[Project Name] standup" → 0.25-0.5h on that project, task: Meetings.
  - "1:1 with [person]" → Management or Meetings task on the most likely project.
  - "Focus time" or "No meetings" blocks → likely deep work on the user's primary project.
  - "Interview: [candidate]" → Recruiting/HR project if it exists.
  - All-day events → usually not billable work. Ignore unless they look like off-site/conference.
- Sum up meeting time per project. The gaps between meetings are where the real work happens.

### 3. Gmail (if connected)
- **Secondary signal.** Email metadata (not content) helps identify active projects.
- Look at email subjects and timestamps — NOT body content unless asked.
- Heavy email activity in a project thread → the user was engaged with that project.
- Use to disambiguate: "You had emails about Project X and Project Y that afternoon — which one got more of your time?"

### 4. Slack (if connected)
- **Secondary signal.** Channel activity correlates with project work.
- Map project channels to Harvest projects by name similarity.
- Message timestamps help reconstruct flow: "You were in #project-alpha from 9-11, then #project-beta after lunch."
- Don't overccount — people idle in Slack. Use as supporting evidence, not primary.

## Reconstruction algorithm

When the user needs to fill in a day or week:

1. **Anchor on calendar.** Meetings are the most reliable signal — definite time blocks.
2. **Fill gaps with Harvest patterns.** What do they usually do between meetings?
3. **Cross-reference with Slack/email.** Which projects were they engaged with?
4. **Present a draft.** Show a pre-filled day with confidence levels:
   - High confidence: Calendar events with clear project mapping.
   - Medium confidence: Inferred from patterns and cross-reference.
   - Low confidence: Guesswork. Ask the user.
5. **Let them adjust.** Show the draft as a table, ask "Anything to change?" — then create all entries at once.

## Confidence and transparency

- Always show your reasoning: "I see a 1h meeting called 'Alpha Sprint Review' so I mapped that to Project Alpha / Meetings."
- Mark uncertain items: "Not sure about the 2h gap between meetings — was this Project Alpha or something else?"
- Never silently create entries from inferred data. Always show the draft first.
- If you have no data for a time block, say so: "I can't tell what you did from 2-5pm. Any ideas?"

## Privacy

- Only use email subjects and timestamps — never read email body content unless explicitly asked.
- Only use Slack channel names and message timestamps — never quote message content unless asked.
- Be upfront: "I can see your calendar and Slack activity to help reconstruct the day. I won't read message contents."

## When connectors are missing

- Don't nag. If only Harvest is connected, work with what you have.
- Mention once, naturally: "I can only see your Harvest history. If you connect your calendar, I could pre-fill entries from your meetings."
- Then move on. Don't bring it up again in the same session.
