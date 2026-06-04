// Harvest API v2 type definitions
// https://help.getharvest.com/api-v2/

// --- Nested reference objects ---

export interface UserRef {
  id: number;
  name: string;
}

export interface ClientRef {
  id: number;
  name: string;
  currency?: string;
}

export interface ProjectRef {
  id: number;
  name: string;
  code?: string;
}

export interface TaskRef {
  id: number;
  name: string;
}

export interface InvoiceRef {
  id: number;
  number: string;
}

export interface ExternalReference {
  id: string;
  group_id: string;
  account_id: string;
  permalink: string;
  service: string;
  service_icon_url: string;
}

export interface UserAssignment {
  id: number;
  is_project_manager: boolean;
  is_active: boolean;
  budget: number | null;
  created_at: string;
  updated_at: string;
  hourly_rate: number;
}

export interface TaskAssignmentRef {
  id: number;
  billable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  hourly_rate: number;
  budget: number | null;
}

// --- Core entities ---

export interface TimeEntry {
  id: number;
  spent_date: string;
  user: UserRef;
  client: ClientRef;
  project: ProjectRef;
  task: TaskRef;
  user_assignment: UserAssignment;
  task_assignment: TaskAssignmentRef;
  external_reference: ExternalReference | null;
  invoice: InvoiceRef | null;
  hours: number;
  hours_without_timer: number;
  rounded_hours: number;
  notes: string | null;
  is_locked: boolean;
  locked_reason: string | null;
  is_closed: boolean;
  approval_status: "unsubmitted" | "submitted" | "approved";
  is_billed: boolean;
  timer_started_at: string | null;
  started_time: string | null;
  ended_time: string | null;
  is_running: boolean;
  billable: boolean;
  budgeted: boolean;
  billable_rate: number | null;
  cost_rate: number | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  client: ClientRef;
  is_active: boolean;
  is_billable: boolean;
  is_fixed_fee: boolean;
  bill_by: string;
  hourly_rate: number | null;
  budget_by: string;
  budget_is_monthly: boolean;
  budget: number | null;
  cost_budget: number | null;
  cost_budget_include_expenses: boolean;
  notify_when_over_budget: boolean;
  over_budget_notification_percentage: number;
  over_budget_notification_date: string | null;
  show_budget_to_all: boolean;
  fee: number | null;
  notes: string | null;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  name: string;
  billable_by_default: boolean;
  default_hourly_rate: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  timezone: string;
  has_access_to_all_future_projects: boolean;
  is_contractor: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  weekly_capacity: number;
  default_hourly_rate: number | null;
  cost_rate: number | null;
  roles: string[];
  access_roles: string[];
  avatar_url: string;
}

