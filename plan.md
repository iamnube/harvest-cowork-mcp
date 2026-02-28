# Harvest MCP — Implementation Plan

pnpm monorepo with two packages: the MCP server and the Cowork plugin.

## Repository Structure

```
harvest-mcp/
├── pnpm-workspace.yaml
├── package.json              # Root: scripts, devDeps
├── tsconfig.base.json        # Shared TS config
├── README.md
├── plan.md
│
├── packages/
│   ├── mcp-server/           # TypeScript MCP server + .mcpb extension
│   │   ├── src/
│   │   │   ├── index.ts              # Entry: McpServer + StdioServerTransport
│   │   │   ├── harvest-client.ts     # Harvest API v2 HTTP client
│   │   │   ├── types.ts              # Harvest API type definitions
│   │   │   ├── tools/
│   │   │   │   ├── time-entries.ts   # CRUD + timers (7 tools)
│   │   │   │   ├── projects.ts       # Projects + task assignments (3 tools)
│   │   │   │   └── users.ts          # Users + clients (4 tools)
│   │   │   └── prompts/
│   │   │       ├── log-time.ts       # Guided time entry creation
│   │   │       ├── weekly-summary.ts # Summarize week's time entries
│   │   │       └── timer.ts          # Start/stop timer workflow
│   │   ├── manifest.json             # .mcpb extension manifest
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── plugin/               # Claude Cowork plugin
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       ├── .mcp.json                 # Connector → mcp-server
│       ├── skills/
│       │   ├── timesheet-management/
│       │   │   └── SKILL.md          # Auto: time entry best practices
│       │   ├── project-time-analysis/
│       │   │   └── SKILL.md          # Auto: project hours insights
│       │   └── harvest-conventions/
│       │       └── SKILL.md          # Auto: Harvest API patterns
│       └── commands/
│           ├── log-time.md           # /harvest:log-time
│           ├── weekly-report.md      # /harvest:weekly-report
│           ├── timer.md              # /harvest:timer
│           └── unsubmitted.md        # /harvest:unsubmitted
```

---

## Phase 1: MCP Server

### 1.1 Project scaffolding
- [ ] `pnpm-workspace.yaml` with `packages/*`
- [ ] Root `package.json` (private, scripts for build/pack)
- [ ] `tsconfig.base.json` (ES2022, NodeNext, strict)
- [ ] `packages/mcp-server/package.json` with deps:
  - `@modelcontextprotocol/sdk` ^1.27
  - `devDependencies`: `typescript`, `@types/node`, `@anthropic-ai/mcpb`
- [ ] `packages/mcp-server/tsconfig.json` extending base

### 1.2 Harvest API client (`harvest-client.ts`)
- [ ] Class `HarvestClient` wrapping `fetch()`
- [ ] Constructor takes `accessToken`, `accountId`
- [ ] Base URL: `https://api.harvestapp.com`
- [ ] Headers: `Authorization: Bearer`, `Harvest-Account-Id`, `User-Agent`, `Content-Type: application/json`
- [ ] Methods mapping 1:1 to API endpoints used:
  - `listTimeEntries(params)` → GET `/v2/time_entries`
  - `getTimeEntry(id)` → GET `/v2/time_entries/{id}`
  - `createTimeEntry(data)` → POST `/v2/time_entries`
  - `updateTimeEntry(id, data)` → PATCH `/v2/time_entries/{id}`
  - `deleteTimeEntry(id)` → DELETE `/v2/time_entries/{id}`
  - `restartTimer(id)` → PATCH `/v2/time_entries/{id}/restart`
  - `stopTimer(id)` → PATCH `/v2/time_entries/{id}/stop`
  - `listProjects(params)` → GET `/v2/projects`
  - `getProject(id)` → GET `/v2/projects/{id}`
  - `listProjectTaskAssignments(projectId)` → GET `/v2/projects/{id}/task_assignments`
  - `listTasks(params)` → GET `/v2/tasks`
  - `getMe()` → GET `/v2/users/me`
  - `listUsers(params)` → GET `/v2/users`
  - `listClients(params)` → GET `/v2/clients`
- [ ] Pagination helper (Harvest uses `page` + `per_page`, max 2000)
- [ ] Error handling: parse Harvest error responses, throw typed errors

### 1.3 Types (`types.ts`)
- [ ] Harvest response types: `TimeEntry`, `Project`, `Task`, `User`, `Client`, `TaskAssignment`
- [ ] List response wrappers with pagination metadata
- [ ] Tool input parameter types (for Zod schemas)

### 1.4 Tools
Each tool file registers tools on the `McpServer` instance using `.tool()`.

**time-entries.ts** (7 tools):
- [ ] `list_time_entries` — filters: user_id, client_id, project_id, task_id, from, to, page
- [ ] `get_time_entry` — by ID
- [ ] `create_time_entry` — project_id, task_id, spent_date, hours OR start/end time, notes
- [ ] `update_time_entry` — partial update of any field
- [ ] `delete_time_entry` — by ID
- [ ] `restart_timer` — by time entry ID
- [ ] `stop_timer` — by time entry ID

**projects.ts** (3 tools):
- [ ] `list_projects` — filters: is_active, client_id, page
- [ ] `get_project` — by ID
- [ ] `list_project_task_assignments` — project_id, page

**users.ts** (4 tools):
- [ ] `get_me` — no params
- [ ] `list_users` — filters: is_active, page
- [ ] `list_tasks` — filters: is_active, page
- [ ] `list_clients` — filters: is_active, page

### 1.5 MCP Prompts
Server-side prompt templates exposed via `prompts/list` and `prompts/get`.

