import type {
  TimeEntry,
  TimeEntryList,
  CreateTimeEntryParams,
  UpdateTimeEntryParams,
  ListTimeEntriesParams,
  Project,
  ProjectList,
  ListProjectsParams,
  Task,
  TaskList,
  ListTasksParams,
  User,
  UserList,
  ListUsersParams,
  Client,
  ClientList,
  ListClientsParams,
  TaskAssignment,
  TaskAssignmentList,
  ListTaskAssignmentsParams,
  CreateProjectParams,
  UpdateProjectParams,
  CreateTaskParams,
  UpdateTaskParams,
  CreateClientParams,
  UpdateClientParams,
  ProjectAssignment,
  ProjectAssignmentList,
  ListProjectAssignmentsParams,
  TimeReportResponse,
  TimeReportParams,
  Expense,
  ExpenseList,
  ListExpensesParams,
  CreateExpenseParams,
  UpdateExpenseParams,
  ExpenseCategory,
  ExpenseCategoryList,
  ListExpenseCategoriesParams,
  CreateExpenseCategoryParams,
  UpdateExpenseCategoryParams,
  ProjectUserAssignment,
  ProjectUserAssignmentList,
  ListProjectUserAssignmentsParams,
  CreateProjectUserAssignmentParams,
  UpdateProjectUserAssignmentParams,
  ProjectBudgetResponse,
  ProjectBudgetReportParams,
  UninvoicedResponse,
  UninvoicedReportParams,
  ExpenseReportResponse,
  ExpenseReportParams,
} from "./types.js";

const BASE_URL = "https://api.harvestapp.com";

export class HarvestApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`Harvest API error ${status}: ${body}`);
    this.name = "HarvestApiError";
  }
}

export class HarvestClient {
  private accessToken: string;
  private accountId: string;

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  private async request<T>(
    method: string,
    path: string,
    params?: Record<string, unknown>,
    body?: Record<string, unknown>,
  ): Promise<T> {
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
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  // --- Time Entries ---

  async listTimeEntries(params?: ListTimeEntriesParams): Promise<TimeEntryList> {
    return this.request<TimeEntryList>("GET", "/v2/time_entries", params as Record<string, unknown>);
  }

  async getTimeEntry(id: number): Promise<TimeEntry> {
    return this.request<TimeEntry>("GET", `/v2/time_entries/${id}`);
  }

  async createTimeEntry(data: CreateTimeEntryParams): Promise<TimeEntry> {
    return this.request<TimeEntry>("POST", "/v2/time_entries", undefined, data as unknown as Record<string, unknown>);
  }

  async updateTimeEntry(id: number, data: UpdateTimeEntryParams): Promise<TimeEntry> {
    return this.request<TimeEntry>("PATCH", `/v2/time_entries/${id}`, undefined, data as Record<string, unknown>);
  }

  async deleteTimeEntry(id: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/time_entries/${id}`);
  }

  async restartTimer(id: number): Promise<TimeEntry> {
    return this.request<TimeEntry>("PATCH", `/v2/time_entries/${id}/restart`);
  }

  async stopTimer(id: number): Promise<TimeEntry> {
    return this.request<TimeEntry>("PATCH", `/v2/time_entries/${id}/stop`);
  }

  // --- Projects ---

  async listProjects(params?: ListProjectsParams): Promise<ProjectList> {
    return this.request<ProjectList>("GET", "/v2/projects", params as Record<string, unknown>);
  }

  async getProject(id: number): Promise<Project> {
    return this.request<Project>("GET", `/v2/projects/${id}`);
  }

  async createProject(data: CreateProjectParams): Promise<Project> {
    return this.request<Project>("POST", "/v2/projects", undefined, data as unknown as Record<string, unknown>);
  }

  async updateProject(id: number, data: UpdateProjectParams): Promise<Project> {
    return this.request<Project>("PATCH", `/v2/projects/${id}`, undefined, data as unknown as Record<string, unknown>);
  }

  async deleteProject(id: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/projects/${id}`);
  }

  async listProjectTaskAssignments(
    projectId: number,
    params?: ListTaskAssignmentsParams,
  ): Promise<TaskAssignmentList> {
    return this.request<TaskAssignmentList>(
      "GET",
      `/v2/projects/${projectId}/task_assignments`,
      params as Record<string, unknown>,
    );
  }

