import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

export function registerProjectTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "list_projects",
    {
      title: "List Projects",
      description: "List projects with optional filters. Returns project names, IDs, clients, budgets, and active status.",
      inputSchema: z.object({
        is_active: z.boolean().optional().describe("Filter by active status"),
        client_id: z.number().optional().describe("Filter by client ID"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.listProjects(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_project",
    {
      title: "Get Project",
      description: "Get detailed information about a specific project including budget, rates, and dates.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
      }),
    },
    async (args) => {
      const result = await client.getProject(args.project_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "create_project",
    {
      title: "Create Project",
      description: "Create a new project in Harvest. Requires client_id, name, is_billable, bill_by, and budget_by.",
      inputSchema: z.object({
        client_id: z.number().describe("The ID of the client to associate with the project"),
        name: z.string().describe("The name of the project"),
        is_billable: z.boolean().describe("Whether the project is billable"),
        bill_by: z.enum(["Project", "Tasks", "People", "none"]).describe("The billing method"),
        budget_by: z.enum(["project", "project_cost", "task", "task_fees", "person", "none"]).describe("The budget method"),
        code: z.string().optional().describe("The project code"),
        is_active: z.boolean().optional().describe("Whether the project is active (defaults to true)"),
        is_fixed_fee: z.boolean().optional().describe("Whether the project is a fixed-fee project"),
        hourly_rate: z.number().optional().describe("Hourly rate for the project (only for Project bill_by)"),
        budget: z.number().optional().describe("The budget in hours or money"),
        budget_is_monthly: z.boolean().optional().describe("Whether the budget resets every month"),
        notify_when_over_budget: z.boolean().optional().describe("Send notification when over budget"),
        over_budget_notification_percentage: z.number().optional().describe("Percentage at which to send over-budget notification"),
        show_budget_to_all: z.boolean().optional().describe("Show budget to all employees"),
        cost_budget: z.number().optional().describe("The cost budget"),
        cost_budget_include_expenses: z.boolean().optional().describe("Include expenses in cost budget"),
        fee: z.number().optional().describe("The amount for fixed-fee projects"),
        notes: z.string().optional().describe("Project notes"),
        starts_on: z.string().optional().describe("Project start date (YYYY-MM-DD)"),
        ends_on: z.string().optional().describe("Project end date (YYYY-MM-DD)"),
      }),
    },
    async (args) => {
      const result = await client.createProject(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "update_project",
    {
      title: "Update Project",
      description: "Update an existing project. Any parameters not provided will be left unchanged.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID to update"),
        client_id: z.number().optional().describe("The ID of the client"),
        name: z.string().optional().describe("The name of the project"),
        is_billable: z.boolean().optional().describe("Whether the project is billable"),
        bill_by: z.enum(["Project", "Tasks", "People", "none"]).optional().describe("The billing method"),
        budget_by: z.enum(["project", "project_cost", "task", "task_fees", "person", "none"]).optional().describe("The budget method"),
        code: z.string().optional().describe("The project code"),
        is_active: z.boolean().optional().describe("Whether the project is active"),
        is_fixed_fee: z.boolean().optional().describe("Whether the project is a fixed-fee project"),
        hourly_rate: z.number().optional().describe("Hourly rate for the project"),
        budget: z.number().optional().describe("The budget in hours or money"),
        budget_is_monthly: z.boolean().optional().describe("Whether the budget resets every month"),
        notify_when_over_budget: z.boolean().optional().describe("Send notification when over budget"),
        over_budget_notification_percentage: z.number().optional().describe("Percentage at which to send over-budget notification"),
        show_budget_to_all: z.boolean().optional().describe("Show budget to all employees"),
        cost_budget: z.number().optional().describe("The cost budget"),
        cost_budget_include_expenses: z.boolean().optional().describe("Include expenses in cost budget"),
        fee: z.number().optional().describe("The amount for fixed-fee projects"),
        notes: z.string().optional().describe("Project notes"),
        starts_on: z.string().optional().describe("Project start date (YYYY-MM-DD)"),
        ends_on: z.string().optional().describe("Project end date (YYYY-MM-DD)"),
      }),
    },
    async (args) => {
      const { project_id, ...data } = args;
      const result = await client.updateProject(project_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "delete_project",
    {
      title: "Delete Project",
      description: "Delete a project. This is a destructive action and cannot be undone.",
      annotations: {
        destructiveHint: true,
      },
      inputSchema: z.object({
        project_id: z.number().describe("The project ID to delete"),
      }),
    },
    async (args) => {
      await client.deleteProject(args.project_id);
      return {
        content: [{ type: "text" as const, text: `Project ${args.project_id} deleted successfully.` }],
      };
    },
  );

  server.registerTool(
    "list_project_task_assignments",
    {
      title: "List Project Task Assignments",
      description: "List task assignments for a project. Shows which tasks are available for time tracking on a given project, including billable status and hourly rates.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const { project_id, ...params } = args;
      const result = await client.listProjectTaskAssignments(project_id, params);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
