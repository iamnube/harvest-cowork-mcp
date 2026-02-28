# Harvest MCP

A pnpm monorepo with two packages for Harvest time tracking integration with Claude:

1. **`mcp-server`** — TypeScript MCP server + Claude Desktop Extension (`.mcpb`)
2. **`plugin`** — Claude Cowork plugin with skills and slash commands

## What it does

Lets Claude interact with your Harvest account — create and edit time entries, manage timers, browse projects and tasks. The MCP server provides the tools, the Cowork plugin adds domain knowledge and guided workflows on top.

## Packages

### `packages/mcp-server` — MCP Server

STDIO MCP server built with TypeScript. Also packaged as a `.mcpb` Claude Desktop Extension for one-click install.

#### Tools (14)

**Time Entries** (primary use case):
`list_time_entries` · `get_time_entry` · `create_time_entry` · `update_time_entry` · `delete_time_entry` · `restart_timer` · `stop_timer`

**Projects & Tasks**:
`list_projects` · `get_project` · `list_project_task_assignments`

**Users & Clients**:
`get_me` · `list_users` · `list_tasks` · `list_clients`

#### Prompts (3)

| Prompt | Description |
|--------|-------------|
| `log-time` | Guided time entry creation — walks through project, task, hours, notes |
| `weekly-summary` | Summarize the week's time entries by project/client |
| `timer` | Start, stop, or check status of running timers |

### `packages/plugin` — Cowork Plugin

File-based plugin (markdown + JSON, no code) that layers domain knowledge and slash commands on top of the MCP server.

#### Skills (auto-activated)
- **timesheet-management** — When/how to log time, timer vs. manual entry, rounding
- **project-time-analysis** — Budget tracking, over/under allocation, reporting
- **harvest-conventions** — API patterns, date formats, entity relationships

#### Commands (user-triggered)
- `/harvest:log-time` — Interactive time entry creation
- `/harvest:weekly-report` — Weekly time summary with gap detection
- `/harvest:timer` — Quick timer start/stop/status
- `/harvest:unsubmitted` — Review entries pending approval

## Tech Stack

- **pnpm** workspaces monorepo
- **TypeScript** with Node.js
- **[@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)** ^1.27 — official MCP TypeScript SDK
- **STDIO transport** — runs as a subprocess
- **[@anthropic-ai/mcpb](https://github.com/anthropics/mcpb)** — Desktop Extension packaging
- **[Zod](https://zod.dev/)** — tool input schema validation

## Project Structure

```
harvest-mcp/
├── pnpm-workspace.yaml
├── package.json                # Root workspace config
├── tsconfig.base.json
├── packages/
│   ├── mcp-server/
│   │   ├── src/
│   │   │   ├── index.ts              # McpServer + StdioServerTransport
│   │   │   ├── harvest-client.ts     # Harvest API v2 HTTP client
│   │   │   ├── types.ts              # Harvest API types
│   │   │   ├── tools/
│   │   │   │   ├── time-entries.ts
│   │   │   │   ├── projects.ts
│   │   │   │   └── users.ts
│   │   │   └── prompts/
│   │   │       ├── log-time.ts
│   │   │       ├── weekly-summary.ts
│   │   │       └── timer.ts
│   │   ├── manifest.json             # .mcpb extension manifest
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── plugin/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── .mcp.json
│       ├── skills/
│       │   ├── timesheet-management/SKILL.md
│       │   ├── project-time-analysis/SKILL.md
│       │   └── harvest-conventions/SKILL.md
│       └── commands/
│           ├── log-time.md
│           ├── weekly-report.md
│           ├── timer.md
│           └── unsubmitted.md
├── README.md
└── plan.md
```

## Authentication

Uses Harvest [Personal Access Tokens](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/):

- **Access Token** — from [Harvest Developer Tools](https://id.getharvest.com/developers)
- **Account ID** — your Harvest account identifier

In the `.mcpb` extension, these are declared as sensitive `user_config` fields stored in the OS keychain. For development, set environment variables `HARVEST_ACCESS_TOKEN` and `HARVEST_ACCOUNT_ID`.

## Installation

### Claude Desktop Extension (recommended)
1. Download `harvest-mcp.mcpb` from releases
2. Double-click or drag into Claude Desktop settings
3. Enter your Harvest credentials when prompted

### Cowork Plugin
```bash
claude plugin install harvest@harvest-mcp
```

### Manual / Development
```bash
pnpm install
pnpm build

# Add to Claude Desktop config:
```
```json
{
  "mcpServers": {
    "harvest": {
      "command": "node",
      "args": ["/path/to/harvest-mcp/packages/mcp-server/dist/index.js"],
      "env": {
        "HARVEST_ACCESS_TOKEN": "your-token",
        "HARVEST_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

## Development

```bash
pnpm install
pnpm build                    # Build MCP server
pnpm validate                 # Validate .mcpb manifest
pnpm pack:mcpb                # Package as .mcpb extension
```

## Harvest API Reference

Built on [Harvest API v2](https://help.getharvest.com/api-v2/). Key endpoints:

| Endpoint | Methods |
|----------|---------|
| `/v2/time_entries` | GET, POST |
| `/v2/time_entries/{id}` | GET, PATCH, DELETE |
| `/v2/time_entries/{id}/restart` | PATCH |
| `/v2/time_entries/{id}/stop` | PATCH |
| `/v2/projects` | GET |
| `/v2/projects/{id}` | GET |
| `/v2/projects/{id}/task_assignments` | GET |
| `/v2/tasks` | GET |
| `/v2/users` | GET |
| `/v2/users/me` | GET |
| `/v2/clients` | GET |

## References

- [MCP Spec 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCPB Manifest Spec](https://github.com/anthropics/mcpb/blob/main/MANIFEST.md)
- [Claude Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions)
- [Knowledge Work Plugins](https://github.com/anthropics/knowledge-work-plugins)
- [Agent Skills](https://github.com/anthropics/skills)
- [taiste/harvest-mcp-server](https://github.com/taiste/harvest-mcp-server) (Python reference)

## License

MIT
