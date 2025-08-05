const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");
require("dotenv").config();

// Auth using service account JSON key
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(
    __dirname,
    "../config/formal-atrium-468108-t9-7855262b3c4e.json"
  ), // adjust path as needed
});

// Replace with your actual GA4 property ID
const PROPERTY_ID = "499321668";

async function SeoSummary() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "activeUsers" },
    ],
  });

  return response;
}

module.exports = { SeoSummary };
