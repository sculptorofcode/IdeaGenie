// Configuration for Google Sheets OAuth
export const SHEETS_CONFIG = {
  SPREADSHEET_ID: process.env.SHEETS_ID || '1kgUG12y32fU21NiJzp0J1ANKiWp84ENk718uBhRBhd4',
  TAB_NAME: process.env.SHEETS_TAB || 'Problems'
};

// Validate required environment variables
export const validateSheetsConfig = (): boolean => {
  const { SPREADSHEET_ID } = SHEETS_CONFIG;
  
  if (!SPREADSHEET_ID) {
    console.error('Missing SHEETS_ID environment variable');
    return false;
  }
  
  return true;
};

// Export other configurations that might be needed
export default SHEETS_CONFIG;
