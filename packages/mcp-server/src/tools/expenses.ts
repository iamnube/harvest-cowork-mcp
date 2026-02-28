import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

export function registerExpenseTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "list_expenses",
    {
      title: "List Expenses",
      description: "List expenses with optional filters by user, client, project, billing status, and date range.",
      inputSchema: z.object({
        user_id: z.number().optional().describe("Filter by user ID"),
        client_id: z.number().optional().describe("Filter by client ID"),
        project_id: z.number().optional().describe("Filter by project ID"),
        is_billed: z.boolean().optional().describe("Filter by billed status"),
        updated_since: z.string().optional().describe("Only return expenses updated since this datetime"),
        from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
        to: z.string().optional().describe("End date (YYYY-MM-DD)"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.listExpenses(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_expense",
    {
      title: "Get Expense",
      description: "Get a specific expense by ID.",
      inputSchema: z.object({
        expense_id: z.number().describe("The expense ID"),
      }),
    },
    async (args) => {
      const result = await client.getExpense(args.expense_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "create_expense",
    {
      title: "Create Expense",
      description:
        "Create a new expense. Provide either units (for unit-based categories) or total_cost.",
      inputSchema: z.object({
        project_id: z.number().describe("The project ID"),
        expense_category_id: z.number().describe("The expense category ID"),
        spent_date: z.string().describe("Date the expense was incurred (YYYY-MM-DD)"),
        user_id: z.number().optional().describe("User ID (defaults to authenticated user)"),
        units: z.number().optional().describe("Number of units (for unit-based categories)"),
        total_cost: z.number().optional().describe("Total cost (for non-unit-based categories)"),
        notes: z.string().optional().describe("Notes about the expense"),
        billable: z.boolean().optional().describe("Whether the expense is billable (defaults to true)"),
      }),
    },
    async (args) => {
      const result = await client.createExpense(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "update_expense",
    {
      title: "Update Expense",
      description: "Update an existing expense. Any parameters not provided will be left unchanged.",
      inputSchema: z.object({
        expense_id: z.number().describe("The expense ID to update"),
        project_id: z.number().optional().describe("The project ID"),
        expense_category_id: z.number().optional().describe("The expense category ID"),
        spent_date: z.string().optional().describe("Date the expense was incurred (YYYY-MM-DD)"),
        units: z.number().optional().describe("Number of units"),
        total_cost: z.number().optional().describe("Total cost"),
        notes: z.string().optional().describe("Notes about the expense"),
        billable: z.boolean().optional().describe("Whether the expense is billable"),
        delete_receipt: z.boolean().optional().describe("Set to true to delete the attached receipt"),
      }),
    },
    async (args) => {
      const { expense_id, ...data } = args;
      const result = await client.updateExpense(expense_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "delete_expense",
    {
      title: "Delete Expense",
      description: "Delete an expense. This is a destructive action and cannot be undone.",
      annotations: {
        destructiveHint: true,
      },
      inputSchema: z.object({
        expense_id: z.number().describe("The expense ID to delete"),
      }),
    },
    async (args) => {
      await client.deleteExpense(args.expense_id);
      return {
        content: [{ type: "text" as const, text: `Expense ${args.expense_id} deleted successfully.` }],
      };
    },
  );
}
