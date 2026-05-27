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

## Available Tools (47)

| Area | Tools |
|---|---|
| **Time Entries** | `list_time_entries` `get_time_entry` `create_time_entry` `update_time_entry` `restart_timer` `stop_timer` |
| **Projects** | `list_projects` `get_project` `create_project` `update_project` `list_project_task_assignments` |
| **Tasks** | `list_tasks` `get_task` `create_task` `update_task` |
| **Clients** | `list_clients` `get_client` `create_client` `update_client` |
| **Users** | `get_me` `get_user` `list_users` `list_my_project_assignments` `list_user_project_assignments` |
| **Expenses** | `list_expenses` `get_expense` `create_expense` `update_expense` |
| **Expense Categories** | `list_expense_categories` `get_expense_category` `create_expense_category` `update_expense_category` |
| **Project User Assignments** | `list_all_user_assignments` `list_project_user_assignments` `get_project_user_assignment` `create_project_user_assignment` `update_project_user_assignment` |
| **Time Reports** | `time_report_by_clients` `time_report_by_projects` `time_report_by_tasks` `time_report_by_team` |
| **Expense Reports** | `expense_report_by_clients` `expense_report_by_projects` `expense_report_by_categories` `expense_report_by_team` |
| **Other Reports** | `project_budget_report` `uninvoiced_report` |

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

## Upstream

Built on [mikkokam/harvest-cowork-mcp](https://github.com/mikkokam/harvest-cowork-mcp) — MIT License.

## License

MIT
