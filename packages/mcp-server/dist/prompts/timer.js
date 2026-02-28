import { z } from "zod";
export function registerTimerPrompt(server) {
    server.registerPrompt("timer", {
        title: "Timer",
        description: "Manage Harvest timers — start a new timer, stop the running one, or check timer status.",
        argsSchema: {
            action: z
                .enum(["start", "stop", "status"])
                .optional()
                .describe("Action to take: start a new timer, stop the current one, or check status. Defaults to status."),
        },
    }, (args) => {
        const action = args.action ?? "status";
        const instructions = {
            status: `Check my current timer status in Harvest.

Steps:
1. Use get_me to get my user ID.
2. Use list_time_entries with my user_id and today's date (from and to both set to today) to find entries.
3. Look for any entry where is_running is true.
4. If a timer is running, show: project name, task name, hours so far, and when it started (timer_started_at).
5. If no timer is running, say so and show today's total logged hours.`,
            start: `Start a new timer in Harvest.

Steps:
1. Use get_me to get my user ID.
2. First check if any timer is already running (list today's entries, look for is_running: true). If so, tell me and ask if I should stop it first.
3. Use list_projects to show active projects and ask which one.
4. Use list_project_task_assignments to show tasks for that project.
5. Create a time entry with create_time_entry using the chosen project, task, today's date, and NO hours (this starts a timer).
6. Confirm the timer is running.`,
            stop: `Stop my currently running timer in Harvest.

Steps:
1. Use get_me to get my user ID.
2. Use list_time_entries with my user_id and today's date to find entries.
3. Find the entry where is_running is true.
4. If found, use stop_timer with that entry's ID.
5. Show the final entry details: project, task, total hours.
6. If no timer is running, say so.`,
        };
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: instructions[action],
                    },
                },
            ],
        };
    });
}
//# sourceMappingURL=timer.js.map