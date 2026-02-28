import { z } from "zod";
export function registerTaskTools(server, client) {
    server.registerTool("list_tasks", {
        title: "List Tasks",
        description: "List all tasks available in Harvest. Tasks are the activity types (e.g. 'Development', 'Design') that can be assigned to projects.",
        inputSchema: z.object({
            is_active: z.boolean().optional().describe("Filter by active status"),
            page: z.number().optional().describe("Page number for pagination"),
            per_page: z.number().optional().describe("Results per page (max 2000)"),
        }),
    }, async (args) => {
        const result = await client.listTasks(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("get_task", {
        title: "Get Task",
        description: "Get a specific task by ID.",
        inputSchema: z.object({
            task_id: z.number().describe("The task ID"),
        }),
    }, async (args) => {
        const result = await client.getTask(args.task_id);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("create_task", {
        title: "Create Task",
        description: "Create a new task (activity type) in Harvest.",
        inputSchema: z.object({
            name: z.string().describe("The name of the task"),
            billable_by_default: z.boolean().optional().describe("Whether the task is billable by default (defaults to true)"),
            default_hourly_rate: z.number().optional().describe("Default hourly rate for the task (defaults to 0)"),
            is_default: z.boolean().optional().describe("Whether this task is added to new projects by default"),
            is_active: z.boolean().optional().describe("Whether the task is active (defaults to true)"),
        }),
    }, async (args) => {
        const result = await client.createTask(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("update_task", {
        title: "Update Task",
        description: "Update an existing task. Any parameters not provided will be left unchanged.",
        inputSchema: z.object({
            task_id: z.number().describe("The task ID to update"),
            name: z.string().optional().describe("The name of the task"),
            billable_by_default: z.boolean().optional().describe("Whether the task is billable by default"),
            default_hourly_rate: z.number().optional().describe("Default hourly rate for the task"),
            is_default: z.boolean().optional().describe("Whether this task is added to new projects by default"),
            is_active: z.boolean().optional().describe("Whether the task is active"),
        }),
    }, async (args) => {
        const { task_id, ...data } = args;
        const result = await client.updateTask(task_id, data);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("delete_task", {
        title: "Delete Task",
        description: "Delete a task. Only possible if it has no time entries. This is destructive and cannot be undone.",
        annotations: {
            destructiveHint: true,
        },
        inputSchema: z.object({
            task_id: z.number().describe("The task ID to delete"),
        }),
    }, async (args) => {
        await client.deleteTask(args.task_id);
        return {
            content: [{ type: "text", text: `Task ${args.task_id} deleted successfully.` }],
        };
    });
}
//# sourceMappingURL=tasks.js.map