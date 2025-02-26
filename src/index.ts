import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ManagementClient } from "auth0";

import { clientCreateParameters, clientDeleteParameters, clientGetParameters, clientGetAllParameters,
         formsCreateParameters, formsGetAllParameters,
         tenantLogGetParameters, tenantLogGetAllParameters } from "./shared/parameters.js";


const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN || "",
  clientId: process.env.AUTH0_CLIENT_ID || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET || ""
});

const server = new McpServer({
  name: "auth0-mcp-server",
  version: "0.0.1",
});

server.tool(
  "clients-create",
  "",
  clientCreateParameters,
  async (args: any) => {
    const client = await auth0.clients.create(args);
    return { content: [{ type: "text", text: JSON.stringify(client) }] };
  }
)

server.tool(
  "clients-delete",
  "Delete a client by id.",
  clientDeleteParameters,
  async (args: any) => {
    const client = await auth0.clients.delete(args);
    if(client) {
      return { content: [{ type: "text", text: "Client deleted successfully." }] };
    } else {
      return { content: [{ type: "text", text: "No client found with this ID." }] };
    }
  }
);

server.tool(
  "clients-get-by-id",
  "Retrieve an individual client by id.",
  clientGetParameters,
  async (args: any) => {
    console.log("Arguments: ", args);
    const client = await auth0.clients.get(args); 
    if(client){
      return { content: [{ type: "text", text: JSON.stringify(client) }] };
    } else {  
      return { content: [{ type: "text", text: "No client found with this ID." }] };
    }
  }
);

server.tool(
  "clients-get-all",
  "Retrieve all clients.",
  clientGetAllParameters,
  async (args: any) => {
    try {
      const clients = await auth0.clients.getAll(args);
      return { content: [{ type: "text", text: JSON.stringify(clients) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }] };
    }
  }
);

server.tool(
  "forms-create-all",
  "Create a new form.",
  formsCreateParameters,
  async (args: any) => {
    const form = await auth0.forms.create(args);
    return { content: [{ type: "text", text: JSON.stringify(form) }] };
  }
);

server.tool(
  "forms-get-all",
  "Retrieve all forms.",
  formsGetAllParameters,
  async (args: any) => {
    const forms = await auth0.forms.getAll(args); 
    return { content: [{ type: "text", text: JSON.stringify(forms) }] };
  }
);

server.tool(
  "log-get-by-id",
  "Retrieve an individual log event by id.",
  tenantLogGetParameters,
  async (args: any) => {
    const log = await auth0.logs.get(args);

    if(log) {
      return { content: [{ type: "text", text: JSON.stringify(log) }] };
    } else {
      return { content: [{ type: "text", text: "No log found with this ID." }] };
    }
  }
);

// TODO: We need to help the LLM know more about the TLog schemas.  The LLM struggles to filter on schemas if you don't specify exactly the info in the prompt.
server.tool(
  "log-get-all",
  "Retrieves the Tenant Logs based on the provided search criteria.",
  tenantLogGetAllParameters,
  async (args: any) => {
    const logs = await auth0.logs.getAll(args);
    if(logs.data.length > 0) {
      return { content: [{ type: "text", text: JSON.stringify(logs) }] };
    } else {
      return { content: [{ type: "text", text: "No logs found." }] };
    }
  }
);


///////-------------- NEEDS refactoring to new structure /////////
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
