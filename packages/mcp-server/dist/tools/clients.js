import { z } from "zod";
export function registerClientTools(server, client) {
    server.registerTool("list_clients", {
        title: "List Clients",
        description: "List all clients in the Harvest account.",
        inputSchema: z.object({
            is_active: z.boolean().optional().describe("Filter by active status"),
            page: z.number().optional().describe("Page number for pagination"),
            per_page: z.number().optional().describe("Results per page (max 2000)"),
        }),
    }, async (args) => {
        const result = await client.listClients(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("get_client", {
        title: "Get Client",
        description: "Get detailed information about a specific client.",
        inputSchema: z.object({
            client_id: z.number().describe("The client ID"),
        }),
    }, async (args) => {
        const result = await client.getClient(args.client_id);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("create_client", {
        title: "Create Client",
        description: "Create a new client in Harvest.",
        inputSchema: z.object({
            name: z.string().describe("The name of the client"),
            is_active: z.boolean().optional().describe("Whether the client is active (defaults to true)"),
            address: z.string().optional().describe("The client's address"),
            currency: z.string().optional().describe("The currency code for the client (e.g. 'EUR', 'USD')"),
        }),
    }, async (args) => {
        const result = await client.createClient(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("update_client", {
        title: "Update Client",
        description: "Update an existing client. Any parameters not provided will be left unchanged.",
        inputSchema: z.object({
            client_id: z.number().describe("The client ID to update"),
            name: z.string().optional().describe("The name of the client"),
            is_active: z.boolean().optional().describe("Whether the client is active"),
            address: z.string().optional().describe("The client's address"),
            currency: z.string().optional().describe("The currency code for the client"),
        }),
    }, async (args) => {
        const { client_id, ...data } = args;
        const result = await client.updateClient(client_id, data);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.registerTool("delete_client", {
        title: "Delete Client",
        description: "Delete a client. Only possible if the client has no projects, invoices, or estimates. This is destructive and cannot be undone.",
        annotations: {
            destructiveHint: true,
        },
        inputSchema: z.object({
            client_id: z.number().describe("The client ID to delete"),
        }),
    }, async (args) => {
        await client.deleteClient(args.client_id);
        return {
            content: [{ type: "text", text: `Client ${args.client_id} deleted successfully.` }],
        };
    });
}
//# sourceMappingURL=clients.js.map