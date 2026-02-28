import { z } from "zod";
export function registerWeeklySummaryPrompt(server) {
    server.registerPrompt("weekly-summary", {
        title: "Weekly Summary",
        description: "Generate a summary of time entries for a given week, grouped by project and client. Highlights total hours, daily breakdown, and gaps.",
        argsSchema: {
            week_offset: z
                .string()
                .optional()
                .describe("Week offset from current week (0 = this week, -1 = last week). Defaults to 0."),
        },
    }, (args) => {
        const offset = args.week_offset ? parseInt(args.week_offset, 10) : 0;
        const offsetDesc = offset === 0
            ? "this week (Monday through today)"
            : offset === -1
                ? "last week (Monday through Friday)"
                : `${Math.abs(offset)} weeks ago`;
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Generate a weekly time summary for ${offsetDesc}.

Steps:
1. Use get_me to get my user ID.
2. Calculate the Monday and Sunday dates for the target week.
3. Use list_time_entries with my user_id and the from/to date range to fetch all entries.
4. Group the entries by project (and client).
5. Present a summary table showing:
   - Each project with total hours
   - Daily breakdown (Mon-Fri at minimum)
   - Grand total hours
6. Flag any days with less than expected hours (e.g. <8h on weekdays) or missing days.`,
                    },
                },
            ],
        };
    });
}
//# sourceMappingURL=weekly-summary.js.map