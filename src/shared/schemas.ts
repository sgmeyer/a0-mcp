import { z } from 'zod';

export const tenantLogGetAllSchema = {
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