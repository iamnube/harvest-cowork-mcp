import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HarvestClient } from "../harvest-client.js";

const lineItemSchema = z.object({
  id: z.number().optional().describe("Line item ID (include when updating an existing line item)"),
  project_id: z.number().optional().describe("The ID of the project associated with this line item"),
  kind: z.string().describe("The invoice item category name (e.g. 'Service', 'Product')"),
  description: z.string().optional().describe("Text description of the line item"),
  quantity: z.number().optional().describe("The unit quantity of the item (defaults to 1)"),
  unit_price: z.number().describe("The individual price per unit"),
  taxed: z.boolean().optional().describe("Whether the invoice's tax percentage applies to this line item"),
  taxed2: z.boolean().optional().describe("Whether the invoice's tax2 percentage applies to this line item"),
});

export function registerInvoiceTools(server: McpServer, client: HarvestClient) {
  server.registerTool(
    "list_invoices",
    {
      title: "List Invoices",
      description: "List invoices, sorted by issue date with most recent first. Filter by client, project, state, or date range.",
      inputSchema: z.object({
        client_id: z.number().optional().describe("Only return invoices for this client ID"),
        project_id: z.number().optional().describe("Only return invoices for this project ID"),
        state: z.enum(["draft", "open", "paid", "closed"]).optional().describe("Filter by invoice state"),
        from: z.string().optional().describe("Only return invoices issued on or after this date (YYYY-MM-DD)"),
        to: z.string().optional().describe("Only return invoices issued on or before this date (YYYY-MM-DD)"),
        updated_since: z.string().optional().describe("Only return invoices updated since this datetime"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      }),
    },
    async (args) => {
      const result = await client.listInvoices(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_invoice",
    {
      title: "Get Invoice",
      description: "Get detailed information about a specific invoice, including its line items.",
      inputSchema: z.object({
        invoice_id: z.number().describe("The invoice ID"),
      }),
    },
    async (args) => {
      const result = await client.getInvoice(args.invoice_id);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "create_invoice",
    {
      title: "Create Invoice",
      description:
        "Create a new invoice for a client. Provide line_items for a free-form invoice. New invoices start in 'draft' state and are not sent automatically.",
      inputSchema: z.object({
        client_id: z.number().describe("The ID of the client this invoice belongs to"),
        subject: z.string().optional().describe("The invoice subject"),
        notes: z.string().optional().describe("Any additional notes to include on the invoice"),
        number: z.string().optional().describe("Invoice number (auto-generated if omitted)"),
        purchase_order: z.string().optional().describe("The purchase order number"),
        tax: z.number().optional().describe("Tax percentage applied to the subtotal (e.g. 10.0 for 10%)"),
        tax2: z.number().optional().describe("Second tax percentage applied to the subtotal"),
        discount: z.number().optional().describe("Discount percentage subtracted from the subtotal"),
        currency: z.string().optional().describe("Currency code (defaults to the client's currency)"),
        issue_date: z.string().optional().describe("Date the invoice was issued (YYYY-MM-DD, defaults to today)"),
        due_date: z.string().optional().describe("Date the invoice is due (YYYY-MM-DD)"),
        payment_term: z
          .enum(["upon receipt", "net 15", "net 30", "net 45", "net 60", "custom"])
          .optional()
          .describe("Payment timeframe (defaults to custom)"),
        line_items: z.array(lineItemSchema).optional().describe("Array of line items for the invoice"),
      }),
    },
    async (args) => {
      const result = await client.createInvoice(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "update_invoice",
    {
      title: "Update Invoice",
      description:
        "Update an existing invoice. Any parameters not provided are left unchanged. To update a line item, include its id; to add one, omit the id.",
      inputSchema: z.object({
        invoice_id: z.number().describe("The invoice ID to update"),
        client_id: z.number().optional().describe("The ID of the client this invoice belongs to"),
        subject: z.string().optional().describe("The invoice subject"),
        notes: z.string().optional().describe("Any additional notes to include on the invoice"),
        number: z.string().optional().describe("Invoice number"),
        purchase_order: z.string().optional().describe("The purchase order number"),
        tax: z.number().optional().describe("Tax percentage applied to the subtotal"),
        tax2: z.number().optional().describe("Second tax percentage applied to the subtotal"),
        discount: z.number().optional().describe("Discount percentage subtracted from the subtotal"),
        currency: z.string().optional().describe("Currency code"),
        issue_date: z.string().optional().describe("Date the invoice was issued (YYYY-MM-DD)"),
        due_date: z.string().optional().describe("Date the invoice is due (YYYY-MM-DD)"),
        payment_term: z
          .enum(["upon receipt", "net 15", "net 30", "net 45", "net 60", "custom"])
          .optional()
          .describe("Payment timeframe"),
        line_items: z.array(lineItemSchema).optional().describe("Array of line items to add or update"),
      }),
    },
    async (args) => {
      const { invoice_id, ...data } = args;
      const result = await client.updateInvoice(invoice_id, data);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "send_invoice",
    {
      title: "Send Invoice",
      description:
        "Send an invoice to one or more recipients by email. This emails the client and moves a draft invoice to 'open' state.",
      annotations: {
        destructiveHint: true,
      },
      inputSchema: z.object({
        invoice_id: z.number().describe("The invoice ID to send"),
        recipients: z
          .array(
            z.object({
              name: z.string().optional().describe("Recipient name"),
              email: z.string().describe("Recipient email address"),
            }),
          )
          .describe("List of recipients to send the invoice to"),
        subject: z.string().optional().describe("Email subject line"),
        body: z.string().optional().describe("Email body text"),
        include_link_to_client_invoice: z
          .boolean()
          .optional()
          .describe("Include a link to the online invoice"),
        attach_pdf: z.boolean().optional().describe("Attach a PDF of the invoice (defaults to true)"),
        send_me_a_copy: z.boolean().optional().describe("Send a copy to yourself"),
        thank_you: z.boolean().optional().describe("Mark this as a thank-you message"),
      }),
    },
    async (args) => {
      const { invoice_id, ...data } = args;
      const payload: Record<string, unknown> = { ...data, attach_pdf: data.attach_pdf ?? true };
      const result = await client.sendInvoice(invoice_id, payload);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