**log-time** prompt:
- Arguments: `project` (optional), `date` (optional)
- Flow: asks for project → task → hours/timer → notes → creates entry
- Returns structured messages guiding the LLM through the workflow

**weekly-summary** prompt:
- Arguments: `week_offset` (optional, default 0 = current week)
- Flow: fetches time entries for the week, asks LLM to summarize by project/client

**timer** prompt:
- Arguments: `action` (start/stop/status)
- Flow: checks running timers, starts or stops as needed

### 1.6 Server entry point (`index.ts`)
- [ ] Read env vars: `HARVEST_ACCESS_TOKEN`, `HARVEST_ACCOUNT_ID`
- [ ] Instantiate `HarvestClient`
- [ ] Create `McpServer` with name `"harvest"`, version from package.json
- [ ] Register all tools (import from tools/)
- [ ] Register all prompts (import from prompts/)
- [ ] Connect via `StdioServerTransport`

### 1.7 MCPB packaging
- [ ] `manifest.json`:
  ```json
  {
    "manifest_version": "0.3",
    "name": "harvest-mcp",
    "display_name": "Harvest Time Tracking",
    "version": "1.0.0",
    "description": "Track time, manage timers, and browse projects in Harvest",
    "author": { "name": "..." },
    "server": {
      "type": "node",
      "entry_point": "dist/index.js",
      "mcp_config": {
        "command": "node",
        "args": ["${__dirname}/dist/index.js"],
        "env": {
          "HARVEST_ACCESS_TOKEN": "${user_config.access_token}",
          "HARVEST_ACCOUNT_ID": "${user_config.account_id}"
        }
      }
    },
    "user_config": {
      "access_token": {
        "type": "string",
        "title": "Harvest Access Token",
        "description": "Personal access token from id.getharvest.com/developers",
        "sensitive": true,
        "required": true
      },
      "account_id": {
        "type": "string",
        "title": "Harvest Account ID",
        "description": "Your Harvest account ID",
        "sensitive": true,
        "required": true
      }
    },
    "tools": [...],
    "prompts": [...]
  }
  ```
- [ ] `.mcpbignore` to exclude `src/`, `tsconfig.json`, etc.
- [ ] Build script: `pnpm --filter mcp-server build && npx @anthropic-ai/mcpb pack packages/mcp-server`

---

## Phase 2: Cowork Plugin

### 2.1 Plugin manifest (`.claude-plugin/plugin.json`)
- [ ] Name: `harvest`
- [ ] Description, version, author
- [ ] References to skills and commands

### 2.2 Connector (`.mcp.json`)
- [ ] Points to the MCP server:
  ```json
  {
    "mcpServers": {
      "harvest": {
        "command": "node",
        "args": ["../mcp-server/dist/index.js"],
        "env": {
          "HARVEST_ACCESS_TOKEN": "${HARVEST_ACCESS_TOKEN}",
          "HARVEST_ACCOUNT_ID": "${HARVEST_ACCOUNT_ID}"
        }
      }
    }
  }
  ```

### 2.3 Skills (auto-activated)

**timesheet-management/SKILL.md**:
- When to log time (end of day, after meetings, project switches)
- Time entry conventions (rounding, minimum increments)
- How to associate entries with correct project + task
- Timer vs. manual entry guidance

**project-time-analysis/SKILL.md**:
- How to interpret time data across projects
- Budget tracking patterns (compare logged vs. budgeted)
- Identifying over/under-allocated time
- Weekly/monthly reporting conventions

**harvest-conventions/SKILL.md**:
- Harvest API pagination patterns
- Date format conventions (YYYY-MM-DD)
- How projects, tasks, clients relate
- Common error scenarios and recovery

### 2.4 Commands (user-triggered)

**`/harvest:log-time`** — Interactive time entry creation
- Asks: what did you work on? how long? which project?
- Resolves project/task via MCP tools
- Creates entry, confirms

**`/harvest:weekly-report`** — Generate weekly time summary
- Fetches current week's entries
- Groups by project/client
- Shows totals, highlights gaps (e.g., <8h days)

**`/harvest:timer`** — Quick timer control
- Start timer on a project/task
- Stop current running timer
- Show current timer status

**`/harvest:unsubmitted`** — Review unsubmitted time
- Lists entries pending approval
- Offers to submit or fix gaps

---

## Phase 3: Polish & Ship

- [ ] Test MCP server with Claude Desktop (manual STDIO test)
- [ ] Test Cowork plugin with `claude plugin install`
- [ ] Update README with both installation paths
- [ ] Package `.mcpb` for distribution
- [ ] Tag v1.0.0

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@modelcontextprotocol/sdk` | ^1.27 | MCP server SDK (McpServer, StdioServerTransport) |
| `typescript` | ^5.7 | Build |
| `@types/node` | ^22 | Node.js types |
| `@anthropic-ai/mcpb` | latest | Extension packaging CLI |
| `zod` | ^3.24 | Tool input schema validation (peer dep of MCP SDK) |

## Key References

- [MCP Spec 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCPB Manifest Spec](https://github.com/anthropics/mcpb/blob/main/MANIFEST.md)
- [MCPB CLI](https://github.com/anthropics/mcpb/blob/main/CLI.md)
- [Harvest API v2](https://help.getharvest.com/api-v2/)
- [Claude Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions)
- [Knowledge Work Plugins](https://github.com/anthropics/knowledge-work-plugins)
- [Agent Skills](https://github.com/anthropics/skills)
- [taiste/harvest-mcp-server](https://github.com/taiste/harvest-mcp-server) (Python reference)
