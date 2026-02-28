# Harvest MCP Server

## Time tracking using Claude.

**The most complete [Harvest](https://www.getharvest.com/) integration for Claude.** 54 tools covering the full [Harvest API v2](https://help.getharvest.com/api-v2/) — time entries, projects, tasks, clients, expenses, team assignments, and reports.

Built in **TypeScript** (not Python like most MCP servers for Harvest time tracking), bundled into a single file — no runtime dependencies to install.

Works with **Claude Desktop Extension** (one-click install, no config files), **Claude Cowork Plugin** (skills + slash commands), and **Claude Code**.

---

## For Users

### Quick Install (Claude Desktop Extension) — recommended

1. **Get your Harvest credentials** — go to [id.getharvest.com/developers](https://id.getharvest.com/developers), click "Create New Personal Access Token", and note your **Access Token** and **Account ID**
2. **Download** `harvest-mcp.mcpb` from the [latest release](https://github.com/mikkokam/harvest-cowork-mcp/releases/latest)
3. **Double-click** the `.mcpb` file (or drag it into Claude Desktop settings)
4. **Enter your credentials** when prompted — they're stored securely in your OS keychain

That's it. No terminal, no JSON files, no build steps. The extension installs the MCP server locally and handles everything — much simpler than servers that require manually editing JSON config files.

This is all you need to get started. The Cowork plugin below is optional but recommended.

### Install (Claude Cowork Plugin) — optional

1. **Get your Harvest credentials** (same as above)
2. **Download** `harvest-plugin.zip` from the [latest release](https://github.com/mikkokam/harvest-cowork-mcp/releases/latest)
3. In Claude Desktop, switch to the **Cowork** tab
4. Click **Customize** in the left sidebar
5. Click **Browse plugins**, then upload the `harvest-plugin.zip` file
6. **Enter your credentials** when prompted

The plugin adds slash commands (`/log-time`, `/timer`, `/weekly-report`, `/catchup`, `/unsubmitted`) and skills for time management, project analysis, and context-aware Harvest conventions.

### What You Can Do

**Track Time** — create, update, and delete time entries. Start and stop timers. Log hours manually or with start/end times.

**Manage Projects** — create projects, assign users, set budgets, configure billing. Full CRUD on projects, tasks, and clients.

**Track Expenses** — log expenses by category, manage expense categories with unit-based pricing (e.g. mileage).

**Get Reports** — time reports by client/project/task/team, expense reports, project budget reports, uninvoiced amounts.

**Team Management** — assign users to projects, manage roles and rates, view project assignments.

### All 54 Tools

| Area | Tools |
|------|-------|
| **Time Entries** | `list_time_entries` `get_time_entry` `create_time_entry` `update_time_entry` `delete_time_entry` `restart_timer` `stop_timer` |
| **Projects** | `list_projects` `get_project` `create_project` `update_project` `delete_project` `list_project_task_assignments` |
| **Tasks** | `list_tasks` `get_task` `create_task` `update_task` `delete_task` |
| **Clients** | `list_clients` `get_client` `create_client` `update_client` `delete_client` |
| **Users** | `get_me` `get_user` `list_users` `list_my_project_assignments` `list_user_project_assignments` |
| **Expenses** | `list_expenses` `get_expense` `create_expense` `update_expense` `delete_expense` |
| **Expense Categories** | `list_expense_categories` `get_expense_category` `create_expense_category` `update_expense_category` `delete_expense_category` |
| **Project User Assignments** | `list_all_user_assignments` `list_project_user_assignments` `get_project_user_assignment` `create_project_user_assignment` `update_project_user_assignment` `delete_project_user_assignment` |
| **Time Reports** | `time_report_by_clients` `time_report_by_projects` `time_report_by_tasks` `time_report_by_team` |
| **Expense Reports** | `expense_report_by_clients` `expense_report_by_projects` `expense_report_by_categories` `expense_report_by_team` |
| **Other Reports** | `project_budget_report` `uninvoiced_report` |

### Guided Prompts

| Prompt | What it does |
|--------|-------------|
| `log-time` | Walks you through picking a project, task, hours, and notes |
| `weekly-summary` | Summarizes the week's entries by project/client with gap detection |
| `timer` | Quick start/stop/status for running timers |

### Getting Your Harvest API Credentials

1. Go to [id.getharvest.com/developers](https://id.getharvest.com/developers)
2. Sign in with your Harvest account
3. Click **"Create New Personal Access Token"**
4. Give it a name (e.g. "Claude")
5. Copy the **Token** and note your **Account ID** (shown on the same page)

---

## For Developers

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)

### Setup

```bash
git clone https://github.com/mikkokam/harvest-cowork-mcp.git
cd harvest-cowork-mcp
pnpm install
```

### Build

```bash
pnpm build                    # Compile TypeScript + bundle with esbuild
pnpm validate                 # Validate the .mcpb manifest
pnpm pack:mcpb                # Build + package as .mcpb extension
```

### Run Locally (for development)

```bash
export HARVEST_ACCESS_TOKEN="your-token"
export HARVEST_ACCOUNT_ID="your-account-id"
node packages/mcp-server/dist/index.mjs
```

Or add to Claude Desktop / Claude Code config manually:

```json
{
  "mcpServers": {
    "harvest": {
      "command": "node",
      "args": ["/absolute/path/to/harvest-cowork-mcp/packages/mcp-server/dist/index.mjs"],
      "env": {
        "HARVEST_ACCESS_TOKEN": "your-token",
        "HARVEST_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

### Project Structure

```
harvest-cowork-mcp/
├── packages/
│   ├── mcp-server/
│   │   ├── src/
│   │   │   ├── index.ts              # Server entry point
│   │   │   ├── harvest-client.ts     # Harvest API v2 HTTP client
│   │   │   ├── types.ts              # TypeScript types for all API entities
│   │   │   ├── tools/
│   │   │   │   ├── time-entries.ts    # 7 tools
│   │   │   │   ├── projects.ts       # 6 tools
│   │   │   │   ├── tasks.ts          # 5 tools
│   │   │   │   ├── clients.ts        # 5 tools
│   │   │   │   ├── users.ts          # 5 tools
│   │   │   │   ├── expenses.ts       # 5 tools
│   │   │   │   ├── expense-categories.ts  # 5 tools
│   │   │   │   ├── project-user-assignments.ts  # 6 tools
│   │   │   │   └── reports.ts        # 10 tools
│   │   │   └── prompts/
│   │   │       ├── log-time.ts
│   │   │       ├── weekly-summary.ts
│   │   │       └── timer.ts
│   │   ├── manifest.json             # .mcpb extension manifest
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── plugin/                       # Claude Cowork plugin (skills + commands)
├── package.json                      # Workspace root
├── pnpm-workspace.yaml
└── .gitignore
```

### Adding New Endpoints

The pattern is consistent across all tools:

1. **Add types** in `types.ts` (entity interface, create/update params, list params)
2. **Add client methods** in `harvest-client.ts`
3. **Create tool file** in `tools/` with `registerXTools()` function
4. **Register** in `index.ts`
5. **Update manifest** in `manifest.json` (tool name + description)
6. **Build** with `pnpm build`

### Tech Stack

- **[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** ^1.27
- **[Zod](https://zod.dev/)** for tool input schema validation
- **esbuild** for single-file bundling
- **[@anthropic-ai/mcpb](https://github.com/anthropics/mcpb)** for Desktop Extension packaging
- **STDIO transport** — runs as a subprocess of Claude

### Harvest API Reference

Built on [Harvest API v2](https://help.getharvest.com/api-v2/). Covers:

- [Time Entries](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/)
- [Projects](https://help.getharvest.com/api-v2/projects-api/projects/projects/) + [Task Assignments](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/) + [User Assignments](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/)
- [Tasks](https://help.getharvest.com/api-v2/tasks-api/tasks/tasks/)
- [Clients](https://help.getharvest.com/api-v2/clients-api/clients/clients/)
- [Users](https://help.getharvest.com/api-v2/users-api/users/users/) + [Project Assignments](https://help.getharvest.com/api-v2/users-api/users/project-assignments/)
- [Expenses](https://help.getharvest.com/api-v2/expenses-api/expenses/expenses/) + [Categories](https://help.getharvest.com/api-v2/expenses-api/expenses/expense-categories/)
- [Time Reports](https://help.getharvest.com/api-v2/reports-api/reports/time-reports/) + [Expense Reports](https://help.getharvest.com/api-v2/reports-api/reports/expense-reports/) + [Project Budget](https://help.getharvest.com/api-v2/reports-api/reports/project-budget-report/) + [Uninvoiced](https://help.getharvest.com/api-v2/reports-api/reports/uninvoiced-report/)

---

## How This Was Built

This entire MCP server — 54 tools, types, client, manifest, packaging — was built in a single session using **Claude Cowork** with the **Claude Code VS Code Extension**. Claude read the Harvest API docs, wrote all the code, validated the manifest, built the `.mcpb`, and pushed to GitHub. No config files were edited by hand.

## License

MIT
