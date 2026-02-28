#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HarvestClient } from "./harvest-client.js";
import { registerTimeEntryTools } from "./tools/time-entries.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerUserTools } from "./tools/users.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerClientTools } from "./tools/clients.js";
import { registerReportTools } from "./tools/reports.js";
import { registerExpenseTools } from "./tools/expenses.js";
import { registerExpenseCategoryTools } from "./tools/expense-categories.js";
import { registerProjectUserAssignmentTools } from "./tools/project-user-assignments.js";
import { registerLogTimePrompt } from "./prompts/log-time.js";
import { registerWeeklySummaryPrompt } from "./prompts/weekly-summary.js";
import { registerTimerPrompt } from "./prompts/timer.js";
const accessToken = process.env.HARVEST_ACCESS_TOKEN;
const accountId = process.env.HARVEST_ACCOUNT_ID;
if (!accessToken || !accountId) {
    console.error("Missing HARVEST_ACCESS_TOKEN or HARVEST_ACCOUNT_ID environment variables.");
    process.exit(1);
}
const client = new HarvestClient(accessToken, accountId);
const server = new McpServer({
    name: "harvest",
    version: "1.0.0",
});
registerTimeEntryTools(server, client);
registerProjectTools(server, client);
registerUserTools(server, client);
registerTaskTools(server, client);
registerClientTools(server, client);
registerReportTools(server, client);
registerExpenseTools(server, client);
registerExpenseCategoryTools(server, client);
registerProjectUserAssignmentTools(server, client);
registerLogTimePrompt(server);
registerWeeklySummaryPrompt(server);
registerTimerPrompt(server);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(() => {
    process.exit(1);
});
//# sourceMappingURL=index.js.map