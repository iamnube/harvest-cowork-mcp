const BASE_URL = "https://api.harvestapp.com";
export class HarvestApiError extends Error {
    status;
    body;
    constructor(status, body) {
        super(`Harvest API error ${status}: ${body}`);
        this.status = status;
        this.body = body;
        this.name = "HarvestApiError";
    }
}
export class HarvestClient {
    accessToken;
    accountId;
    constructor(accessToken, accountId) {
        this.accessToken = accessToken;
        this.accountId = accountId;
    }
    async request(method, path, params, body) {
        const url = new URL(`${BASE_URL}${path}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, String(value));
                }
            }
        }
        const response = await fetch(url.toString(), {
            method,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Harvest-Account-Id": this.accountId,
                "User-Agent": "HarvestMCP/1.0.0",
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const text = await response.text();
            throw new HarvestApiError(response.status, text);
        }
        if (response.status === 204) {
            return undefined;
        }
        return (await response.json());
    }
    // --- Time Entries ---
    async listTimeEntries(params) {
        return this.request("GET", "/v2/time_entries", params);
    }
    async getTimeEntry(id) {
        return this.request("GET", `/v2/time_entries/${id}`);
    }
    async createTimeEntry(data) {
        return this.request("POST", "/v2/time_entries", undefined, data);
    }
    async updateTimeEntry(id, data) {
        return this.request("PATCH", `/v2/time_entries/${id}`, undefined, data);
    }
    async deleteTimeEntry(id) {
        return this.request("DELETE", `/v2/time_entries/${id}`);
    }
    async restartTimer(id) {
        return this.request("PATCH", `/v2/time_entries/${id}/restart`);
    }
    async stopTimer(id) {
        return this.request("PATCH", `/v2/time_entries/${id}/stop`);
    }
    // --- Projects ---
    async listProjects(params) {
        return this.request("GET", "/v2/projects", params);
    }
    async getProject(id) {
        return this.request("GET", `/v2/projects/${id}`);
    }
    async createProject(data) {
        return this.request("POST", "/v2/projects", undefined, data);
    }
    async updateProject(id, data) {
        return this.request("PATCH", `/v2/projects/${id}`, undefined, data);
    }
    async deleteProject(id) {
        return this.request("DELETE", `/v2/projects/${id}`);
    }
    async listProjectTaskAssignments(projectId, params) {
        return this.request("GET", `/v2/projects/${projectId}/task_assignments`, params);
    }
    // --- Tasks ---
    async listTasks(params) {
        return this.request("GET", "/v2/tasks", params);
    }
    async getTask(id) {
        return this.request("GET", `/v2/tasks/${id}`);
    }
    async createTask(data) {
        return this.request("POST", "/v2/tasks", undefined, data);
    }
    async updateTask(id, data) {
        return this.request("PATCH", `/v2/tasks/${id}`, undefined, data);
    }
    async deleteTask(id) {
        return this.request("DELETE", `/v2/tasks/${id}`);
    }
    // --- Users ---
    async getMe() {
        return this.request("GET", "/v2/users/me");
    }
    async getUser(id) {
        return this.request("GET", `/v2/users/${id}`);
    }
    async listUsers(params) {
        return this.request("GET", "/v2/users", params);
    }
    async listMyProjectAssignments(params) {
        return this.request("GET", "/v2/users/me/project_assignments", params);
    }
    async listUserProjectAssignments(userId, params) {
        return this.request("GET", `/v2/users/${userId}/project_assignments`, params);
    }
    // --- Clients ---
    async listClients(params) {
        return this.request("GET", "/v2/clients", params);
    }
    async getClient(id) {
        return this.request("GET", `/v2/clients/${id}`);
    }
    async createClient(data) {
        return this.request("POST", "/v2/clients", undefined, data);
    }
    async updateClient(id, data) {
        return this.request("PATCH", `/v2/clients/${id}`, undefined, data);
    }
    async deleteClient(id) {
        return this.request("DELETE", `/v2/clients/${id}`);
    }
    // --- Reports ---
    async getTimeReportByClients(params) {
        return this.request("GET", "/v2/reports/time/clients", params);
    }
    async getTimeReportByProjects(params) {
        return this.request("GET", "/v2/reports/time/projects", params);
    }
    async getTimeReportByTasks(params) {
        return this.request("GET", "/v2/reports/time/tasks", params);
    }
    async getTimeReportByTeam(params) {
        return this.request("GET", "/v2/reports/time/team", params);
    }
    // --- Expenses ---
    async listExpenses(params) {
        return this.request("GET", "/v2/expenses", params);
    }
    async getExpense(id) {
        return this.request("GET", `/v2/expenses/${id}`);
    }
    async createExpense(data) {
        return this.request("POST", "/v2/expenses", undefined, data);
    }
    async updateExpense(id, data) {
        return this.request("PATCH", `/v2/expenses/${id}`, undefined, data);
    }
    async deleteExpense(id) {
        return this.request("DELETE", `/v2/expenses/${id}`);
    }
    // --- Expense Categories ---
    async listExpenseCategories(params) {
        return this.request("GET", "/v2/expense_categories", params);
    }
    async getExpenseCategory(id) {
        return this.request("GET", `/v2/expense_categories/${id}`);
    }
    async createExpenseCategory(data) {
        return this.request("POST", "/v2/expense_categories", undefined, data);
    }
    async updateExpenseCategory(id, data) {
        return this.request("PATCH", `/v2/expense_categories/${id}`, undefined, data);
    }
    async deleteExpenseCategory(id) {
        return this.request("DELETE", `/v2/expense_categories/${id}`);
    }
    // --- Project User Assignments ---
    async listAllUserAssignments(params) {
        return this.request("GET", "/v2/user_assignments", params);
    }
    async listProjectUserAssignments(projectId, params) {
        return this.request("GET", `/v2/projects/${projectId}/user_assignments`, params);
    }
    async getProjectUserAssignment(projectId, assignmentId) {
        return this.request("GET", `/v2/projects/${projectId}/user_assignments/${assignmentId}`);
    }
    async createProjectUserAssignment(projectId, data) {
        return this.request("POST", `/v2/projects/${projectId}/user_assignments`, undefined, data);
    }
    async updateProjectUserAssignment(projectId, assignmentId, data) {
        return this.request("PATCH", `/v2/projects/${projectId}/user_assignments/${assignmentId}`, undefined, data);
    }
    async deleteProjectUserAssignment(projectId, assignmentId) {
        return this.request("DELETE", `/v2/projects/${projectId}/user_assignments/${assignmentId}`);
    }
    // --- Additional Reports ---
    async getProjectBudgetReport(params) {
        return this.request("GET", "/v2/reports/project_budget", params);
    }
    async getUninvoicedReport(params) {
        return this.request("GET", "/v2/reports/uninvoiced", params);
    }
    async getExpenseReportByClients(params) {
        return this.request("GET", "/v2/reports/expenses/clients", params);
    }
    async getExpenseReportByProjects(params) {
        return this.request("GET", "/v2/reports/expenses/projects", params);
    }
    async getExpenseReportByCategories(params) {
        return this.request("GET", "/v2/reports/expenses/categories", params);
    }
    async getExpenseReportByTeam(params) {
        return this.request("GET", "/v2/reports/expenses/team", params);
    }
}
//# sourceMappingURL=harvest-client.js.map