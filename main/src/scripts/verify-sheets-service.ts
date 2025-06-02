import path from 'path';
import fs from 'fs/promises';
import SheetsService from '../services/sheets';
import { SHEETS_CONFIG, validateSheetsConfig } from '../config/sheets';

/**
 * This script is used to verify the service account connection to Google Sheets API
 * Run this script to test your service account credentials
 */
async function verifyServiceAccount() {
  console.log('Verifying Google Sheets service account authentication...');
  
  // Show the path where we're looking for credentials
  const credentialsPath = path.join(process.cwd(), 'credentials.json');
  console.log(`Looking for service account credentials at: ${credentialsPath}`);
  
  // Check if service account credentials exist
  try {
    await fs.access(credentialsPath);
    console.log('✓ Service account credentials file found');
  } catch (error: unknown) {
    console.log('Error:', error);
    console.error('✗ Service account credentials file not found');
    console.error(`Please place your service account JSON file at: ${credentialsPath}`);
    console.error('You can create a service account in the Google Cloud Console.');
    process.exit(1);
  }
  
  // Validate that we have the required environment variables
  if (!validateSheetsConfig()) {
    console.error('Error: Missing required environment variables for Google Sheets.');
    console.error('Make sure SHEETS_ID is set in your environment.');
    process.exit(1);
  }

  try {
    console.log('Initializing Google Sheets service with service account...');
    const sheetsService = new SheetsService(SHEETS_CONFIG.SPREADSHEET_ID, SHEETS_CONFIG.TAB_NAME);
    
    // Initialize service with service account credentials
    await sheetsService.init();
    
    // Test the connection by reading some data
    const rows = await sheetsService.readRows();
    console.log(`✓ Successfully authenticated with Google Sheets service account!`);
    console.log(`✓ Connected to spreadsheet: ${SHEETS_CONFIG.SPREADSHEET_ID}`);
    console.log(`✓ Found ${rows.length} rows in the spreadsheet.`);
    
    console.log('Your application is now properly configured to use Google Sheets with a service account.');
  } catch (error) {
    console.error('✗ Error setting up Google Sheets service account authentication:');
    console.error(error);
    console.error('\nPlease check:');
    console.error('1. Your service account credentials file is valid');
    console.error('2. Your service account has access to the spreadsheet');
    console.error('3. The spreadsheet ID is correct');
    process.exit(1);
  }
}

// Run the verification
console.log('');
console.log('=== Google Sheets Service Account Verification ===');
console.log('This script verifies that your service account can access your Google Sheets.');
console.log('Run this script before deploying your application to production.');
console.log('');

verifyServiceAccount().catch(console.error);
