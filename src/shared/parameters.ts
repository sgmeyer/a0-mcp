import { z } from 'zod';


export const clientCreateParameters = {
  name: z.string().nonempty().describe("Name of this client (min length: 1 character, does not allow `<` or `>`)."),
  description: z.string().optional().describe("Free text description of this client (max length: 140 characters)."),
  logo_uri: z.string().optional().describe("URL of the logo to display for this client. Recommended size is 150x150 pixels."),
  callbacks: z.array(z.string()).optional().describe("Comma-separated list of URLs whitelisted for Auth0 to use as a callback to the client after authentication."),
  oidc_logout: z.object({
    backchannel_logout: z.array(z.string()).optional().describe("Comma-separated list of URLs that are valid to call back from Auth0 for OIDC backchannel logout. Currently only one URL is allowed.")
  }),
  allow_origin: z.array(z.string()).optional().describe("Comma-separated list of URLs allowed to make requests from JavaScript to Auth0 API (typically used with CORS). By default, all your callback URLs will be allowed. This field allows you to enter other origins if necessary. You can also use wildcards at the subdomain level (e.g., https://*.contoso.com). Query strings and hash information are not taken into account when validating these URLs."),
  web_origins: z.array(z.string()).optional().describe("Comma-separated list of allowed origins for use with <a href='https://auth0.com/docs/cross-origin-authentication'>Cross-Origin Authentication</a>, <a href='https://auth0.com/docs/flows/concepts/device-auth'>Device Flow</a>, and <a href='https://auth0.com/docs/protocols/oauth2#how-response-mode-works'>web message response mode</a>."),
  client_aliases: z.array(z.string()).optional().describe("List of audiences/realms for SAML protocol. Used by the wsfed addon."),
  allowed_clients: z.array(z.string()).optional().describe("List of allow clients and API ids that are allowed to make delegation requests. Empty means all all your clients are allowed."),
  allowed_logout_urls: z.array(z.string()).optional().describe("Comma-separated list of URLs that are valid to redirect to after logout from Auth0. Wildcards are allowed for subdomains."),
  grant_types: z.array(z.string()).optional().describe("List of grant types supported for this application. Can include `authorization_code`, `implicit`, `refresh_token`, `client_credentials`, `password`, `http://auth0.com/oauth/grant-type/password-realm`, `http://auth0.com/oauth/grant-type/mfa-oob`, `http://auth0.com/oauth/grant-type/mfa-otp`, `http://auth0.com/oauth/grant-type/mfa-recovery-code`, and `urn:ietf:params:oauth:grant-type:device_code`."),
  token_endpoint_auth_method: z.enum(["none", "client_secret_post", "client_secret_basic"]).optional().describe("Defines the requested authentication method for the token endpoint. Can be `none` (public client without a client secret), `client_secret_post` (client uses HTTP POST parameters), or `client_secret_basic` (client uses HTTP Basic)."),
  app_type: z.enum(["spa", "native", "regular_web", "non_interactive", "rm_fa", "box", "cloudbees", "concur", "dropbox", "echosign", "newrelic", "office365", "salesforce", "samlp", "sharepoint", "slack", "springcm", "zendesk", "zoom", "zoom_us"]).optional().describe("Type of client used to determine which settings are applicable. Can be `spa`, `native`, `non_interactive`, or `regular_web`."),
  is_first_party: z.boolean().optional().describe("Whether this client is a first-party client (used to differentiate between first-party and third-party clients)."),
  oidc_conformant: z.boolean().optional().describe("Whether this client conforms to <a href='https://auth0.com/docs/api-auth/tutorials/adoption'>strict OIDC specifications</a> (true) or uses legacy features (false)."),
  jwt_configuration: z.object({
    life_time_in_seconds: z.number().optional().describe(" Number of seconds the JWT will be valid for (affects `exp` claim)."),
    scopes: z.object({}).optional().describe("Configuration related to id token claims for the client."),
    alg: z.enum(["HS256", "RS256", "PS256"]).optional().describe("Algorithm used to sign JWTs. Can be `HS256` or `RS256`. `PS256` available via addon.")
  }).optional().describe("Configuration related to JWTs for this client."),
  //encryption_key: z.object({}).optional().describe(""),
  sso: z.boolean().optional().describe("Applies only to SSO clients and determines whether Auth0 will handle Single Sign On (true) or whether the Identity Provider will (false)."),
  cross_origin_authentication: z.string().optional().describe("URL of the location in your site where the cross origin verification takes place for the cross-origin auth flow when performing Auth in your own domain instead of Auth0 hosted login page."),
  sso_disabled: z.boolean().optional().describe("<code>true</code> to disable Single Sign On, <code>false</code> otherwise (default: <code>false</code>)"),
  custom_login_page_on: z.boolean().optional().describe("<code>true</code> if the custom login page is to be used, <code>false</code> otherwise. Defaults to <code>true</code>"),
  custom_login_page: z.string().optional().describe("The content (HTML, CSS, JS) of the custom login page."),
  custom_login_page_preview: z.string().optional().describe("The content (HTML, CSS, JS) of the custom login page. (Used on Previews)"),
  form_template: z.string().optional().describe("HTML form template to be used for WS-Federation."),
  //addons: z.object({}).optional().describe(""),
  // TODO: need to setup a key value pair
  //client_metadata: z.object({}).optional().describe("Additional metadata to store for this client."),
  //mobile: z.object({}).optional().describe(""),
  initiate_login_uri: z.string().optional().describe("Initiate login uri, must be https"),
  organization_usage: z.enum(["any", "only", "none"]).optional().describe("Defines how to proceed during an authentication transaction with regards an organization. Can be `deny` (default), `allow` or `require`."),
  organization_require_behavior: z.enum(["no_prompt", "pre_login_prompt", "post_login_prompt"]).optional().describe("Defines how to proceed during an authentication transaction with regards an organization. Can be `any` (default) or `all`."),
  //client_authentication_methods: z.object({}).optional().describe(""),
  require_pushed_authorization_requests: z.boolean().optional().describe(" Makes the use of Pushed Authorization Requests mandatory for this client"),
  //signed_request_object: z.object([]).optional().describe(""),
  require_proof_of_possession: z.boolean().optional().describe("Makes the use of Proof of Possession mandatory for this client"),
  compliance_level: z.enum(["none", "fapi1_adv_pkj_par", "fapi1_adv_mtls_par", "null"]).optional().describe("Defines the compliance level for this client, which may restrict it's capabilities"),
};