export interface Client {
  id: number;
  name: string;
  is_active: boolean;
  address: string | null;
  statement_key: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: number;
  project: ProjectRef;
  task: TaskRef;
  is_active: boolean;
  billable: boolean;
  hourly_rate: number | null;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectAssignment {
  id: number;
  is_project_manager: boolean;
  is_active: boolean;
  use_default_rates: boolean;
  budget: number | null;
  created_at: string;
  updated_at: string;
  hourly_rate: number | null;
  project: ProjectRef;
  client: ClientRef;
  task_assignments: TaskAssignmentRef[];
}

export interface TimeReportResult {
  [key: string]: unknown;
  total_hours: number;
  billable_hours: number;
  currency: string;
  billable_amount: number;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  unit_name: string | null;
  unit_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategoryRef {
  id: number;
  name: string;
  unit_name: string | null;
  unit_price: number | null;
}

export interface Expense {
  id: number;
  client: ClientRef;
  project: ProjectRef;
  expense_category: ExpenseCategoryRef;
  user: UserRef;
  user_assignment: UserAssignment;
  receipt: { url: string; file_name: string; content_type: string; file_size: number } | null;
  invoice: InvoiceRef | null;
  notes: string | null;
  units: number | null;
  total_cost: number;
  billable: boolean;
  is_closed: boolean;
  is_locked: boolean;
  is_billed: boolean;
  locked_reason: string | null;
  spent_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectUserAssignment {
  id: number;
  project: ProjectRef;
  user: UserRef;
  is_active: boolean;
  is_project_manager: boolean;
  use_default_rates: boolean;
  hourly_rate: number | null;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectBudgetResult {
  [key: string]: unknown;
  project_id: number;
  project_name: string;
  client_id: number;
  client_name: string;
  budget_is_monthly: boolean;
  budget_by: string;
  is_active: boolean;
  budget: number | null;
  budget_spent: number;
  budget_remaining: number;
}

export interface UninvoicedResult {
  [key: string]: unknown;
  client_id: number;
  client_name: string;
  project_id: number;
  project_name: string;
  currency: string;
  total_hours: number;
  uninvoiced_hours: number;
  uninvoiced_expenses: number;
  uninvoiced_amount: number;
}

export interface ExpenseReportResult {
  [key: string]: unknown;
  total_amount: number;
  billable_amount: number;
  currency: string;
}

// --- Pagination ---

export interface PaginationLinks {
  first: string;
  next: string | null;
  previous: string | null;
  last: string;
}

export interface PaginationMeta {
  per_page: number;
  total_pages: number;
  total_entries: number;
  next_page: number | null;
  previous_page: number | null;
  page: number;
  links: PaginationLinks;
}

// --- List responses ---

export interface TimeEntryList extends PaginationMeta {
  time_entries: TimeEntry[];
}

export interface ProjectList extends PaginationMeta {
  projects: Project[];
}

export interface TaskList extends PaginationMeta {
  tasks: Task[];
}

export interface UserList extends PaginationMeta {
  users: User[];
}

export interface ClientList extends PaginationMeta {
  clients: Client[];
}

export interface TaskAssignmentList extends PaginationMeta {
  task_assignments: TaskAssignment[];
}

export interface ProjectAssignmentList extends PaginationMeta {
  project_assignments: ProjectAssignment[];
}

export interface TimeReportResponse extends PaginationMeta {
  results: TimeReportResult[];
}

export interface ExpenseList extends PaginationMeta {
  expenses: Expense[];
}

export interface ExpenseCategoryList extends PaginationMeta {
  expense_categories: ExpenseCategory[];
}

export interface ProjectUserAssignmentList extends PaginationMeta {
  user_assignments: ProjectUserAssignment[];
}

export interface ProjectBudgetResponse extends PaginationMeta {
  results: ProjectBudgetResult[];
}

export interface UninvoicedResponse extends PaginationMeta {
  results: UninvoicedResult[];
}

export interface ExpenseReportResponse extends PaginationMeta {
  results: ExpenseReportResult[];
}

// --- Request bodies ---

export interface CreateTimeEntryParams {
  project_id: number;
  task_id: number;
  spent_date: string;
  user_id?: number;
  hours?: number;
  started_time?: string;
  ended_time?: string;
  notes?: string;
}

export interface UpdateTimeEntryParams {
  project_id?: number;
  task_id?: number;
  spent_date?: string;
  hours?: number;
  started_time?: string;
  ended_time?: string;
  notes?: string;
}

export interface CreateProjectParams {
  client_id: number;
  name: string;
  is_billable: boolean;
  bill_by: "Project" | "Tasks" | "People" | "none";
  budget_by: "project" | "project_cost" | "task" | "task_fees" | "person" | "none";
  code?: string;
  is_active?: boolean;
  is_fixed_fee?: boolean;
  hourly_rate?: number;
  budget?: number;
  budget_is_monthly?: boolean;
  notify_when_over_budget?: boolean;
  over_budget_notification_percentage?: number;
  show_budget_to_all?: boolean;
  cost_budget?: number;
  cost_budget_include_expenses?: boolean;
  fee?: number;
  notes?: string;
  starts_on?: string;
  ends_on?: string;
}

export interface UpdateProjectParams {
  client_id?: number;
  name?: string;
  is_billable?: boolean;
  bill_by?: "Project" | "Tasks" | "People" | "none";
  budget_by?: "project" | "project_cost" | "task" | "task_fees" | "person" | "none";
  code?: string;
  is_active?: boolean;
  is_fixed_fee?: boolean;
  hourly_rate?: number;
  budget?: number;
  budget_is_monthly?: boolean;
  notify_when_over_budget?: boolean;
  over_budget_notification_percentage?: number;
  show_budget_to_all?: boolean;
  cost_budget?: number;
  cost_budget_include_expenses?: boolean;
  fee?: number;
  notes?: string;
  starts_on?: string;
  ends_on?: string;
}

export interface CreateTaskParams {
  name: string;
  billable_by_default?: boolean;
  default_hourly_rate?: number;
  is_default?: boolean;
  is_active?: boolean;
}

export interface UpdateTaskParams {
  name?: string;
  billable_by_default?: boolean;
  default_hourly_rate?: number;
  is_default?: boolean;
  is_active?: boolean;
}

export interface CreateClientParams {
  name: string;
  is_active?: boolean;
  address?: string;
  currency?: string;
}

export interface UpdateClientParams {
  name?: string;
  is_active?: boolean;
  address?: string;
  currency?: string;
}

export interface CreateExpenseParams {
  project_id: number;
  expense_category_id: number;
  spent_date: string;
  user_id?: number;
  units?: number;
  total_cost?: number;
  notes?: string;
  billable?: boolean;
}

export interface UpdateExpenseParams {
  project_id?: number;
  expense_category_id?: number;
  spent_date?: string;
  units?: number;
  total_cost?: number;
  notes?: string;
  billable?: boolean;
  delete_receipt?: boolean;
}

export interface CreateExpenseCategoryParams {
  name: string;
  unit_name?: string;
  unit_price?: number;
  is_active?: boolean;
}

export interface UpdateExpenseCategoryParams {
  name?: string;
  unit_name?: string;
  unit_price?: number;
  is_active?: boolean;
}

export interface CreateProjectUserAssignmentParams {
  user_id: number;
  is_active?: boolean;
  is_project_manager?: boolean;
  use_default_rates?: boolean;
  hourly_rate?: number;
  budget?: number;
}

export interface UpdateProjectUserAssignmentParams {
  is_active?: boolean;
  is_project_manager?: boolean;
  use_default_rates?: boolean;
  hourly_rate?: number;
  budget?: number;
}

// --- Query params ---

export interface ListTimeEntriesParams {
  user_id?: number;
  client_id?: number;
  project_id?: number;
  task_id?: number;
  from?: string;
  to?: string;
  approval_status?: "unsubmitted" | "submitted" | "approved";
  page?: number;
  per_page?: number;
}

export interface ListProjectsParams {
  is_active?: boolean;
  client_id?: number;
  page?: number;
  per_page?: number;
}

export interface ListUsersParams {
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListTasksParams {
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListClientsParams {
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListTaskAssignmentsParams {
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListProjectAssignmentsParams {
  updated_since?: string;
  page?: number;
  per_page?: number;
}

export interface TimeReportParams {
  from: string;
  to: string;
  include_fixed_fee?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListExpensesParams {
  user_id?: number;
  client_id?: number;
  project_id?: number;
  is_billed?: boolean;
  updated_since?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export interface ListExpenseCategoriesParams {
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListProjectUserAssignmentsParams {
  user_id?: number;
  is_active?: boolean;
  updated_since?: string;
  page?: number;
  per_page?: number;
}

export interface ProjectBudgetReportParams {
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface UninvoicedReportParams {
  from: string;
  to: string;
  include_fixed_fee?: boolean;
  page?: number;
  per_page?: number;
}

export interface ExpenseReportParams {
  from: string;
  to: string;
  page?: number;
  per_page?: number;
}

// --- Invoices ---

export interface InvoiceLineItem {
  id?: number;
  project_id?: number;
  kind: string;
  description?: string;
  quantity?: number;
  unit_price: number;
  taxed?: boolean;
  taxed2?: boolean;
}

export interface Invoice {
  id: number;
  client?: { id: number; name: string };
  number?: string;
  purchase_order?: string;
  amount?: number;
  due_amount?: number;
  subject?: string;
  notes?: string;
  state?: string;
  issue_date?: string;
  due_date?: string;
  payment_term?: string;
  currency?: string;
  sent_at?: string;
  paid_at?: string;
  line_items?: InvoiceLineItem[];
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceList {
  invoices: Invoice[];
  per_page: number;
  total_pages: number;
  total_entries: number;
  page: number;
}

export interface ListInvoicesParams {
  client_id?: number;
  project_id?: number;
  updated_since?: string;
  from?: string;
  to?: string;
  state?: string;
  page?: number;
  per_page?: number;
}

export interface CreateInvoiceParams {
  client_id: number;
  retainer_id?: number;
  estimate_id?: number;
  number?: string;
  purchase_order?: string;
  tax?: number;
  tax2?: number;
  discount?: number;
  subject?: string;
  notes?: string;
  currency?: string;
  issue_date?: string;
  due_date?: string;
  payment_term?: string;
  line_items?: InvoiceLineItem[];
}

export interface UpdateInvoiceParams {
  client_id?: number;
  retainer_id?: number;
  estimate_id?: number;
  number?: string;
  purchase_order?: string;
  tax?: number;
  tax2?: number;
  discount?: number;
  subject?: string;
  notes?: string;
  currency?: string;
  issue_date?: string;
  due_date?: string;
  payment_term?: string;
  line_items?: InvoiceLineItem[];
}

export interface SendInvoiceParams {
  invoice_id: number;
  recipients: { name?: string; email: string }[];
  subject?: string;
  body?: string;
  include_link_to_client_invoice?: boolean;
  attach_pdf?: boolean;
  send_me_a_copy?: boolean;
  thank_you?: boolean;
}

export interface InvoiceMessage {
  id: number;
  sent_by?: string;
  subject?: string;
  body?: string;
  created_at?: string;
}

// --- Invoice Payments ---

export interface InvoicePayment {
  id: number;
  amount?: number;
  paid_at?: string;
  paid_date?: string;
  recorded_by?: string;
  recorded_by_email?: string;
  notes?: string;
  transaction_id?: string | null;
  created_at?: string;
  updated_at?: string;
  payment_gateway?: { id: number | null; name: string | null } | null;
}

export interface InvoicePaymentList {
  invoice_payments: InvoicePayment[];
  per_page: number;
  total_pages: number;
  total_entries: number;
  page: number;
}

export interface ListInvoicePaymentsParams {
  updated_since?: string;
  page?: number;
  per_page?: number;
}

export interface CreateInvoicePaymentParams {
  amount: number;
  paid_at?: string;
  paid_date?: string;
  notes?: string;
}
