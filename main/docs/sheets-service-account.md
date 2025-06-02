# Google Sheets Service Account Integration

This project uses Google Sheets Service Account for secure, automated access to sheets data without requiring user authentication.

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable the Google Sheets API for your project

### 2. Create a Service Account

1. In the Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name for your service account (e.g., "IdeaGenie Sheets Service")
4. Optionally add a description
5. Click "Create and Continue"
6. (Optional) You can assign roles at the project level, but it's not necessary for our use case
7. Click "Done"

### 3. Generate Service Account Key

1. Find your newly created service account in the list
2. Click the three dots menu (⋮) on the right side of the row
3. Select "Manage keys"
4. Click "Add Key" > "Create new key"
5. Select "JSON" as the key type
6. Click "Create" to generate and download the key

### 4. Set Up the Service Account Key in Your Project

1. Save the downloaded JSON key file as `credentials.json` in the project root folder
2. Update environment variables:
   ```
   SHEETS_ID=your_spreadsheet_id
   SHEETS_TAB=your_tab_name (optional, defaults to "Problems")
   ```

### 5. Share Your Spreadsheet with the Service Account

1. Open your Google Spreadsheet
2. Click "Share" in the top-right corner
3. Add the email address of your service account (found in the credentials.json file, looks like: `service-account-name@project-id.iam.gserviceaccount.com`)
4. Give it "Editor" access if you need to write to the spreadsheet, or "Viewer" access if you only need to read
5. Click "Share"

### 6. Verify the Service Account Connection

Run the command below to verify your service account can access the spreadsheet:

```
npm run setup-sheets
```

This command will attempt to connect to your spreadsheet using the service account credentials and report any issues.

### 7. Usage

The application will now use service account authentication to access Google Sheets. No user interaction is required.

## Notes

- Keep your `credentials.json` file secure and do not commit it to version control
- Add this file to your `.gitignore` file
- Service accounts are ideal for automated, server-side applications where user interaction isn't available
