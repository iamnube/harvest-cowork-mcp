import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

const expenseReportSchema = z.object({
  from: z.string().describe("Start date (YYYY-MM-DD)"),
  to: z.string().describe("End date (YYYY-MM-DD). Timeframe cannot exceed 1 year."),
  page: z.number().optional().describe("Page number for pagination"),
  per_page: z.number().optional().describe("Results per page (max 2000)"),
});

const timeReportSchema = z.object({
  from: z.string().describe("Start date (YYYY-MM-DD)"),
  to: z.string().describe("End date (YYYY-MM-DD)"),
  include_fixed_fee: z.boolean().optional().describe("Include billable amounts for fixed-fee projects"),
  page: z.number().optional().describe("Page number for pagination"),
  per_page: z.number().optional().describe("Results per page (max 2000)"),
});

export function registerReportTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "time_report_by_clients",
    {
      title: "Time Report by Clients",
      description:
        "Get a time report grouped by clients for a date range. Shows total hours, billable hours, and billable amounts per client.",
      inputSchema: timeReportSchema,
    },
    async (args) => {
      const result = await client.getTimeReportByClients(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "time_report_by_projects",
    {
      title: "Time Report by Projects",
      description:
        "Get a time report grouped by projects for a date range. Shows total hours, billable hours, and billable amounts per project.",
      inputSchema: timeReportSchema,
    },
    async (args) => {
      const result = await client.getTimeReportByProjects(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "time_report_by_tasks",
    {
      title: "Time Report by Tasks",
      description:
        "Get a time report grouped by tasks for a date range. Shows total hours, billable hours, and billable amounts per task.",
      inputSchema: timeReportSchema,
    },
    async (args) => {
      const result = await client.getTimeReportByTasks(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "time_report_by_team",
    {
      title: "Time Report by Team",
      description:
        "Get a time report grouped by team members for a date range. Shows total hours, billable hours, and billable amounts per user.",
      inputSchema: timeReportSchema,
    },
    async (args) => {
      const result = await client.getTimeReportByTeam(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  // --- Project Budget Report ---

  server.registerTool(
    "project_budget_report",
    {
      title: "Project Budget Report",
      description:
        "Get a project budget report showing budget, spent, and remaining amounts for all projects.",
      inputSchema: z.object({
        is_active: z.boolean().optional().describe("Filter by active projects"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.getProjectBudgetReport(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  // --- Uninvoiced Report ---

  server.registerTool(
    "uninvoiced_report",
    {
      title: "Uninvoiced Report",
      description:
        "Get an uninvoiced report for a date range. Shows uninvoiced hours, expenses, and amounts per project.",
      inputSchema: z.object({
        from: z.string().describe("Start date (YYYY-MM-DD)"),
        to: z.string().describe("End date (YYYY-MM-DD)"),
        include_fixed_fee: z.boolean().optional().describe("Include fixed-fee projects"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.getUninvoicedReport(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  // --- Expense Reports ---

  server.registerTool(
    "expense_report_by_clients",
    {
      title: "Expense Report by Clients",
      description: "Get an expense report grouped by clients for a date range.",
      inputSchema: expenseReportSchema,
    },
    async (args) => {
      const result = await client.getExpenseReportByClients(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "expense_report_by_projects",
    {
      title: "Expense Report by Projects",
      description: "Get an expense report grouped by projects for a date range.",
      inputSchema: expenseReportSchema,
    },
    async (args) => {
      const result = await client.getExpenseReportByProjects(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "expense_report_by_categories",
    {
      title: "Expense Report by Categories",
      description: "Get an expense report grouped by expense categories for a date range.",
      inputSchema: expenseReportSchema,
    },
    async (args) => {
      const result = await client.getExpenseReportByCategories(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "expense_report_by_team",
    {
      title: "Expense Report by Team",
      description: "Get an expense report grouped by team members for a date range.",
      inputSchema: expenseReportSchema,
    },
    async (args) => {
      const result = await client.getExpenseReportByTeam(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
