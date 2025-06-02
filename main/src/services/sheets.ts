import fs from "fs/promises";
import path from "path";
import { google, sheets_v4, Auth } from "googleapis";

// If modifying these scopes, modify the SERVICE_ACCOUNT_SCOPES
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file containing service account credentials
const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Authorizes with a service account
 */
async function authorizeWithServiceAccount(): Promise<Auth.JWT> {
  try {
    // Check if service account file exists
    await fs.access(SERVICE_ACCOUNT_PATH);

    // Create a JWT client using the service account credentials
    const auth = new google.auth.JWT({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: SCOPES,
    });

    // Authorize the client
    await auth.authorize();
    return auth;
  } catch (err) {
    console.error("Error authorizing with service account:", err);
    throw new Error(
      "Failed to authenticate with Google Sheets service account"
    );
  }
}

export class SheetsService {
  private sheets: sheets_v4.Sheets | null = null;
  private spreadsheetId: string;
  private tabName: string;

  constructor(spreadsheetId: string, tabName: string = "Problems") {
    this.spreadsheetId = spreadsheetId;
    this.tabName = tabName;
  }

  /**
   * Initialize the Google Sheets API client with service account authentication
   */
  async init() {
    try {
      const auth = await authorizeWithServiceAccount();
      this.sheets = google.sheets({ version: "v4", auth });
    } catch (error) {
      console.error("Failed to initialize Sheets service:", error);
      throw new Error("Failed to initialize Google Sheets service");
    }
  }

  /**
   * Append rows to the configured spreadsheet
   */
  async appendRows(rows: string[][]) {
    if (!this.sheets) {
      await this.init();
    }

    try {
      const response = await this.sheets!.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.tabName,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: rows,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error appending data to spreadsheet:", error);
      throw new Error("Failed to append data to Google Sheets");
    }
  }

  async getRowsCount(range?: string): Promise<number> {
    if (!this.sheets) {
      await this.init();
    }
    try {
      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range || this.tabName,
      });
      const values = response.data.values || [];
      return values.length;
    } catch (error) {
      console.error("Error getting rows count from spreadsheet:", error);
      throw new Error("Failed to get rows count from Google Sheets");
    }
  }

  /**
   * Read data from the configured spreadsheet
   */
  async readRows(range?: string) {
    if (!this.sheets) {
      await this.init();
    }

    try {
      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range || this.tabName,
      });

      return response.data.values || [];
    } catch (error) {
      console.error("Error reading data from spreadsheet:", error);
      throw new Error("Failed to read data from Google Sheets");
    }
  }
}

export default SheetsService;
