import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

export function registerTimeEntryTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "list_time_entries",
    {
      title: "List Time Entries",
      description:
        "List time entries with optional filters. Returns paginated results sorted by spent_date. Use 'from' and 'to' for date ranges (YYYY-MM-DD).",
      inputSchema: z.object({
        user_id: z.number().optional().describe("Filter by user ID"),
        client_id: z.number().optional().describe("Filter by client ID"),
        project_id: z.number().optional().describe("Filter by project ID"),
        task_id: z.number().optional().describe("Filter by task ID"),
        from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
        to: z.string().optional().describe("End date (YYYY-MM-DD)"),
        approval_status: z
          .enum(["unsubmitted", "submitted", "approved"])
          .optional()
          .describe("Filter by approval status"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.listTimeEntries(args);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_time_entry",
    {
      title: "Get Time Entry",
      description: "Get a specific time entry by its ID. Returns full details including project, task, user, hours, notes, and timer status.",
      inputSchema: z.object({
        time_entry_id: z.number().describe("The time entry ID"),
      }),
    },
    async (args) => {
      const result = await client.getTimeEntry(args.time_entry_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "create_time_entry",
    {
      title: "Create Time Entry",
      description:
        "Create a new time entry. Requires project_id, task_id, and spent_date. Provide either 'hours' for duration-based tracking, or 'started_time'/'ended_time' for start/end time tracking. Omitting hours starts a running timer.",
      inputSchema: z.object({
        project_id: z.number().describe("Project ID"),
        task_id: z.number().describe("Task ID"),
        spent_date: z.string().describe("Date for the entry (YYYY-MM-DD)"),
        user_id: z.number().optional().describe("User ID (defaults to authenticated user)"),
        hours: z.number().optional().describe("Duration in hours (e.g. 1.5 for 1h30m)"),
        started_time: z.string().optional().describe("Start time (e.g. '8:00am' or '08:00')"),
        ended_time: z.string().optional().describe("End time (e.g. '5:00pm' or '17:00')"),
        notes: z.string().optional().describe("Notes for the time entry"),
      }),
    },
    async (args) => {
      const result = await client.createTimeEntry(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "update_time_entry",
    {
      title: "Update Time Entry",
      description: "Update an existing time entry. Only provided fields will be changed.",
      inputSchema: z.object({
        time_entry_id: z.number().describe("The time entry ID to update"),
        project_id: z.number().optional().describe("New project ID"),
        task_id: z.number().optional().describe("New task ID"),
        spent_date: z.string().optional().describe("New date (YYYY-MM-DD)"),
        hours: z.number().optional().describe("New duration in hours"),
        started_time: z.string().optional().describe("New start time"),
        ended_time: z.string().optional().describe("New end time"),
        notes: z.string().optional().describe("New notes"),
      }),
    },
    async (args) => {
      const { time_entry_id, ...data } = args;
      const result = await client.updateTimeEntry(time_entry_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "restart_timer",
    {
      title: "Restart Timer",
      description: "Restart a previously stopped timer on a time entry. Only one timer can run at a time — any other running timer will be stopped.",
      inputSchema: z.object({
        time_entry_id: z.number().describe("The time entry ID to restart the timer on"),
      }),
    },
    async (args) => {
      const result = await client.restartTimer(args.time_entry_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "stop_timer",
    {
      title: "Stop Timer",
      description: "Stop a running timer on a time entry.",
      inputSchema: z.object({
        time_entry_id: z.number().describe("The time entry ID to stop the timer on"),
      }),
    },
    async (args) => {
      const result = await client.stopTimer(args.time_entry_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
