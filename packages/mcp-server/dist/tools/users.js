import { z } from "zod";
export function registerUserTools(server, client) {
    server.registerTool("get_me", {
        title: "Get Current User",
        description: "Get the currently authenticated user's profile including name, email, roles, and timezone.",
    }, async () => {
        const result = await client.getMe();
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("list_users", {
        title: "List Users",
        description: "List all users in the Harvest account.",
        inputSchema: z.object({
            is_active: z.boolean().optional().describe("Filter by active status"),
            page: z.number().optional().describe("Page number for pagination"),
            per_page: z.number().optional().describe("Results per page (max 2000)"),
        }),
    }, async (args) => {
        const result = await client.listUsers(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("get_user", {
        title: "Get User",
        description: "Get a specific user by ID.",
        inputSchema: z.object({
            user_id: z.number().describe("The user ID"),
        }),
    }, async (args) => {
        const result = await client.getUser(args.user_id);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("list_my_project_assignments", {
        title: "List My Project Assignments",
        description: "List active project assignments for the currently authenticated user. Shows which projects you are assigned to, with task assignments and rates.",
        inputSchema: z.object({
            page: z.number().optional().describe("Page number for pagination"),
            per_page: z.number().optional().describe("Results per page (max 2000)"),
        }),
    }, async (args) => {
        const result = await client.listMyProjectAssignments(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("list_user_project_assignments", {
        title: "List User Project Assignments",
        description: "List active project assignments for a specific user. Shows which projects the user is assigned to.",
        inputSchema: z.object({
            user_id: z.number().describe("The user ID"),
            updated_since: z.string().optional().describe("Only return assignments updated since this datetime"),
            page: z.number().optional().describe("Page number for pagination"),
            per_page: z.number().optional().describe("Results per page (max 2000)"),
        }),
    }, async (args) => {
        const { user_id, ...params } = args;
        const result = await client.listUserProjectAssignments(user_id, params);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
}
//# sourceMappingURL=users.js.map