export const clientDeleteParameters = {
  client_id: z.string().nonempty().describe("ID of the client to delete.")
}

export const clientGetParameters = {
  client_id: z.string().nonempty().describe("The ID of the client to retrieve."),
  fields: z.string().optional().describe("Comma-separated list of fields to include or exclude (based on value provided for include_fields) in the result. Leave empty to retrieve all fields."),
  include_fields: z.boolean().optional().describe("Whether specified fields are to be included (true) or excluded (false).")
};

export const clientGetAllParameters = {
  fields: z.string().optional().describe("Comma-separated list of fields to include or exclude (based on value provided for include_fields) in the result. Leave empty to retrieve all fields."),
  include_fields: z.boolean().optional().describe("Whether specified fields are to be included (true) or excluded (false)."),
  page: z.number().optional().describe("Page index of the results to return. First page is 0."),
  per_page: z.number().optional().describe("Number of results per page. Default value is 50, maximum value is 100"),
  include_totals: z.boolean().optional().describe("Return results inside an object that contains the total result count (true) or as a direct array of results (false, default)."),
  from: z.string().optional().describe("Optional Id from which to start selection."),
  take: z.number().optional().describe("Number of results per page. Defaults to 50."),
  is_global: z.boolean().optional().describe("Optional filter on the global client parameter."),
  is_first_party: z.boolean().optional().describe("Optional filter on whether or not a client is a first-party client."),
  app_type: z.string().optional().describe("Optional filter by a comma-separated list of application types."),
  q: z.string().optional().describe("Advanced Query in <a href='http://www.lucenetutorial.com/lucene-query-syntax.html'>Lucene</a> syntax.<br /><b>Permitted Queries</b>:<br /><ul><li><i>client_grant.organization_id:{organization_id}</i></li><li><i>client_grant.allow_any_organization:true</i></li></ul><b>Additional Restrictions</b>:<br /><ul><li>Cannot be used in combination with other filters</li><li>Requires use of the <i>from</i> and <i>take</i> paging parameters (checkpoint paginatinon)</li><li>Reduced rate limits apply. See <a href='https://auth0.com/docs/troubleshoot/customer-support/operational-policies/rate-limit-policy/rate-limit-configurations/enterprise-public'>Rate Limit Configurations</a></li></ul><i><b>Note</b>: Recent updates may not be immediately reflected in query results</i>")
};

export const formsGetAllParameters = {
  page: z.number().optional().describe("Page index of the results to return. First page is 0."),
  per_page: z.number().optional().describe("Number of results per page. Defaults to 50."),
  include_totals: z.boolean().optional().describe("Return results inside an object that contains the total result count (true) or as a direct array of results (false, default)."),
  hydrate: z.array(z.enum(["flow_count", "links"])).optional().describe("Hydration param"),
}

export const tenantLogGetParameters = {
  id: z.string().nonempty().describe("The ID of the log event to retrieve.")
};

export const tenantLogGetAllParameters = {
  page: z.number().optional().describe("Page index of the results to return. First page is 0."), 
  per_page: z.number().optional().describe("Number of results per page. Paging is disabled if parameter not sent. Default: <code>50</code>. Max value: <code>100</code>"),
  sort: z.string().optional().describe("Comma-separated list of fields to include or exclude (based on value provided for <code>include_fields</code>) in the result. Leave empty to retrieve all fields."),
  fields: z.string().optional().describe("Comma-separated list of fields to include or exclude (based on value provided for <code>include_fields</code>) in the result. Leave empty to retrieve all fields."),
  include_fields: z.boolean().optional().describe("Whether specified fields are to be included (<code>true</code>) or excluded (<code>false</code>)"),
  include_totals: z.boolean().optional().describe("Return results as an array when false (default). Return results inside an object that also contains a total result count when true."),
  from: z.string().optional().describe("This takes a Tenant Log Event Id from which to start selection from"),
  take: z.number().optional().describe("Number of entries to retrieve when using the <code>from</code> parameter. Default <code>50</code>, max <code>100</code>"),
  q: z.string().optional().describe("Query in <a target='_new' href ='http://www.lucenetutorial.com/lucene-query-syntax.html'>Lucene query string syntax</a>.")
};