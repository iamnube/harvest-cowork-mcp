import { z } from "zod";
export function registerLogTimePrompt(server) {
    server.registerPrompt("log-time", {
        title: "Log Time",
        description: "Interactive workflow to log a time entry. Guides you through selecting a project, task, duration, and notes.",
        argsSchema: {
            project: z.string().optional().describe("Project name or ID to pre-select"),
            date: z.string().optional().describe("Date for the entry (YYYY-MM-DD, defaults to today)"),
        },
    }, (args) => {
        const datePart = args.date
            ? `The date for this entry is ${args.date}.`
            : "The date for this entry is today.";
        const projectPart = args.project
            ? `The user wants to log time to the project "${args.project}".`
            : "First, help the user choose a project.";
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Help me log a time entry in Harvest.

${datePart}
${projectPart}

Follow these steps:
1. If no project is specified, use list_projects to show active projects and ask which one.
2. Use list_project_task_assignments to show available tasks for the chosen project, and ask which task.
3. Ask how long I worked (hours) or whether to start a timer.
4. Ask for any notes to add.
5. Create the time entry using create_time_entry.
6. Confirm what was created.`,
                    },
                },
            ],
        };
    });
}
//# sourceMappingURL=log-time.js.map