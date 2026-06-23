# Harvest MCP Server — IAMNUBE Fork

A hardened fork of [mikkokam/harvest-cowork-mcp](https://github.com/mikkokam/harvest-cowork-mcp) for IAMNUBE IT Consulting deployments.

## Changes from Upstream

**All destructive `delete_*` tools have been removed:**
- ~~`delete_client`~~
- ~~`delete_project`~~
- ~~`delete_task`~~
- ~~`delete_time_entry`~~
- ~~`delete_expense`~~
- ~~`delete_expense_category`~~
- ~~`delete_project_user_assignment`~~

This makes the server safe for deployment to client teams without risk of accidental or AI-hallucinated data deletion.

**Invoice support added (v1.2.0):** full invoice management — list, get, create, update, and send — minus delete, consistent with the fork's safety policy.

**Invoice & payment support added (v1.3.0):** full invoice management — list, get, create, update, send — plus payment recording (list and record received payments), all minus delete, consistent with the fork's safety policy.

## Available Tools (55)

| Area | Tools |
|---|---|
| **Time Entries** | `list_time_entries` (filter by `is_billed`) `get_time_entry` `create_time_entry` (`billable` flag) `update_time_entry` `restart_timer` `stop_timer` |
| **Projects** | `list_projects` `get_project` `create_project` `update_project` `list_project_task_assignments` |
| **Tasks** | `list_tasks` `get_task` `create_task` `update_task` |
| **Clients** | `list_clients` `get_client` `create_client` `update_client` |
| **Invoices** | `list_invoices` `get_invoice` `create_invoice` `create_invoice_from_time` `update_invoice` `send_invoice` |
| **Invoice Payments** | `list_invoice_payments` `record_invoice_payment` |
| **Users** | `get_me` `get_user` `list_users` `list_my_project_assignments` `list_user_project_assignments` |
| **Expenses** | `list_expenses` `get_expense` `create_expense` `update_expense` |
| **Expense Categories** | `list_expense_categories` `get_expense_category` `create_expense_category` `update_expense_category` |
| **Project User Assignments** | `list_all_user_assignments` `list_project_user_assignments` `get_project_user_assignment` `create_project_user_assignment` `update_project_user_assignment` |
| **Time Reports** | `time_report_by_clients` `time_report_by_projects` `time_report_by_tasks` `time_report_by_team` |
| **Expense Reports** | `expense_report_by_clients` `expense_report_by_projects` `expense_report_by_categories` `expense_report_by_team` |
| **Other Reports** | `project_budget_report` `uninvoiced_report` |

> Note: `send_invoice` emails the invoice to the client and moves a draft to `open` state. `record_invoice_payment` updates the invoice's outstanding balance (and marks it paid when fully settled). Both are flagged as destructive actions so Claude confirms before acting. Recording a payment only updates Harvest bookkeeping — it never moves money or charges a client.

## Quick Install (Claude Desktop Extension)

1. Get your Harvest credentials at [id.getharvest.com/developers](https://id.getharvest.com/developers)
2. Download `harvest-mcp.mcpb` from the [latest release](../../releases/latest)
3. Double-click the `.mcpb` file in Claude Desktop
4. Enter your **Access Token** and **Account ID** when prompted — stored securely in OS keychain

## Manual Config (Claude Desktop / Claude Code)

```json
{
  "mcpServers": {
    "harvest": {
      "command": "node",
      "args": ["/path/to/harvest-cowork-mcp/packages/mcp-server/dist/index.mjs"],
      "env": {
        "HARVEST_ACCESS_TOKEN": "your-token",
        "HARVEST_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

## Build from Source

```bash
npm install -g pnpm
pnpm install
pnpm build
```

## Getting Your Harvest Credentials

1. Go to [id.getharvest.com/developers](https://id.getharvest.com/developers)
2. Click **Create New Personal Access Token**
3. Copy the **Token** and note your **Account ID**

## Primary Use Case: Email → Create Client & Project

Once installed, paste any client email into Claude and say:
> "Create a new client and project in Harvest based on this email."

Claude will extract the relevant data, check for duplicate clients, then call `create_client` → `create_project` in sequence.

## Invoicing

Generate and send invoices conversationally. Examples:
> "Create a draft invoice for [client] with a line item: 10 hours of consulting at $250/hr."

> "List all open invoices for [client]."

> "Send invoice #1002 to billing@client.com."

Invoices are created in `draft` state. Nothing is emailed until you explicitly call `send_invoice`, and Claude confirms before sending.

To bill a client for all the unbilled work logged against their projects:
> "Create an invoice for [client] from all unbilled time and expenses on project 12345, grouped by task."

This uses `create_invoice_from_time`, which pulls every uninvoiced time entry and expense for the given projects into a draft invoice automatically — no manual line items needed. Add a `from`/`to` date range to bill only a specific period.

To record a payment once a client pays:
> "Record a $2,500 payment on invoice #1002, paid by check today."

> "Show me all payments recorded against invoice #1002."

Recording a payment updates the invoice balance and marks it paid when fully settled. It only updates Harvest's records — it does not move money or charge the client.

## Upstream

Built on [mikkokam/harvest-cowork-mcp](https://github.com/mikkokam/harvest-cowork-mcp) — MIT License.

## License

MIT