  // --- Tasks ---

  async listTasks(params?: ListTasksParams): Promise<TaskList> {
    return this.request<TaskList>("GET", "/v2/tasks", params as Record<string, unknown>);
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>("GET", `/v2/tasks/${id}`);
  }

  async createTask(data: CreateTaskParams): Promise<Task> {
    return this.request<Task>("POST", "/v2/tasks", undefined, data as unknown as Record<string, unknown>);
  }

  async updateTask(id: number, data: UpdateTaskParams): Promise<Task> {
    return this.request<Task>("PATCH", `/v2/tasks/${id}`, undefined, data as Record<string, unknown>);
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/tasks/${id}`);
  }

  // --- Users ---

  async getMe(): Promise<User> {
    return this.request<User>("GET", "/v2/users/me");
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>("GET", `/v2/users/${id}`);
  }

  async listUsers(params?: ListUsersParams): Promise<UserList> {
    return this.request<UserList>("GET", "/v2/users", params as Record<string, unknown>);
  }

  async listMyProjectAssignments(params?: ListProjectAssignmentsParams): Promise<ProjectAssignmentList> {
    return this.request<ProjectAssignmentList>("GET", "/v2/users/me/project_assignments", params as Record<string, unknown>);
  }

  async listUserProjectAssignments(userId: number, params?: ListProjectAssignmentsParams): Promise<ProjectAssignmentList> {
    return this.request<ProjectAssignmentList>("GET", `/v2/users/${userId}/project_assignments`, params as Record<string, unknown>);
  }

  // --- Clients ---

  async listClients(params?: ListClientsParams): Promise<ClientList> {
    return this.request<ClientList>("GET", "/v2/clients", params as Record<string, unknown>);
  }

  async getClient(id: number): Promise<Client> {
    return this.request<Client>("GET", `/v2/clients/${id}`);
  }

  async createClient(data: CreateClientParams): Promise<Client> {
    return this.request<Client>("POST", "/v2/clients", undefined, data as unknown as Record<string, unknown>);
  }

  async updateClient(id: number, data: UpdateClientParams): Promise<Client> {
    return this.request<Client>("PATCH", `/v2/clients/${id}`, undefined, data as Record<string, unknown>);
  }

  async deleteClient(id: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/clients/${id}`);
  }

  // --- Reports ---

  async getTimeReportByClients(params: TimeReportParams): Promise<TimeReportResponse> {
    return this.request<TimeReportResponse>("GET", "/v2/reports/time/clients", params as unknown as Record<string, unknown>);
  }

  async getTimeReportByProjects(params: TimeReportParams): Promise<TimeReportResponse> {
    return this.request<TimeReportResponse>("GET", "/v2/reports/time/projects", params as unknown as Record<string, unknown>);
  }

  async getTimeReportByTasks(params: TimeReportParams): Promise<TimeReportResponse> {
    return this.request<TimeReportResponse>("GET", "/v2/reports/time/tasks", params as unknown as Record<string, unknown>);
  }

  async getTimeReportByTeam(params: TimeReportParams): Promise<TimeReportResponse> {
    return this.request<TimeReportResponse>("GET", "/v2/reports/time/team", params as unknown as Record<string, unknown>);
  }

  // --- Expenses ---

  async listExpenses(params?: ListExpensesParams): Promise<ExpenseList> {
    return this.request<ExpenseList>("GET", "/v2/expenses", params as Record<string, unknown>);
  }

  async getExpense(id: number): Promise<Expense> {
    return this.request<Expense>("GET", `/v2/expenses/${id}`);
  }

  async createExpense(data: CreateExpenseParams): Promise<Expense> {
    return this.request<Expense>("POST", "/v2/expenses", undefined, data as unknown as Record<string, unknown>);
  }

  async updateExpense(id: number, data: UpdateExpenseParams): Promise<Expense> {
    return this.request<Expense>("PATCH", `/v2/expenses/${id}`, undefined, data as unknown as Record<string, unknown>);
  }

  async deleteExpense(id: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/expenses/${id}`);
  }

  // --- Expense Categories ---

  async listExpenseCategories(params?: ListExpenseCategoriesParams): Promise<ExpenseCategoryList> {
    return this.request<ExpenseCategoryList>("GET", "/v2/expense_categories", params as Record<string, unknown>);
  }

  async getExpenseCategory(id: number): Promise<ExpenseCategory> {
    return this.request<ExpenseCategory>("GET", `/v2/expense_categories/${id}`);
  }

  async createExpenseCategory(data: CreateExpenseCategoryParams): Promise<ExpenseCategory> {
    return this.request<ExpenseCategory>("POST", "/v2/expense_categories", undefined, data as unknown as Record<string, unknown>);
  }

  async updateExpenseCategory(id: number, data: UpdateExpenseCategoryParams): Promise<ExpenseCategory> {
    return this.request<ExpenseCategory>("PATCH", `/v2/expense_categories/${id}`, undefined, data as unknown as Record<string, unknown>);
  }

  async deleteExpenseCategory(id: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/expense_categories/${id}`);
  }

  // --- Project User Assignments ---

  async listAllUserAssignments(params?: ListProjectUserAssignmentsParams): Promise<ProjectUserAssignmentList> {
    return this.request<ProjectUserAssignmentList>("GET", "/v2/user_assignments", params as Record<string, unknown>);
  }

  async listProjectUserAssignments(projectId: number, params?: ListProjectUserAssignmentsParams): Promise<ProjectUserAssignmentList> {
    return this.request<ProjectUserAssignmentList>("GET", `/v2/projects/${projectId}/user_assignments`, params as Record<string, unknown>);
  }

  async getProjectUserAssignment(projectId: number, assignmentId: number): Promise<ProjectUserAssignment> {
    return this.request<ProjectUserAssignment>("GET", `/v2/projects/${projectId}/user_assignments/${assignmentId}`);
  }

  async createProjectUserAssignment(projectId: number, data: CreateProjectUserAssignmentParams): Promise<ProjectUserAssignment> {
    return this.request<ProjectUserAssignment>("POST", `/v2/projects/${projectId}/user_assignments`, undefined, data as unknown as Record<string, unknown>);
  }

  async updateProjectUserAssignment(projectId: number, assignmentId: number, data: UpdateProjectUserAssignmentParams): Promise<ProjectUserAssignment> {
    return this.request<ProjectUserAssignment>("PATCH", `/v2/projects/${projectId}/user_assignments/${assignmentId}`, undefined, data as unknown as Record<string, unknown>);
  }

  async deleteProjectUserAssignment(projectId: number, assignmentId: number): Promise<void> {
    return this.request<void>("DELETE", `/v2/projects/${projectId}/user_assignments/${assignmentId}`);
  }

  // --- Additional Reports ---

  async getProjectBudgetReport(params?: ProjectBudgetReportParams): Promise<ProjectBudgetResponse> {
    return this.request<ProjectBudgetResponse>("GET", "/v2/reports/project_budget", params as Record<string, unknown>);
  }

  async getUninvoicedReport(params: UninvoicedReportParams): Promise<UninvoicedResponse> {
    return this.request<UninvoicedResponse>("GET", "/v2/reports/uninvoiced", params as unknown as Record<string, unknown>);
  }

  async getExpenseReportByClients(params: ExpenseReportParams): Promise<ExpenseReportResponse> {
    return this.request<ExpenseReportResponse>("GET", "/v2/reports/expenses/clients", params as unknown as Record<string, unknown>);
  }

  async getExpenseReportByProjects(params: ExpenseReportParams): Promise<ExpenseReportResponse> {
    return this.request<ExpenseReportResponse>("GET", "/v2/reports/expenses/projects", params as unknown as Record<string, unknown>);
  }

  async getExpenseReportByCategories(params: ExpenseReportParams): Promise<ExpenseReportResponse> {
    return this.request<ExpenseReportResponse>("GET", "/v2/reports/expenses/categories", params as unknown as Record<string, unknown>);
  }

  async getExpenseReportByTeam(params: ExpenseReportParams): Promise<ExpenseReportResponse> {
    return this.request<ExpenseReportResponse>("GET", "/v2/reports/expenses/team", params as unknown as Record<string, unknown>);
  }
}
