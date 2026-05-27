import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

export function registerExpenseCategoryTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "list_expense_categories",
    {
      title: "List Expense Categories",
      description: "List all expense categories. Categories define the types of expenses that can be tracked (e.g. 'Meals', 'Travel', 'Mileage').",
      inputSchema: z.object({
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.listExpenseCategories(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_expense_category",
    {
      title: "Get Expense Category",
      description: "Get a specific expense category by ID.",
      inputSchema: z.object({
        expense_category_id: z.number().describe("The expense category ID"),
      }),
    },
    async (args) => {
      const result = await client.getExpenseCategory(args.expense_category_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "create_expense_category",
    {
      title: "Create Expense Category",
      description: "Create a new expense category. Set unit_name and unit_price for unit-based categories (e.g. 'Mileage' at $0.535/mile).",
      inputSchema: z.object({
        name: z.string().describe("The name of the expense category"),
        unit_name: z.string().optional().describe("Unit name for unit-based categories (e.g. 'Mile', 'Kilometer')"),
        unit_price: z.number().optional().describe("Price per unit for unit-based categories"),
        is_active: z.boolean().optional().describe("Whether the category is active (defaults to true)"),
      }),
    },
    async (args) => {
      const result = await client.createExpenseCategory(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "update_expense_category",
    {
      title: "Update Expense Category",
      description: "Update an existing expense category. Any parameters not provided will be left unchanged.",
      inputSchema: z.object({
        expense_category_id: z.number().describe("The expense category ID to update"),
        name: z.string().optional().describe("The name of the expense category"),
        unit_name: z.string().optional().describe("Unit name for unit-based categories"),
        unit_price: z.number().optional().describe("Price per unit"),
        is_active: z.boolean().optional().describe("Whether the category is active"),
      }),
    },
    async (args) => {
      const { expense_category_id, ...data } = args;
      const result = await client.updateExpenseCategory(expense_category_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

}
