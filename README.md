# Auth0 MCP Server

** This is a POC that isn't fully implemented and should not be used for production workloads or any tenant you do not want an LLM to have access to.

A ModelContextProtocol (MCP) server implementation for Auth0 that enables Language Models to interact with Auth0 resources securely.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Building the MCP Server](#building-the-mcp-server)
  - [Connecting to Claude Desktop](#connecting-to-claude-desktop)
  - [Available Operations](#available-operations)
- [API Reference](#api-reference)
  - [Clients](#clients)
  - [Users](#users)
  - [Forms](#forms)
  - [Resources](#resources)
- [Authentication](#authentication)
- [Security](#security)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Auth0 MCP Server acts as a bridge between Language Models (LLMs) and Auth0's Management API. It implements the ModelContextProtocol specification to provide a secure, structured way for LLMs to create, read, update, delete, and search Auth0 resources.

This server enables AI assistants to help manage your Auth0 tenant by providing natural language interfaces to Auth0 operations, enhancing productivity and simplifying resource management.

## Features

- **Auth0 Resource Management**: Interact with clients, users, forms, and other Auth0 resources
- **Secure Access Control**: Enforces proper authentication and authorization
- **ModelContextProtocol Compliant**: Compatible with LLMs that support the MCP specification
- **Comprehensive Operations**: Create, read, update, delete, and search functionality for resources
- **Stateless Design**: No server-side session storage required
- **Detailed Logging**: Comprehensive activity tracking for security monitoring
- **Customizable Permissions**: Fine-grained access control per resource type

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/a0-mcp.git
cd a0-mcp

# Install dependencies
npm install
```

## Configuration with Claude Desktop

This project can be used with Claude Deskop.  To configure Claude Desktop you must edit the `claude_desktop_config.json` file.  You can find this file in Claude Desktop under the file menu _Claud >> Settings_.  A new window will open up.  Select the navigation item called _Developer_.  at the bottom hit the _Edit Config_ button.  A file explorer window will open up where you can find the `claude_desktop_config.json` to open in a text editor.

```json
{
  "mcpServers": {
    "auth0": {
      "command": "node",
      "args": [
        "/path/to/repo/a0-mcp/dist/index.js"
      ],
      "env": {
        "AUTH0_DOMAIN": "<auth0-domain>",
        "AUTH0_CLIENT_ID": "<client-id>",
        "AUTH0_CLIENT_SECRET": "<client-secrete>"
    }
  }
}
```

It is recommended that you create a M2M Client in Auth0 Tenant.  Using the _Client ID_ and _Client Secret_ the MCP Server will do the necessary authentication for the LLM to interact with your auth0 tenant.  You can control the scopes inside your M2M Client to restrict what access you want to give the LLM via the MCP Server.

## Usage

### Building the MCP Server

```bash
# Go to the root directory of the a0-mcp repository
cd 

# Builds the MCP Server in the ./dist directory
npm run build
```

Once the MCP Server is build you can import this into Claude Desktop.  All the necessary files are built and published to the `dist` directory in the root director of the local `a0-mcp` repository.

### Connecting to Claude Desktop



### Available Operations

The MCP server supports the following operations for Auth0 resources:

- **Create**: Add new resources to your Auth0 tenant
- **Read**: Retrieve information about existing resources
- **Update**: Modify properties of existing resources
- **Delete**: Remove resources from your Auth0 tenant
- **Search**: Find resources matching specific criteria

## API Reference

### Clients

| Operation | Description | Required Parameters |
|-----------|-------------|---------------------|
| `listClients` | Retrieve all clients | None |
| `getClient` | Get a specific client | `client_id` |
| `createClient` | Create a new client | `name`, `app_type` |
| `deleteClient` | Delete a client | `client_id` |
| `searchClients` | Search for clients | `query` |

### Users

| Operation | Description | Required Parameters |
|-----------|-------------|---------------------|
| `listUsers` | Retrieve all users | None |
| `getUser` | Get a specific user | `user_id` |
| `getUserByEmail` | Get a specific user by email | `user_email` |
| `createUser` | Create a new user | `email`, `password` |
| `updateUser` | Update user properties | `user_id`, properties to update |
| `deleteUser` | Delete a user | `user_id` |
| `searchUsers` | Search for users | `query` |

### Forms

*This is a work in progress and not fully implemented.....*


| Operation | Description | Required Parameters |
|-----------|-------------|---------------------|
| `listForms` | Retrieve all forms | None |
| `getForm` | Get a specific form | `form_id` |
| `createForm` | Create a new form | `name`, `fields` |
| `updateForm` | Update form properties | `form_id`, properties to update |
| `deleteForm` | Delete a form | `form_id` |
| `searchForms` | Search for forms | `query` |



## Authentication

The server supports the following authentication methods:

1. **OAuth 2.0 Client Credentials**: For server-to-server communication
2. **Bearer Token**: For authenticated API calls
3. **API Key**: For simplified access (less secure, use with caution)

Example authentication with Bearer token:

```bash
curl -X POST https://your-server.com/mcp/clients/list \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## Security

The Auth0 MCP Server implements several security measures:

- **Rate Limiting**: Prevents abuse and DoS attacks
- **Input Validation**: Sanitizes all incoming data
- **Scoped Access**: Enforces least privilege principle
- **Audit Logging**: Records all operations for review
- **Transport Security**: Requires HTTPS for all communications

## Examples

Here's an example of how an LLM might interact with the MCP server...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code adheres to the existing style and passes all tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
