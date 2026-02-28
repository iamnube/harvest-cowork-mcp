import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

export function registerProjectUserAssignmentTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "list_all_user_assignments",
    {
      title: "List All User Assignments",
      description: "List all user assignments across all projects. Shows who is assigned to which projects.",
      inputSchema: z.object({
        user_id: z.number().optional().describe("Filter by user ID"),
        is_active: z.boolean().optional().describe("Filter by active status"),
        updated_since: z.string().optional().describe("Only return assignments updated since this datetime"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.listAllUserAssignments(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "list_project_user_assignments",
    {
      title: "List Project User Assignments",
      description: "List user assignments for a specific project. Shows who is assigned to the project, their roles, and rates.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        user_id: z.number().optional().describe("Filter by user ID"),
        is_active: z.boolean().optional().describe("Filter by active status"),
        updated_since: z.string().optional().describe("Only return assignments updated since this datetime"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const { project_id, ...params } = args;
      const result = await client.listProjectUserAssignments(project_id, params);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_project_user_assignment",
    {
      title: "Get Project User Assignment",
      description: "Get a specific user assignment for a project.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        user_assignment_id: z.number().describe("The user assignment ID"),
      }),
    },
    async (args) => {
      const result = await client.getProjectUserAssignment(args.project_id, args.user_assignment_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "create_project_user_assignment",
    {
      title: "Assign User to Project",
      description: "Assign a user to a project. Sets their role, rates, and budget on the project.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        user_id: z.number().describe("The user ID to assign"),
        is_active: z.boolean().optional().describe("Whether the assignment is active (defaults to true)"),
        is_project_manager: z.boolean().optional().describe("Whether the user is a project manager"),
        use_default_rates: z.boolean().optional().describe("Use default rates (defaults to true)"),
        hourly_rate: z.number().optional().describe("Custom hourly rate for this assignment"),
        budget: z.number().optional().describe("Budget for this user on the project"),
      }),
    },
    async (args) => {
      const { project_id, ...data } = args;
      const result = await client.createProjectUserAssignment(project_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "update_project_user_assignment",
    {
      title: "Update Project User Assignment",
      description: "Update a user's assignment on a project. Any parameters not provided will be left unchanged.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        user_assignment_id: z.number().describe("The user assignment ID to update"),
        is_active: z.boolean().optional().describe("Whether the assignment is active"),
        is_project_manager: z.boolean().optional().describe("Whether the user is a project manager"),
        use_default_rates: z.boolean().optional().describe("Use default rates"),
        hourly_rate: z.number().optional().describe("Custom hourly rate"),
        budget: z.number().optional().describe("Budget for this user on the project"),
      }),
    },
    async (args) => {
      const { project_id, user_assignment_id, ...data } = args;
      const result = await client.updateProjectUserAssignment(project_id, user_assignment_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "delete_project_user_assignment",
    {
      title: "Remove User from Project",
      description: "Remove a user's assignment from a project. This is a destructive action and cannot be undone.",
      annotations: {
        destructiveHint: true,
      },
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        user_assignment_id: z.number().describe("The user assignment ID to delete"),
      }),
    },
    async (args) => {
      await client.deleteProjectUserAssignment(args.project_id, args.user_assignment_id);
      return {
        content: [{ type: "text" as const, text: `User assignment ${args.user_assignment_id} removed from project ${args.project_id} successfully.` }],
      };
    },
  );
}
