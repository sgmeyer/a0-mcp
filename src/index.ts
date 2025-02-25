import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ManagementClient } from 'auth0';


const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN || "",
  clientId: process.env.AUTH0_CLIENT_ID || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET || ""
});

// Create server instance
const server = new McpServer({
  name: "auth0-mcp-server",
  version: "0.0.1",
});


server.tool(
  "get-tenant-logs",
  "Fetches the Tenant Logs",
  { 
    page: z.number().optional().describe("Page index of the results to return. First page is 0."), 
    per_page: z.number().optional().describe("Number of results per page. Paging is disabled if parameter not sent. Default: <code>50</code>. Max value: <code>100</code>"),
    sort: z.string().optional().describe("Comma-separated list of fields to include or exclude (based on value provided for <code>include_fields</code>) in the result. Leave empty to retrieve all fields."),
    fields: z.string().optional().describe("Comma-separated list of fields to include or exclude (based on value provided for <code>include_fields</code>) in the result. Leave empty to retrieve all fields."),
    include_fields: z.boolean().optional().describe("Whether specified fields are to be included (<code>true</code>) or excluded (<code>false</code>)"),
    include_totals: z.boolean().optional().describe("Return results as an array when false (default). Return results inside an object that also contains a total result count when true."),
    from: z.string().optional().describe("This takes a Tenant Log Event Id from which to start selection from"),
    take: z.number().optional().describe("Number of entries to retrieve when using the <code>from</code> parameter. Default <code>50</code>, max <code>100</code>"),
    q: z.string().optional().describe("Query in <a target='_new' href ='http://www.lucenetutorial.com/lucene-query-syntax.html'>Lucene query string syntax</a>.")
  },
  async ({ page, per_page, sort, fields, include_fields, include_totals, from, take, q }) => {
    const logs = await auth0.logs.getAll({ page, per_page, sort, fields, include_fields, include_totals, from, take, q });
    return { content: [{ type: "text", text: JSON.stringify(logs) }] };
  }
);

server.tool(
  "find-user-by-email",
  "Find a user for a given email",
  { email: z.string() },
  async ({ email }) => {
    const users = await auth0.users.getAll({ q: `email:"${email}"`, search_engine: 'v3' });

    if (users.data.length > 0) {
      return { content: [{ type: "text", text: JSON.stringify(users) }] };
    }
    return { content: [{ type: "text", text: "No user found with this email." }] };
  }
);

server.tool(
  "get-user-by-id",
  "Retrieve a user by their Auth0 user ID",
  { userId: z.string() },
  async ({ userId }) => {
    try {
      const user = await auth0.users.get({ id: userId });
      return { content: [{ type: "text", text: JSON.stringify(user) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "list-users",
  "Retrieve a list of users with pagination",
  { page: z.number().default(0), per_page: z.number().default(10) },
  async ({ page, per_page }) => {
    const users = await auth0.users.getAll({ page, per_page });
    return { content: [{ type: "text", text: JSON.stringify(users) }] };
  }
);

server.tool(
  "create-user",
  "Create a new user in Auth0",
  { email: z.string(), password: z.string(), connection: z.string() },
  async ({ email, password, connection }) => {
    try {
      const user = await auth0.users.create({ email, password, connection });
      return { content: [{ type: "text", text: JSON.stringify(user) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "update-user",
  "Update a user's details",
  { userId: z.string(), data: z.record(z.string(), z.any()) },
  async ({ userId, data }) => {
    try {
      const user = await auth0.users.update({ id: userId }, data);
      return { content: [{ type: "text", text: JSON.stringify(user) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "delete-user",
  "Delete a user permanently",
  { userId: z.string() },
  async ({ userId }) => {
    try {
      await auth0.users.delete({ id: userId });
      return { content: [{ type: "text", text: "User deleted successfully." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "block-user",
  "Block a user from logging in",
  { userId: z.string() },
  async ({ userId }) => {
    try {
      await auth0.users.update({ id: userId }, { blocked: true });
      return { content: [{ type: "text", text: "User blocked successfully." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "unblock-user",
  "Unblock a previously blocked user",
  { userId: z.string() },
  async ({ userId }) => {
    try {
      await auth0.users.update({ id: userId }, { blocked: false });
      return { content: [{ type: "text", text: "User unblocked successfully." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "assign-role-to-user",
  "Assign roles to a user",
  { userId: z.string(), roles: z.array(z.string()) },
  async ({ userId, roles }) => {
    try {
      await auth0.users.assignRoles({ id: userId }, { roles });
      return { content: [{ type: "text", text: "Roles assigned successfully." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "remove-role-from-user",
  "Remove roles from a user",
  { userId: z.string(), roles: z.array(z.string()) },
  async ({ userId, roles }) => {
    try {
      await auth0.users.deleteRoles({ id: userId }, { roles });
      return { content: [{ type: "text", text: "Roles removed successfully." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "get-user-logs",
  "Retrieve login history and event logs for a user",
  { userId: z.string(), per_page: z.number().default(10) },
  async ({ userId, per_page }) => {
    try {
      const logs = await auth0.users.getLogs({ id: userId, per_page });
      return { content: [{ type: "text", text: JSON.stringify(logs) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "verify-user-email",
  "Manually verify a user's email",
  { userId: z.string() },
  async ({ userId }) => {
    try {
      await auth0.users.update({ id: userId }, { email_verified: true });
      return { content: [{ type: "text", text: "User email verified." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "resend-email-verification",
  "Send an email verification email to a user",
  { userId: z.string() },
  async ({ userId }) => {
    try {
      await auth0.jobs.verifyEmail({ user_id: userId });
      return { content: [{ type: "text", text: "Verification email sent." }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Auth0 MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
